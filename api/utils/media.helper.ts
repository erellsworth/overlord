import { S3 } from "aws-sdk";
import { Error } from "sequelize/types";
import sharp from 'sharp';
import concat from 'concat-stream';
import { CreationResult, MediaInstance, MediaInterface } from "~/interfaces/media";
import { ContentWithMedia, ImageStorageResult, S3UploadResult } from "~/interfaces/misc";
import { Media, MediaModel } from "../models/Media";

const s3 = new S3({
    accessKeyId: process.env.AWS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string

});

export const attachImages = async (contents: ContentWithMedia[]): Promise<ContentWithMedia[]> => {
    return Promise.all(contents.map(async (content: ContentWithMedia): Promise<ContentWithMedia> => {
        const image = await attachImage(content);
        return image;
    }));
}

export const attachImage = async (content: ContentWithMedia): Promise<ContentWithMedia> => {

    if (content && content.metaData.media_id) {
        const media: MediaInterface = await Media.findById(content.metaData.media_id);
        const basePath = `${process.env.ASSETS_URI}${media.path}/`;

        content.image = {
            data: media,
            full: `${basePath}${media.filename}`,
            thumbnail: `${basePath}thumbs/${media.filename}`
        };
    }

    return content;
}

export const parseFileName = (name: string): string => {
    let parts = name.split(".");
    let ext = parts[parts.length - 1];
    let trimmed = name.replace("." + ext, "");

    return trimmed.replace(/[_-]/g, " ");
};

const uploadToS3 = async (Body: Buffer | Express.Multer.File['stream'], Key: string, ContentType: string): Promise<S3UploadResult> => {

    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: process.env.AWS_BUCKET as string,
            Body,
            Key,
            ContentType
        }, (error: Error, data: S3.ManagedUpload.SendData) => {
            if (error) {
                reject({
                    success: false,
                    error
                });

                return;
            }

            resolve({
                success: true,
                data
            });

        });
    });
}

export const storeImage = async (file: Express.Multer.File, thumbSize: { width: number, height: number } = { width: 400, height: 225 }): Promise<ImageStorageResult> => {

    const ContentType = file.mimetype;
    const { width, height } = thumbSize;

    return new Promise((resolve, reject) => {

        try {
            file.stream.pipe(concat({ encoding: 'buffer' }, async (data) => {

                const thumbnail = await sharp(data)
                    .resize(width, height)
                    .toBuffer();

                const fullSizeResult = await uploadToS3(data, `uploads/${file.originalname}`, ContentType);
                const thumbResult = await uploadToS3(thumbnail, `uploads/thumbs/${file.originalname}`, ContentType);

                resolve({
                    success: fullSizeResult.success && thumbResult.success,
                    fullSizeResult,
                    thumbResult
                });
            }));
        } catch (error) {
            reject({
                success: false,
                error
            });
        }

    });
}

export const createMediaRecord = async (file: Express.Multer.File, uploadData: any): Promise<CreationResult> => {

    if (!file) {
        return {
            success: false,
            error: { message: "failed to load file" }
        };
    }

    const name = parseFileName(file.originalname);

    const newMedia = {
        name,
        filename: file.originalname,
        alt: name,
        mimetype: file.mimetype,
        path: '/uploads'
    }

    try {
        const data = await MediaModel.create(newMedia);

        const basePath = `${process.env.ASSETS_URI}${data.path}/`;

        return {
            success: true,
            image: {
                data,
                full: `${basePath}${data.filename}`,
                thumbnail: `${basePath}thumbs/${data.filename}`
            }
        }

    } catch (e) {
        const error = e as Error;

        return {
            success: false,
            error: error
        };
    }

}