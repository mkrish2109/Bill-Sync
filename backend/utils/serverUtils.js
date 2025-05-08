const connect = require("../db/connect");

const start = async (app) => {
  const PORT = 5000;  // Adjust the port as necessary
  try {
    await connect();
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to the database. Error: ", error.message);
  }
};

// Function to send error response
const sendErrorResponse = (res, message, status = 500) => {
  res.status(status).json({ success: false, message });
};

// Function to send success response
const sendSuccessResponse = (res, message, status = 200) => {
  res.status(status).json({ success: true, message });
};

// Function to send data response
const sendDataResponse = (res, data, status = 200) => {
  res.status(status).json({ success: true, data });
};

module.exports = {
  start,
  sendErrorResponse,
  sendDataResponse,
  sendSuccessResponse,
};
