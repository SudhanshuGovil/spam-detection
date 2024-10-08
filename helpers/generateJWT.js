const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const generateJWT = (user) => {
  try {
    return jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error: ", error);
  }
};

module.exports = { generateJWT };
