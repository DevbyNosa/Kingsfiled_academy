import nodemailer from "nodemailer";
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }

});

export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"KingsField Academy" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        });
        console.log(`✅ Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Email send error:', error);
        return null;
    }
};

export default transporter;