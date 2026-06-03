import rateLimit from "express-rate-limit";

export const studentLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  handler: (req, res) => {
    req.flash("error", "Too many login attempts. Try again after 15 minutes.");
    return res.redirect("/portal");
  },

  standardHeaders: true,
  legacyHeaders: false,
});


export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,

  handler: (req, res) => {
    req.flash("error", "Too many requests. Please slow down.");
    return res.redirect("back");
  }
});