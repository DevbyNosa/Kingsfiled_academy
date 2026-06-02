// utils/paystack.js
import pool from "../database/config/db.js";
import axios from "axios";
import { sendApplicationConfirmationEmail } from "../services/emailService.js"; // ADD THIS IMPORT

export const paymentVerify = async (req, res) => {
    const { reference } = req.query;

    if (!reference || !reference.startsWith('PAY_')) {
        return res.redirect('/apply');
    }

    try {
        const verify = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                },
                 family: 4
            }
        );

        if (verify.data.data.status === 'success') {
            // Update payment
            await pool.query(
                `UPDATE payments 
                 SET status = 'success', 
                     paystack_reference = $1, 
                     paystack_response = $2,
                     paid_at = NOW() 
                 WHERE payment_ref = $3`,
                [verify.data.data.reference, JSON.stringify(verify.data.data), reference]
            );

            // Get application
            const payment = await pool.query(
                `SELECT application_ref FROM payments WHERE payment_ref = $1`,
                [reference]
            );

            const application = await pool.query(
                `SELECT * FROM applications WHERE application_ref = $1`,
                [payment.rows[0].application_ref]
            );

            // Update application status
            await pool.query(
                `UPDATE applications SET status = 'payment_confirmed' WHERE application_ref = $1`,
                [payment.rows[0].application_ref]
            );

            const app = application.rows[0];

          
            await sendApplicationConfirmationEmail({
                parentEmail: app.parent_email,
                parentName: app.father_name || app.mother_name || 'Parent',
                studentName: app.student_name,
                applicationRef: app.application_ref,
                amount: verify.data.data.amount / 100,
                date: new Date().toLocaleDateString('en-NG'),
                className: app.applying_for_class
            });

            res.render('homepage/payment-success', { 
                reference: reference, 
                amount: verify.data.data.amount / 100 
            });
        } else {
            res.render('homepage/payment-failed', { 
                reference: reference,
                error: verify.data.data.message || 'Payment verification failed'
            });
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.render('homepage/payment-failed', { 
            reference: reference,
            error: error.response?.data?.message || error.message,
        });
    }
};

export const handlePaystackWebhook = async (req, res) => {
    const event = req.body;
    const crypto = require('crypto');

    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(401).send('Unauthorized');
    }

    if (event.event === 'charge.success') {
        const transaction = event.data;
        const paymentRef = transaction.reference;

        await pool.query(
            `UPDATE payments 
             SET status = 'success', 
                 paystack_reference = $1, 
                 paystack_response = $2,
                 amount = $3,
                 paid_at = $4
             WHERE payment_ref = $5`,
            [transaction.reference, JSON.stringify(transaction), transaction.amount / 100, new Date(transaction.paid_at), paymentRef]
        );

        const payment = await pool.query(
            `SELECT application_ref FROM payments WHERE payment_ref = $1`,
            [paymentRef]
        );

        if (payment.rows[0]) {
            const application = await pool.query(
                `SELECT * FROM applications WHERE application_ref = $1`,
                [payment.rows[0].application_ref]
            );

            await pool.query(
                `UPDATE applications SET status = 'payment_confirmed', updated_at = NOW() WHERE application_ref = $1`,
                [payment.rows[0].application_ref]
            );

            const app = application.rows[0];

            // ✅ SEND EMAIL HERE TOO
            await sendApplicationConfirmationEmail({
                parentEmail: app.parent_email,
                parentName: app.father_name || app.mother_name || 'Parent',
                studentName: app.student_name,
                applicationRef: app.application_ref,
                amount: transaction.amount / 100,
                date: new Date().toLocaleDateString('en-NG'),
                className: app.applying_for_class
            });
        }

        console.log(`✅ Payment confirmed via webhook: ${paymentRef}`);
    }

    res.sendStatus(200);
};