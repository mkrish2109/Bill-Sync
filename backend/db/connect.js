const mongoose = require("mongoose");

const connect = () => {
  // console.log(process.env.MONGO_URI);
  return mongoose.connect(process.env.MONGO_URI);
};

module.exports = connect;
