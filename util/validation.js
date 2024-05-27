// Checks if a given value is empty or not.
// Returns true if the value is undefined, null, an empty string, or a string with only whitespace characters.
// Returns false otherwise.
function isEmpty(value) {
  return !value || value.trim() === ''; // value and type checking both
}

// Validates the user's credentials by checking if the email contains an "@" symbol and if the password is not empty and has a length of at least 6 characters.
// Returns true if both conditions are met, and false otherwise.
function userCredentialsAreValid(email, password) {
  return (
      email && email.includes('@') && password && password.trim().length >= 6
  );
}

// Validates the user's details by checking if the email and password are valid (using userCredentialsAreValid) and if the name, street, postal code, and city are not empty (using isEmpty).
// Returns true if all these conditions are met, and false otherwise.
function userDetailsAreValid(email, password, name, street, postal, city) {
  return (
      userCredentialsAreValid(email, password) &&
      !isEmpty(name) &&
      !isEmpty(street) &&
      !isEmpty(postal) &&
      !isEmpty(city)
  );
}

// Checks if the provided email and confirmEmail are the same.
// Returns true if they match, and false otherwise.
function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}

// Exports the functions for use in other parts of the application.
module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};