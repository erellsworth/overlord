import { Request, Response } from 'express';
import { successResponse } from '../utils/responses';
import taxonomyRouter from './router';
import { SettingModel } from '../models/Setting';

taxonomyRouter.get('/settings', async (req: Request, res: Response) => {
  const settings = await SettingModel.findAll();

  successResponse(res, settings);
});

export default taxonomyRouter;
