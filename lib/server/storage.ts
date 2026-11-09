import "server-only";
import { S3Client } from "@aws-sdk/client-s3";
import { sts } from "tencentcloud-sdk-nodejs-sts";

export const bucket = process.env.S3_BUCKET!;
export const region = process.env.S3_REGION!;
export const endpoint = process.env.S3_ENDPOINT!;
const credentials = { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! };
export const storage = new S3Client({ endpoint, region, credentials, requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED" });
const federation = new sts.v20180813.Client({ credential: { secretId: credentials.accessKeyId, secretKey: credentials.secretAccessKey }, region });

export async function issueUploadCredentials(key: string, size: number, multipart: boolean) {
  const appId = bucket.split("-").at(-1)!;
  const shortBucket = bucket.slice(0, -appId.length - 1);
  const result = await federation.GetFederationToken({
    Name: "hachimi-upload", DurationSeconds: 900,
    Policy: JSON.stringify({ version: "2.0", statement: [{
      effect: "allow", action: [multipart ? "name/cos:UploadPart" : "name/cos:PutObject"],
      resource: [`qcs::cos:${region}:uid/${appId}:prefix//${appId}/${shortBucket}/${key}`],
      condition: {
        numeric_less_than_equal: { "cos:content-length": size },
        ...(!multipart ? { string_equal: { "cos:x-cos-forbid-overwrite": "true" } } : {}),
      },
    }] }),
  });
  const temporary = result.Credentials;
  if (!temporary?.TmpSecretId || !temporary.TmpSecretKey || !temporary.Token || !result.ExpiredTime) throw new Error("STS unavailable");
  return {
    credentials: { accessKeyId: temporary.TmpSecretId, secretAccessKey: temporary.TmpSecretKey, sessionToken: temporary.Token },
    expiresAt: result.ExpiredTime, serverTime: Math.floor(Date.now() / 1000),
  };
}
