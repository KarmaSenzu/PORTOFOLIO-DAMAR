const express = require('express');
const slugify = require('slugify');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Transform DB row to frontend format
function transformPost(row) {
  return {
    id: row.slug,
    dbId: row.id,
    title: { en: row.title_en, id: row.title_id },
    excerpt: { en: row.excerpt_en, id: row.excerpt_id },
    content: { en: row.content_en, id: row.content_id },
    category: row.category,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    image: row.image,
    readTime: row.read_time,
    published: Boolean(row.published),
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/blog - list all posts (public)
router.get('/', async (req, res) => {
  try {
    const { category, published } = req.query;
    let query = 'SELECT * FROM blog_posts';
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    // By default, only show published posts for public access
    if (published !== undefined) {
      conditions.push('published = ?');
      params.push(published === 'true' ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    res.json(rows.map(transformPost));
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
});

// GET /api/blog/:slug - get single post (public)
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM blog_posts WHERE slug = ?',
      [req.params.slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    res.json(transformPost(rows[0]));
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post.' });
  }
});

// POST /api/blog - create post (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, excerpt, content, category, tags,
      image, readTime, published
    } = req.body;

    if (!title || !title.en) {
      return res.status(400).json({ error: 'Title (en) is required.' });
    }

    const slug = slugify(title.en, { lower: true, strict: true });

    // Check for duplicate slug
    const [existing] = await pool.execute('SELECT id FROM blog_posts WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A blog post with this title already exists.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO blog_posts (
        slug, title_en, title_id, excerpt_en, excerpt_id,
        content_en, content_id, category, tags, image,
        read_time, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title.en || '',
        title.id || '',
        excerpt?.en || null,
        excerpt?.id || null,
        content?.en || null,
        content?.id || null,
        category || 'tutorials',
        JSON.stringify(tags || []),
        image || null,
        readTime || 5,
        published !== undefined ? (published ? 1 : 0) : 1
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);
    res.status(201).json(transformPost(rows[0]));
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Failed to create blog post.' });
  }
});

// PUT /api/blog/:id - update post (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const {
      title, excerpt, content, category, tags,
      image, readTime, published
    } = req.body;

    const [existing] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    // Generate new slug if title changed
    let slug = existing[0].slug;
    if (title && title.en && title.en !== existing[0].title_en) {
      slug = slugify(title.en, { lower: true, strict: true });
      const [dupCheck] = await pool.execute('SELECT id FROM blog_posts WHERE slug = ? AND id != ?', [slug, postId]);
      if (dupCheck.length > 0) {
        slug = slug + '-' + Date.now();
      }
    }

    await pool.execute(
      `UPDATE blog_posts SET
        slug = ?, title_en = ?, title_id = ?, excerpt_en = ?, excerpt_id = ?,
        content_en = ?, content_id = ?, category = ?, tags = ?, image = ?,
        read_time = ?, published = ?
      WHERE id = ?`,
      [
        slug,
        title?.en ?? existing[0].title_en,
        title?.id ?? existing[0].title_id,
        excerpt?.en ?? existing[0].excerpt_en,
        excerpt?.id ?? existing[0].excerpt_id,
        content?.en ?? existing[0].content_en,
        content?.id ?? existing[0].content_id,
        category ?? existing[0].category,
        JSON.stringify(tags ?? (typeof existing[0].tags === 'string' ? JSON.parse(existing[0].tags) : existing[0].tags)),
        image ?? existing[0].image,
        readTime ?? existing[0].read_time,
        published !== undefined ? (published ? 1 : 0) : existing[0].published,
        postId
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    res.json(transformPost(rows[0]));
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ error: 'Failed to update blog post.' });
  }
});

// DELETE /api/blog/:id - delete post (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.execute('SELECT id FROM blog_posts WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Blog post deleted successfully.' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Failed to delete blog post.' });
  }
});

module.exports = router;
