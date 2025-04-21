// Script to create a test user in the database
import { createUser } from '../lib/db.js';

async function createTestUser() {
  try {
    const result = await createUser(
      'test@example.com',
      'password123',
      'Test',
      'User'
    );

    console.log('Test user created successfully:', result);
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
