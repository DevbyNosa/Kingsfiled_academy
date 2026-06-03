 import pool  from "../database/config/db.js";
 import parser from "../database/config/multer.js";
 import paystackAxios from "../database/config/axios.js";


export const aboutPage = function(req, res) {
   res.render("homepage/about.ejs");
}

export const acadamicsPage = function(req, res) {
   res.render("homepage/academics.ejs");
}

export const admissionPage = function(req, res) {
   res.render("homepage/admission.ejs");
}

export const campusLifePage = function(req, res) {
   res.render("homepage/campus-life.ejs");
}

export const contactPage = function (req, res) {
   res.render("homepage/contact.ejs")
}

export const portalPage = (req, res) => {
    // If already logged in as student
      if (req.session.user && req.session.user.role === 'student') {
    return res.redirect('/student/dashboard');
  }
  
  // If already logged in as parent
  if (req.session.user && req.session.user.role === 'parent') {
    return res.redirect('/parent/dashboard');
  }
  
  // If already logged in as teacher
  if (req.session.user && req.session.user.role === 'teacher') {
    return res.redirect('/teacher/dashboard');
  }
  
  // If already logged in as admin
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  
  const flash = req.session.flash || null;


  
  req.session.flash = null;

  return res.render("homepage/portal.ejs", {
    flash
  });
};

export const applicationPage = function (req, res) {
   res.render("homepage/application.ejs")
}

export const submitApplication = async function (req, res) {
   try {
        const {
            studentName,
            dob,
            gender,
            class: className,
            previousSchool,
            fatherName,
            fatherPhone,
            motherName,
            motherPhone,
            email,
            address,
            source,
            session,
            comments
        } = req.body;

       
      const applicationRef = `APP_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        
        
        const birthCertificateUrl = req.files?.birthCertificate ? req.files.birthCertificate[0].path : null;
        const reportCardUrl = req.files?.reportCard ? req.files.reportCard[0].path : null;
        const passportUrl = req.files?.passport ? req.files.passport[0].path : null;
        
        
        const feeAmount = 3000;

        
        const result = await pool.query(
            `INSERT INTO applications (
                application_ref, student_name, student_dob, student_gender,
                applying_for_class, previous_school, father_name, father_phone,
                mother_name, mother_phone, parent_email, address, how_heard,
                preferred_session, comments, birth_certificate_url, report_card_url,
                passport_url, fee_amount, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING application_ref`,
            [
                applicationRef, studentName, dob, gender, className, previousSchool,
                fatherName, fatherPhone, motherName, motherPhone, email, address,
                source, session, comments, birthCertificateUrl, reportCardUrl, passportUrl,
                feeAmount, 'pending_payment'
            ]
        );

        
       const paymentRef = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
       
        await pool.query(
            `INSERT INTO payments (
                payment_ref, application_ref, amount, status
            ) VALUES ($1, $2, $3, $4)`,
            [paymentRef, applicationRef, feeAmount, 'pending']
        );

        
        const paystackResponse = await paystackAxios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email: email,
                amount: feeAmount * 100,
                reference: paymentRef,
                callback_url: `${process.env.BASE_URL}/payment/verify`
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                
            }
        );

        // Redirect to Paystack payment page
        res.redirect(paystackResponse.data.data.authorization_url);

      } catch (error) {
         console.error("Error submitting application:", error);
         res.status(500).json({ error: "An error occurred while submitting the application" });
      }
}