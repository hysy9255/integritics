const bcrypt = require("bcrypt");

const password = "1234";

bcrypt.hash(password, 10).then((hashedPassword) => {
  console.log(hashedPassword);
});
