const express = require('express');
const slugify = require('slugify');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Transform DB row to frontend format
function transformProject(row) {
  return {
    id: row.slug,
    dbId: row.id,
    title: { en: row.title_en, id: row.title_id },
    description: { en: row.description_en, id: row.description_id },
    about: { en: row.about_en, id: row.about_id },
    category: row.category,
    role: row.role,
    techStack: typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : (row.tech_stack || []),
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    image: (typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []))[0] || null,
    liveUrl: row.live_url,
    repoUrl: row.repo_url,
    date: row.date,
    duration: row.duration,
    status: row.status,
    featured: Boolean(row.featured),
    sortOrder: row.sort_order,
    caseStudy: {
      problem: { en: row.case_study_problem_en, id: row.case_study_problem_id },
      solution: { en: row.case_study_solution_en, id: row.case_study_solution_id },
      result: { en: row.case_study_result_en, id: row.case_study_result_id }
    },
    challenges: typeof row.challenges === 'string' ? JSON.parse(row.challenges) : (row.challenges || []),
    features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/projects - list all projects (public)
router.get('/', async (req, res) => {
  try {
    const { category, status, featured } = req.query;
    let query = 'SELECT * FROM projects';
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (featured !== undefined) {
      conditions.push('featured = ?');
      params.push(featured === 'true' ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    const [rows] = await pool.execute(query, params);
    const projects = rows.map(transformProject);

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// GET /api/projects/:slug - get single project (public)
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM projects WHERE slug = ?',
      [req.params.slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json(transformProject(rows[0]));
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project.' });
  }
});

// PUT /api/projects/reorder - reorder projects (auth required)
router.put('/reorder', auth, async (req, res) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'Orders must be an array of { id, sort_order }.' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const item of orders) {
        await connection.execute(
          'UPDATE projects SET sort_order = ? WHERE id = ?',
          [item.sort_order, item.id]
        );
      }

      await connection.commit();
      connection.release();

      const [rows] = await pool.execute('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
      res.json(rows.map(transformProject));
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Reorder projects error:', error);
    res.status(500).json({ error: 'Failed to reorder projects.' });
  }
});

// POST /api/projects - create project (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, description, about, category, role, techStack, images,
      liveUrl, repoUrl, date, duration, status, featured,
      caseStudy, challenges, features
    } = req.body;

    if (!title || !title.en) {
      return res.status(400).json({ error: 'Title (en) is required.' });
    }

    const slug = slugify(title.en, { lower: true, strict: true });

    // Check for duplicate slug
    const [existing] = await pool.execute('SELECT id FROM projects WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A project with this title already exists.' });
    }

    // Get max sort_order
    const [maxOrder] = await pool.execute('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM projects');
    const sortOrder = maxOrder[0].max_order + 1;

    const [result] = await pool.execute(
      `INSERT INTO projects (
        slug, title_en, title_id, description_en, description_id,
        about_en, about_id, category, role, tech_stack, images,
        live_url, repo_url, date, duration, status, featured, sort_order,
        case_study_problem_en, case_study_problem_id,
        case_study_solution_en, case_study_solution_id,
        case_study_result_en, case_study_result_id,
        challenges, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title.en || '',
        title.id || '',
        description?.en || null,
        description?.id || null,
        about?.en || null,
        about?.id || null,
        category || 'web-app',
        role || 'fullstack',
        JSON.stringify(techStack || []),
        JSON.stringify(images || []),
        liveUrl || null,
        repoUrl || null,
        date || null,
        duration || null,
        status || 'completed',
        featured ? 1 : 0,
        sortOrder,
        caseStudy?.problem?.en || null,
        caseStudy?.problem?.id || null,
        caseStudy?.solution?.en || null,
        caseStudy?.solution?.id || null,
        caseStudy?.result?.en || null,
        caseStudy?.result?.id || null,
        JSON.stringify(challenges || []),
        JSON.stringify(features || [])
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(transformProject(rows[0]));
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// PUT /api/projects/:id - update project (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const {
      title, description, about, category, role, techStack, images,
      liveUrl, repoUrl, date, duration, status, featured,
      caseStudy, challenges, features
    } = req.body;

    // Check if project exists
    const [existing] = await pool.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Generate new slug if title changed
    let slug = existing[0].slug;
    if (title && title.en && title.en !== existing[0].title_en) {
      slug = slugify(title.en, { lower: true, strict: true });
      // Check for duplicate slug (excluding current project)
      const [dupCheck] = await pool.execute('SELECT id FROM projects WHERE slug = ? AND id != ?', [slug, projectId]);
      if (dupCheck.length > 0) {
        slug = slug + '-' + Date.now();
      }
    }

    await pool.execute(
      `UPDATE projects SET
        slug = ?, title_en = ?, title_id = ?, description_en = ?, description_id = ?,
        about_en = ?, about_id = ?, category = ?, role = ?, tech_stack = ?, images = ?,
        live_url = ?, repo_url = ?, date = ?, duration = ?, status = ?, featured = ?,
        case_study_problem_en = ?, case_study_problem_id = ?,
        case_study_solution_en = ?, case_study_solution_id = ?,
        case_study_result_en = ?, case_study_result_id = ?,
        challenges = ?, features = ?
      WHERE id = ?`,
      [
        slug,
        title?.en ?? existing[0].title_en,
        title?.id ?? existing[0].title_id,
        description?.en ?? existing[0].description_en,
        description?.id ?? existing[0].description_id,
        about?.en ?? existing[0].about_en,
        about?.id ?? existing[0].about_id,
        category ?? existing[0].category,
        role ?? existing[0].role,
        JSON.stringify(techStack ?? (typeof existing[0].tech_stack === 'string' ? JSON.parse(existing[0].tech_stack) : existing[0].tech_stack)),
        JSON.stringify(images ?? (typeof existing[0].images === 'string' ? JSON.parse(existing[0].images) : existing[0].images)),
        liveUrl ?? existing[0].live_url,
        repoUrl ?? existing[0].repo_url,
        date ?? existing[0].date,
        duration ?? existing[0].duration,
        status ?? existing[0].status,
        featured !== undefined ? (featured ? 1 : 0) : existing[0].featured,
        caseStudy?.problem?.en ?? existing[0].case_study_problem_en,
        caseStudy?.problem?.id ?? existing[0].case_study_problem_id,
        caseStudy?.solution?.en ?? existing[0].case_study_solution_en,
        caseStudy?.solution?.id ?? existing[0].case_study_solution_id,
        caseStudy?.result?.en ?? existing[0].case_study_result_en,
        caseStudy?.result?.id ?? existing[0].case_study_result_id,
        JSON.stringify(challenges ?? (typeof existing[0].challenges === 'string' ? JSON.parse(existing[0].challenges) : existing[0].challenges)),
        JSON.stringify(features ?? (typeof existing[0].features === 'string' ? JSON.parse(existing[0].features) : existing[0].features)),
        projectId
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.json(transformProject(rows[0]));
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id - delete project (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.execute('SELECT id FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await pool.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;
