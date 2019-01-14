const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: [true, 'Username is required'], unique: true
  },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default: 'https://image.flaticon.com/icons/svg/149/149071.svg',
    match: [/^https?:\/\/.+/, 'Image link must start with \'http\'']
  }
});

userSchema.virtual('pets', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'user'
});
// remove password
userSchema.set('toJSON',{
  transform(doc, json) {
    delete json.password;
    return json;
  },
  virtuals: true
});

userSchema.plugin(require('mongoose-unique-validator'),{
  message: 'Error, expected {PATH} to be unique'
});

userSchema.virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

userSchema.pre('validate', function checkPasswordsMatch(next) {
  if(this.isModified('password') && this._passwordConfirmation !== this.password) {
    this.invalidate('passwordConfirmation', 'Passwords do not match');
  }
  next();
});

userSchema.pre('save', function hashPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
