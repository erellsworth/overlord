import { Request, Response } from "express"
import multer from 'multer';
import { Image, MediaInterface } from "~/interfaces/media";
import { Media } from "../models";
import { errorResponse, successResponse } from "../utils/responses";
import mediaRouter from "./router";
import { createMediaRecord, parseFileName, storeImage } from "../utils/media.helper";
import { ImageStorageResult } from "~/interfaces/misc";

multer.memoryStorage
const upload = multer({
    storage: {
        _handleFile: async (req: Request, file: Express.Multer.File, cb: (error?: any, file?: Partial<Express.Multer.File>) => void) => {

            req.body.uploadResult = await storeImage(file);

            cb(null, file);

        },
        _removeFile: (req: Request, file: any, cb: (error: Error | null) => void) => {
            delete file.buffer;
            cb(null);
        }
    }
});

mediaRouter.get('/media/:page?', async (req: Request, res: Response) => {

    let { page } = req.params;

    if (!page) {
        page = '1';
    }

    const media = await Media.findAll(parseInt(page));

    const { total } = media;

    const images: Image[] = media.contents.map((image: MediaInterface) => {
        const basePath = `${process.env.ASSETS_URI}${image.path}/`;

        return {
            data: image,
            full: `${basePath}${image.filename}`,
            thumbnail: `${basePath}thumbs/${image.filename}`
        };
    });

    successResponse(res, {
        images,
        total,
        page: parseInt(page)
    });

});

mediaRouter.post('/media/create', upload.single('file'), async (req: Request, res: Response) => {

    const uploadResult = req.body.uploadResult as ImageStorageResult;

    if (!uploadResult.success) {
        errorResponse(res, 'upload error');
        return;
    }

    const result = await createMediaRecord(req.file as unknown as Express.Multer.File, req.body.s3Data);

    if (result.success) {
        successResponse(res, result);
    } else {
        errorResponse(res, result.error as string);
    }
});

export default mediaRouter;