import express from "express";
import { createNewStudent } from "../controllers/createUser.js";
import { createNewTeacher } from '../controllers/createUser.js';

const router = express.Router();

// GET ROUTES FOR ADMIN DASHBOARD

router.post("/admin/students", createNewStudent);

router.post("/admin/teachers", createNewTeacher);
export default router;