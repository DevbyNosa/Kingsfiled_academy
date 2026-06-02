import express from 'express';
import session from '../database/config/session.js';
import pool from '../database/config/db.js';
import bcrypt from 'bcrypt';


export const studentAuthenticated = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.redirect('/portal');
    }
    next();
};

export const studentSessionConfig = async (req, res) => {
   const {
    admission_no,
    password
   } = req.body;

   let success;

   if(!admission_no || !password) {
    return res.render("homepage/portal.ejs", {
      success: false,
      message: "All fields are required"
    })
   }


    const result = await pool.query(
        `SELECT u.*, p.admission_no, p.full_name 
         FROM users u 
         INNER JOIN profiles p ON u.id = p.user_id 
         WHERE p.admission_no = $1 AND u.role = $2`,
        [admission_no, 'student']
    );


   if(result.rows.length === 0) {
   return res.render("homepage/portal.ejs", {
      success: false,
      message: "Invalid Student Credential"
    })
   }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if(!isMatch) {
      return res.render("homepage/portal.ejs", {
        success: false,
        message: "Invalid Student Credential"
      })
    }

    const fetchStudent = await pool.query(
    `SELECT 
        u.id AS user_id, u.email, u.role, u.is_active,
        p.full_name, p.phone, p.admission_no, p.class, p.date_of_birth
     FROM users u
     INNER JOIN profiles p ON u.id = p.user_id
     WHERE u.id = $1 AND u.role = 'student'`, 
    [user.id]
);

    req.session.user = {
    id: user.id,
    student_id: user.id,
    student_name: fetchStudent.rows[0].full_name,
    name: fetchStudent.rows[0].full_name,
    role: 'student',  
    admission_no: fetchStudent.rows[0].admission_no,
    class: fetchStudent.rows[0].class
};

   return res.render("homepage/portal.ejs", {
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: fetchStudent.rows[0].full_name,
        email: user.email,
      }
    })

}