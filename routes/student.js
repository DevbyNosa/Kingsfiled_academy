import express from 'express';
import { studentSessionConfig } from '../middleware/studentSession.js';
import { studentLoginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();



router.post(
  "/login/student",
  studentLoginLimiter,
  studentSessionConfig
);
export default router;