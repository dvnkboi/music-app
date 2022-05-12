const mongoose = require("mongoose");
const validator = require("validator"); //use to validate input
const Types = require("mongoose").Schema.Types;


const schema = new mongoose.Schema({
  title: { type: String, trim: true, unique: false, required: true },
  artist: { type: String, trim: true, unique: false, required: true },
  image: { type: String, trim: true, unique: true, required: true },
  path: { type: String, trim: true, unique: true, required: true },
  lyrics: { type: Object, required: false },
  release_date: { type: Date, required: false },
  album: { type: String, trim: true, unique: false, required: false },
  category: Types.ObjectId
});

schema.pre("save", async function(next) {
  // your presave code here
  next();
});

schema.set('toObject', { getters: true, setters: true });
schema.set('toJSON', { getters: true, setters: true });

const Song = mongoose.model("Song", schema);
module.exports = Song;
