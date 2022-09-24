const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const Activity = new Schema({
  category: {
    type: SchemaTypes.String,
    required: [true, "La category est requise"],
    lowercase: true,
  },
  sport: {
    type: SchemaTypes.String,
    required: [true, "Le nom de l'activité est requise"],
    lowercase: true,
  },
  icon: {
    type: SchemaTypes.String,
  },
});

Activity.index({ category: 1, name: 1 });

module.exports = mongoose.model("activity", Activity, "activity");
