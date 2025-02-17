import path from 'path';
import { fromEnv } from '@aws-sdk/credential-providers';
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Error } from 'sequelize/types';
import sharp from 'sharp';
import concat from 'concat-stream';
import {
  Crop,
  MediaCreationResult,
  MediaDeletionResult,
  MediaInstance,
  MediaInterface,
} from '../../interfaces/media';
import {
  ContentWithMedia,
  GenericResult,
  ImageStorageResult,
  S3UploadResult,
} from '../../interfaces/misc';
import { Media, MediaModel } from '../models/Media';

const s3 = new S3Client({
  credentials: fromEnv(),
  region: process.env['AWS_REGION'] || 'us-east-1',
  endpoint: process.env['AWS_ENDPOINT'],
});

export const attachImages = async (
  contents: ContentWithMedia[],
): Promise<ContentWithMedia[]> => {
  return Promise.all(
    contents.map(
      async (content: ContentWithMedia): Promise<ContentWithMedia> => {
        const image = await attachImage(content);
        return image;
      },
    ),
  );
};

export const attachImage = async (
  content: ContentWithMedia,
): Promise<ContentWithMedia> => {
  if (content && content.metaData.media_id) {
    const media: MediaInterface = await Media.findById(
      content.metaData.media_id,
    );

    if (!media) {
      return content;
    }
    const basePath = `${process.env.ASSETS_URI}${media.path}/`;

    content.image = {
      data: media,
      full: `${basePath}${media.filename}`,
      thumbnail: `${basePath}thumbs/${media.filename}`,
    };
  }

  return content;
};

export const parseFileName = (name: string): string => {
  let parts = name.split('.');
  let ext = parts[parts.length - 1];
  let trimmed = name.replace('.' + ext, '');

  return trimmed.replace(/[_-]/g, ' ');
};

const uploadToS3 = async (
  Body: Buffer | Express.Multer.File['stream'],
  Key: string,
  ContentType: string,
): Promise<S3UploadResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET as string,
        Key,
        Body,
        ContentType,
        ACL: ObjectCannedACL.public_read,
      };

      const upload = new Upload({
        client: s3,
        params,
      });

      const data = await upload.done();

      resolve({
        success: true,
        data,
      });
    } catch (error) {
      console.log('upload error', error);
      reject({
        success: false,
        error,
      });
      return;
    }
  });
};

const removeFromS3 = async (media: MediaInstance): Promise<GenericResult[]> => {
  const removeThumb = new Promise<GenericResult>(async (resolve, reject) => {
    const Key = `${media.path.replace('/', '')}/thumbs/${media.filename}`;

    try {
      const deleteObject = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET as string,
        Key,
      });

      await s3.send(deleteObject);
      resolve({
        success: true,
      });
    } catch (e) {
      resolve({
        success: false,
        error: { message: (e as Error).message },
      });
    }
  });

  const removeFull = new Promise<GenericResult>(async (resolve, reject) => {
    const Key = `${media.path.replace('/', '')}/${media.filename}`;

    try {
      const deleteObject = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET as string,
        Key,
      });

      await s3.send(deleteObject);
      resolve({
        success: true,
      });
    } catch (e) {
      resolve({
        success: false,
        error: { message: (e as Error).message },
      });
    }
  });

  return Promise.all([removeThumb, removeFull]);
};

export const storeImage = async (
  file: Express.Multer.File,
  filename: string,
  crops?: { [key: string]: Crop },
  thumbSize: { width: number; height: number } = { width: 400, height: 225 },
): Promise<ImageStorageResult> => {
  const ContentType = file.mimetype;
  const { width, height } = thumbSize;

  return new Promise((resolve, reject) => {
    try {
      file.stream.pipe(
        concat({ encoding: 'buffer' }, async (data) => {
          try {
            let fullsize = sharp(data);
            let thumbnail = sharp(data);

            if (crops?.thumb) {
              thumbnail = thumbnail.extract(crops.thumb);
            }

            if (crops?.full) {
              fullsize = fullsize.extract(crops.full);
            }

            const full = await fullsize.toBuffer();
            const thumb = await thumbnail.resize(width, height).toBuffer();

            const fullSizeResult = await uploadToS3(
              full,
              `uploads/${filename}`,
              ContentType,
            );
            const thumbResult = await uploadToS3(
              thumb,
              `uploads/thumbs/${filename}`,
              ContentType,
            );

            resolve({
              success: fullSizeResult.success && thumbResult.success,
              fullSizeResult,
              thumbResult,
            });
          } catch (e) {
            reject({
              success: false,
              error: e,
            });
          }
        }),
      );
    } catch (error) {
      reject({
        success: false,
        error,
      });
    }
  });
};

export const removeImage = async (id: number): Promise<MediaDeletionResult> => {
  const media = await Media.findById(id);

  if (!media) {
    return {
      success: false,
      error: { message: 'Media not found' },
    };
  }

  const S3results = await removeFromS3(media);

  const success = S3results.every((result) => result.success);

  if (!success) {
    return {
      success,
      error: {
        message: 'S3 error',
      },
    };
  }

  return {
    success,
    media,
  };
};

export const createMediaRecord = async (
  file: Express.Multer.File,
  filename: string,
  alt: string,
  uploadData: any,
): Promise<MediaCreationResult> => {
  if (!file) {
    return {
      success: false,
      error: { message: 'failed to load file' },
    };
  }

  const name = parseFileName(filename);

  const newMedia = {
    name,
    filename,
    alt,
    mimetype: file.mimetype,
    path: '/uploads',
  };

  try {
    const data = await MediaModel.create(newMedia);

    const basePath = `${process.env.ASSETS_URI}${data.path}/`;

    return {
      success: true,
      image: {
        data,
        full: `${basePath}${data.filename}`,
        thumbnail: `${basePath}thumbs/${data.filename}`,
      },
    };
  } catch (e) {
    const error = e as Error;

    return {
      success: false,
      error: error,
    };
  }
};

export const incrementFileName = (filename: string) => {
  const fileInfo = path.parse(filename);
  const lastChar = parseInt(fileInfo.name.slice(-1));

  if (isNaN(lastChar)) {
    return `${fileInfo.name}-2${fileInfo.ext}`;
  }

  const nameParts = fileInfo.name.split('-');

  if (nameParts.length === 1) {
    return `${fileInfo.name}-2${fileInfo.ext}`;
  }

  let lastNum = parseInt(nameParts[nameParts.length - 1]);
  lastNum++;

  return `${fileInfo.name}-${lastNum}${fileInfo.ext}`;
};
