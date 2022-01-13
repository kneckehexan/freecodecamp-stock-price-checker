const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const StockSchema = new mongoose.Schema({
  stock: {
    type: String,
    required: [true, 'Please prove a stock name']
  },
  ip: {
    type: [String],
    unique: true
  }
});

//StockSchema.pre('save', async function() {
//  const salt = await bcrypt.genSalt(10);
//  this.ip = await bcrypt.hash(this.ip, salt);
//});

StockSchema.methods.compareIP = async function(candidateIP) {
  const isMatch = await bcrypt.compare(candidateIP, this.ip);
  return isMatch;
}

module.exports = mongoose.model('Stock', StockSchema);