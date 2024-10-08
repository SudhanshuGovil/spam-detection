const bcrypt = require("bcryptjs");

const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    if (!hashedPass) {
      console.log("Error while encrypting the password!");
      throw new Error("Error while saving the password!");
    }
    return hashedPass;
  } catch (error) {
    console.log("Error: ", error);
    throw new Error(error);
  }
};

module.exports = { encryptPassword };
