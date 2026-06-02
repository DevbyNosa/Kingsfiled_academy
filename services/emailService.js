import transporter from "../database/config/nodemailer.js";
import { applicationConfirmationEmail } from "../utils/nodemailer/applicationMessage.js";

export const sendApplicationConfirmationEmail = async (applicationData) => {
    try {
        const emailContent = applicationConfirmationEmail(applicationData);
        await transporter.sendMail({
            from: `"KingsField Academy" <${process.env.EMAIL_USER}>`,
            to: applicationData.parentEmail,
            subject: "Application Confirmation - KingsField Academy",
            html: emailContent,
        });
        console.log(`✅ Application confirmation email sent to ${applicationData.parentEmail}`);
    } catch (error) {
        console.error('Email send error:', error);
        throw new Error(error.response?.data?.message || error.message);
    }
  }

