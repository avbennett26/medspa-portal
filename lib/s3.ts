import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from './env';

export const s3 = new S3Client({
  region: 'auto', // Use 'auto' for S3-compatible, or specify region for AWS
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for S3-compatible storage
});

export async function getS3SignedUrl(key: string, contentType: string, expiresIn = 900) {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

// Example server action for direct upload
export async function uploadFileToS3({ key, body, contentType }: { key: string; body: Buffer; contentType: string }) {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return s3.send(command);
}
