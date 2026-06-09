import session from "express-session";
import 'dotenv/config';
import connectPgSimple from "connect-pg-simple";
import pool from "./db.js";

const PostgresStore = connectPgSimple(session)

const isProduction = process.env.NODE_ENV === 'production';

const sessionConfig = {
   store: new PostgresStore({
    pool: pool,               
    tableName: 'session'       
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 21,  // for 21 days (3 Weeks)
    httpOnly: true,           
    secure: false,
  }
}

export default session(sessionConfig);