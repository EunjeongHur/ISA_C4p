const validator = require('validator');
const bcrypt = require('bcrypt');

const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    return { isValid: false, message: "Invalid email format." };
  }
  return { isValid: true };
};

function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) {
    return { isValid: false, message: "Password must be at least 8 characters long." };
  }
  if (!hasUpperCase) {
    return { isValid: false, message: "Password must contain at least one uppercase letter." };
  }
  if (!hasLowerCase) {
    return { isValid: false, message: "Password must contain at least one lowercase letter." };
  }
  if (!hasNumbers) {
    return { isValid: false, message: "Password must contain at least one number." };
  }
  if (!hasSpecialChars) {
    return { isValid: false, message: "Password must contain at least one special character." };
  }

  return { isValid: true, message: "Password is valid." };
};

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = { 
  validateEmail, 
  validatePassword,
  hashPassword,
};