const express = require("express");
const db = require("../db/db.js");
var jwt = require("jsonwebtoken");
const util = require("util");
const router = express.Router();

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
      resolve(decoded.user);
    });
  });
};

router.post("/new", getToken, async (req, res) => {
  try {
    var user = await verifyToken(req.token);

    var query_text =
      "update users\
      SET current_exercise_start_time = $1\
      where email = $2;";

    var values = [req.body.start_time, user.email];
    await db.query(query_text, values);
    return res.status(201).json({ msg: "started" });
  } catch (error) {
    return res.status(500).json({ msg: "cannot start" });
  }
});

router.post("/", getToken, async (req, res) => {
  try {
    var user = await verifyToken(req.token);

    var query_text =
      "update users\
      SET current_exercise_start_time = $1\
      where email = $2;";

    var values = ["", user.email];
    await db.query(query_text, values);

    query_text =
      "INSERT INTO records (start_time, end_time, duration, points, user_id)\
      VALUES($1,$2,$3,$4,$5) RETURNING *;";
    values = [
      req.body.start_time,
      req.body.end_time,
      req.body.duration,
      req.body.points,
      user.user_id,
    ];
    var newRecord = await db.query(query_text, values);
    return res.status(201).json(newRecord);
  } catch (error) {
    return res.status(500).json({ msg: "cannot add new record" });
  }
});

router.get("/", getToken, async (req, res) => {
  try {
    var user = await verifyToken(req.token);

    var query_text =
      "select * \
      from records\
      where user_id = $1\
      order by start_time desc\
      limit $2 offset $3;";

    var values = [user.user_id, req.query.limit, req.query.offset];
    var records = await db.query(query_text, values);
    records = records.rows;

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/totalPoints", getToken, async (req, res) => {
  try {
    var user = await verifyToken(req.token);

    var query_text =
      "select sum(points) as total_points \
      from records\
      where user_id = $1;";

    var values = [user.user_id];
    var records = await db.query(query_text, values);
    records = records.rows[0];

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
