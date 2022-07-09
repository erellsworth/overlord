import { Request, Response } from "express"
import { ContentCreation, ContentInstance, ContentQuery } from "~/interfaces/content";
import { PaginatedResults } from "~/interfaces/misc";
import { Content, Taxonomy } from "../models";
import { ContentModel } from "../models/Content";
import { notFoundResponse, successResponse } from "../utils/responses";
import contentRouter from "./router";

contentRouter.get('/content/types', async (req: Request, res: Response) => {
    successResponse(res, ['post', 'page']);
});

contentRouter.get('/content/:slug?', async (req: Request, res: Response) => {

    let content: ContentInstance | PaginatedResults<ContentInstance>;

    const { slug } = req.params;

    if (slug) {
        content = await Content.findBySlug(slug);
    } else {
        const query: ContentQuery = {
            type: 'post',
            limit: 9,
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

contentRouter.post('/content', async (req: Request, res: Response) => {

    const newContent = { ...req.body, ...{ text: '', status: 'draft', metaData: {} } } as ContentCreation;

    delete newContent.id;
    delete newContent.newTags;
    delete newContent.createdAt;
    delete newContent.updatedAt;

    if (!newContent.Taxonomies) {
        newContent.Taxonomies = [];
    }

    if (req.body.newTags && req.body.newTags.length) {
        const newTags = await Taxonomy.bulkCreate(req.body.newTags);
        newContent.Taxonomies = newContent.Taxonomies.concat(newTags);
    }

    console.log('newContent', newContent);

    const content = ContentModel.build(newContent);

    console.log('content', content);

    content.save();

    successResponse(res, content);
});

export default contentRouter;