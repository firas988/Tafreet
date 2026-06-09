const express = require("express");
const app = express();
const dotenv = require("dotenv");
const session = require("express-session");
const cors = require("cors");
dotenv.config();

const port = process.env.PORT || 4000;

const authrization = require("./Routers/Auth/authrization");
const menu = require("./Routers/Menu/menu");
const order = require("./Routers/Order/order");
const restaurant = require("./Routers/Restaurant/restaurant");
const worker = require("./Routers/Worker/worker");
const {
  checkAdminSession,
} = require("./Middleware/validation/checkAdminSession.middleware");
const {
  checkWorkerSession,
} = require("./Middleware/validation/checkWorkerSession.middleware");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use("/api/auth", authrization);
app.use("/api/menu", menu);
app.use("/api/order", order);
app.use("/api/restaurant", checkAdminSession, restaurant);
app.use("/api/worker", checkWorkerSession, worker);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
