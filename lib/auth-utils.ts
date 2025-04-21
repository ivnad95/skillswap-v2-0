import { NextRequest } from 'next/server';
import { verifyToken } from './db';

/**
 * Extracts the user ID from the authorization header or cookie
 * @param req The Next.js request object
 * @returns The user ID or null if not authenticated
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  try {
    // Try to get token from Authorization header
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // If no token in header, try to get from cookies
    if (!token) {
      const cookieHeader = req.headers.get('cookie') || '';
      token = cookieHeader.split(';')
        .map(cookie => cookie.trim().split('='))
        .find(([key]) => key === 'auth-token')?.[1] || null;
    }
    
    if (!token) {
      return null;
    }
    
    // Verify the token
    const result = verifyToken(token);
    
    if (result.error || !result.data?.session?.user) {
      return null;
    }
    
    // Return the user ID from the token
    // Safely access the id property with type assertion
    const user = result.data.session.user as { id: string };
    return user.id;
  } catch (error) {
    console.error('Error extracting user ID from request:', error);
    return null;
  }
}

/**
 * Logs security-related events for auditing
 * @param userId The ID of the user performing the action
 * @param action The action being performed
 * @param resourceType The type of resource being accessed
 * @param resourceId The ID of the resource being accessed
 * @param success Whether the action was successful
 * @param details Additional details about the action
 */
export function logSecurityEvent(
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId: string | null,
  success: boolean,
  details?: string
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    userId: userId || 'anonymous',
    action,
    resourceType,
    resourceId: resourceId || 'n/a',
    success,
    details: details || '',
  };
  
  // In a production environment, this would write to a secure audit log
  // For now, we'll just log to the console
  console.log(`[SECURITY_AUDIT] ${JSON.stringify(logEntry)}`);
}
