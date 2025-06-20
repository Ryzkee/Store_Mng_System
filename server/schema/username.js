const mongoose = require('mongoose');

const usernameSchema = new mongoose.Schema({
  username: String,
  password: String,
});

module.exports = mongoose.model('username', usernameSchema, 'username');