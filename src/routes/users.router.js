const express = require('express');
const User = require('../models/User');

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List all users
 *     description: Returns all users stored in the database.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUsers'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
// GET /api/users - list all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.json({ status: 'success', payload: users });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;
