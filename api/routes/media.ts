import { Request, Response } from "express"
import { Image, MediaInterface } from "~/interfaces/media";
import { Media } from "../models";
import { successResponse } from "../utils/responses";
import mediaRouter from "./router";

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

mediaRouter.post('/media/create', async (req: Request, res: Response) => {

});

export default mediaRouter;