import pool from "../database/config/db.js";
import bcrypt from "bcrypt";
import { flashMiddleware } from "../middleware/flash.js";




export const createNewStudent = async (req, res) => {
   try {
      const {
        student_name,
        student_dob,
        student_number,
        student_class,
        student_password,
        student_address
      } = req.body;

      // Validation
      if (!student_name || !student_password || !student_class) {
        req.flash("error", "Name, password, and class are required");
        return res.redirect("/admin/students");
      }

      const saltRounds = 10;

      // Generate Admission Number
      const year = new Date().getFullYear();
      const count = await pool.query('SELECT COUNT(*) FROM profiles');
      const nextNumber = String(count.rows[0].count + 1).padStart(3, '0');
      const admission_no = `KF/${year}/${nextNumber}`;

      // Check if admission number already exists
      const existingUser = await pool.query(
        `SELECT id FROM users WHERE username = $1`,
        [admission_no]
      );

      if (existingUser.rows.length > 0) {
        req.flash("error", `Admission number ${admission_no} already exists. Please try again.`);
        return res.redirect("/admin/students");
      }

      // Hash Student's Password
      const passwordHash = await bcrypt.hash(student_password, saltRounds);

      // Insert into users table
      const userResult = await pool.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
        [admission_no, passwordHash, 'student']
      );

      const studentId = userResult.rows[0].id;

      // Insert into profiles table
      await pool.query(
        `INSERT INTO profiles (user_id, full_name, admission_no, phone, date_of_birth, class, address) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [studentId, student_name, admission_no, student_number, student_dob, student_class, student_address]
      );

      console.log("New student created");
      req.flash("success", `Student ${student_name} created successfully. Admission No: ${admission_no}`);
      res.redirect("/admin/students");

   } catch (error) {
      console.error("Error creating new student:", error);
      req.flash("error", "An error occurred while creating the student");
      res.redirect("/admin/students");
   }
}



export const createNewTeacher = async (req, res) => {
  try {
    const {
      teacher_phone,
      teacher_email,
      teacher_password,
      teacher_dob,
      teacher_name,
      teacher_address  
    } = req.body;

   
    if (!teacher_email || !teacher_password) {
      req.flash("error", "Email and password are required");
      return res.redirect("/admin/teachers");
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(teacher_password, saltRounds);

    await pool.query('BEGIN');

    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [teacher_email, passwordHash, 'teacher'] 
    );

    const userId = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO teachers (teacher_id, phone_number, teacher_name, date_of_birth, address) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, teacher_phone || null, teacher_name, teacher_dob, teacher_address]  
    );

    
    await pool.query('COMMIT');

    console.log("New teacher created");
    req.flash("success", "Teacher created successfully");
    res.redirect("/admin/teachers");

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Error creating new teacher:", error);
    req.flash("error", "An error occurred while creating the teacher");
    res.redirect("/admin/teachers");
  }
}