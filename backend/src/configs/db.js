const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.mongoDbURI;

  if (!uri) {
    console.error("❌ MongoDB URI is missing in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connect;
