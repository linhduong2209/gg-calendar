const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  summary: {
    type: String,
    trim: true,
    required: [true, 'Please provide calendar summary'],
    minlength: [10, 'Summary must have at least 10 characters'],
    maxlength: [50, 'Summary length limit is 30 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private',
  },
  // creator: {
  //
  // }
  // events: {
  //
  // }
});

module.exports = mongoose.model('Calendar', calendarSchema);
