const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    // For Vercel/serverless, use in-memory database or temp file
    const dbPath = process.env.NODE_ENV === 'production' 
      ? ':memory:' 
      : (process.env.DB_PATH || './database/admission.db');
    this.db = new sqlite3.Database(dbPath);
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Create users table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create admissions table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS admissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            application_id TEXT UNIQUE NOT NULL,
            student_name TEXT NOT NULL,
            student_email TEXT NOT NULL,
            student_phone TEXT,
            student_dob DATE,
            student_gender TEXT,
            parent_name TEXT NOT NULL,
            parent_email TEXT NOT NULL,
            parent_phone TEXT NOT NULL,
            address TEXT,
            city TEXT,
            country TEXT DEFAULT 'Saudi Arabia',
            nationality TEXT,
            previous_school TEXT,
            grade_level TEXT NOT NULL,
            academic_year TEXT NOT NULL,
            documents TEXT, -- JSON string of document paths
            status TEXT DEFAULT 'pending',
            payment_status TEXT DEFAULT 'pending',
            payment_id TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create payments table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admission_id INTEGER,
            payment_id TEXT UNIQUE,
            amount DECIMAL(10,2) NOT NULL,
            currency TEXT DEFAULT 'SAR',
            status TEXT DEFAULT 'pending',
            payment_method TEXT,
            transaction_data TEXT, -- JSON string
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admission_id) REFERENCES admissions (id)
          )
        `);

        // Create admin_logs table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS admin_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER,
            action TEXT NOT NULL,
            details TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES users (id)
          )
        `);

        // Create default admin user
        this.createDefaultAdmin()
          .then(() => {
            console.log('✅ Database tables created successfully');
            resolve();
          })
          .catch(reject);
      });
    });
  }

  async createDefaultAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rajac.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const hashedPassword = await bcrypt.hash(adminPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id FROM users WHERE email = ?',
        [adminEmail],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (!row) {
            this.db.run(
              'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
              [adminEmail, hashedPassword, 'admin'],
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  console.log('✅ Default admin user created');
                  resolve();
                }
              }
            );
          } else {
            console.log('ℹ️ Admin user already exists');
            resolve();
          }
        }
      );
    });
  }

  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  close() {
    this.db.close();
  }
}

let dbInstance = null;

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
}

async function initializeDatabase() {
  const db = getDatabase();
  await db.initialize();
  return db;
}

module.exports = {
  Database,
  getDatabase,
  initializeDatabase
};
