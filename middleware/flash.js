export const flashMiddleware = (req, res, next) => {
  
  res.locals.flash = req.session.flash;

  
  req.flash = (type, message) => {
    req.session.flash = { type, message };
  };

 
  res.on("finish", () => {
     req.session.flash = null;
  });

  next();
};