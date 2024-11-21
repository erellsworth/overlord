import { Request, Response, Router } from 'express';
import { successResponse } from '../utils/responses';
import { configurator } from '../utils/config';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.redirect(`${req.baseUrl}/health-check`);
});

router.get('/config', (req: Request, res: Response) => {
  successResponse(res, configurator.config);
});

router.use('/health-check', (req: Request, res: Response) => {
  res.json({ it: 'works' });
});

export default router;
