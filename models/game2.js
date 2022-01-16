const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const game2Schema = new Schema(
  {
    rooms: {
      type: Number,
      required: true,
    },
    nbUser: {
      type: Number,
      required: true,
    },
    u1: {
      type: String,
      required: true,
    },
    u2: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Game2 = mongoose.model("game2", game2Schema);
module.exports = Game2;
