const bcrypt = require('bcryptjs');

const password = 'test123'; // This will be our test password
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Password:', password);
console.log('Hashed password:', hash); 