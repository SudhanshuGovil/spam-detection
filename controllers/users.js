const { PrismaClient } = require("@prisma/client");
const { generateJWT } = require("../helpers/generateJWT");
const { encryptPassword } = require("../helpers/encrypt");
const { decryptPassword } = require("../helpers/decrypt");

const prisma = new PrismaClient();

const signup = async (req, res, next) => {
  try {
    const { name, phone, password, email = null } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Missing credentials!" });
    }
    const existingUser = await prisma.users.findUnique({
      where: { phone },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist!" });
    }
    const hashedPass = await encryptPassword(password);
    const user = await prisma.users.create({
      data: {
        name,
        phone,
        email,
        password: hashedPass,
      },
    });
    await prisma.contacts.create({
      data: {
        name,
        phone,
        email,
        registered: true,
        userId: user.id,
      },
    });
    const token = generateJWT(user);
    return res.status(201).json({ token });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(400).json({ message: "Bad request!" });
  }
};

const login = async (req, res, next) => {
  try {
    let { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const existingUser = await prisma.users.findUnique({
      where: { phone },
    });
    const isMatch = await decryptPassword(password, existingUser.password);
    if (!existingUser || !isMatch) {
      return res.status(400).json({ mesage: "Wrong credentials!" });
    }

    const token = generateJWT(existingUser);
    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(400).json({ message: "Bad request!" });
  }
};

module.exports = { signup, login };
