import { NextResponse } from 'next/server';
import { getDatabaseStats } from '@/lib/atlasClient';

/**
 * GET /api/atlas/stats
 * Fetches real-time MongoDB Atlas cluster metrics from the Render proxy
 */
export async function GET() {
  const result = await getDatabaseStats();

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        fallbackData: {
          clustersActive: 10,
          primaryDatabase: 'UNIVER_E_DB',
          collections: ['videos', 'courses', 'certificates', 'student_telemetry', 'users'],
          status: 'online',
        },
      },
      { status: 200 }
    );
  }

  return NextResponse.json(result);
}
