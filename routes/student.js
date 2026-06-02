import express from 'express';
import { studentSessionConfig } from '../middleware/studentSession.js';

const router = express.Router();



router.post("/login/student", studentSessionConfig);

export default router;