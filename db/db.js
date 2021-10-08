const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "quazhfgqoylsda",
  host: "ec2-35-171-171-27.compute-1.amazonaws.com",
  database: "dccsgfv5s57dod",
  password: "a20abe5ed9edc5ce0481e414951a0e9a6e75fec0d8426f462360b3bd3f475059",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
