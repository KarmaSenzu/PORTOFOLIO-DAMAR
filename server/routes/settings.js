const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/settings - get all settings (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM settings ORDER BY setting_key ASC');

    // Transform to a key-value object
    const settings = {};
    for (const row of rows) {
      settings[row.setting_key] = typeof row.setting_value === 'string'
        ? JSON.parse(row.setting_value)
        : row.setting_value;
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

// GET /api/settings/:key - get setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM settings WHERE setting_key = ?',
      [req.params.key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found.' });
    }

    const value = typeof rows[0].setting_value === 'string'
      ? JSON.parse(rows[0].setting_value)
      : rows[0].setting_value;

    res.json({
      key: rows[0].setting_key,
      value,
      updatedAt: rows[0].updated_at
    });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting.' });
  }
});

// PUT /api/settings/:key - update setting (auth required)
router.put('/:key', auth, async (req, res) => {
  try {
    const { value } = req.body;
    const key = req.params.key;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required.' });
    }

    const jsonValue = JSON.stringify(value);

    // Upsert: insert or update
    await pool.execute(
      `INSERT INTO settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = CURRENT_TIMESTAMP`,
      [key, jsonValue, jsonValue]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM settings WHERE setting_key = ?',
      [key]
    );

    const resultValue = typeof rows[0].setting_value === 'string'
      ? JSON.parse(rows[0].setting_value)
      : rows[0].setting_value;

    res.json({
      key: rows[0].setting_key,
      value: resultValue,
      updatedAt: rows[0].updated_at
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting.' });
  }
});

module.exports = router;
