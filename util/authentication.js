function createUserSession(req, user, action) {
  //req.session is an obj provided by express-session pacakge, represents the session data for the current request.

  req.session.uid = user._id.toString();
  // Store the user's MongoDB database ID as a string in the session.
  // The _id field is automatically generated by MongoDB for each document.

  // Store the user's administrative status in the session.
  // This is a custom of the user document in the database.
  req.session.isAdmin = user.isAdmin;

  //save() is also a method provided by express-session pacakge
  req.session.save(action); //after the session is saved then only this action will be performed
}

// function for logging out user( by deleting the stored _id)
function destroyUserAuthSession(req) {
  req.session.uid = null;
  // dont have to call save() method bc it is only called when needed to perform some action func, otherwise saves automatically
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
