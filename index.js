import express from 'express';
import env from 'dotenv/config';
import session from './database/config/session.js';
import ejs from 'ejs';
import homepageRouter from './routes/homepage.js';
import pool from './database/config/db.js';




const app = express();
const PORT = process.env.PORT || 3000;

// express middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// for serving static files like CSS, JS, and images, we need to use the express.static middleware
app.use(express.static('public'));

// for rendering ejs templates, we need to set the view engine to ejs
app.set('view engine', 'ejs');




// For session management, we need to use the session middleware before defining any routes that require session handling.
app.use(session);
app.use('/', homepageRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});