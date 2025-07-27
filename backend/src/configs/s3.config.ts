import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { BadRequestError } from "../core/error.response";
import "dotenv/config";

const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new BadRequestError(
    "AWS credentials are not set in environment variables."
  );
}

const s3Config = {
  region: "us-east-1",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
};

const s3 = new S3Client(s3Config);

export { s3, PutObjectCommand, GetObjectCommand };
