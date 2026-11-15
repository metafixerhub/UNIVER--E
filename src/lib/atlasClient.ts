/**
 * UNIVER-E MongoDB Atlas Integration Client
 * 
 * Securely connects external website and Next.js backend to the Atlas cluster proxy
 * without exposing raw MongoDB connection strings or passwords.
 */

export interface AtlasPushPayload<T = any> {
  clusterIndex?: number; // 1 to 10 (defaults to 1)
  dbName?: string;       // Defaults to "UNIVER_E_DB"
  collectionName: string; // Target collection (e.g. "videos", "courses", "certificates")
  payload: T | T[];
}

export interface VideoRecord {
  id?: string;
  courseId: string;
  lessonId?: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  durationSeconds?: number;
  uploadedBy?: string;
  resolution?: string;
  fileSize?: string;
  createdAt?: string;
  metadata?: Record<string, any>;
}

export interface StudentTelemetryRecord {
  studentId: string;
  studentName: string;
  courseId: string;
  lessonId: string;
  watchedSeconds: number;
  completed: boolean;
  timestamp: string;
}

export interface CertificateRecord {
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  grade: string;
  issueDate: string;
  verificationUrl: string;
  createdAt: string;
}

const ATLAS_SERVER_BASE_URL = 'https://one0l-server-point-234567.onrender.com';
const DEFAULT_DB_NAME = 'UNIVER_E_DB';
const DEFAULT_CLUSTER_INDEX = 1;

/**
 * 1. Read live Database / Cluster stats
 */
export async function getDatabaseStats() {
  try {
    const res = await fetch(`${ATLAS_SERVER_BASE_URL}/api/external/stats-embed`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache on Vercel for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Failed to read Atlas stats: HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error: any) {
    console.error('[Atlas Client] Error reading database stats:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 2. Push data directly into any Atlas cluster collection
 */
export async function pushToAtlas<T = any>({
  clusterIndex = DEFAULT_CLUSTER_INDEX,
  dbName = DEFAULT_DB_NAME,
  collectionName,
  payload,
}: AtlasPushPayload<T>) {
  try {
    const res = await fetch(`${ATLAS_SERVER_BASE_URL}/api/external/push-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clusterIndex,
        dbName,
        collectionName,
        payload,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || `Atlas push failed with status ${res.status}`);
    }

    return {
      success: true,
      result: data.result,
      insertedId: data.result?.insertedId || data.insertedId,
    };
  } catch (error: any) {
    console.error(`[Atlas Client] Error pushing to ${collectionName}:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Specific Use Case 1: Save Video Metadata and Streaming URLs
 */
export async function saveVideoRecord(video: VideoRecord) {
  const recordWithTimestamp = {
    ...video,
    createdAt: video.createdAt || new Date().toISOString(),
    status: 'ready',
    platform: 'UNIVER-E Cloud',
  };

  return pushToAtlas({
    clusterIndex: 1,
    dbName: DEFAULT_DB_NAME,
    collectionName: 'videos',
    payload: recordWithTimestamp,
  });
}

/**
 * Specific Use Case 2: Save Course & Syllabus Data
 */
export async function saveCourseRecord(courseData: any) {
  return pushToAtlas({
    clusterIndex: 1,
    dbName: DEFAULT_DB_NAME,
    collectionName: 'courses',
    payload: {
      ...courseData,
      updatedAt: new Date().toISOString(),
    },
  });
}

/**
 * Specific Use Case 3: Log Student Watch Time / Telemetry
 */
export async function logStudentProgress(telemetry: StudentTelemetryRecord) {
  return pushToAtlas({
    clusterIndex: 1,
    dbName: DEFAULT_DB_NAME,
    collectionName: 'student_telemetry',
    payload: telemetry,
  });
}

/**
 * Specific Use Case 4: Record Tamper-Proof Digital Certificates
 */
export async function saveCertificateToAtlas(cert: CertificateRecord) {
  return pushToAtlas({
    clusterIndex: 1,
    dbName: DEFAULT_DB_NAME,
    collectionName: 'certificates',
    payload: cert,
  });
}
