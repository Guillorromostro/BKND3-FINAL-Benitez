const express = require('express');
const bcrypt = require('bcryptjs');
const { generateMockUsers, generateMockPets } = require('../utils/mocking');
const User = require('../models/User');
const Pet = require('../models/Pet');

const router = express.Router();

let fakerInstance;
async function getFaker() {
  if (!fakerInstance) {
    ({ faker: fakerInstance } = await import('@faker-js/faker'));
  }
  return fakerInstance;
}

// GET /api/mocks/mockingusers?qty=50 - generate users (not insert)
router.get('/mockingusers', async (req, res) => {
  try {
    const qty = Number(req.query.qty || 50);
    const users = await generateMockUsers(qty);
    res.json({ status: 'success', payload: users });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// GET /api/mocks/mockingpets?qty=20 - migrate/implement mock pets (not insert)
router.get('/mockingpets', async (req, res) => {
  try {
    const qty = Number(req.query.qty || 20);
    const pets = await generateMockPets(qty);
    res.json({ status: 'success', payload: pets });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// POST /api/mocks/generateData - insert users and pets into DB
// body: { users: number, pets: number }
router.post('/generateData', async (req, res) => {
  try {
    const faker = await getFaker();
    const usersQty = Number(req.body.users || 0);
    const petsQty = Number(req.body.pets || 0);

    if (Number.isNaN(usersQty) || Number.isNaN(petsQty) || usersQty < 0 || petsQty < 0) {
      return res.status(400).json({ status: 'error', error: 'Invalid numeric parameters: users, pets' });
    }

    // Generate users with hashed password coder123
    const hashed = await bcrypt.hash('coder123', 10);
    const userDocs = Array.from({ length: usersQty }, () => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: hashed,
      role: Math.random() < 0.85 ? 'user' : 'admin',
      pets: [],
    }));

    const createdUsers = userDocs.length ? await User.insertMany(userDocs, { ordered: false }) : [];

    // Generate pets, optionally assign random owner from created/existing users
    let allUsers = createdUsers;
    if (petsQty > 0 && allUsers.length === 0) {
      allUsers = await User.find({}).lean();
    }

    const speciesList = ['dog', 'cat', 'hamster', 'parrot', 'rabbit'];
    const OWNER_RATE = 0.6;
    const petDocs = Array.from({ length: petsQty }, () => {
      const maybeOwner = allUsers.length && Math.random() < OWNER_RATE
        ? faker.helpers.arrayElement(allUsers)._id
        : null;
      return {
        name: faker.animal.dog().split(' ')[0],
        species: faker.helpers.arrayElement(speciesList),
        color: faker.color.human(),
        owner: maybeOwner,
      };
    });

    const createdPets = petDocs.length ? await Pet.insertMany(petDocs, { ordered: false }) : [];

    res.json({
      status: 'success',
      payload: {
        usersInserted: createdUsers.length,
        petsInserted: createdPets.length,
      },
      message: 'Data generated and inserted. Verify via GET /api/users and /api/pets',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;
