import pool from "../database/config/db.js";


export const studentDashboardPage = (req, res) => {
  res.render("student/dashboard.ejs")
}

export const studentResultPage = async (req, res) => {
   res.render("student/results.ejs");
}