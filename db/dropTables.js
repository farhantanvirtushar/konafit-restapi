const db = require("./db.js");

const dropTables = async () => {
  try {
    // await db.query("DROP TABLE IF EXISTS users CASCADE;");
    // await db.query("DROP TABLE IF EXISTS records CASCADE;");
    await db.query("DROP TABLE IF EXISTS admins CASCADE;");
  } catch (error) {}
};

dropTables();
