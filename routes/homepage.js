import express from 'express';
import { aboutPage } from '../controllers/home.js';
import { acadamicsPage } from '../controllers/home.js';
import { admissionPage } from '../controllers/home.js';
import { campusLifePage } from '../controllers/home.js';
import { contactPage } from '../controllers/home.js';
import { portalPage } from '../controllers/home.js';
import { applicationPage } from '../controllers/home.js';

const router = express.Router();



// GET ROUTE  FOR HOMEPAGE (/)
router.get('/', (req, res) => {
  res.render('homepage.ejs');
});

router.get("/about", aboutPage);
router.get("/academics", acadamicsPage);
router.get("/admission", admissionPage);
router.get("/campus-life", campusLifePage);
router.get("/contact", contactPage);
router.get("/portal", portalPage);
router.get("/apply", applicationPage);

export default router;