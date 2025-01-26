const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
      unique: true,
      lowercase: true,
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false, // Field password will never be displayed in output when retreiving data
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      minlength: 8,
      validate: {
        // This only works on CREATE and SAVE
        validator: function (val) {
          return this.password === val;
        },
        message: 'Passwords are not the same',
      },
    },
  },
  {
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true }, // Include virtuals when converting to plain objects
  },
);

userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash password
  // Second param determines cost factor (how many rounds of hashing data wil lgo through)
  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm as it's only needed for validation during user creation
  this.passwordConfirm = undefined;
  next();
});

// Instance method - will be available on all documents of certain collections
// Method to compare a candidate password with the stored user password
// 'this' refers to the current document, but we cannot access this.password
// because it is excluded in the schema by default; hence, we use userPassword.
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  // The salt is appended to the hashed password. When you call .compare() on it,
  // bcrypt will extract the salt and use it to hash the plaintext password.
  // If the results match then it passes.
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
