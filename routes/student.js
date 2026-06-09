import express from 'express';
import { studentSessionConfig } from '../middleware/studentSession.js';
import { studentLoginLimiter } from '../middleware/rateLimit.js';
import { studentDashboardPage } from '../controllers/student.js';
import { studentResultPage } from '../controllers/student.js';

// Authenticated Student route with Student Session
import { isStudentAuthenticated } from '../middleware/studentSession.js';

const router = express.Router();

router.get("/student/dashboard", isStudentAuthenticated, studentDashboardPage);

router.get("/student/results", isStudentAuthenticated,  studentResultPage)





router.post(
  "/login/student",
  studentLoginLimiter,
  studentSessionConfig
);


export default router;