const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    win: {
      type: Number,
      required: false,
    },
    lose: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: false,
    },
    numRoom: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
