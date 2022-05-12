const mongoose = require("mongoose");
const validator = require("validator"); //use to validate input
const Types = require("mongoose").Schema.Types;


const schema = new mongoose.Schema({
  name: { type: String, trim: true, unique: true, required: true },
  background: { type: String, trim: true, unique: false, required: false },
  song: [Types.ObjectId]
});

schema.pre("save", async function(next) {
  // your presave code here
  next();
});

schema.set('toObject', { getters: true, setters: true });
schema.set('toJSON', { getters: true, setters: true });

const Category = mongoose.model("Category", schema);
module.exports = Category;
