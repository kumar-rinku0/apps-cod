import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";

if (process.env.NODE_ENV != "development") {
  configDotenv();
}
import express from "express";
import http from "http";
import { connectDatabase } from "./util/db-con.js";
import { io } from "./service/socket.js";

// routers
import userRouter from "./route/user.js";
import companyRouter from "./route/company.js";
import branchRouter from "./route/branch.js";
import attendanceRouter from "./route/attendance.js";
import contectRouter from "./route/contact.js";
import shiftRouter from "./route/shift.js";
import personalRouter from "./route/personal.js";
import leavesRouter from "./route/leaves.js";
import holidayRouter from "./route/holidays.js";
import notesRouter from "./route/notes.js";
import exportRouter from "./route/export.js";

//middlewares
import { isLoggedInCheck, onlyLoggedInUser } from "./middleware/auth.js";

const app = express();
const port = process.env.PORT || "8000";
const SECRET = process.env.SESSION_SECRET || "KEYBOARD & mE!";
const MONGO_URI = process.env.MONGO_URI;

connectDatabase(MONGO_URI);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(isLoggedInCheck);

const server = http.createServer(app);

app.get("/api", (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(200).send({ user: null });
  }
  return res.status(200).send({ user: user });
});

app.use("/api/user", userRouter);
app.use("/api/company", onlyLoggedInUser, companyRouter);
app.use("/api/branch", onlyLoggedInUser, branchRouter);
app.use("/api/attendance", onlyLoggedInUser, attendanceRouter);
app.use("/api/shift", onlyLoggedInUser, shiftRouter);
app.use("/api/contact", onlyLoggedInUser, contectRouter);
app.use("/api/personal", onlyLoggedInUser, personalRouter);
app.use("/api/leaves", onlyLoggedInUser, leavesRouter);
app.use("/api/add", onlyLoggedInUser, holidayRouter);
app.use("/api/notes", onlyLoggedInUser, notesRouter);
app.use("/api/export", exportRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message } = err;
  res.status(status).send({ error: message, status: status });
});

app.listen(port, () => {
  console.log(`attendance app listening on port ${port}`);
});

// oops!
// Attach the Socket.io instance to the server
io.attach(server);
