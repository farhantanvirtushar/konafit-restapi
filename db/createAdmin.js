const db = require("./db.js");
const bcrypt = require("bcrypt");

const createAdmin = async () => {
  try {
    var query_text =
      "INSERT INTO admins (username,password)\
      VALUES($1,$2) ;";

    var values = ["admin", "admin"];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(values[1], salt);
    values[1] = hashedPassword;
    await db.query(query_text, values);
  } catch (error) {}
};

createAdmin();
