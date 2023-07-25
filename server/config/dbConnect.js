const mongoose = require("mongoose");

const dbConnect = () => {
  try {

    const conn = mongoose.connect(process.env.MONGO_URL);
    console.log("Database successfully connect");

  } catch (error) {
    console.log("Database error connect");
  };
};

module.exports = dbConnect;