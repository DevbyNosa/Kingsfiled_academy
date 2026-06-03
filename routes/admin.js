import express from "express";
import { createNewStudent } from "../controllers/admin.js";

const router = express.Router();

// GET ROUTES FOR ADMIN DASHBOARD

router.post("/admin/students", createNewStudent);
export default router;