const bcrypt = require('bcryptjs');

const password = 'password123';

// Hash the password
bcrypt.hash(password, 12, (err, hashedPassword) => {
  if (err) {
    console.error(`Error hashing password: ${err.message}`);
  } else {
    console.log(`Hashed password: ${hashedPassword}`);

    // Compare the password
    bcrypt.compare(password, hashedPassword, (compareErr, isMatch) => {
      if (compareErr) {
        console.error(`Error comparing passwords: ${compareErr.message}`);
      } else {
        console.log(`Passwords match: ${isMatch}`);
      }
    });
  }
});
