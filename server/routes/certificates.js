const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Transform DB row to frontend format
function transformCertificate(row) {
  return {
    id: row.id,
    title: { en: row.title_en, id: row.title_id },
    issuer: row.issuer,
    date: row.date,
    credentialId: row.credential_id,
    image: row.image,
    credentialUrl: row.credential_url,
    sortOrder: row.sort_order
  };
}

// GET /api/certificates - list all (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM certificates ORDER BY sort_order ASC, date DESC');
    res.json(rows.map(transformCertificate));
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates.' });
  }
});

// POST /api/certificates - create (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, issuer, date, credentialId, image, credentialUrl } = req.body;

    if (!title || !title.en) {
      return res.status(400).json({ error: 'Title (en) is required.' });
    }

    // Get max sort_order
    const [maxOrder] = await pool.execute('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM certificates');
    const sortOrder = maxOrder[0].max_order + 1;

    const [result] = await pool.execute(
      `INSERT INTO certificates (title_en, title_id, issuer, date, credential_id, image, credential_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.en || '',
        title.id || '',
        issuer || null,
        date || null,
        credentialId || null,
        image || null,
        credentialUrl || null,
        sortOrder
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [result.insertId]);
    res.status(201).json(transformCertificate(rows[0]));
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: 'Failed to create certificate.' });
  }
});

// PUT /api/certificates/:id - update (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const certId = req.params.id;
    const { title, issuer, date, credentialId, image, credentialUrl, sortOrder } = req.body;

    const [existing] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [certId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Certificate not found.' });
    }

    await pool.execute(
      `UPDATE certificates SET
        title_en = ?, title_id = ?, issuer = ?, date = ?,
        credential_id = ?, image = ?, credential_url = ?, sort_order = ?
      WHERE id = ?`,
      [
        title?.en ?? existing[0].title_en,
        title?.id ?? existing[0].title_id,
        issuer ?? existing[0].issuer,
        date ?? existing[0].date,
        credentialId ?? existing[0].credential_id,
        image ?? existing[0].image,
        credentialUrl ?? existing[0].credential_url,
        sortOrder ?? existing[0].sort_order,
        certId
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [certId]);
    res.json(transformCertificate(rows[0]));
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ error: 'Failed to update certificate.' });
  }
});

// DELETE /api/certificates/:id - delete (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.execute('SELECT id FROM certificates WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Certificate not found.' });
    }

    await pool.execute('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ message: 'Certificate deleted successfully.' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Failed to delete certificate.' });
  }
});

module.exports = router;
