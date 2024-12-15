import { Request, Response } from 'express';
import { Taxonomy } from '../models';
import { successResponse } from '../utils/responses';
import taxonomyRouter from './router';

taxonomyRouter.get('/tags', async (req: Request, res: Response) => {
  const tags = await Taxonomy.findAll();

  successResponse(res, tags);
});

export default taxonomyRouter;
