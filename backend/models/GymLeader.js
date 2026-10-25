const mongoose = require('mongoose');

const gymLeaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      enum: {
        values: ['Kanto', 'Johto', 'Hoenn'],
        message: 'Region must be one of Kanto, Johto, or Hoenn',
      },
    },
    town: {
      type: String,
      required: [true, 'Town is required'],
      trim: true,
    },
    badge: {
      type: String,
      required: [true, 'Badge is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty Pokemon type is required'],
      trim: true,
    },
    aceLevel: {
      type: Number,
      required: [true, 'Ace level is required'],
      min: [1, 'Ace level must be at least 1'],
      max: [100, 'Ace level must be at most 100'],
      validate: {
        validator: Number.isInteger,
        message: 'Ace level must be a whole number',
      },
    },
    motto: {
      type: String,
      trim: true,
      maxlength: [150, 'Motto must be at most 150 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GymLeader', gymLeaderSchema);
