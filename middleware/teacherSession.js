import express from 'express';
import session from '../database/config/db.js'
import bcrypt from 'bcrypt';
import pool
 from '../database/config/db.js';
 import { flashMiddleware } from './flash.js';


 export const isTeacherAuthenticated = (req, res, next) => {
  if(req.session.user && req.session.user.role === "teacher")
  {
    return next();
  }

  return res.redirect("/portal");

 }

 export const teacherSessionConfig = async (req, res) => {
  try {
  const {
    teacher_email,
    teacher_password
  } = req.body;

  if(!teacher_email || !teacher_password) {
    req.flash("error", "All fields are required");
    return res.redirect("/portral!");

  }

  if(teacher_email.length < 5 ||teacher_email.length > 100)  {
    req.flash("error", "Enter correct address");
    res.redirect("/portal");
  }

  if(teacher_password.length < 6 ) {
    req.flash("error", "Password Must be at least 6 characters");
    return res.redirect("/portal");
  }

 const result = await pool.query(
      `SELECT u.*, t.teacher_name, t.phone_number 
       FROM users u 
       INNER JOIN teachers t ON u.id = t.teacher_id 
       WHERE u.email = $1 AND u.role = $2`,
      [teacher_email, "teacher"]  
    );

    if(result.rows.length === 0) {
      req.flash("error", "Invalid Teacher credentials");

      res.redirect("/portal");
    }


    const user = result.rows[0];

    const isMatch = await bcrypt.compare(teacher_password, user.password_hash);

    if(!isMatch) {
      req.flash("error", "Invalid Teacher credentials");

     return res.redirect("/portal");
    }

    req.session.user = {
      id: user.id,
      name: user.teacher_name,
      email: user.email,
      role: "teacher",
      phone: user.phone_number
    };


     req.flash("success", "Login successful");


     setTimeout( () => {
      return res.redirect("/teacher/dashboard");
     }, 3000)
    

} catch(error) {
   console.log("error", error);
}
 
 }