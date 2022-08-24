import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js";
import { BUCKET_NAME } from "./env.js";

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

/** トレーナーの一覧の取得 */
export const findTrainers = async () => {
  const objects = await s3Client.send(
    new ListObjectsCommand({ Bucket: BUCKET_NAME })
  );
  console.log(`bucketName: ${BUCKET_NAME}`);
  return objects.Contents ?? [];
};

/** トレーナーの取得 */
// TODO: トレーナーを取得する S3 クライアント処理の実装
export const findTrainer = async (name) => {
  console.log(BUCKET_NAME);
  console.log(name);
  const result = await s3Client.send(
    new GetObjectCommand(
      {
        Bucket: BUCKET_NAME,
        Key: `${name}.json`
      }
    )
  )
  const bodyContents = await streamToString(result.Body);
  console.log(bodyContents);
  return bodyContents;
}


/** トレーナーの追加更新 */
export const upsertTrainer = async (name, trainer) => {
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${name}.json`,
      Body: JSON.stringify({ name: "", pokemons: [], ...trainer }),
    })
  );
  return result;
};

/** トレーナーの削除 */
// TODO: トレーナーを削除する S3 クライアント処理の実装
export const deleteTrainer = async (name) => {
  const result = await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${name}.json`,
    })
  )
  return result;
}