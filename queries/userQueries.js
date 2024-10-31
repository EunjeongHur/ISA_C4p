const userQueries = {
  createUser: `
    INSERT INTO users (username, password, email)
    VALUES (?, ?, ?)
  `,

  getUserByEmail: `
    SELECT * FROM users WHERE email = ?
  `,

  isUsernameTaken: `
    SELECT * FROM users WHERE username = ?
  `,
};

module.exports = userQueries;
