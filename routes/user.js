const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const getToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;

    next();
  } else {
    res.status(403).json({ error: "cannot authenticate" });
  }
};

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        reject(err);
      }

      resolve(decoded.admin);
    });
  });
};

router.get("/", getToken, async (req, res) => {
  try {
    var admin = await verifyToken(req.token);

    var query_text =
      "select * \
      from users\
      where mobile_number like $1\
      order by created_on desc\
      limit $2 offset $3;";

    var values = [req.query.search, req.query.limit, req.query.offset];

    var users = await db.query(query_text, values);
    users = users.rows;

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
