const bcrypt = require("bcryptjs");

const decryptPassword = async (password, hashedPass) => {
  try {
    return await bcrypt.compare(password, hashedPass);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = { decryptPassword };
