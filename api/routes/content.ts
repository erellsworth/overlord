import { Request, Response } from "express"
import { ContentCreation, ContentInstance, ContentQueryParams, ContentType } from "../../interfaces/content";
import { PaginatedResults } from "../../interfaces/misc";
import { TaxonomyInterface } from "../../interfaces/taxonomy";
import { Content, Taxonomy } from "../models";
import { ContentModel } from "../models/Content";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responses";
import contentRouter from "./router";

export enum ContentTypes {
    POST = 'post',
    PAGE = 'page'
};

contentRouter.get('/content/types', async (req: Request, res: Response) => {
    //TODO: Content types should be more flexible so additional types could be added as needed
    successResponse(res, Object.values(ContentTypes));
});

contentRouter.get('/content/type/:type?', async (req: Request, res: Response) => {

    try {
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
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

contentRouter.get('/content/:slug?', async (req: Request, res: Response) => {

    let content: ContentInstance | PaginatedResults<ContentInstance>;

    const { slug } = req.params;

    try {
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
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

contentRouter.put('/content', async (req: Request, res: Response) => {

    const contentUpdate = { ...req.body } as ContentCreation;

    if (!contentUpdate.id) {
        return errorResponse(res, 'Content ID missing', 400);
    }

    try {
        delete contentUpdate.newTaxonomies;
        delete contentUpdate.updatedAt;
        delete contentUpdate.createdAt;

        if (!contentUpdate.Taxonomies) {
            contentUpdate.Taxonomies = [];
        }

        if (req.body.newTaxonomies && req.body.newTaxonomies.length) {
            const newTags = await Taxonomy.bulkCreate(req.body.newTaxonomies);
            contentUpdate.Taxonomies = contentUpdate.Taxonomies.concat(newTags);
        }

        let content = await Content.findById(contentUpdate.id);

        let newContent = await content.update(contentUpdate);

        if (contentUpdate.Taxonomies) {
            const tagIds = contentUpdate.Taxonomies.map((tag: TaxonomyInterface) => {
                return tag.id;
            });

            // @ts-ignore
            newContent.addTaxonomies(tagIds);
        }

        successResponse(res, newContent);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

contentRouter.put('/content/autosave', async (req: Request, res: Response) => {
    successResponse(res, '');
});

contentRouter.post('/content', async (req: Request, res: Response) => {

    try {
        const newContent = { ...req.body, ...{ text: '', status: 'draft' } } as ContentCreation;

        delete newContent.id;
        delete newContent.newTaxonomies;
        delete newContent.createdAt;
        delete newContent.updatedAt;

        if (!newContent.Taxonomies) {
            newContent.Taxonomies = [];
        }

        if (req.body.newTaxonomies && req.body.newTaxonomies.length) {
            const newTags = await Taxonomy.bulkCreate(req.body.newTaxonomies);
            newContent.Taxonomies = newContent.Taxonomies.concat(newTags);
        }

        const tagIds = newContent.Taxonomies.map((tag: TaxonomyInterface) => {
            return tag.id;
        });

        const content = await ContentModel.create(newContent);

        // @ts-ignore
        content.addTaxonomies(tagIds);

        successResponse(res, content);
    } catch (e) {
        errorResponse(res, (e as Error).message);
        return;
    }

});

contentRouter.delete('/content/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        errorResponse(res, 'Invalid Content Id', 400);
        return;
    }

    try {
        const content = await Content.findById(Number(id));

        if (!content) {
            notFoundResponse(res);
            return;
        }
        await content.destroy();
        return successResponse(res, 'Content Deleted');
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

export default contentRouter;