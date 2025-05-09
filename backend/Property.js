const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  area: Number,
  images: [String],
  description: String,
  type: String,
  offerType: {
    type: String,
    enum: ['Продажба', 'Наем'],
    required: true
  }
});

module.exports = mongoose.model('Property', propertySchema);
