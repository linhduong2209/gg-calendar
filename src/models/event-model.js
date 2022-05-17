const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  startAt: {
    type: Date,
    required: [true, 'Please provide event start time'],
  },
  endAt: Date,
  endTimeUnspecified: Boolean,
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'public',
  },
  // creator
  // attendees:
});

module.exports = mongoose.model('Event', eventSchema);
