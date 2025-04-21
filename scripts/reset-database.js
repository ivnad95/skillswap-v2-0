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

  // Delete all data from tables in reverse order of dependencies
  console.log('Deleting data from all tables...');

  // Delete from email_verification_tokens
  const deleteEmailTokens = db.prepare('DELETE FROM email_verification_tokens');
  const emailTokensResult = deleteEmailTokens.run();
  console.log(`Deleted ${emailTokensResult.changes} email verification tokens`);

  // Delete from password_reset_tokens
  const deletePasswordTokens = db.prepare('DELETE FROM password_reset_tokens');
  const passwordTokensResult = deletePasswordTokens.run();
  console.log(`Deleted ${passwordTokensResult.changes} password reset tokens`);

  // Delete from ratings
  const deleteRatings = db.prepare('DELETE FROM ratings');
  const ratingsResult = deleteRatings.run();
  console.log(`Deleted ${ratingsResult.changes} ratings`);

  // Delete from transactions
  const deleteTransactions = db.prepare('DELETE FROM transactions');
  const transactionsResult = deleteTransactions.run();
  console.log(`Deleted ${transactionsResult.changes} transactions`);

  // Delete from sessions
  const deleteSessions = db.prepare('DELETE FROM sessions');
  const sessionsResult = deleteSessions.run();
  console.log(`Deleted ${sessionsResult.changes} sessions`);

  // Delete from community_posts
  const deletePosts = db.prepare('DELETE FROM community_posts');
  const postsResult = deletePosts.run();
  console.log(`Deleted ${postsResult.changes} community posts`);

  // Delete from communities
  const deleteCommunities = db.prepare('DELETE FROM communities');
  const communitiesResult = deleteCommunities.run();
  console.log(`Deleted ${communitiesResult.changes} communities`);

  // Delete from skills
  const deleteSkills = db.prepare('DELETE FROM skills');
  const skillsResult = deleteSkills.run();
  console.log(`Deleted ${skillsResult.changes} skills`);

  // Delete from profiles
  const deleteProfiles = db.prepare('DELETE FROM profiles');
  const profilesResult = deleteProfiles.run();
  console.log(`Deleted ${profilesResult.changes} profiles`);

  // Delete from users
  const deleteUsers = db.prepare('DELETE FROM users');
  const usersResult = deleteUsers.run();
  console.log(`Deleted ${usersResult.changes} users`);

  // Commit the transaction
  db.prepare('COMMIT').run();

  console.log('Database reset successfully!');
} catch (error) {
  // Rollback the transaction in case of error
  db.prepare('ROLLBACK').run();
  console.error('Error resetting database:', error);
} finally {
  // Close the database connection
  db.close();
}
