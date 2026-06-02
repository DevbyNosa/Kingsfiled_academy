// utils/messages.js
export const applicationConfirmationEmail = (data) => {
    const { parentName, studentName, applicationRef, amount, date, className } = data;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px; background: #0B1523; color: white; }
        .logo { font-size: 24px; font-weight: bold; }
        .content { padding: 20px; background: #f9f9f9; }
        .success-box { background: #d4edda; padding: 15px; border-radius: 5px; text-align: center; }
        .details { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .highlight { color: #D4AF37; font-weight: bold; }
        .button { display: inline-block; padding: 10px 20px; background: #D4AF37; color: #0B1523; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏫 KINGSFIELD ACADEMY</div>
            <p>Shaping Future Scholars Today</p>
        </div>
        
        <div class="content">
            <div class="success-box">
                <h2>✅ PAYMENT CONFIRMED!</h2>
                <p>Dear <strong>${parentName}</strong>,</p>
                <p>Your application for <strong>${studentName}</strong> has been successfully submitted.</p>
            </div>
            
            <div class="details">
                <h3>📋 Application Details</h3>
                <p><strong>Application Reference:</strong> ${applicationRef}</p>
                <p><strong>Amount Paid:</strong> <span class="highlight">₦${amount}</span></p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Class:</strong> ${className}</p>
            </div>
            
            <div class="details">
                <h3>⏳ What Happens Next?</h3>
                <ul>
                    <li>Our admissions team will review your application</li>
                    <li>You will be contacted within 48 hours</li>
                    <li>Keep this email for reference</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="https://kingsfield.edu.ng" class="button">Visit Our Website</a>
            </div>
        </div>
        
        <div class="footer">
            <p>🏫 Benin City, Edo State, Nigeria</p>
            <p>📞 +234 810 234 5678 | ✉️ admissions@kingsfield.edu.ng</p>
            <p>© 2026 KingsField Academy. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};