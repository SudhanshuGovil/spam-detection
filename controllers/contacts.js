const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const fetchContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phone } = req.user;
    const user = await prisma.contacts.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "No contact found!" });
    }
    if (user.registered) {
      const count = await prisma.contacts.count({
        where: {
          userId: user.userId,
          phone,
        },
      });
      if (count) {
        return res.status(200).json({
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          isSpam: user.isSpam,
        });
      }
    }
    return res.status(200).json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      isSpam: user.isSpam,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(400).json({ message: "Bad request!" });
  }
};

const createContact = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { phone, name, email = null } = req.body;

    if (!phone || !name || !userId) {
      return res.status(400).json({ message: "Missing credentials!" });
    }

    await prisma.contacts.create({
      data: {
        name,
        phone,
        email,
        userId,
      },
    });

    return res.status(201).json({ message: "Contact created!" });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(400).json({ message: "Bad request!" });
  }
};

const markSpam = async (req, res, next) => {
  try {
    const { id } = req.query;
    const existingContact = await prisma.contacts.findUnique({
      where: {
        id,
      },
    });
    if (!existingContact) {
      return res.status(404).json({ message: "Contact not found!" });
    }
    await prisma.contacts.update({
      data: {
        isSpam: true,
      },
      where: {
        id,
      },
    });
    return res.status(202).json({ message: "Updated successfully!" });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(400).json({ message: "Bad request!" });
  }
};

module.exports = { createContact, fetchContactById, markSpam };
