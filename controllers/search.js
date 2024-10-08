const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const selectQuery = {
  id: true,
  name: true,
  phone: true,
  isSpam: true,
};

const searchByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    const contactsStartsWithQuery = await prisma.contacts.findMany({
      where: {
        name: {
          startsWith: name,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 10,
      select: selectQuery,
    });
    const contactsContainsQuery = await prisma.contacts.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
          not: {
            startsWith: name,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 10,
      select: selectQuery,
    });
    return res
      .status(200)
      .json([...contactsStartsWithQuery, ...contactsContainsQuery]);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(400).json({ message: "Bad request!" });
  }
};

const searchByPhone = async (req, res, next) => {
  try {
    const { phone } = req.query;
    const user = await prisma.contacts.findMany({
      where: {
        phone,
        registered: true,
      },
      select: selectQuery,
    });
    if (user.length) {
      return res.status(200).json(user);
    }
    const contacts = await prisma.contacts.findMany({
      where: {
        phone,
      },
      take: 20,
      select: selectQuery,
    });
    return res.status(200).json(contacts);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(400).json({ message: "Bad request!" });
  }
};

module.exports = { searchByName, searchByPhone };
