import { Request, Response, Router } from "express"

const router = Router();

router.use('/health-check', (req: Request, res: Response) => {
    res.json({ it: 'works' });
});

export default router;