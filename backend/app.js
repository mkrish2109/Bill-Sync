const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
const userRouter = require('./routes/userRouter');

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.json());

app.use('/api/buyers', require('./routes/buyers'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api', userRouter);
app.use('/api/auth', require('./routes/auth'));


require('./cron/paymentReminder')(); // Start the cron job

module.exports = app;
