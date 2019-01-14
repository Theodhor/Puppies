const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  petType: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [2, 'Name must have at least 3 characters']
  },
  race: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [2, 'Name must have at least 3 characters']
  },
  name: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [2, 'Name must have at least 3 characters']
  },
  image: {
    type: String,
    required: [true, 'This field is required']
  },
  age: Number,
  info: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

petSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Pet', petSchema);
