const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
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
    u3: {
      type: String,
      required: true,
    },
    u4: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("game", gameSchema);
module.exports = Game;
