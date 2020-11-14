import { AWSError, config, S3 } from 'aws-sdk';
import { PutObjectOutput, PutObjectRequest } from 'aws-sdk/clients/s3';
import { Buffer } from 'buffer';
import { CallableContext } from 'firebase-functions/lib/providers/https';

const admin = require('firebase-admin');
const functions = require('firebase-functions');

exports.uploader = functions.https.onCall(async (data: any, context: CallableContext) => {

  if (!context.auth?.token.admin) {
    return {
      error: 'Unauthorized'
    };
  }

  const db = admin.firestore();

  const s3Config = await db.collection('CmsConfig').doc('S3').get();

  if (!s3Config.exists) {
    return {
      error: 'S3 config not found'
    };
  }

  config.update(s3Config.data());

  const uploadObjects = new Promise((resolve, reject) => {

    const s3 = new S3();

    const base64Data = Buffer.from(data.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    const params: PutObjectRequest = {
      Bucket: data.bucket,
      Key: data.name,
      Body: base64Data,
      ContentType: data.type
    };

    s3.putObject(params, (err: AWSError, output: PutObjectOutput) => {
      if (err) {
        reject(err);
      }
      resolve('https://' + data.bucket + '/' + params.Key);
    });

  });

  try {
    const uploadResult = await uploadObjects;

    return uploadResult;

  } catch (e) {
    return {
      error: e,
      data
    }
  }
});
