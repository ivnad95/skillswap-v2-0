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
      notification_settings TEXT, -- Added column for notification settings (JSON)
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
      token_amount INTEGER, -- Added column for token cost
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

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      recipient_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE
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
  notification_settings?: string; // Added field (will store JSON string)
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
  token_amount?: number; // Added column for token cost
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at?: string | null;
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
  notificationSettings?: Record<string, boolean>; // Added optional field
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
        onboarding_completed,
        notification_settings -- Added column
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) -- Added placeholder
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
      0, // onboarding_completed (false)
      '{}' // notification_settings (default empty JSON)
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
    const notificationSettings = profile.notification_settings ? JSON.parse(profile.notification_settings) : {}; // Parse settings

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
        notificationSettings, // Include parsed settings
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

    // Prepare data for update, including notification settings if provided
    const { bio, location, socialLinks, learningPreferences, profileImage, coverImage, onboardingCompleted, notificationSettings } = profileData;

    const socialLinksJson = socialLinks ? JSON.stringify(socialLinks) : null;
    const learningPreferencesJson = learningPreferences ? JSON.stringify(learningPreferences) : null;
    // Only update notification settings if they are explicitly passed in profileData
    const shouldUpdateNotifications = notificationSettings !== undefined;
    const notificationSettingsJson = shouldUpdateNotifications ? JSON.stringify(notificationSettings) : undefined;

    // Build the SET part of the query dynamically
    const setClauses: string[] = [];
    const params: any[] = [];

    if (bio !== undefined) { setClauses.push("bio = ?"); params.push(bio); }
    if (location !== undefined) { setClauses.push("location = ?"); params.push(location); }
    if (socialLinksJson !== undefined) { setClauses.push("social_links = ?"); params.push(socialLinksJson); }
    if (learningPreferencesJson !== undefined) { setClauses.push("learning_preferences = ?"); params.push(learningPreferencesJson); }
    if (profileImage !== undefined) { setClauses.push("profile_image = ?"); params.push(profileImage); }
    if (coverImage !== undefined) { setClauses.push("cover_image = ?"); params.push(coverImage); }
    if (onboardingCompleted !== undefined) { setClauses.push("onboarding_completed = ?"); params.push(onboardingCompleted === true ? 1 : 0); }
    if (shouldUpdateNotifications) { setClauses.push("notification_settings = ?"); params.push(notificationSettingsJson); }

    if (setClauses.length === 0) {
      // Nothing to update
      return { success: true };
    }

    setClauses.push("updated_at = datetime('now')");
    params.push(userId); // Add userId for the WHERE clause

    const sql = `UPDATE profiles SET ${setClauses.join(', ')} WHERE user_id = ?`;
    const stmt = db.prepare(sql);


    try {
      stmt.run(...params); // Spread the parameters
      return { success: true };
    } catch (sqlError) {
      console.error('SQL execution error:', sqlError);
      throw sqlError; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { error: { message: 'Failed to update profile', details: error instanceof Error ? error.message : String(error) } };
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

// Define a type for the populated session data
export interface PopulatedDbSession extends DbSession {
  teacher: { first_name: string | null; last_name: string | null; image_url?: string | null };
  learner: { first_name: string | null; last_name: string | null; image_url?: string | null };
  skill: { name: string };
  token_amount?: number; // Added to sessions table
}

export function getUserSessions(userId: string): DBResult<PopulatedDbSession[]> {
  try {
    // Join sessions with users (teacher/learner) and skills tables
    const stmt = db.prepare(`
      SELECT
        s.*,
        t.first_name as teacher_first_name, t.last_name as teacher_last_name, tp.profile_image as teacher_image_url,
        l.first_name as learner_first_name, l.last_name as learner_last_name, lp.profile_image as learner_image_url,
        sk.title as skill_name
        -- Placeholder for token amount - needs schema change or join with transactions
      FROM sessions s
      JOIN users t ON s.teacher_id = t.id
      JOIN users l ON s.learner_id = l.id
      JOIN skills sk ON s.skill_id = sk.id
      LEFT JOIN profiles tp ON s.teacher_id = tp.user_id -- Join teacher profile for image
      LEFT JOIN profiles lp ON s.learner_id = lp.user_id -- Join learner profile for image
      WHERE s.teacher_id = ? OR s.learner_id = ?
      ORDER BY s.start_time ASC
    `);

    const sessionsRaw = stmt.all(userId, userId) as any[]; // Use any[] for raw data

    // Map raw data to the PopulatedDbSession structure
    const sessions: PopulatedDbSession[] = sessionsRaw.map(row => ({
      ...row, // Spread basic session fields
      teacher: {
        first_name: row.teacher_first_name,
        last_name: row.teacher_last_name,
        image_url: row.teacher_image_url
      },
      learner: {
        first_name: row.learner_first_name,
        last_name: row.learner_last_name,
        image_url: row.learner_image_url
      },
      skill: {
        name: row.skill_name
      },
      token_amount: row.token_amount // Fetch the actual token_amount
    }));

    return { data: sessions };
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export function createSession(sessionData: any) {
  try {
    // Include token_amount in destructuring
    const { teacherId, learnerId, skillId, startTime, endTime, status, notes, tokenAmount } = sessionData;

    const sessionId = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO sessions (id, teacher_id, learner_id, skill_id, start_time, end_time, status, notes, token_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) -- Added token_amount placeholder
    `);

    // Add tokenAmount to the run parameters (default to 0 if not provided)
    stmt.run(sessionId, teacherId, learnerId, skillId, startTime, endTime, status, notes, tokenAmount || 0);

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
        tokenAmount: tokenAmount || 0, // Include in returned data
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

// --- Messaging Functions ---

export function createMessage(senderId: string, recipientId: string, content: string): DBResult<{ id: string }> {
  try {
    const messageId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO messages (id, sender_id, recipient_id, content)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(messageId, senderId, recipientId, content);
    return { data: { id: messageId } };
  } catch (error) {
    console.error('Error creating message:', error);
    const dbError: DBError = { message: 'Failed to send message' };
    if (error instanceof Error) {
      dbError.details = error.message;
    }
    return { error: dbError };
  }
}

export function getMessagesBetweenUsers(userId1: string, userId2: string): DBResult<DbMessage[]> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM messages
      WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
      ORDER BY created_at ASC
    `);
    const messages = stmt.all(userId1, userId2, userId2, userId1) as DbMessage[];
    return { data: messages };
  } catch (error) {
    console.error('Error getting messages:', error);
    const dbError: DBError = { message: 'Failed to retrieve messages' };
     if (error instanceof Error) {
      dbError.details = error.message;
    }
    return { error: dbError };
  }
}

// TODO: Add function to mark messages as read

// --- Conversation List Function ---
export interface ConversationListItem {
  partnerId: string;
  partnerFirstName: string | null;
  partnerLastName: string | null;
  partnerProfileImage: string | null;
  lastMessageContent: string;
  lastMessageTimestamp: string;
  unreadCount: number; // Count of unread messages from this partner
}

export function getConversationList(userId: string): DBResult<ConversationListItem[]> {
  try {
    // This query is complex. It finds the latest message for each conversation partner.
    // It uses Common Table Expressions (CTEs) for clarity.
    const stmt = db.prepare(`
      WITH LatestMessages AS (
        SELECT
          CASE
            WHEN sender_id = ? THEN recipient_id
            ELSE sender_id
          END as partner_id,
          MAX(created_at) as max_created_at
        FROM messages
        WHERE sender_id = ? OR recipient_id = ?
        GROUP BY partner_id
      ),
      UnreadCounts AS (
         SELECT recipient_id as partner_id, COUNT(*) as unread_count
         FROM messages
         WHERE sender_id = ? AND read_at IS NULL -- Count messages sent by partner that are unread by current user
         GROUP BY recipient_id
      )
      SELECT
        lm.partner_id,
        u.first_name as partnerFirstName,
        u.last_name as partnerLastName,
        p.profile_image as partnerProfileImage,
        m.content as lastMessageContent,
        m.created_at as lastMessageTimestamp,
        COALESCE(uc.unread_count, 0) as unreadCount
      FROM LatestMessages lm
      JOIN messages m ON (
          (m.sender_id = ? AND m.recipient_id = lm.partner_id) OR
          (m.sender_id = lm.partner_id AND m.recipient_id = ?)
        ) AND m.created_at = lm.max_created_at
      JOIN users u ON lm.partner_id = u.id
      LEFT JOIN profiles p ON lm.partner_id = p.user_id
      LEFT JOIN UnreadCounts uc ON lm.partner_id = uc.partner_id
      ORDER BY lm.max_created_at DESC
    `);

    // Parameters: userId repeated for different parts of the query
    const conversationsRaw = stmt.all(userId, userId, userId, userId, userId, userId) as any[];

    // Map directly as column names match the interface mostly
    const conversations: ConversationListItem[] = conversationsRaw;

    return { data: conversations };
  } catch (error) {
    console.error('Error getting conversation list:', error);
    return { error: { message: 'Failed to retrieve conversation list' } };
  }
}

// TODO: Add function to mark messages as read
export function markMessagesAsRead(recipientId: string, senderId: string): DBResult<{ success: boolean }> {
  try {
    const stmt = db.prepare(`
      UPDATE messages
      SET read_at = datetime('now')
      WHERE recipient_id = ? AND sender_id = ? AND read_at IS NULL
    `);
    // Mark messages sent by senderId to recipientId (current user) as read
    const info = stmt.run(recipientId, senderId);
    console.log(`Marked ${info.changes} messages as read from ${senderId} for ${recipientId}`);
    return { data: { success: true } };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return { error: { message: 'Failed to mark messages as read' } };
  }
}


// --- User Reviews Function ---
export interface UserReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { // Basic info about the reviewer
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  };
  skill: { // Skill the review was for
     id: string;
     title: string;
  }
}

export function getUserReviews(ratedUserId: string): DBResult<UserReviewData[]> {
  try {
    const stmt = db.prepare(`
      SELECT
        r.id, r.rating, r.comment, r.created_at,
        u.id as reviewer_id, u.first_name as reviewer_first_name, u.last_name as reviewer_last_name,
        p.profile_image as reviewer_profile_image,
        s.id as skill_id, sk.title as skill_title
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN profiles p ON r.user_id = p.user_id
      JOIN sessions s ON r.session_id = s.id
      JOIN skills sk ON s.skill_id = sk.id
      WHERE r.rated_user_id = ?
      ORDER BY r.created_at DESC
    `);
    const reviewsRaw = stmt.all(ratedUserId) as any[];

    const reviews: UserReviewData[] = reviewsRaw.map(row => ({
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      reviewer: {
        id: row.reviewer_id,
        firstName: row.reviewer_first_name,
        lastName: row.reviewer_last_name,
        profileImage: row.reviewer_profile_image
      },
       skill: {
         id: row.skill_id,
         title: row.skill_title
      }
    }));

    return { data: reviews };
  } catch (error) {
     console.error('Error getting user reviews:', error);
     return { error: { message: 'Failed to retrieve user reviews' } };
  }
}

// --- Teacher Search Function ---

export interface PopulatedTeacherData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  bio: string | null;
  averageRating: number | null;
  ratingCount: number;
  sessionCount: number; // Number of sessions taught
  skillsTeaching: string[]; // List of skill titles
}

// Function to search for users who have teaching skills
export function searchTeachers(searchTerm?: string): DBResult<PopulatedTeacherData[]> {
  try {
    let query = `
      SELECT DISTINCT
        u.id,
        u.first_name,
        u.last_name,
        p.profile_image,
        p.bio,
        -- Calculate average rating and count
        (SELECT AVG(r.rating) FROM ratings r JOIN sessions ses ON r.session_id = ses.id WHERE ses.teacher_id = u.id) as avg_rating,
        (SELECT COUNT(r.rating) FROM ratings r JOIN sessions ses ON r.session_id = ses.id WHERE ses.teacher_id = u.id) as rating_count,
        -- Count completed sessions as teacher
        (SELECT COUNT(*) FROM sessions ses WHERE ses.teacher_id = u.id AND ses.status = 'completed') as session_count,
        -- Aggregate teaching skills (simple approach, might need refinement for performance on large datasets)
        GROUP_CONCAT(s.title) as teaching_skill_titles
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      -- Join skills specifically for filtering and aggregation, ensure user teaches at least one skill
      JOIN skills s ON u.id = s.user_id AND s.type = 'teaching'
      -- Removed WHERE s.type = 'teaching' as it's now in the JOIN condition
    `;
    const params: any[] = [];
    let whereClause = '';

    // Build WHERE clause if searchTerm is provided
    if (searchTerm) {
      whereClause = `
      WHERE (
        (u.first_name || ' ' || u.last_name) LIKE ? OR
        u.first_name LIKE ? OR
        u.last_name LIKE ? OR
        p.bio LIKE ? OR
        -- Using HAVING for aggregated column search might be better, but this works for simple cases
        teaching_skill_titles LIKE ?
      )
      `;
      const likeTerm = `%${searchTerm}%`;
      params.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm);
    }

    // Append WHERE clause (if exists), GROUP BY, ORDER BY, and LIMIT
    query += `
      ${whereClause}
      GROUP BY u.id, u.first_name, u.last_name, p.profile_image, p.bio
      ORDER BY u.first_name, u.last_name LIMIT 50
    `;

    // Add ORDER BY and LIMIT
    query += ` ORDER BY u.first_name, u.last_name LIMIT 50`;

    const stmt = db.prepare(query);
    const teachersRaw = stmt.all(...params) as any[];

    const teachers: PopulatedTeacherData[] = teachersRaw.map(row => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      profileImage: row.profile_image,
      bio: row.bio,
      averageRating: row.avg_rating !== null ? parseFloat(row.avg_rating.toFixed(1)) : null,
      ratingCount: row.rating_count,
      sessionCount: row.session_count,
      // Split the aggregated skill titles string into an array
      skillsTeaching: row.teaching_skill_titles ? row.teaching_skill_titles.split(',') : []
    }));

    return { data: teachers };

  } catch (error) {
    console.error('Error searching teachers:', error);
    const dbError: DBError = { message: 'Failed to search teachers' };
     if (error instanceof Error) {
      dbError.details = error.message;
    }
    return { error: dbError };
  }
}


// --- Skill Analytics Functions ---

// Basic analytics - can be expanded significantly
export function getUserSkillAnalytics(userId: string): DBResult<{
  teachingSessionCount: number;
  learningSessionCount: number;
  averageRating: number | null;
  ratingCount: number;
}> {
  try {
    // Count teaching sessions (assuming status 'completed' or similar)
    const teachingStmt = db.prepare(`
      SELECT COUNT(*) as count FROM sessions WHERE teacher_id = ? AND status = 'completed'
    `);
    const teachingResult = teachingStmt.get(userId) as { count: number };

    // Count learning sessions
    const learningStmt = db.prepare(`
      SELECT COUNT(*) as count FROM sessions WHERE learner_id = ? AND status = 'completed'
    `);
    const learningResult = learningStmt.get(userId) as { count: number };

    // Calculate average rating received as a teacher
    const ratingStmt = db.prepare(`
      SELECT AVG(rating) as avgRating, COUNT(rating) as ratingCount
      FROM ratings
      JOIN sessions ON ratings.session_id = sessions.id
      WHERE sessions.teacher_id = ?
    `);
    const ratingResult = ratingStmt.get(userId) as { avgRating: number | null; ratingCount: number };

    return {
      data: {
        teachingSessionCount: teachingResult.count,
        learningSessionCount: learningResult.count,
        // Round average rating to one decimal place
        averageRating: ratingResult.avgRating !== null ? parseFloat(ratingResult.avgRating.toFixed(1)) : null,
        ratingCount: ratingResult.ratingCount
      }
    };
  } catch (error) {
    console.error('Error getting skill analytics:', error);
    const dbError: DBError = { message: 'Failed to retrieve skill analytics' };
     if (error instanceof Error) {
      dbError.details = error.message;
    }
    return { error: dbError };
  }
}


// --- Notification Settings Functions ---

export function getUserNotificationSettings(userId: string): DBResult<Record<string, boolean>> {
  try {
    const stmt = db.prepare(`
      SELECT notification_settings FROM profiles WHERE user_id = ?
    `);
    const profile = stmt.get(userId) as { notification_settings?: string } | undefined;

    if (!profile) {
      return { error: { message: 'Profile not found' } };
    }

    const settings = profile.notification_settings ? JSON.parse(profile.notification_settings) : {};
    return { data: settings };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    const dbError: DBError = { message: 'Failed to retrieve notification settings' };
     if (error instanceof Error) {
      dbError.details = error.message;
    }
    return { error: dbError };
  }
}

export function updateUserNotificationSettings(userId: string, settings: Record<string, boolean>): DBResult<{ success: boolean }> {
  try {
    const settingsJson = JSON.stringify(settings);
    const stmt = db.prepare(`
      UPDATE profiles
      SET notification_settings = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `);
    const info = stmt.run(settingsJson, userId);

    if (info.changes === 0) {
      return { error: { message: 'Profile not found or settings not updated' } };
    }

    return { data: { success: true } };
  } catch (error) {
    console.error('Error updating notification settings:', error);
     const dbError: DBError = { message: 'Failed to update notification settings' };
     if (error instanceof Error) {
      dbError.details = error.message;
    }
    return { error: dbError };
  }
}

// --- Skill Detail Functions ---

export function getSkillById(skillId: string): DBResult<SkillData> {
  try {
    const stmt = db.prepare(`SELECT * FROM skills WHERE id = ?`);
    const skill = stmt.get(skillId) as DbSkill | undefined;

    if (!skill) {
      return { error: { message: 'Skill not found' } };
    }

    // Parse JSON fields
    const parsedSkill: SkillData = {
      id: skill.id,
      userId: skill.user_id, // Keep original user_id if needed
      title: skill.title,
      type: skill.type,
      level: skill.level,
      rate: skill.rate,
      description: skill.description || null,
      tags: skill.tags ? JSON.parse(skill.tags) : [],
      createdAt: skill.created_at,
      updatedAt: skill.updated_at
    };

    return { data: parsedSkill };
  } catch (error) {
    console.error('Error getting skill by ID:', error);
    return { error: { message: 'Failed to retrieve skill details' } };
  }
}

// Fetches basic info for teachers offering a specific skill
export function getTeachersForSkill(skillId: string): DBResult<PopulatedTeacherData[]> {
   try {
    // Find users who have the specified skill with type 'teaching'
    const stmt = db.prepare(`
      SELECT DISTINCT
        u.id,
        u.first_name,
        u.last_name,
        p.profile_image,
        p.bio
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      JOIN skills s ON u.id = s.user_id
      WHERE s.title = (SELECT title FROM skills WHERE id = ?) -- Match by title, assuming title is unique enough for this context
        AND s.type = 'teaching'
      LIMIT 20 -- Limit results for performance
    `);
    const teachersRaw = stmt.all(skillId) as any[];

    // Map to PopulatedTeacherData (excluding analytics fields for now)
    const teachers: PopulatedTeacherData[] = teachersRaw.map(row => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      profileImage: row.profile_image,
      bio: row.bio,
      // Set analytics fields to default/null as they aren't calculated here
      averageRating: null,
      ratingCount: 0,
      sessionCount: 0,
      skillsTeaching: [] // Skills list not needed here
    }));

    return { data: teachers };
  } catch (error) {
    console.error('Error getting teachers for skill:', error);
    return { error: { message: 'Failed to retrieve teachers for this skill' } };
  }
}

// Fetches skills related by category (simple approach)
export function getRelatedSkills(skillId: string, limit: number = 5): DBResult<SkillData[]> {
   try {
    // Get the category of the current skill
    const categoryStmt = db.prepare(`SELECT tags FROM skills WHERE id = ?`);
    const currentSkill = categoryStmt.get(skillId) as { tags?: string } | undefined;

    if (!currentSkill?.tags) {
        return { data: [] }; // No tags/category found, return empty
    }

    // Assuming the first tag represents the main category for simplicity
    const tagsArray = JSON.parse(currentSkill.tags);
    if (!tagsArray || tagsArray.length === 0) {
         return { data: [] };
    }
    const category = tagsArray[0]; // Use the first tag as category

    // Find other skills in the same category, excluding the current skill
    const stmt = db.prepare(`
      SELECT * FROM skills
      WHERE json_extract(tags, '$[0]') = ? AND id != ?
      ORDER BY RANDOM() -- Order randomly or by relevance/popularity later
      LIMIT ?
    `);
    const relatedSkillsRaw = stmt.all(category, skillId, limit) as DbSkill[];

     // Parse JSON fields
    const relatedSkills: SkillData[] = relatedSkillsRaw.map(skill => ({
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


    return { data: relatedSkills };
  } catch (error) {
    console.error('Error getting related skills:', error);
    return { error: { message: 'Failed to retrieve related skills' } };
  }
}


// Export the database for direct access if needed
export { db };
