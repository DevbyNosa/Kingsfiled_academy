import express from 'express';
import parser from '../database/config/multer.js';
import axios from 'axios';
import pool from '../database/config/db.js';
import { 
    aboutPage, 
    acadamicsPage, 
    admissionPage, 
    campusLifePage, 
    contactPage, 
    portalPage, 
    applicationPage, 
    submitApplication 
} from '../controllers/home.js';
import { paymentVerify, handlePaystackWebhook } from '../utils/paystack.js';

const router = express.Router();

// GET ROUTES FOR HOMEPAGE
router.get('/', (req, res) => {
    res.render('homepage.ejs');
});

router.get('/about', aboutPage);
router.get('/academics', acadamicsPage);
router.get('/admission', admissionPage);
router.get('/campus-life', campusLifePage);
router.get('/contact', contactPage);
router.get('/portal', portalPage);
router.get('/apply', applicationPage);
router.get('/payment/verify', paymentVerify);

router.post('/application', 
    parser.fields([
        { name: 'birthCertificate', maxCount: 1 },
        { name: 'reportCard', maxCount: 1 },
        { name: 'passport', maxCount: 1 }
    ]), 
    submitApplication
);

router.post('/webhook/paystack', handlePaystackWebhook);

export default router;