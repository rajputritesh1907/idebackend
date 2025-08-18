const mongoose = require('mongoose');

// Database configuration
const connectDB = async () => {
    try {
        // Use MongoDB Atlas connection string or local MongoDB
        const mongoURI = process.env.MONGODB_URI;
        
        await mongoose.connect(mongoURI);
        
        console.log('MongoDB connected successfully');
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB');
        });
        
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        // Don't exit process, let the app run without database
        console.log('Application will continue without database connection');
    }
};

module.exports = connectDB;
