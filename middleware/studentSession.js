import express from 'express';
import session from '../database/config/session.js';
import pool from '../database/config/db.js';
import bcrypt from 'bcrypt';
import { flashMiddleware } from './flash.js';


export const isStudentAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.role === "student") {
    return next();
  }
  return res.redirect("/portal");
}


export const studentSessionConfig = async (req, res) => {
  const { admission_no, password } = req.body;

  if (!admission_no || !password) {
    req.flash("error", "All fields are required");
    return res.redirect("/portal");
  }

  if(admission_no.length < 5 || admission_no.length > 20) {
    req.flash("error", "Invalid admission number format");
    return res.redirect("/portal");
  }

  if(password.length < 6) {
    req.flash("error", "Password must be at least 6 characters");
    return res.redirect("/portal");
  }

  try {
    const result = await pool.query(
      `SELECT u.*, p.admission_no, p.full_name 
       FROM users u 
       INNER JOIN profiles p ON u.id = p.user_id 
       WHERE p.admission_no = $1 AND u.role = $2`,
      [admission_no, "student"]
    );

    if (result.rows.length === 0) {
      req.flash("error", "Invalid Student credentials");
      return res.redirect("/portal");
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      req.flash("error", "Invalid Student credentials");
      return res.redirect("/portal");
    }

    const fetchStudent = await pool.query(
      `SELECT u.id AS user_id, u.email, u.role,
              p.full_name, p.admission_no, p.class
       FROM users u
       INNER JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1 AND u.role = 'student'`,
      [user.id]
    );

    const student = fetchStudent.rows[0];

    // Set session ONLY on successful login
    req.session.regenerate((err) => {
      if (err) {
        req.flash("error", "Session error");
        return res.redirect("/portal");
      }
      
      req.session.user = {
        id: student.user_id,
        name: student.full_name,
        role: "student",
        admission_no: student.admission_no,
        class: student.class
      };
      
      req.flash("success", "Login successful");
      
      req.session.save(() => {
       return res.redirect("/student/dashboard");
      });
    });

  } catch (error) {
    console.log(error);
    req.flash("error", "Server error, try again");
    return res.redirect("/portal");
  }
};