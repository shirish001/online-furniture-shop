function checkAuthStatus(req, res, next) {
  const uid = req.session.uid; // uid is the user id

  if (!uid) {
    return next();
  }

  res.locals.uid = uid;
  res.locals.isAuth = true; 
  res.locals.isAdmin = req.session.isAdmin; 
  next();
}

module.exports = checkAuthStatus;