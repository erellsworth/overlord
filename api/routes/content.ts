import { Request, Response } from "express"
import { ContentCreation, ContentInstance, ContentQuery, ContentQueryParams, ContentType } from "../../interfaces/content";
import { PaginatedResults } from "../../interfaces/misc";
import { TaxonomyInterface } from "../../interfaces/taxonomy";
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
        const query: ContentQueryParams = {
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

contentRouter.get('/contents/:type?', async (req: Request, res: Response) => {

    let content: PaginatedResults<ContentInstance>;

    const { type } = req.params;

    const query: ContentQueryParams = {
        noPagination: true
    };

    if (type) {
        query.type = type as ContentType;
    }

    content = await Content.findAll(query);

    if (content) {
        successResponse(res, content);
    } else {
        notFoundResponse(res);
    }

});

contentRouter.post('/update/:slug', async (req: Request, res: Response) => {

    const contentUpdate = { ...req.body };

    delete contentUpdate.updatedAt;
    delete contentUpdate.createdAt;

    const { slug } = req.params;

    let content = await Content.findBySlug(slug);

    let newContent = await content.update(contentUpdate);

    if (contentUpdate.Taxonomies) {
        const tagIds = contentUpdate.Taxonomies.map((tag: TaxonomyInterface) => {
            return tag.id;
        });

        // @ts-ignore
        newContent.addTaxonomies(tagIds);
    }

    successResponse(res, newContent);

});

contentRouter.post('/content', async (req: Request, res: Response) => {

    const newContent = { ...req.body, ...{ text: '', status: 'draft' } } as ContentCreation;

    delete newContent.id;
    delete newContent.newTags;
    delete newContent.createdAt;
    delete newContent.updatedAt;
    delete newContent.image;

    if (!newContent.Taxonomies) {
        newContent.Taxonomies = [];
    }

    if (req.body.newTags && req.body.newTags.length) {
        const newTags = await Taxonomy.bulkCreate(req.body.newTags);
        newContent.Taxonomies = newContent.Taxonomies.concat(newTags);
    }

    const tagIds = newContent.Taxonomies.map((tag: TaxonomyInterface) => {
        return tag.id;
    });

    const content = await ContentModel.create(newContent);

    // @ts-ignore
    content.addTaxonomies(tagIds);

    successResponse(res, content);
});

export default contentRouter;