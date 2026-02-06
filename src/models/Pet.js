const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    color: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', PetSchema);
