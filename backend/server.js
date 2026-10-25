const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('./models/GymLeader');

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined. Create backend/.env from .env.example.');
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');

    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000');
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

startServer();
