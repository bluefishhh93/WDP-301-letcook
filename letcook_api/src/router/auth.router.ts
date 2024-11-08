import AuthController from '@/controller/auth.controller';
import { requireAuth } from '@/middleware/authJwt';
import { Request, Response, Router } from 'express';
const router = Router();
const authController = new AuthController();

router.post('/authenticate', authController.authenticate);

export default router;
