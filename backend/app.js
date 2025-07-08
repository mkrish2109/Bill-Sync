const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const buyerRoutes = require("./routes/buyersRoutes");
const workersRoutes = require("./routes/workersRoutes");
const fabricRoutes = require("./routes/fabricRoutes");
const fabricAssignmentRoutes=require("./routes/fabricAssignmentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const requestRoutes = require("./routes/requestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const billsRoutes = require("./routes/billsRoutes")

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/workers", workersRoutes);
app.use("/api/fabrics", fabricRoutes);
app.use("/api/assignments", fabricAssignmentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bills", billsRoutes);
require("./cron/paymentReminder")(); // Start the cron job

module.exports = app;
