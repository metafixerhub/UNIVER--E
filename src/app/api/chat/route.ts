import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const MODEL_ID = 'nvidia/nemotron-3-ultra-550b-a55b:free';

const SYSTEM_PROMPT = `You are "UNIVER-E AI Genius", the official intelligent academic assistant and search-anywhere copilot for UNIVER-E Digital Academy (https://univer-e.in).

BRAND & VISUAL IDENTITY:
- Primary Navy: #082B59
- Golden Yellow: #F5A900
- Sky Blue: #13A8E8
- Leaf Green: #28A745
- Tagline: "Learn Today. Lead Tomorrow. Learn. Build. Innovate. Achieve."

CORE CAPABILITIES & SEARCH ANYWHERE:
- You help learners find, search, explore, and understand ANY course, department, syllabus, certification requirement, examination rules, refund policy, and technical feature across UNIVER-E.
- You understand questions in English, Hindi, and Hinglish.
- You are polite, educational, encouraging, and authoritative.

KNOWLEDGE BASE:
1. COURSES & SYLLABUS:
   - Full Stack Web Development (React, Next.js, Node.js, MongoDB - ₹2,999 / $49.99, 12 weeks, Beginner to Advanced, Certificate included). Route: /courses/course-1
   - AI Fundamentals with Python (Machine Learning, PyTorch, LLMs - ₹3,499 / $59.99, 10 weeks, Intermediate). Route: /courses/course-2
   - Graphic Design with Canva Pro & Figma (UI/UX, Visual Branding - ₹1,499 / $29.99, 6 weeks, Beginner). Route: /courses/course-3
   - Cybersecurity Essentials (Network Security, SOC Analysis, Ethical Hacking - ₹2,499 / $39.99, 8 weeks). Route: /courses/course-4
   - Digital Marketing Mastery (SEO, Meta Ads, Google Analytics 4 - ₹1,999 / $34.99, 8 weeks). Route: /courses/course-5
   - Data Science & Business Analytics (SQL, Pandas, Tableau - ₹3,199 / $54.99, 10 weeks). Route: /courses/course-6
   - Free courses available: Check /courses?price=free

2. 30-DAY SATISFACTION REFUND POLICY (Terms of Service §8):
   - 30 calendar days from original purchase date.
   - Learner must have consumed LESS than 25% of the total curriculum video duration.
   - Official final examination certificate must NOT have been generated.
   - Request must be sent to the official desk: univer-e-services@protonmail.com.

3. CERTIFICATION & VERIFICATION (Terms §9):
   - Digital certificates with unique tamper-evident verification ID and scannable QR code.
   - Passing requirement: 70% score on the timed final assessment (/assessment/[id]).
   - Public verification available at /certificates.
   - Important: Certificates are skill-development credentials; not UGC/AICTE degree qualifications.

4. CONTACT & SECRETARIAT (Terms §27 / Contact Page):
   - Official Unified Email: univer-e-services@protonmail.com (for all inquiries, refunds, certificates, admissions, and support).
   - Phone Helpline: +91 (080) 4123-8900 (Mon - Sat, 9:00 AM - 7:00 PM IST).
   - Address: UNIVER-E Tower, Tech Hub, Whitefield, Bengaluru, Karnataka 560066, India.

5. MOBILE APP:
   - Available as a direct Android APK download from the homepage button: "Get it on APK" (/univer-e.apk).

6. PAYMENT METHODS:
   - UPI (GPay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, Net Banking across 50+ Indian banks. 100% encrypted, zero raw card data stored.

INSTRUCTIONS FOR ANSWERS:
- Always give clear, complete, helpful, structured answers with bullet points or step-by-step guides.
- Always provide relevant clickable Markdown links (e.g. [Explore Courses](/courses), [30-Day Refund Policy](/terms#sec-8), [Verify Certificate](/certificates), [Contact Desk](/contact), [Download APK](/univer-e.apk)).
- MANDATORY: Always conclude every response with a distinct "Sources & Platform References" section listing the exact sources used:
  Example:
  ---
  **Sources & References:**
  - [Source: UNIVER-E Course Catalog](/courses)
  - [Source: Master Terms §8 - 30-Day Refund Policy](/terms#sec-8)
  - [Source: Learner Secretariat (univer-e-services@protonmail.com)](mailto:univer-e-services@protonmail.com)
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages array provided' },
        { status: 400 }
      );
    }

    const payloadMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-8), // Keep context window lean & fast
    ];

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://univer-e.in',
          'X-Title': 'UNIVER-E Digital Academy AI Assistant',
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: payloadMessages,
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content =
          data?.choices?.[0]?.message?.content ||
          'I am here to help you navigate UNIVER-E courses and academic policies.';

        return NextResponse.json({
          reply: content,
          model: data?.model || MODEL_ID,
          sources: extractSources(content),
        });
      }
    } catch (apiError) {
      console.warn('[OpenRouter] API request failed, engaging local knowledge copilot:', apiError);
    }

    // High-speed fallback knowledge engine
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const fallbackReply = generateFallbackResponse(lastUserMsg);

    return NextResponse.json({
      reply: fallbackReply,
      model: 'univer-e-knowledge-base/v1',
      sources: extractSources(fallbackReply),
    });
  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractSources(text: string): string[] {
  const sources: string[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.includes('[Source:') || line.includes('Source:')) {
      sources.push(line.replace(/^[*\s-]+/, '').trim());
    }
  }
  return sources.length > 0
    ? sources
    : [
        'UNIVER-E Digital Academy Official Platform',
        'Official Support: univer-e-services@protonmail.com',
      ];
}

function generateFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('refund') || q.includes('return') || q.includes('money back')) {
    return `### UNIVER-E 30-Day Satisfaction Guarantee & Refund Policy

Under **Section 8 of our Terms of Service**, all eligible paid courses qualify for a 30-day money-back guarantee:

1. **Eligibility Criteria:**
   - The request must be submitted within **30 calendar days** from your original purchase.
   - You must have consumed **less than 25%** of the total curriculum video duration.
   - An official final examination certificate must **not** have been issued.
2. **How to Apply:**
   - Send your request with your registered email and transaction ID to:
   - **Official Desk:** [univer-e-services@protonmail.com](mailto:univer-e-services@protonmail.com)
3. **Turnaround Time:**
   - Refunds are processed to the original payment method (UPI/Card/NetBanking) within 5–7 business days.

---
**Sources & References:**
- [Source: Master Terms & Conditions §8 - 30-Day Guarantee](/terms#sec-8)
- [Source: Learner Secretariat (univer-e-services@protonmail.com)](mailto:univer-e-services@protonmail.com)`;
  }

  if (q.includes('certificate') || q.includes('exam') || q.includes('verify')) {
    return `### UNIVER-E Certification & Verification System

Every certified course includes an official digital credential recognized across the digital industry:

1. **Earning Your Certificate:**
   - Complete 100% of the lessons in the course curriculum.
   - Score **70% or higher** on the timed Final Assessment at [/assessment](/courses).
2. **Tamper-Evident Verification:**
   - Each certificate features a unique alphanumeric ID and a scannable QR code.
   - Employers can verify authenticity anytime at: [Public Certificate Registry](/certificates).
3. **Academic Standing:**
   - Certificates represent industry-grade skill development programs (not formal UGC/AICTE degree credentials).

---
**Sources & References:**
- [Source: Certificate Verification Registry](/certificates)
- [Source: Master Terms & Conditions §9 - Certification](/terms#sec-9)`;
  }

  if (q.includes('python') || q.includes('ai') || q.includes('web') || q.includes('course') || q.includes('learn')) {
    return `### Recommended UNIVER-E Courses & Search Results

Here are top programs currently trending across UNIVER-E Digital Academy:

- **[Full Stack Web Development](/courses/course-1)**: Master React, Next.js, Node.js, Express & MongoDB Atlas. (12 weeks • ₹2,999 • All Levels)
- **[AI Fundamentals with Python](/courses/course-2)**: Machine Learning, PyTorch, Deep Learning & LLMs. (10 weeks • ₹3,499 • Intermediate)
- **[Cybersecurity Essentials](/courses/course-4)**: Network Defense, SOC Operations & Ethical Hacking. (8 weeks • ₹2,499 • Intermediate)
- **[Graphic Design with Canva Pro & Figma](/courses/course-3)**: UI/UX & Visual Branding. (6 weeks • ₹1,499 • Beginner)
- **[Free Courses Collection](/courses?price=free)**: Zero-cost beginner modules with full digital access.

You can filter and search by difficulty, category, price, and language directly on the [Course Marketplace](/courses).

---
**Sources & References:**
- [Source: UNIVER-E Course Marketplace](/courses)
- [Source: Faculty Directory](/departments)`;
  }

  if (q.includes('apk') || q.includes('app') || q.includes('mobile') || q.includes('download')) {
    return `### UNIVER-E Mobile Android App

You can learn on the go with the official UNIVER-E Android application:

- **Direct Download:** Download the standalone release package directly via [Get it on APK](/univer-e.apk).
- **Features:** Resume video playback, track quiz attempts, download lecture notes, and get push notifications for new courses.

---
**Sources & References:**
- [Source: UNIVER-E Mobile Release (/univer-e.apk)](/univer-e.apk)
- [Source: Mobile App Portal](/help)`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('support')) {
    return `### UNIVER-E Academic Secretariat & Support Desk

Our administrative and learner support team is available to assist you:

- **Official Desk Email:** [univer-e-services@protonmail.com](mailto:univer-e-services@protonmail.com)
- **Toll-Free Helpline:** +91 (080) 4123-8900 (Mon – Sat, 9:00 AM – 7:00 PM IST)
- **Campus Address:** UNIVER-E Tower, Tech Hub, Whitefield, Bengaluru, Karnataka 560066, India
- **Online Form:** Submit inquiries directly to the Admin Portal at [Contact Us](/contact).

---
**Sources & References:**
- [Source: UNIVER-E Contact Secretariat](/contact)
- [Source: Master Terms §27 - Contact Support](/terms#sec-27)`;
  }

  return `### Hello! Welcome to UNIVER-E Digital Academy

I am **UNIVER-E AI Genius**, powered by NVIDIA Nemotron 3 Ultra. I can help you search, discover, and navigate everything across the platform:

- **Search Anywhere:** Ask me about Python, Web Development, Cybersecurity, AI, or Design.
- **Policies & Refunds:** Learn about our 30-Day Money-Back Guarantee (Terms §8).
- **Certificates:** Discover how to earn and verify tamper-evident QR certificates.
- **Android App:** Download the UNIVER-E app directly via [Get it on APK](/univer-e.apk).
- **Learner Support:** Reach our secretariat at [univer-e-services@protonmail.com](mailto:univer-e-services@protonmail.com).

What would you like to learn or explore today?

---
**Sources & References:**
- [Source: UNIVER-E Digital Academy Homepage](/)
- [Source: Course Marketplace](/courses)
- [Source: Master Terms of Service](/terms)`;
}
