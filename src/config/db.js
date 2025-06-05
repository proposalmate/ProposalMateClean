const mongoose = require('mongoose');
const config = require('./config'); // Assuming config.js is in the same directory

const connectDB = async () => {
  try {
    // Here we're using the URI from config.js
    const conn = await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process if we can't connect to MongoDB
  }
};

module.exports = connectDB;
