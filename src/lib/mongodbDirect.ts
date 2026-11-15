import { MongoClient, Db } from 'mongodb';

/**
 * UNIVER-E Multi-Cluster MongoDB Atlas Connection Handler
 * 
 * Supports both Cluster 1 and Cluster 2 for high availability,
 * caching connections across Vercel serverless function invocations.
 */

const CLUSTER_1_URI =
  process.env.MONGODB_URI_CLUSTER_1 ||
  'mongodb+srv://xobego4785_db_user:rEdJDKYS3LViXHQl@univer-1.w8mheik.mongodb.net/UNIVER_E_DB?retryWrites=true&w=majority';

const CLUSTER_2_URI =
  process.env.MONGODB_URI_CLUSTER_2 ||
  'mongodb+srv://femaniy324_db_user:EoVBLhrQmJT2XfOv@univer-2.7ysts02.mongodb.net/UNIVER_E_DB?retryWrites=true&w=majority';

// Global cache for serverless environments (Vercel)
declare global {
  var _mongoClientPromise1: Promise<MongoClient> | undefined;
  var _mongoClientPromise2: Promise<MongoClient> | undefined;
}

export async function getMongoClient(clusterNumber: 1 | 2 = 1): Promise<MongoClient> {
  const uri = clusterNumber === 1 ? CLUSTER_1_URI : CLUSTER_2_URI;

  if (process.env.NODE_ENV === 'development') {
    if (clusterNumber === 1) {
      if (!global._mongoClientPromise1) {
        const client = new MongoClient(uri);
        global._mongoClientPromise1 = client.connect();
      }
      return global._mongoClientPromise1;
    } else {
      if (!global._mongoClientPromise2) {
        const client = new MongoClient(uri);
        global._mongoClientPromise2 = client.connect();
      }
      return global._mongoClientPromise2;
    }
  } else {
    // In production (Vercel)
    const client = new MongoClient(uri);
    return client.connect();
  }
}

export async function getMongoDb(
  dbName = 'UNIVER_E_DB',
  clusterNumber: 1 | 2 = 1
): Promise<Db> {
  const client = await getMongoClient(clusterNumber);
  return client.db(dbName);
}
