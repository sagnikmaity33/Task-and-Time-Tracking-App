const app = require('../src/index');
const connect = require('../src/configs/db');

// Connect to database when the function is invoked
const connectDB = async () => {
    try {
        await connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

// Connect to database
connectDB();

module.exports = app;
