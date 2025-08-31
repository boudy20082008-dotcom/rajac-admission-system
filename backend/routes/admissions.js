const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');

const router = express.Router();

// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
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
    req.user = user;
    next();
  });
};

// Submit admission application
router.post('/submit', [
  body('studentName').trim().isLength({ min: 2 }).withMessage('Student name is required'),
  body('studentEmail').isEmail().normalizeEmail().withMessage('Valid student email is required'),
  body('studentPhone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('studentDob').optional().isISO8601().withMessage('Valid date of birth is required'),
  body('studentGender').optional().isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('parentName').trim().isLength({ min: 2 }).withMessage('Parent name is required'),
  body('parentEmail').isEmail().normalizeEmail().withMessage('Valid parent email is required'),
  body('parentPhone').isMobilePhone().withMessage('Valid parent phone is required'),
  body('address').optional().trim().isLength({ min: 5 }).withMessage('Address is required'),
  body('city').optional().trim().isLength({ min: 2 }).withMessage('City is required'),
  body('country').optional().trim().default('Saudi Arabia'),
  body('nationality').optional().trim().isLength({ min: 2 }).withMessage('Nationality is required'),
  body('previousSchool').optional().trim().isLength({ min: 2 }).withMessage('Previous school is required'),
  body('gradeLevel').trim().isLength({ min: 1 }).withMessage('Grade level is required'),
  body('academicYear').trim().isLength({ min: 4 }).withMessage('Academic year is required'),
  body('documents').optional().isArray().withMessage('Documents must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      studentName,
      studentEmail,
      studentPhone,
      studentDob,
      studentGender,
      parentName,
      parentEmail,
      parentPhone,
      address,
      city,
      country,
      nationality,
      previousSchool,
      gradeLevel,
      academicYear,
      documents
    } = req.body;

    const db = getDatabase();
    const applicationId = `APP-${Date.now()}-${uuidv4().substring(0, 8)}`;

    // Check if application already exists for this student email
    const existingApplication = await db.get(
      'SELECT id FROM admissions WHERE student_email = ? AND academic_year = ?',
      [studentEmail, academicYear]
    );

    if (existingApplication) {
      return res.status(400).json({ 
        error: 'An application for this student already exists for the specified academic year' 
      });
    }

    // Insert admission application
    const result = await db.run(`
      INSERT INTO admissions (
        application_id, student_name, student_email, student_phone, student_dob,
        student_gender, parent_name, parent_email, parent_phone, address, city,
        country, nationality, previous_school, grade_level, academic_year, documents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      applicationId, studentName, studentEmail, studentPhone, studentDob,
      studentGender, parentName, parentEmail, parentPhone, address, city,
      country, nationality, previousSchool, gradeLevel, academicYear,
      documents ? JSON.stringify(documents) : null
    ]);

    res.status(201).json({
      message: 'Admission application submitted successfully',
      applicationId,
      application: {
        id: result.id,
        applicationId,
        studentName,
        studentEmail,
        parentName,
        parentEmail,
        gradeLevel,
        academicYear,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Submit admission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's admission applications
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const applications = await db.query(
      'SELECT * FROM admissions WHERE student_email = ? ORDER BY created_at DESC',
      [req.user.email]
    );

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific admission application
router.get('/:applicationId', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const db = getDatabase();

    const application = await db.get(
      'SELECT * FROM admissions WHERE application_id = ? AND student_email = ?',
      [applicationId, req.user.email]
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Parse documents JSON if exists
    if (application.documents) {
      application.documents = JSON.parse(application.documents);
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update admission application
router.put('/:applicationId', [
  authenticateToken,
  body('studentName').optional().trim().isLength({ min: 2 }),
  body('studentPhone').optional().isMobilePhone(),
  body('parentPhone').optional().isMobilePhone(),
  body('address').optional().trim().isLength({ min: 5 }),
  body('city').optional().trim().isLength({ min: 2 }),
  body('documents').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { applicationId } = req.params;
    const updateFields = req.body;
    const db = getDatabase();

    // Check if application exists and belongs to user
    const existingApplication = await db.get(
      'SELECT id FROM admissions WHERE application_id = ? AND student_email = ?',
      [applicationId, req.user.email]
    );

    if (!existingApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Build update query dynamically
    const allowedFields = [
      'studentPhone', 'parentPhone', 'address', 'city', 'documents'
    ];
    
    const updates = [];
    const values = [];
    
    allowedFields.forEach(field => {
      if (updateFields[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(field === 'documents' ? JSON.stringify(updateFields[field]) : updateFields[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(applicationId);

    await db.run(
      `UPDATE admissions SET ${updates.join(', ')} WHERE application_id = ?`,
      values
    );

    res.json({ message: 'Application updated successfully' });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete admission application (only if status is pending)
router.delete('/:applicationId', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const db = getDatabase();

    // Check if application exists and belongs to user
    const application = await db.get(
      'SELECT id, status FROM admissions WHERE application_id = ? AND student_email = ?',
      [applicationId, req.user.email]
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Cannot delete application that is not in pending status' 
      });
    }

    await db.run('DELETE FROM admissions WHERE application_id = ?', [applicationId]);

    res.json({ message: 'Application deleted successfully' });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get application status
router.get('/:applicationId/status', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const db = getDatabase();

    const application = await db.get(
      'SELECT application_id, status, payment_status, created_at, updated_at FROM admissions WHERE application_id = ? AND student_email = ?',
      [applicationId, req.user.email]
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ 
      applicationId: application.application_id,
      status: application.status,
      paymentStatus: application.payment_status,
      submittedAt: application.created_at,
      lastUpdated: application.updated_at
    });

  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
