const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
const userRouter = require('./routes/userRouter');
const fabricRouter = require("./routes/fabricRouters");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.json());

app.use('/api/buyers', require('./routes/buyersRouter'));
app.use('/api/workers', require('./routes/workersRouter'));
app.use('/api/bills', require('./routes/billsRouter'));
app.use('/api', userRouter);
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/fabrics', fabricRouter);
app.use('/api/assignments', require('./routes/fabricAssignment'));



require('./cron/paymentReminder')(); // Start the cron job

module.exports = app;
