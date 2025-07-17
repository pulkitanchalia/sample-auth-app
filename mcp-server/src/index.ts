#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { z } from 'zod';

// Configuration
const API_BASE_URL = 'http://localhost:8000';

// Simple in-memory session store for AI assistants
class SessionManager {
  private sessions: Map<string, { token: string, username: string, loginTime: Date }> = new Map();

  setSession(sessionId: string, token: string, username: string) {
    this.sessions.set(sessionId, {
      token,
      username,
      loginTime: new Date()
    });
    this.logDebug(`Session created for user: ${username}`);
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  removeSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.logDebug(`Session removed for user: ${session.username}`);
      this.sessions.delete(sessionId);
    }
  }

  private logDebug(message: string) {
    console.error(`[SessionManager] ${new Date().toISOString()}: ${message}`);
  }
}

const sessionManager = new SessionManager();

// Schemas for validation
const UserCreateSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const UserLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Create server instance
const server = new Server({
  name: 'auth-api-server',
  version: '1.0.0',
  capabilities: {
    tools: {},
  },
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'auth_signup',
        description: 'Register a new user account',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Username for the new account',
            },
            email: {
              type: 'string',
              description: 'Email address for the new account',
            },
            password: {
              type: 'string',
              description: 'Password for the new account (minimum 6 characters)',
            },
          },
          required: ['username', 'email', 'password'],
        },
      },
      {
        name: 'auth_login',
        description: 'Login with username and password to get JWT token',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Username to login with',
            },
            password: {
              type: 'string',
              description: 'Password to login with',
            },
          },
          required: ['username', 'password'],
        },
      },
      {
        name: 'auth_get_current_user',
        description: 'Get current user information using JWT token',
        inputSchema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token from login',
            },
          },
          required: ['token'],
        },
      },
      {
        name: 'auth_logout',
        description: 'Logout current user session',
        inputSchema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token to logout',
            },
          },
          required: ['token'],
        },
      },
      {
        name: 'auth_health_check',
        description: 'Check if the authentication API is running',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  logDebug('MCP', `Tool called: ${name}`, args);

  try {
    switch (name) {
      case 'auth_health_check':
        return await handleHealthCheck();
      
      case 'auth_signup':
        return await handleSignup(args);
      
      case 'auth_login':
        return await handleLogin(args);
      
      case 'auth_get_current_user':
        return await handleGetCurrentUser(args);
      
      case 'auth_logout':
        return await handleLogout(args);
      
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error: any) {
    logDebug('MCP', `Tool error: ${name}`, { error: error.message });
    
    if (error instanceof McpError) {
      throw error;
    }
    
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.message;
      
      if (status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, `Bad request: ${message}`);
      } else if (status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, `Authentication failed: ${message}`);
      } else if (status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, `Not found: ${message}`);
      } else {
        throw new McpError(ErrorCode.InternalError, `API error: ${message}`);
      }
    }
    
    throw new McpError(ErrorCode.InternalError, `Unexpected error: ${error}`);
  }
});

// Tool implementations
async function handleHealthCheck() {
  try {
    logDebug('API', 'Health check started');
    const response = await axios.get(`${API_BASE_URL}/`);
    const result = {
      status: 'healthy',
      message: response.data.message,
      timestamp: new Date().toISOString(),
    };
    logDebug('API', 'Health check successful', result);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    const result = {
      status: 'unhealthy',
      error: axios.isAxiosError(error) ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
    logDebug('API', 'Health check failed', result);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
}

async function handleSignup(args: any) {
  const validatedData = UserCreateSchema.parse(args);
  
  const response = await axios.post(`${API_BASE_URL}/signup`, validatedData);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: 'User created successfully',
          user: {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            is_active: response.data.is_active,
          },
        }, null, 2),
      },
    ],
  };
}

async function handleLogin(args: any) {
  const validatedData = UserLoginSchema.parse(args);
  
  const response = await axios.post(`${API_BASE_URL}/login`, validatedData);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: 'Login successful',
          token: response.data.access_token,
          token_type: response.data.token_type,
        }, null, 2),
      },
    ],
  };
}

async function handleGetCurrentUser(args: any) {
  if (!args.token) {
    throw new McpError(ErrorCode.InvalidParams, 'Token is required');
  }
  
  const response = await axios.get(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${args.token}`,
    },
  });
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          user: {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            is_active: response.data.is_active,
          },
        }, null, 2),
      },
    ],
  };
}

async function handleLogout(args: any) {
  if (!args.token) {
    throw new McpError(ErrorCode.InvalidParams, 'Token is required');
  }
  
  const response = await axios.post(`${API_BASE_URL}/logout`, {}, {
    headers: {
      Authorization: `Bearer ${args.token}`,
    },
  });
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: response.data.message,
        }, null, 2),
      },
    ],
  };
}

// Enhanced logging function
function logDebug(category: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${category}] ${timestamp}: ${message}`);
  if (data) {
    console.error(`[${category}] Data:`, JSON.stringify(data, null, 2));
  }
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Auth API MCP Server running on stdio');
}

main().catch((error: any) => {
  console.error('Server error:', error);
  // Exit with error code
  (globalThis as any).process?.exit?.(1);
});
