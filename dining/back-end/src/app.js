import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { dbconnect } from "./utils/db-con.js";

import { isLoggedInCheck } from "./middlewares/auth.js";

// Routers
import userRouter from "./routes/user.js";
import catererRouter from "./routes/caterer.js";
import staffRouter from "./routes/staff.js";
import menuRouter from "./routes/menu.js";
import eventRouter from "./routes/event.js";
import mealRouter from "./routes/meal.js";
import quotationRouter from "./routes/quotation.js";

// Load environment variables
if (process.env.NODE_ENV !== "development") {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGO_URI;

// Database Connection
dbconnect(MONGODB_URI);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(isLoggedInCheck);

// Routes
app.get("/", (req, res) => {
  res.send("Dining app server is running!");
});


app.use("/api/user", userRouter);
app.use("/api/caterers", catererRouter);
app.use("/api/staff", staffRouter);
app.use("/api/menu", menuRouter);
app.use("/api/event", eventRouter);
app.use("/api/meals", mealRouter);
app.use("/api/quotation", quotationRouter);

// error middleware
app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message } = err;
  res.status(status).send({ error: message, status: status });
});


// Start Server
app.listen(port, () => {
  console.log(`Dining app listening on port ${port}`);
});