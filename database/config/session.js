import session from "express-session";
import 'dotenv/config';

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 21  // for 21 days (3 Weeks)
  }
}

export default session(sessionConfig);