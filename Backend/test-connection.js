require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGO_URL:', process.env.MONGO_URL ? 'Set' : 'NOT SET');

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('✅ SUCCESS! MongoDB connected');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILED:', err.message);
        console.error('Make sure:');
        console.error('1. Your cluster is active (not paused)');
        console.error('2. Your IP is whitelisted (0.0.0.0/0 for testing)');
        console.error('3. Your password is correct in the connection string');
        process.exit(1);
    });

// Timeout after 10 seconds
setTimeout(() => {
    console.error('❌ Connection timeout - cluster might still be starting');
    process.exit(1);
}, 10000);
