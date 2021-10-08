const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../db/db.js");
var jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var query_text =
      "INSERT INTO users (first_name, last_name,mobile_number,email,password)\
      VALUES($1,$2,$3,$4,$5) RETURNING *;";

    var values = [
      req.body.first_name,
      req.body.last_name,
      req.body.mobile_number,
      req.body.email,
      hashedPassword,
    ];

    var newUser = await db.query(query_text, values);
    newUser = newUser.rows[0];
    delete newUser["password"];

    jwt.sign({ user: newUser }, process.env.SECRET_KEY, function (err, token) {
      newUser.token = token;
      res.status(201).json(newUser);
    });
  } catch (error) {
    if (error.constraint) {
      res.status(500).json({ error: error.constraint });
    }
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    var query_text = "select *\
      from users \
      where email = $1;";

    var values = [req.body.email];

    var user = await db.query(query_text, values);

    if (user.rowCount != 1) {
      return res.status(404).json("User Not found");
    }

    user = user.rows[0];

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(403).json({ error: "wrong password" });
    }

    delete user["password"];
    jwt.sign({ user: user }, process.env.SECRET_KEY, function (err, token) {
      user.token = token;
      res.status(201).json(user);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    var query_text = "select *\
      from admins \
      where username = $1;";

    var values = [req.body.username];

    var admin = await db.query(query_text, values);

    if (admin.rowCount != 1) {
      return res.status(404).json("Admin Not found");
    }

    admin = admin.rows[0];

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!validPassword) {
      return res.status(403).json({ error: "wrong password" });
    }

    delete admin["password"];
    jwt.sign({ admin: admin }, process.env.SECRET_KEY, function (err, token) {
      admin.token = token;
      res.status(201).json(admin);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
