const bcrypt = require('bcryptjs');

// Check bcryptjs version
console.log('bcryptjs version:', bcrypt.version);

// Sample password
const password = '123456';

// Hash the password
bcrypt.genSalt(10, (err, salt) => {
  if (err) throw err;

  bcrypt.hash(password, salt, (err, hash) => {
    if (err) throw err;

    console.log('Hashed Password:', hash);

    // Simulate storing and retrieving the hash from the database
    const storedHash = hash;

    // Compare the provided password with the stored hash
    bcrypt.compare(password, storedHash, (err, isMatch) => {
      if (err) throw err;

      console.log('Password Match:', isMatch); // Should output true
    });
  });
});
