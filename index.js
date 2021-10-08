const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");
const recordRouter = require("./routes/record.js");

const createTables = require("./db/createTables.js");

dotenv.config();

createTables();
app.use(express.json());
app.use(helmet());
app.use(morgan());

app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/records/", recordRouter);
app.listen(8000);
