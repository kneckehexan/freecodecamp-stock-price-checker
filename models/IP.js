const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const IPSchema = new mongoose.Schema({
  ip: {
    type: String,
    require: [true, 'IP must be provided'],
    minlength: 7,
    maxlength: 15
  }
});

IPSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  this.ip = await bcrypt.hash(this.ip, salt);
});

IPSchema.methods.comparePassword = async function(candidateIP) {
  const isMatch = await bcrypt.compare(candidateIP, this.ip);
  return isMatch;
}

module.exports = mongoose.model('IP', IPSchema);