import { Request, Response } from 'express';
import {
  ContentCreation,
  ContentInstance,
  ContentQueryParams,
  ContentType,
} from '../../interfaces/content';
import { PaginatedResults } from '../../interfaces/misc';
import { TaxonomyInterface } from '../../interfaces/taxonomy';
import { Content, Taxonomy } from '../models';
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../utils/responses';
import contentRouter from './router';
import { configurator } from '../utils/config';
import { Revision } from '../models/Revision';

contentRouter.get('/content/types', async (req: Request, res: Response) => {
  successResponse(res, configurator.contentTypes);
});

contentRouter.get(
  '/content/type/:type/:page?',
  async (req: Request<{ type: string; page?: number }>, res: Response) => {
    try {
      let content: PaginatedResults<ContentInstance>;

      const { type } = req.params;
      const page = req.params.page || 1;

      const query: ContentQueryParams = {
        page,
        type,
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
  },
);

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
        page: 1,
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
    const updatedContent = await Content.update(contentUpdate);

    successResponse(res, updatedContent);
  } catch (e) {
    errorResponse(res, (e as Error).message);
  }
});

contentRouter.post('/content/autosave', async (req: Request, res: Response) => {
  try {
    const autoSaveContent = req.body as ContentCreation;
    autoSaveContent.isAutosave = true;

    if (autoSaveContent.id) {
      const revision = await Content.update(autoSaveContent);

      successResponse(res, revision);
      return;
    } else {
      const content = await Content.create(autoSaveContent);

      successResponse(res, content);
      return;
    }
  } catch (e) {
    errorResponse(res, (e as Error).message);
    return;
  }
});

contentRouter.post('/content', async (req: Request, res: Response) => {
  try {
    const newContent = {
      ...req.body,
      ...{ text: '', status: 'draft' },
    } as ContentCreation;

    const content = await Content.create(newContent);

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
