function protectRoutes(req, res, next) {
    if (!res.locals.isAuth) { // if user is not logged in
      return res.redirect('/401'); // if user is not logged in then he cannot access this page
    }
  
    // if user is logged in and is not admin and is accessing paths that start with /admin
    if (req.path.startsWith('/admin') && !res.locals.isAdmin) { // req.path returns string, startswith() is js method that returns first word of that string
      return res.redirect('/403'); // if user is not admin then he cannot access this page
    }
  
    next();  // control is passed to next middleware or router in order... of app.js
  }
  
  module.exports = protectRoutes;