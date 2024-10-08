const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.users.upsert({
    where: { phone: "999999999" },
    update: {},
    create: {
      email: "alice@dev.io",
      name: "Alice",
      phone: "999999999",
      password: "$2a$10$RK1ZTWbFSAH.BGIUeevlH.7VTD21DY2agnrbkJQFof/7Or8v49HfO",
      contacts: {
        create: [
          {
            email: "alice@dev.io",
            name: "Alice",
            phone: "999999999",
            registered: true,
          },
          {
            email: "steve@dev.io",
            name: "Steve",
            phone: "999999991",
          },
          {
            email: "john@dev.io",
            name: "John",
            phone: "999999992",
          },
        ],
      },
    },
  });
  const bob = await prisma.users.upsert({
    where: { phone: "899999999" },
    update: {},
    create: {
      email: "bob@dev.io",
      name: "Bob",
      phone: "899999999",
      password: "$2a$10$RK1ZTWbFSAH.BGIUeevlH.7VTD21DY2agnrbkJQFof/7Or8v49HfO",
      contacts: {
        create: [
          {
            email: "bob@dev.io",
            name: "Bob",
            phone: "899999999",
            registered: true,
          },
          {
            email: "steve@dev.io",
            name: "Steve",
            phone: "999999991",
          },
          {
            email: "alice@dev.io",
            name: "Alice",
            phone: "999999999",
          },
          {
            email: "carl@dev.io",
            name: "Carl John",
            phone: "889999999",
          },
        ],
      },
    },
  });
  const carl = await prisma.users.upsert({
    where: { phone: "889999999" },
    update: {},
    create: {
      email: "carl@dev.io",
      name: "Carl John",
      phone: "889999999",
      password: "$2a$10$RK1ZTWbFSAH.BGIUeevlH.7VTD21DY2agnrbkJQFof/7Or8v49HfO",
      contacts: {
        create: [
          {
            email: "carl@dev.io",
            name: "Carl John",
            phone: "889999999",
            registered: true,
          },
          {
            email: "steve@dev.io",
            name: "Steve Mudds",
            phone: "999999991",
          },
          {
            email: "alice@dev.io",
            name: "Alice Bob",
            phone: "999999999",
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

function timeConversion(s) {
  // Write your code here
  let [hour, min, sec] = s.split(":");
  let meridiam = sec.slice(-2);
  sec = sec.slice(0, 2);
  let res = "";

  if (meridiam === "AM") {
    if (hour === "12") res = `00:${min}:${sec}`;
    else res = `${hour}:${min}:${sec}`;
  }
  if (hour === "12") res = `${hour}:${min}:${sec}`;
  else res = `${hour + 12}:${min}:${sec}`;
  return res;
}
