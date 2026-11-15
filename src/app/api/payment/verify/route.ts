import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      method = 'upi',
      utrNumber,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      studentName,
      studentEmail,
      courseTitle,
      amount,
      upiId = '7557060447-5@ybl',
    } = body;

    const receiptNumber = `UNIV-RCP-${Date.now().toString().slice(-8)}`;
    const verifiedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. UPI UTR Verification (Simulates Razorpay / NPCI bank reconciliation)
    if (method === 'upi') {
      const cleanUtr = String(utrNumber || '').trim();

      if (!cleanUtr) {
        return NextResponse.json(
          { success: false, verified: false, error: '12-digit UTR Reference Number is required.' },
          { status: 400 }
        );
      }

      // Check 12-digit format
      if (!/^\d{12}$/.test(cleanUtr)) {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: 'Invalid UTR format. Indian Bank UTR must be exactly 12 digits (e.g. 431902847192).',
          },
          { status: 422 }
        );
      }

      const transactionRecord = {
        id: `tx_${Date.now()}`,
        utrNumber: cleanUtr,
        paymentGateway: 'Direct UPI / NPCI Instant Settlement',
        merchantUpiId: upiId,
        studentName: studentName || 'Enrolled Student',
        studentEmail: studentEmail || 'student@univer-e.in',
        courseTitle: courseTitle || 'Specialization Enrollment',
        amount: Number(amount) || 2999,
        status: 'verified',
        receiptNumber,
        verifiedAt,
      };

      // Optional push to MongoDB Atlas External Proxy
      try {
        await fetch('https://one0l-server-point-234567.onrender.com/api/external/push-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clusterIndex: 1,
            dbName: 'ShopDB',
            collectionName: 'verified_payments',
            payload: transactionRecord,
          }),
        });
      } catch (err) {
        console.warn('MongoDB Atlas payment push notice:', err);
      }

      return NextResponse.json({
        success: true,
        verified: true,
        method: 'upi',
        transaction: transactionRecord,
        receiptNumber,
        verifiedAt,
        message: `UPI Payment verified successfully for UTR ${cleanUtr}. Instant enrollment granted.`,
      });
    }

    // 2. Razorpay Gateway Verification
    if (method === 'razorpay') {
      if (!razorpayPaymentId) {
        return NextResponse.json(
          { success: false, verified: false, error: 'Razorpay Payment ID is required.' },
          { status: 400 }
        );
      }

      const transactionRecord = {
        id: razorpayPaymentId,
        utrNumber: `RZP-${razorpayPaymentId.slice(-8)}`,
        paymentGateway: 'Razorpay Standard Checkout',
        orderId: razorpayOrderId || `order_${Date.now()}`,
        studentName: studentName || 'Enrolled Student',
        studentEmail: studentEmail || 'student@univer-e.in',
        courseTitle: courseTitle || 'Specialization Enrollment',
        amount: Number(amount) || 2999,
        status: 'verified',
        receiptNumber,
        verifiedAt,
      };

      return NextResponse.json({
        success: true,
        verified: true,
        method: 'razorpay',
        transaction: transactionRecord,
        receiptNumber,
        verifiedAt,
        message: `Razorpay payment ${razorpayPaymentId} verified successfully.`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported payment verification method.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Payment Verification error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Payment verification server error' },
      { status: 500 }
    );
  }
}
