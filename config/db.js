const mongoose = require('mongoose');
require('dotenv').config();
const mongoAtlassUrl = "mongodb+srv://paramanilkumar:a9midU1t4g5azZ5H@cluster0.zlsyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoAtlassUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
