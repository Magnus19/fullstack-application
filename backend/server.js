const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const GymLeader = require('./models/GymLeader');

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined. Create backend/.env from .env.example.');
  process.exit(1);
}

app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await GymLeader.find();
    res.status(200).json(leaders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve Gym Leaders', error: err.message });
  }
});

app.get('/api/leaders/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    const leader = await GymLeader.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    res.status(200).json(leader);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve Gym Leader', error: err.message });
  }
});

app.post('/api/leaders', async (req, res) => {
  try {
    const leader = new GymLeader(req.body);
    const savedLeader = await leader.save();
    res.status(201).json(savedLeader);
  } catch (err) {
    res.status(400).json({ message: 'Validation failed', error: err.message });
  }
});

app.put('/api/leaders/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    const updatedLeader = await GymLeader.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLeader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    res.status(200).json(updatedLeader);
  } catch (err) {
    res.status(400).json({ message: 'Validation failed', error: err.message });
  }
});

app.delete('/api/leaders/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    const deletedLeader = await GymLeader.findByIdAndDelete(req.params.id);
    if (!deletedLeader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    res.status(200).json({ message: 'Gym Leader removed from the registry' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete Gym Leader', error: err.message });
  }
});

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
