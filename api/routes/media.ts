import { Request, Response } from "express"
import multer from 'multer';
import { Image, MediaInterface } from "../../interfaces/media";
import { Media } from "../models";
import { errorResponse, successResponse } from "../utils/responses";
import mediaRouter from "./router";
import { createMediaRecord, removeImage, storeImage } from "../utils/media.helper";
import { ImageStorageResult } from "../../interfaces/misc";

const upload = multer({
    storage: {
        _handleFile: async (req: Request, file: Express.Multer.File, cb: (error?: any, file?: Partial<Express.Multer.File>) => void) => {

            req.body.uploadResult = await storeImage(file, JSON.parse(req.body.crops));

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

mediaRouter.get('/media/getValidFileName/:name', async (req: Request, res: Response) => {

    const validName = await Media.getNewFileName(req.params.name);

    successResponse(res, { validName });
});

mediaRouter.post('/media/create', upload.single('file'), async (req: Request, res: Response) => {

    const uploadResult = req.body.uploadResult as ImageStorageResult;

    if (!uploadResult.success) {
        errorResponse(res, 'upload error');
        return;
    }

    const newMedia = await createMediaRecord(req.file as unknown as Express.Multer.File, req.body.s3Data);

    if (newMedia.success) {
        successResponse(res, newMedia);
    } else {
        errorResponse(res, newMedia.error?.message as string);
    }
});

mediaRouter.delete('/media/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await removeImage(parseInt(id));

    if (result.success) {
        await result.media?.destroy();
    }

    successResponse(res, result);
});

mediaRouter.patch('/media', async (req: Request, res: Response) => {

    const updatedMedia = { ...req.body } as MediaInterface;

    if (!updatedMedia.id) {
        errorResponse(res, 'Missing id');
        return;
    }

    const media = await Media.findById(updatedMedia.id);

    delete updatedMedia.updatedAt;
    delete updatedMedia.createdAt;

    media.set(updatedMedia);

    await media.save();

    successResponse(res, { media });

});

export default mediaRouter;