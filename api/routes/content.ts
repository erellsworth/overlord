import { Request, Response } from "express"
import { ContentInstance, ContentInterface, ContentQuery } from "~/interfaces/content";
import { PaginatedResults } from "~/interfaces/misc";
import { Content } from "../models";
import { notFoundResponse, successResponse } from "../utils/responses";
import contentRouter from "./router";

contentRouter.get('/content/:slug?', async (req: Request, res: Response) => {

    let content: ContentInstance | PaginatedResults<ContentInstance>;

    const { slug } = req.params;

    if (slug) {
        content = await Content.findBySlug(slug);
    } else {
        const query: ContentQuery = {
            type: 'post',
            limit: 6,
            page: 1
        };

        content = await Content.findAll(query);
    }

    if (content) {
        successResponse(res, content);
    } else {
        notFoundResponse(res);
    }

});

contentRouter.post('/update/:slug', async (req: Request, res: Response) => {

    const { slug } = req.params;

    let content = await Content.findBySlug(slug);

    content.content = req.body.json;
    content.save();

    res.json(req.body);

});

contentRouter.post('/create', async (req: Request, res: Response) => {

});

export default contentRouter;