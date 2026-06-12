import express from 'express'
import pool from '../database/config/db.js'


export const teacherDashboardPage = (req, res) => {
  res.render("teacher/dashboard.ejs");
};