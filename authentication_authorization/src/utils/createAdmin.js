const { Account } = require("../schemas/account.schema");
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const createAdmin = async () => {
  const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
  try {
    const admins = await Account.find({ isAdmin: true });
    if (admins.length === 0) {
      Account.create({
        name: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        isAdmin: true,
        isBlocked: false,
      });
      console.log("Admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createAdmin };
