const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/buyers', require('./routes/buyers'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));


require('./cron/paymentReminder')(); // Start the cron job

module.exports = app;
