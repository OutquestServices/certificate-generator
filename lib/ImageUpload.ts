import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

// Create S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_KEY_ID || "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadFileToS3(file: File) {
  if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_S3_REGION) {
    throw new Error("AWS environment variables are not properly configured.");
  }

  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const filepath = `certificate_generator/${fileName}`;

  // Ensure the file is a valid Blob or Buffer
  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filepath,
    Body: fileBuffer, // Convert File to Buffer
    ContentType: file.type, // Optional: Ensure correct MIME type
  };

  const command = new PutObjectCommand(params);

  try {
    const data = await s3Client.send(command);

    if (data.$metadata.httpStatusCode !== 200) {
      throw new Error("Failed to upload file");
    }

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/certificate_generator/${fileName}`;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error uploading file:", err.message);
      throw new Error(err.message);
    } else {
      console.error("Error uploading file:", err);
      throw new Error("File upload failed");
    }
  }
}

export async function deleteFileFromS3(fileUrl: string): Promise<boolean> {
  if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_S3_REGION) {
    throw new Error("AWS environment variables are not properly configured.");
  }

  const fileName = fileUrl.split("/").pop();
  if (!fileName) {
    throw new Error("Invalid file URL");
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `certificate_generator/${fileName}`,
  };

  const command = new DeleteObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    const status = data.$metadata.httpStatusCode;
    // S3 typically returns 204 for successful delete; accept 200/204.
    if (status !== 204 && status !== 200) {
      console.warn("Unexpected S3 delete status:", status);
      return false;
    }
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // Treat missing object or lack of permission as non-fatal (return false) to avoid breaking the flow.
    if (/NoSuchKey/i.test(message)) {
      console.warn("S3 object already absent:", message);
      return true; // Already deleted
    }
    if (/AccessDenied/i.test(message) || /not authorized/i.test(message)) {
      console.warn("Insufficient S3 permissions to delete object; treat as non-fatal:", message);
      return false;
    }

    console.error("Error deleting file:", message);
    throw new Error(message);
  }
}