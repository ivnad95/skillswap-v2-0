// Client-side database interface
// This file provides a client-side API that mimics the  client API structure
// for easier migration from 

import Cookies from 'js-cookie';

// Base URL for API requests
const API_BASE_URL = '/api';

// Helper function to make authenticated API requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = Cookies.get('auth-token');
  
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

// Auth methods
const auth = {
  signUp: async (params: { email: string; password: string; options?: { data: { first_name: string; last_name: string } } }) => {
    try {
      const { email, password, options } = params;
      const firstName = options?.data?.first_name || '';
      const lastName = options?.data?.last_name || '';
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        return { error: data.error };
      }
      
      return { data: { user: null, session: null }, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },
  
  signIn: async (params: { email: string; password: string }) => {
    try {
      const { email, password } = params;
      
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign in');
      
      // Set auth cookie
      if (data.token) {
        Cookies.set('auth-token', data.token, { expires: 7 });
      }
      
      return { data: data.user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  signOut: async () => {
    try {
      await fetchWithAuth('/auth/signout', { method: 'POST' });
      Cookies.remove('auth-token');
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  
  getSession: async () => {
    try {
      const token = Cookies.get('auth-token');
      
      if (!token) {
        return { data: { session: null }, error: null };
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        // If token is invalid, remove it
        Cookies.remove('auth-token');
        return { data: { session: null }, error: null };
      }
      
      return {
        data: {
          session: {
            access_token: token,
            user: data.user,
          },
        },
        error: null,
      };
    } catch (error) {
      console.error('Error in getSession:', error);
      return { data: { session: null }, error: { message: 'An unexpected error occurred' } };
    }
  },
  
  verifyOtp: async (params: { token_hash: string; type: 'signup' | 'recovery' }) => {
    try {
      const { token_hash, type } = params;
      
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token_hash, type }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        return { error: data.error };
      }
      
      return { data: {}, error: null };
    } catch (error) {
      console.error('Error in verifyOtp:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },
  
  resetPasswordForEmail: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        return { error: data.error };
      }
      
      return { data: {}, error: null };
    } catch (error) {
      console.error('Error in resetPasswordForEmail:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },
  
  updateUser: async (params: { data: { password?: string } }) => {
    try {
      const { data } = params;
      
      if (data.password) {
        const response = await fetchWithAuth('/auth/update-password', {
          method: 'POST',
          body: JSON.stringify({ password: data.password }),
        });
        
        const responseData = await response.json();
        
        if (responseData.error) {
          return { error: responseData.error };
        }
      }
      
      return { data: {}, error: null };
    } catch (error) {
      console.error('Error in updateUser:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },
};

// Database query methods
const from = (table: string) => {
  return {
    select: (columns = '*') => {
      return {
        eq: async (column: string, value: any) => {
          try {
            const response = await fetchWithAuth(`/db/${table}?select=${columns}&${column}=eq.${value}`);
            const data = await response.json();
            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
        order: (column: string, options: { ascending?: boolean } = {}) => {
          const direction = options.ascending === false ? 'desc' : 'asc';
          return {
            limit: async (limit: number) => {
              try {
                const response = await fetchWithAuth(`/db/${table}?select=${columns}&order=${column}.${direction}&limit=${limit}`);
                const data = await response.json();
                return { data, error: null };
              } catch (error) {
                return { data: null, error };
              }
            }
          };
        }
      };
    },
    insert: async (values: any) => {
      try {
        const response = await fetchWithAuth(`/db/${table}`, {
          method: 'POST',
          body: JSON.stringify(values),
        });
        const data = await response.json();
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    update: (values: any) => {
      return {
        eq: async (column: string, value: any) => {
          try {
            const response = await fetchWithAuth(`/db/${table}?${column}=eq.${value}`, {
              method: 'PATCH',
              body: JSON.stringify(values),
            });
            const data = await response.json();
            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      };
    },
    delete: () => {
      return {
        eq: async (column: string, value: any) => {
          try {
            const response = await fetchWithAuth(`/db/${table}?${column}=eq.${value}`, {
              method: 'DELETE',
            });
            const data = await response.json();
            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      };
    }
  };
};

// Storage methods
const storage = {
  from: (bucket: string) => {
    return {
      upload: async (path: string, file: File) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetchWithAuth(`/storage/${bucket}/${path}`, {
            method: 'POST',
            headers: {}, // Let browser set content-type with boundary
            body: formData,
          });
          
          const data = await response.json();
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      getPublicUrl: (path: string) => {
        return {
          data: { publicUrl: `${API_BASE_URL}/storage/${bucket}/${path}` }
        };
      }
    };
  }
};

// Client DB client
export function createClientDbClient() {
  return {
    auth,
    from,
    storage
  };
}

// Server DB client
export function createServerDbClient(cookieString: string) {
  // Parse the auth token from the cookie string
  const getToken = () => {
    if (!cookieString) return null;
    const match = cookieString.match(/auth-token=([^;]+)/);
    return match ? match[1] : null;
  };
  
  const token = getToken();
  
  // Server-side fetch with auth
  const serverFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
    
    return fetch(`${process.env.INTERNAL_API_URL || 'http://localhost:3000'}${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };
  
  // Server-side auth
  const serverAuth = {
    getUser: async () => {
      try {
        if (!token) return { data: null, error: null };
        
        const response = await serverFetch('/auth/user');
        const data = await response.json();
        
        return { data: data.user, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  };
  
  // Server-side database methods
  const serverFrom = (table: string) => {
    // Implement similar to the client-side from method but using serverFetch
    // This is a simplified version
    return {
      select: (columns = '*') => {
        return {
          eq: async (column: string, value: any) => {
            try {
              const response = await serverFetch(`/db/${table}?select=${columns}&${column}=eq.${value}`);
              const data = await response.json();
              return { data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        };
      }
    };
  };
  
  return {
    auth: serverAuth,
    from: serverFrom
  };
}

// Browser DB client for middleware
export function createBrowserDbClient(cookieHeader: string) {
  // Similar to server client but for middleware contexts
  return createServerDbClient(cookieHeader);
}
