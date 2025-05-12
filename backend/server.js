const app = require('./app');
const mongoose = require('mongoose');
const { start } = require('./utils/serverUtils');
require('dotenv').config();
const PORT = process.env.PORT;




start(app);