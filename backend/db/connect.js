const mongoose = require("mongoose");

const connect = () => {
  // console.log(process.env.MONGODB_URI);
  return mongoose.connect(process.env.MONGODB_URI);
};

module.exports = connect;
