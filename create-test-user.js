// Create a test user directly in the database
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize the database
const dbPath = path.join(dataDir, 'skillswap.db');
const db = new Database(dbPath);

// Create the users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE
  )
`);

// Create the profiles table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    social_links TEXT,
    learning_preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`);

// Create a test user
async function createTestUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userId = uuidv4();
    
    // Check if the user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get('test@example.com');
    
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }
    
    // Insert the user
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, first_name, last_name, email_verified)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(userId, 'test@example.com', hashedPassword, 'Test', 'User', true);
    
    // Create an empty profile for the user
    const profileStmt = db.prepare(`
      INSERT INTO profiles (id, user_id)
      VALUES (?, ?)
    `);
    
    profileStmt.run(uuidv4(), userId);
    
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

// Run the function
createTestUser();
