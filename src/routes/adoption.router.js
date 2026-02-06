const express = require('express');
const mongoose = require('mongoose');

const Adoption = require('../models/Adoption');
const User = require('../models/User');
const Pet = require('../models/Pet');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/adoptions - list all adoptions
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find({}).lean();
    res.json({ status: 'success', payload: adoptions });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// GET /api/adoptions/:id - get adoption by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ status: 'error', error: 'Invalid id' });
    }

    const adoption = await Adoption.findById(id).lean();
    if (!adoption) {
      return res.status(404).json({ status: 'error', error: 'Adoption not found' });
    }

    res.json({ status: 'success', payload: adoption });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// POST /api/adoptions - create adoption
// body: { userId, petId, status? }
router.post('/', async (req, res) => {
  try {
    const { userId, petId, status } = req.body || {};

    if (!userId || !petId) {
      return res.status(400).json({ status: 'error', error: 'Missing required fields: userId, petId' });
    }
    if (!isValidObjectId(userId) || !isValidObjectId(petId)) {
      return res.status(400).json({ status: 'error', error: 'Invalid userId or petId' });
    }

    const [user, pet] = await Promise.all([
      User.findById(userId).lean(),
      Pet.findById(petId).lean(),
    ]);

    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }
    if (!pet) {
      return res.status(404).json({ status: 'error', error: 'Pet not found' });
    }

    const created = await Adoption.create({ user: userId, pet: petId, ...(status ? { status } : {}) });

    res.status(201).json({ status: 'success', payload: created.toObject() });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// PUT /api/adoptions/:id - update adoption
// body: { status?, userId?, petId? }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ status: 'error', error: 'Invalid id' });
    }

    const { userId, petId, status } = req.body || {};
    const update = {};

    if (userId !== undefined) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ status: 'error', error: 'Invalid userId' });
      }
      const exists = await User.findById(userId).lean();
      if (!exists) {
        return res.status(404).json({ status: 'error', error: 'User not found' });
      }
      update.user = userId;
    }

    if (petId !== undefined) {
      if (!isValidObjectId(petId)) {
        return res.status(400).json({ status: 'error', error: 'Invalid petId' });
      }
      const exists = await Pet.findById(petId).lean();
      if (!exists) {
        return res.status(404).json({ status: 'error', error: 'Pet not found' });
      }
      update.pet = petId;
    }

    if (status !== undefined) {
      update.status = status;
    }

    const updated = await Adoption.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!updated) {
      return res.status(404).json({ status: 'error', error: 'Adoption not found' });
    }

    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// DELETE /api/adoptions/:id - delete adoption
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ status: 'error', error: 'Invalid id' });
    }

    const deleted = await Adoption.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ status: 'error', error: 'Adoption not found' });
    }

    res.json({ status: 'success', payload: deleted });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;
