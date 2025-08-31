const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');

const router = express.Router();

// Middleware to validate JWT token and check admin role
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = user;
    next();
  });
};

// Get all admission applications with pagination and filters
router.get('/applications', authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      gradeLevel,
      academicYear,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const db = getDatabase();
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = [];
    let params = [];

    if (status) {
      whereConditions.push('status = ?');
      params.push(status);
    }

    if (gradeLevel) {
      whereConditions.push('grade_level = ?');
      params.push(gradeLevel);
    }

    if (academicYear) {
      whereConditions.push('academic_year = ?');
      params.push(academicYear);
    }

    if (search) {
      whereConditions.push(`(
        student_name LIKE ? OR 
        student_email LIKE ? OR 
        parent_name LIKE ? OR 
        parent_email LIKE ? OR
        application_id LIKE ?
      )`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await db.get(
      `SELECT COUNT(*) as total FROM admissions ${whereClause}`,
      params
    );
    const total = countResult.total;

    // Get applications
    const applications = await db.query(
      `SELECT * FROM admissions ${whereClause} 
       ORDER BY ${sortBy} ${sortOrder} 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Parse documents JSON for each application
    applications.forEach(app => {
      if (app.documents) {
        try {
          app.documents = JSON.parse(app.documents);
        } catch (e) {
          app.documents = [];
        }
      }
    });

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific admission application
router.get('/applications/:applicationId', authenticateAdmin, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const db = getDatabase();

    const application = await db.get(
      'SELECT * FROM admissions WHERE application_id = ?',
      [applicationId]
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Parse documents JSON if exists
    if (application.documents) {
      try {
        application.documents = JSON.parse(application.documents);
      } catch (e) {
        application.documents = [];
      }
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application status
router.put('/applications/:applicationId/status', [
  authenticateAdmin,
  body('status').isIn(['pending', 'approved', 'rejected', 'waitlisted']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { applicationId } = req.params;
    const { status, notes } = req.body;
    const db = getDatabase();

    // Check if application exists
    const application = await db.get(
      'SELECT id FROM admissions WHERE application_id = ?',
      [applicationId]
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update status
    await db.run(
      'UPDATE admissions SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE application_id = ?',
      [status, notes, applicationId]
    );

    // Log admin action
    await db.run(
      'INSERT INTO admin_logs (admin_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [req.user.id, 'UPDATE_STATUS', JSON.stringify({ applicationId, status, notes }), req.ip]
    );

    res.json({ 
      message: 'Application status updated successfully',
      applicationId,
      status,
      notes
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const db = getDatabase();

    // Get total applications
    const totalResult = await db.get('SELECT COUNT(*) as total FROM admissions');
    const total = totalResult.total;

    // Get applications by status
    const statusStats = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM admissions 
      GROUP BY status
    `);

    // Get applications by grade level
    const gradeStats = await db.query(`
      SELECT grade_level, COUNT(*) as count 
      FROM admissions 
      GROUP BY grade_level
      ORDER BY count DESC
      LIMIT 10
    `);

    // Get applications by academic year
    const yearStats = await db.query(`
      SELECT academic_year, COUNT(*) as count 
      FROM admissions 
      GROUP BY academic_year
      ORDER BY academic_year DESC
    `);

    // Get recent applications (last 7 days)
    const recentResult = await db.get(`
      SELECT COUNT(*) as count 
      FROM admissions 
      WHERE created_at >= datetime('now', '-7 days')
    `);
    const recent = recentResult.count;

    // Get pending applications count
    const pendingResult = await db.get(`
      SELECT COUNT(*) as count 
      FROM admissions 
      WHERE status = 'pending'
    `);
    const pending = pendingResult.count;

    res.json({
      total,
      recent,
      pending,
      statusStats,
      gradeStats,
      yearStats
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export applications to CSV
router.get('/export', authenticateAdmin, async (req, res) => {
  try {
    const { status, academicYear, format = 'json' } = req.query;
    const db = getDatabase();

    let whereConditions = [];
    let params = [];

    if (status) {
      whereConditions.push('status = ?');
      params.push(status);
    }

    if (academicYear) {
      whereConditions.push('academic_year = ?');
      params.push(academicYear);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const applications = await db.query(
      `SELECT * FROM admissions ${whereClause} ORDER BY created_at DESC`,
      params
    );

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = [
        'Application ID', 'Student Name', 'Student Email', 'Parent Name', 'Parent Email',
        'Grade Level', 'Academic Year', 'Status', 'Payment Status', 'Created At'
      ];

      const csvData = applications.map(app => [
        app.application_id,
        app.student_name,
        app.student_email,
        app.parent_name,
        app.parent_email,
        app.grade_level,
        app.academic_year,
        app.status,
        app.payment_status,
        app.created_at
      ]);

      const csv = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=admissions-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({ applications });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin logs
router.get('/logs', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const db = getDatabase();
    const offset = (page - 1) * limit;

    const logs = await db.query(`
      SELECT al.*, u.email as admin_email 
      FROM admin_logs al 
      LEFT JOIN users u ON al.admin_id = u.id 
      ORDER BY al.created_at DESC 
      LIMIT ? OFFSET ?
    `, [parseInt(limit), offset]);

    const totalResult = await db.get('SELECT COUNT(*) as total FROM admin_logs');
    const total = totalResult.total;

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new admin user
router.post('/users', [
  authenticateAdmin,
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'user']).withMessage('Valid role is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;
    const db = getDatabase();
    const bcrypt = require('bcryptjs');

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // Create user
    const result = await db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: result.id,
        email,
        role
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
