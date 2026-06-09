import pool from "../database/config/db.js";
import bcrypt from "bcrypt";
import { flashMiddleware } from "../middleware/flash.js";




export const createNewStudent = async (req, res) => {
   try {
  const {
    student_name,
    student_dob,
    student_class,
    student_password,
    student_address
  } = req.body;

  const saltRounds = 10;

  // Generate Admission Number
  const year = new Date().getFullYear();
  const count = await pool.query('SELECT COUNT(*) FROM profiles');
  const admission_no = `KF/${year}/${String(count.rows[0].count + 1).padStart(3, '0')}`;

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
    `INSERT INTO profiles (user_id, full_name, admission_no, class, address) 
     VALUES ($1, $2, $3, $4, $5)`,
    [studentId, student_name, admission_no, student_class, student_address]
  );

  console.log("New student created")
  req.flash("success", "Student created successfully");
  res.redirect("/admin/students");

  //

   } catch (error) {
      console.error("Error creating new student:", error);
      res.status(500).json({ error: "An error occurred while creating the student." });
   }
}