import { Request, Response } from 'express';
import { notFoundResponse, successResponse } from '../utils/responses';
import settingsRouter from './router';
import { SettingModel } from '../models/Setting';
import { SettingInterface } from '../../interfaces/setting';

settingsRouter.get(
  '/settings/:name?',
  async (req: Request<{ name?: string }>, res: Response) => {
    if (req.params.name) {
      const setting = await SettingModel.findOne({
        where: {
          name: req.params.name,
        },
      });

      if (setting) {
        successResponse(res, setting);
        return;
      }

      notFoundResponse(res, 'Setting');
    } else {
      const settings = await SettingModel.findAll();

      successResponse(res, settings);
    }
  },
);

settingsRouter.put(
  '/settings',
  async (req: Request<{}, SettingInterface>, res: Response) => {
    const setting = await SettingModel.findOne({
      where: {
        name: req.body.name,
      },
    });

    if (setting) {
      const updated = await setting.update(req.body);
      await updated.save();
      return successResponse(res, updated);
    }

    const newSetting = await SettingModel.create(req.body);

    successResponse(res, newSetting);
  },
);

export default settingsRouter;
