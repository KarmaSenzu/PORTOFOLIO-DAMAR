const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Transform DB row to frontend format
function transformExperience(row) {
  return {
    id: row.id,
    title: { en: row.title_en, id: row.title_id },
    company: row.company,
    period: { en: row.period_en, id: row.period_id },
    description: { en: row.description_en, id: row.description_id },
    current: Boolean(row.is_current),
    isEducation: Boolean(row.is_education),
    sortOrder: row.sort_order
  };
}

// GET /api/experiences - list all (public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM experiences';
    const params = [];

    if (type === 'education') {
      query += ' WHERE is_education = 1';
    } else if (type === 'work') {
      query += ' WHERE is_education = 0';
    }

    query += ' ORDER BY sort_order ASC';

    const [rows] = await pool.execute(query, params);
    res.json(rows.map(transformExperience));
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ error: 'Failed to fetch experiences.' });
  }
});

// POST /api/experiences - create (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, period, description, current, isEducation } = req.body;

    if (!title || !title.en) {
      return res.status(400).json({ error: 'Title (en) is required.' });
    }

    // Get max sort_order
    const [maxOrder] = await pool.execute('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM experiences');
    const sortOrder = maxOrder[0].max_order + 1;

    const [result] = await pool.execute(
      `INSERT INTO experiences (
        title_en, title_id, company, period_en, period_id,
        description_en, description_id, is_current, is_education, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.en || '',
        title.id || '',
        company || null,
        period?.en || null,
        period?.id || null,
        description?.en || null,
        description?.id || null,
        current ? 1 : 0,
        isEducation ? 1 : 0,
        sortOrder
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM experiences WHERE id = ?', [result.insertId]);
    res.status(201).json(transformExperience(rows[0]));
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ error: 'Failed to create experience.' });
  }
});

// PUT /api/experiences/:id - update (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const expId = req.params.id;
    const { title, company, period, description, current, isEducation, sortOrder } = req.body;

    const [existing] = await pool.execute('SELECT * FROM experiences WHERE id = ?', [expId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Experience not found.' });
    }

    await pool.execute(
      `UPDATE experiences SET
        title_en = ?, title_id = ?, company = ?, period_en = ?, period_id = ?,
        description_en = ?, description_id = ?, is_current = ?, is_education = ?, sort_order = ?
      WHERE id = ?`,
      [
        title?.en ?? existing[0].title_en,
        title?.id ?? existing[0].title_id,
        company ?? existing[0].company,
        period?.en ?? existing[0].period_en,
        period?.id ?? existing[0].period_id,
        description?.en ?? existing[0].description_en,
        description?.id ?? existing[0].description_id,
        current !== undefined ? (current ? 1 : 0) : existing[0].is_current,
        isEducation !== undefined ? (isEducation ? 1 : 0) : existing[0].is_education,
        sortOrder ?? existing[0].sort_order,
        expId
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM experiences WHERE id = ?', [expId]);
    res.json(transformExperience(rows[0]));
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Failed to update experience.' });
  }
});

// DELETE /api/experiences/:id - delete (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.execute('SELECT id FROM experiences WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Experience not found.' });
    }

    await pool.execute('DELETE FROM experiences WHERE id = ?', [req.params.id]);
    res.json({ message: 'Experience deleted successfully.' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Failed to delete experience.' });
  }
});

module.exports = router;
