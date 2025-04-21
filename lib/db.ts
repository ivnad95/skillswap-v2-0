import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize the database
const dbPath = path.join(dataDir, 'skillswap.db');
const db = new Database(dbPath);

// JWT secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d';

// Initialize database tables
function initDb() {
  // Users table
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

  // Profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      bio TEXT,
      location TEXT,
      social_links TEXT,
      learning_preferences TEXT,
      profile_image TEXT,
      cover_image TEXT,
      onboarding_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Skills table
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      level TEXT NOT NULL,
      rate INTEGER,
      description TEXT,
      tags TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      teacher_id TEXT NOT NULL,
      learner_id TEXT NOT NULL,
      skill_id TEXT NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users (id),
      FOREIGN KEY (learner_id) REFERENCES users (id),
      FOREIGN KEY (skill_id) REFERENCES skills (id)
    )
  `);

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      from_user_id TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      session_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_user_id) REFERENCES users (id),
      FOREIGN KEY (to_user_id) REFERENCES users (id),
      FOREIGN KEY (session_id) REFERENCES sessions (id)
    )
  `);

  // Ratings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      rated_user_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (rated_user_id) REFERENCES users (id),
      FOREIGN KEY (session_id) REFERENCES sessions (id)
    )
  `);

  // Communities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS communities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_by TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users (id)
    )
  `);

  // Community posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      community_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (community_id) REFERENCES communities (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Email verification tokens
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Password reset tokens
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
}

// Add a proper error type for database operations
export interface DBError {
  message: string;
  code?: string;
  details?: unknown;
}

export type DBResult<T> = { data: T; error?: undefined } | { error: DBError; data?: undefined };

// Type definitions for database objects
export interface DbUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string;
  user_id: string;
  bio?: string;
  location?: string;
  social_links?: string;
  learning_preferences?: string;
  profile_image?: string;
  cover_image?: string;
  onboarding_completed?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbSkill {
  id: string;
  user_id: string;
  title: string;
  type: string;
  level: string;
  rate: number;
  description?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface DbSession {
  id: string;
  teacher_id: string;
  learner_id: string;
  skill_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbToken {
  id: string;
  user_id: string;
  token: string;
  created_at: string;
  expires_at: string;
}

export interface ProfileData {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  socialLinks: Record<string, string>;
  learningPreferences: Record<string, any>;
  profileImage: string | null;
  coverImage: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillData {
  id: string;
  userId: string;
  title: string;
  type: string;
  level: string;
  rate: number;
  description: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Initialize the database
initDb();

// User authentication functions
export async function createUser(email: string, password: string, firstName: string, lastName: string) {
  try {
    // Start a transaction
    db.prepare('BEGIN TRANSACTION').run();
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(userId, email, hashedPassword, firstName, lastName);

    // Create an empty profile for the user with all required fields
    const profileStmt = db.prepare(`
      INSERT INTO profiles (
        id,
        user_id,
        bio,
        location,
        social_links,
        learning_preferences,
        profile_image,
        cover_image,
        onboarding_completed
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Initialize with empty values
    profileStmt.run(
      uuidv4(),
      userId,
      '', // bio
      '', // location
      '{}', // social_links as empty JSON object
      '{}', // learning_preferences as empty JSON object
      null, // profile_image
      null, // cover_image
      0 // onboarding_completed (false)
    );

    // Commit the transaction
    db.prepare('COMMIT').run();

    return { userId };
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run();
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function verifyUser(email: string, password: string): Promise<DBResult<{ session: { user: any; access_token: string } }>> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `);

    const user = stmt.get(email) as DbUser | undefined;

    if (!user) {
      return { error: { message: 'User not found' } };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: { message: 'Invalid password' } };
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    return {
      data: {
        session: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
          },
          access_token: token
        }
      }
    };
  } catch (error) {
    console.error('Error verifying user:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { data: { session: { user: decoded } } };
  } catch (error) {
    return { data: { session: null }, error };
  }
}

export function createEmailVerificationToken(userId: string) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

  const stmt = db.prepare(`
    INSERT INTO email_verification_tokens (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(uuidv4(), userId, token, expiresAt.toISOString());

  return token;
}

export function verifyEmailToken(token: string): DBResult<{ success: boolean }> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM email_verification_tokens
      WHERE token = ? AND expires_at > datetime('now')
    `);

    const verification = stmt.get(token) as DbToken | undefined;

    if (!verification) {
      return { error: { message: 'Invalid or expired token' } };
    }

    // Mark user as verified
    const updateStmt = db.prepare(`
      UPDATE users SET email_verified = TRUE
      WHERE id = ?
    `);

    updateStmt.run(verification.user_id);

    // Delete the token
    const deleteStmt = db.prepare(`
      DELETE FROM email_verification_tokens
      WHERE token = ?
    `);

    deleteStmt.run(token);

    return { data: { success: true } };
  } catch (error) {
    console.error('Error verifying email token:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export function createPasswordResetToken(email: string) {
  try {
    const stmt = db.prepare(`
      SELECT id FROM users WHERE email = ?
    `);

    const user = stmt.get(email) as { id: string } | undefined;

    if (!user) {
      return { error: { message: 'User not found' } };
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    const insertStmt = db.prepare(`
      INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `);

    insertStmt.run(uuidv4(), user.id, token, expiresAt.toISOString());

    return { token };
  } catch (error) {
    console.error('Error creating password reset token:', error);
    return { error };
  }
}

export function resetPassword(token: string, newPassword: string): DBResult<{ success: boolean }> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM password_reset_tokens
      WHERE token = ? AND expires_at > datetime('now')
    `);

    const resetToken = stmt.get(token) as DbToken | undefined;

    if (!resetToken) {
      return { error: { message: 'Invalid or expired token' } };
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update the user's password
    const updateStmt = db.prepare(`
      UPDATE users SET password = ?
      WHERE id = ?
    `);

    updateStmt.run(hashedPassword, resetToken.user_id);

    // Delete the token
    const deleteStmt = db.prepare(`
      DELETE FROM password_reset_tokens
      WHERE token = ?
    `);

    deleteStmt.run(token);

    return { data: { success: true } };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

// Database query functions
export function getUser(userId: string): DBResult<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  createdAt: string;
}> {
  try {
    const stmt = db.prepare(`
      SELECT id, email, first_name, last_name, email_verified, created_at
      FROM users WHERE id = ?
    `);

    const user = stmt.get(userId) as DbUser | undefined;

    if (!user) {
      return { error: { message: 'User not found' } };
    }

    return {
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        emailVerified: user.email_verified,
        createdAt: user.created_at
      }
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export function getUserProfile(userId: string): DBResult<ProfileData> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM profiles WHERE user_id = ?
    `);

    const profile = stmt.get(userId) as DbProfile | undefined;

    if (!profile) {
      return { error: { message: 'Profile not found' } };
    }

    // Parse JSON fields
    const socialLinks = profile.social_links ? JSON.parse(profile.social_links) : {};
    const learningPreferences = profile.learning_preferences ? JSON.parse(profile.learning_preferences) : {};

    return {
      data: {
        id: profile.id,
        userId: profile.user_id,
        bio: profile.bio || null,
        location: profile.location || null,
        socialLinks,
        learningPreferences,
        profileImage: profile.profile_image || null,
        coverImage: profile.cover_image || null,
        onboardingCompleted: !!profile.onboarding_completed,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export function updateUserProfile(userId: string, profileData: any) {
  try {
    // Check if profile exists
    const checkStmt = db.prepare(`
      SELECT id FROM profiles WHERE user_id = ?
    `);

    const profile = checkStmt.get(userId);

    if (!profile) {
      console.error('Profile not found for user ID:', userId);
      return { error: { message: 'Profile not found' } };
    }

    // Prepare data for update
    const { bio, location, socialLinks, learningPreferences, profileImage, coverImage, onboardingCompleted } = profileData;

    const socialLinksJson = socialLinks ? JSON.stringify(socialLinks) : null;
    const learningPreferencesJson = learningPreferences ? JSON.stringify(learningPreferences) : null;

    const stmt = db.prepare(`
      UPDATE profiles
      SET bio = ?, location = ?, social_links = ?, learning_preferences = ?,
          profile_image = ?, cover_image = ?, onboarding_completed = ?,
          updated_at = datetime('now')
      WHERE user_id = ?
    `);

    try {
      stmt.run(
        bio,
        location,
        socialLinksJson,
        learningPreferencesJson,
        profileImage,
        coverImage,
        onboardingCompleted === true ? 1 : 0,
        userId
      );

      return { success: true };
    } catch (sqlError) {
      console.error('SQL execution error:', sqlError);
      throw sqlError; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { error };
  }
}

export function getUserSkills(userId: string): DBResult<SkillData[]> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM skills WHERE user_id = ?
    `);

    const skills = stmt.all(userId) as DbSkill[];

    // Parse JSON fields
    const parsedSkills = skills.map(skill => ({
      id: skill.id,
      userId: skill.user_id,
      title: skill.title,
      type: skill.type,
      level: skill.level,
      rate: skill.rate,
      description: skill.description || null,
      tags: skill.tags ? JSON.parse(skill.tags) : [],
      createdAt: skill.created_at,
      updatedAt: skill.updated_at
    }));

    return { data: parsedSkills };
  } catch (error) {
    console.error('Error getting user skills:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export function createSkill(userId: string, skillData: any) {
  try {
    const { title, type, level, rate, description, tags } = skillData;

    const tagsJson = tags ? JSON.stringify(tags) : null;
    const skillId = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO skills (id, user_id, title, type, level, rate, description, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(skillId, userId, title, type, level, rate, description, tagsJson);

    return {
      data: {
        id: skillId,
        userId,
        title,
        type,
        level,
        rate,
        description,
        tags: tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error creating skill:', error);
    return { error };
  }
}

export function updateSkill(skillId: string, userId: string, skillData: any) {
  try {
    // First verify that the skill belongs to the user
    if (!verifyResourceOwnership('skill', skillId, userId)) {
      return { error: { message: 'Unauthorized: You do not have permission to update this skill' } };
    }

    const { title, type, level, rate, description, tags } = skillData;

    const tagsJson = tags ? JSON.stringify(tags) : null;

    const stmt = db.prepare(`
      UPDATE skills
      SET title = ?, type = ?, level = ?, rate = ?, description = ?, tags = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `);

    stmt.run(title, type, level, rate, description, tagsJson, skillId, userId);

    return { success: true };
  } catch (error) {
    console.error('Error updating skill:', error);
    return { error };
  }
}

export function deleteSkill(skillId: string, userId: string) {
  try {
    // First verify that the skill belongs to the user
    if (!verifyResourceOwnership('skill', skillId, userId)) {
      return { error: { message: 'Unauthorized: You do not have permission to delete this skill' } };
    }

    const stmt = db.prepare(`
      DELETE FROM skills WHERE id = ? AND user_id = ?
    `);

    stmt.run(skillId, userId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting skill:', error);
    return { error };
  }
}

export function getUserSessions(userId: string): DBResult<DbSession[]> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM sessions
      WHERE teacher_id = ? OR learner_id = ?
      ORDER BY start_time ASC
    `);

    const sessions = stmt.all(userId, userId) as DbSession[];
    return { data: sessions };
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export function createSession(sessionData: any) {
  try {
    const { teacherId, learnerId, skillId, startTime, endTime, status, notes } = sessionData;

    const sessionId = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO sessions (id, teacher_id, learner_id, skill_id, start_time, end_time, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(sessionId, teacherId, learnerId, skillId, startTime, endTime, status, notes);

    return {
      data: {
        id: sessionId,
        teacherId,
        learnerId,
        skillId,
        startTime,
        endTime,
        status,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return { error };
  }
}

export function updateSession(sessionId: string, userId: string, sessionData: any) {
  try {
    // First verify that the user is a participant in the session
    if (!verifyResourceOwnership('session', sessionId, userId)) {
      return { error: { message: 'Unauthorized: You do not have permission to update this session' } };
    }

    const { startTime, endTime, status, notes } = sessionData;

    const stmt = db.prepare(`
      UPDATE sessions
      SET start_time = ?, end_time = ?, status = ?, notes = ?, updated_at = datetime('now')
      WHERE id = ? AND (teacher_id = ? OR learner_id = ?)
    `);

    stmt.run(startTime, endTime, status, notes, sessionId, userId, userId);

    return { success: true };
  } catch (error) {
    console.error('Error updating session:', error);
    return { error };
  }
}

export function deleteSession(sessionId: string, userId: string) {
  try {
    // First verify that the user is a participant in the session
    if (!verifyResourceOwnership('session', sessionId, userId)) {
      return { error: { message: 'Unauthorized: You do not have permission to delete this session' } };
    }

    const stmt = db.prepare(`
      DELETE FROM sessions WHERE id = ? AND (teacher_id = ? OR learner_id = ?)
    `);

    stmt.run(sessionId, userId, userId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting session:', error);
    return { error };
  }
}

// Utility function to verify resource ownership
export function verifyResourceOwnership(resourceType: string, resourceId: string, userId: string) {
  try {
    let stmt;

    switch (resourceType) {
      case 'skill':
        stmt = db.prepare(`
          SELECT 1 FROM skills WHERE id = ? AND user_id = ?
        `);
        break;
      case 'profile':
        stmt = db.prepare(`
          SELECT 1 FROM profiles WHERE id = ? AND user_id = ?
        `);
        break;
      case 'session':
        stmt = db.prepare(`
          SELECT 1 FROM sessions WHERE id = ? AND (teacher_id = ? OR learner_id = ?)
        `);
        return !!stmt.get(resourceId, userId, userId);
      case 'community':
        stmt = db.prepare(`
          SELECT 1 FROM communities WHERE id = ? AND created_by = ?
        `);
        break;
      case 'post':
        stmt = db.prepare(`
          SELECT 1 FROM community_posts WHERE id = ? AND user_id = ?
        `);
        break;
      default:
        return false;
    }

    return !!stmt.get(resourceId, userId);
  } catch (error) {
    console.error(`Error verifying ${resourceType} ownership:`, error);
    return false;
  }
}

// Check if a user has completed onboarding
export function hasCompletedOnboarding(userId: string) {
  try {
    const stmt = db.prepare(`
      SELECT onboarding_completed FROM profiles WHERE user_id = ?
    `);

    const profile = stmt.get(userId) as { onboarding_completed: boolean } | undefined;

    if (!profile) {
      return { error: { message: 'Profile not found' } };
    }

    return { completed: !!profile.onboarding_completed };
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return { error };
  }
}

// Complete user onboarding function
export async function completeUserOnboarding(userId: string, data: {
    firstName: string;
    lastName: string;
    bio?: string;
    skillsToTeach: string[];
    skillsToLearn: string[];
    availability: Record<string, { startTime: string; endTime: string }[]>;
}): Promise<DBResult<{ success: boolean }>> {
    try {
        // Update user profile
        const updateProfileStmt = db.prepare(`
            UPDATE profiles
            SET 
                bio = ?,
                onboarding_completed = TRUE,
                updated_at = datetime('now')
            WHERE user_id = ?
        `);
        
        updateProfileStmt.run(data.bio || '', userId);
        
        // Update user information
        const updateUserStmt = db.prepare(`
            UPDATE users
            SET 
                first_name = ?,
                last_name = ?,
                updated_at = datetime('now')
            WHERE id = ?
        `);
        
        updateUserStmt.run(data.firstName, data.lastName, userId);
        
        // First clear existing skills
        const clearSkillsStmt = db.prepare(`
            DELETE FROM skills
            WHERE user_id = ?
        `);
        
        clearSkillsStmt.run(userId);
        
        // Add skills to teach
        if (data.skillsToTeach && data.skillsToTeach.length > 0) {
            const addSkillStmt = db.prepare(`
                INSERT INTO skills (id, user_id, title, type, level, rate, description, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            for (const skillTitle of data.skillsToTeach) {
                addSkillStmt.run(
                    uuidv4(),
                    userId,
                    skillTitle,
                    'teaching',
                    'Intermediate', // Default level
                    0, // Default rate
                    '', // Default description
                    '[]' // Default tags (empty array)
                );
            }
        }
        
        // Add skills to learn
        if (data.skillsToLearn && data.skillsToLearn.length > 0) {
            const addSkillStmt = db.prepare(`
                INSERT INTO skills (id, user_id, title, type, level, rate, description, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            for (const skillTitle of data.skillsToLearn) {
                addSkillStmt.run(
                    uuidv4(),
                    userId,
                    skillTitle,
                    'learning',
                    'Beginner', // Default level
                    0, // Default rate
                    '', // Default description
                    '[]' // Default tags (empty array)
                );
            }
        }
        
        // Handle availability - this would require a proper availability table
        // For now, we'll store it in the profile as JSON
        const availabilityJson = JSON.stringify(data.availability);
        const updateAvailabilityStmt = db.prepare(`
            UPDATE profiles
            SET learning_preferences = ?
            WHERE user_id = ?
        `);
        
        updateAvailabilityStmt.run(availabilityJson, userId);
        
        return { data: { success: true } };
    } catch (error) {
        console.error("Error completing user onboarding:", error);
        return { error: { message: "Failed to complete onboarding process" } };
    }
}

// Export the database for direct access if needed
export { db };
