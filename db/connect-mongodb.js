const mongoose = require('mongoose');

const connectDB = url =>
  mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

module.exports = connectDB;
