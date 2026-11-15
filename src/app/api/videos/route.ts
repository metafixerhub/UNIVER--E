import { NextResponse } from 'next/server';
import { saveVideoRecord, VideoRecord } from '@/lib/atlasClient';

/**
 * POST /api/videos
 * Saves video lesson metadata and streaming URLs into MongoDB Atlas Cluster
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.videoUrl) {
      return NextResponse.json(
        { success: false, error: 'Video title and videoUrl are required.' },
        { status: 400 }
      );
    }

    const videoData: VideoRecord = {
      courseId: body.courseId || 'general',
      lessonId: body.lessonId || `lesson_${Date.now()}`,
      title: body.title,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl || '/images/logo.jpg',
      duration: body.duration || '10:00',
      durationSeconds: body.durationSeconds || 600,
      uploadedBy: body.uploadedBy || 'UNIVER-E Faculty',
      resolution: body.resolution || '1080p',
      fileSize: body.fileSize || '250 MB',
      createdAt: new Date().toISOString(),
      metadata: body.metadata || {},
    };

    // Push into Atlas cluster via render endpoint
    const result = await saveVideoRecord(videoData);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to save video to MongoDB Atlas cluster',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video metadata successfully persisted in MongoDB Atlas!',
      insertedId: result.insertedId,
      video: videoData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/videos
 * Returns sample verified video streaming endpoints
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'UNIVER-E Video Streaming Registry',
    targetDatabase: 'UNIVER_E_DB',
    targetCollection: 'videos',
    supportedResolutions: ['4K', '1080p', '720p', '480p'],
    cdnProvider: 'Cloudflare R2 / AWS S3 + MongoDB Atlas Index',
  });
}
