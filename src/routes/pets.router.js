const express = require('express');
const Pet = require('../models/Pet');

const router = express.Router();

// GET /api/pets - list all pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find({}).lean();
    res.json({ status: 'success', payload: pets });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;
