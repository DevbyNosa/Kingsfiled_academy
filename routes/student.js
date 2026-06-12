import express from 'express';
import { studentSessionConfig } from '../middleware/studentSession.js';
import { studentLoginLimiter } from '../middleware/rateLimit.js';
import { studentDashboardPage, studentResultPage, timeTablePage } from '../controllers/student.js';



// Authenticated Student route with Student Session
import { isStudentAuthenticated } from '../middleware/studentSession.js';

const router = express.Router();

router.get("/dashboard", isStudentAuthenticated, studentDashboardPage);

router.get("/results", isStudentAuthenticated,  studentResultPage);
router.get("/timetable", isStudentAuthenticated,  timeTablePage);





router.post(
  "/login",
  studentLoginLimiter,
  studentSessionConfig
);



export default router;