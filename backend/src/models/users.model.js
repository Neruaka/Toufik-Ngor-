const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim:true,
      unique:true,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      trim:true,
      unique:true,
      match: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema)
 