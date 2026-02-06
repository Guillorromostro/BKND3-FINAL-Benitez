const mongoose = require('mongoose');

const AdoptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true, index: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Adoption', AdoptionSchema);
