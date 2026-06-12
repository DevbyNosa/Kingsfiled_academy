import express from "express";
import { isTeacherAuthenticated } from "../middleware/teacherSession.js";
import { teacherSessionConfig } from "../middleware/teacherSession.js";
import { teacherDashboardPage } from "../controllers/teacher.js";
const router = express.Router();


router.get("/dashboard", isTeacherAuthenticated, teacherDashboardPage );

router.post("/login",teacherSessionConfig )

export default router;