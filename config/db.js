const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    console.log('connectDB Initialized');
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log('MongoDB Connected...');
    } catch(err) {
        console.error(`MongoDB Failed Connect with error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;