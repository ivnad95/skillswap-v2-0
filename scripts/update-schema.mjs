import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the database
const dbPath = path.join(path.resolve(__dirname, '..'), 'data', 'skillswap.db');

// Check if database exists
if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at:', dbPath);
  process.exit(1);
}

// Connect to the database
const db = new Database(dbPath);

try {
  // Start a transaction
  db.prepare('BEGIN TRANSACTION').run();

  console.log('Checking if profiles table needs to be updated...');
  
  // Check if profile_image column exists
  const tableInfo = db.prepare("PRAGMA table_info(profiles)").all();
  const columnNames = tableInfo.map(col => col.name);
  
  // List of columns to add if they don't exist
  const columnsToAdd = [
    { name: 'profile_image', type: 'TEXT' },
    { name: 'cover_image', type: 'TEXT' },
    { name: 'onboarding_completed', type: 'INTEGER DEFAULT 0' }
  ];
  
  // Add columns if they don't exist
  for (const column of columnsToAdd) {
    if (!columnNames.includes(column.name)) {
      console.log(`Adding ${column.name} column to profiles table...`);
      db.prepare(`ALTER TABLE profiles ADD COLUMN ${column.name} ${column.type}`).run();
    } else {
      console.log(`Column ${column.name} already exists in profiles table.`);
    }
  }
  
  // Commit the transaction
  db.prepare('COMMIT').run();
  
  console.log('Database schema updated successfully!');
} catch (error) {
  // Rollback the transaction in case of error
  db.prepare('ROLLBACK').run();
  console.error('Error updating database schema:', error);
} finally {
  // Close the database connection
  db.close();
}
