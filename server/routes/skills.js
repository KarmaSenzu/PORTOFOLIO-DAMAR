const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Transform DB row to frontend format
function transformSkill(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    category: row.category,
    color: row.color,
    sortOrder: row.sort_order
  };
}

// GET /api/skills - list all skills (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM skills';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY sort_order ASC, name ASC';

    const [rows] = await pool.execute(query, params);
    res.json(rows.map(transformSkill));
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
});

// POST /api/skills - create skill (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { name, icon, category, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Skill name is required.' });
    }

    // Get max sort_order
    const [maxOrder] = await pool.execute('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM skills');
    const sortOrder = maxOrder[0].max_order + 1;

    const [result] = await pool.execute(
      'INSERT INTO skills (name, icon, category, color, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, icon || null, category || 'frontend', color || null, sortOrder]
    );

    const [rows] = await pool.execute('SELECT * FROM skills WHERE id = ?', [result.insertId]);
    res.status(201).json(transformSkill(rows[0]));
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Failed to create skill.' });
  }
});

// PUT /api/skills/:id - update skill (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const skillId = req.params.id;
    const { name, icon, category, color, sortOrder } = req.body;

    const [existing] = await pool.execute('SELECT * FROM skills WHERE id = ?', [skillId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Skill not found.' });
    }

    await pool.execute(
      'UPDATE skills SET name = ?, icon = ?, category = ?, color = ?, sort_order = ? WHERE id = ?',
      [
        name ?? existing[0].name,
        icon ?? existing[0].icon,
        category ?? existing[0].category,
        color ?? existing[0].color,
        sortOrder ?? existing[0].sort_order,
        skillId
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM skills WHERE id = ?', [skillId]);
    res.json(transformSkill(rows[0]));
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Failed to update skill.' });
  }
});

// DELETE /api/skills/:id - delete skill (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.execute('SELECT id FROM skills WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Skill not found.' });
    }

    await pool.execute('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ message: 'Skill deleted successfully.' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill.' });
  }
});

module.exports = router;
