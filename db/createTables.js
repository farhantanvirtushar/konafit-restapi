const db = require("./db.js");

const createTables = async () => {
  try {
    await db.query(
      "CREATE TABLE IF NOT EXISTS users (\
        user_id serial PRIMARY KEY,\
        first_name VARCHAR ( 50 )  NOT NULL,\
        last_name VARCHAR ( 50 )  NOT NULL,\
        mobile_number VARCHAR ( 50 ) NOT NULL,\
        email VARCHAR ( 255 ) UNIQUE NOT NULL,\
        password VARCHAR ( 60 ) NOT NULL,\
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        last_login TIMESTAMP,\
        current_exercise_start_time VARCHAR ( 50 ) DEFAULT '');"
    );

    await db.query(
      "CREATE TABLE IF NOT EXISTS records (\
      record_id serial PRIMARY KEY,\
      start_time VARCHAR ( 50 ),\
      end_time VARCHAR ( 50 ),\
      duration integer,\
      points integer,\
      user_id integer REFERENCES users (user_id) );"
    );

    await db.query(
      "CREATE TABLE IF NOT EXISTS admins (\
      username VARCHAR ( 255 ) UNIQUE NOT NULL,\
      password VARCHAR ( 60 ) NOT NULL );"
    );

    console.log("database connected");
  } catch (error) {
    console.log("error creating tables");
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

module.exports = createTables;
