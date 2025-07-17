#!/usr/bin/env node

/**
 * Demo script showing how an AI assistant would interact with the MCP server
 * This simulates the workflow of an AI using the authentication tools
 */

import { spawn } from 'child_process';
import { EventEmitter } from 'events';

class MCPServerDemo extends EventEmitter {
  constructor() {
    super();
    this.serverProcess = null;
    this.requestId = 0;
  }

  async startServer() {
    console.log('🚀 Starting MCP Server...');
    
    this.serverProcess = spawn('node', ['../dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: __dirname
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.log('📋 Server log:', data.toString());
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ MCP Server started\n');
  }

  async sendRequest(method, params = {}) {
    if (!this.serverProcess) {
      throw new Error('Server not started');
    }

    const request = {
      jsonrpc: '2.0',
      id: ++this.requestId,
      method,
      params
    };

    console.log(`📤 AI Request: ${method}`);
    console.log(`   Parameters:`, JSON.stringify(params, null, 2));

    return new Promise((resolve, reject) => {
      let responseData = '';

      const onData = (data) => {
        responseData += data.toString();
        
        // Check if we have a complete JSON response
        try {
          const lines = responseData.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              this.serverProcess.stdout.removeListener('data', onData);
              
              console.log(`📥 AI Response:`);
              if (response.error) {
                console.log(`   ❌ Error:`, response.error);
                reject(new Error(response.error.message));
              } else {
                console.log(`   ✅ Success:`, JSON.stringify(response.result, null, 2));
                resolve(response.result);
              }
              return;
            }
          }
        } catch (e) {
          // Incomplete JSON, continue collecting data
        }
      };

      this.serverProcess.stdout.on('data', onData);
      
      // Send the request
      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
      
      // Timeout after 10 seconds
      setTimeout(() => {
        this.serverProcess.stdout.removeListener('data', onData);
        reject(new Error('Request timeout'));
      }, 10000);
    });
  }

  async demonstrateAIWorkflow() {
    console.log('🤖 AI Assistant Demo: User Authentication Workflow\n');
    console.log('=' * 60);

    try {
      // Step 1: AI checks if the backend is healthy
      console.log('\n🔍 Step 1: AI checks system health');
      await this.sendRequest('tools/call', {
        name: 'auth_health_check',
        arguments: {}
      });

      // Step 2: AI lists available tools
      console.log('\n📋 Step 2: AI discovers available tools');
      const tools = await this.sendRequest('tools/list', {});
      console.log(`   Found ${tools.tools.length} authentication tools`);

      // Step 3: AI registers a new user
      console.log('\n👤 Step 3: AI registers a new user');
      const signupResult = await this.sendRequest('tools/call', {
        name: 'auth_signup',
        arguments: {
          username: `ai_demo_user_${Date.now()}`,
          email: `demo${Date.now()}@ai-assistant.com`,
          password: 'SecureAIPass123!'
        }
      });

      // Extract username for login
      const userData = JSON.parse(signupResult.content[0].text);
      const username = userData.user.username;

      // Step 4: AI logs in the user
      console.log('\n🔐 Step 4: AI logs in the user');
      const loginResult = await this.sendRequest('tools/call', {
        name: 'auth_login',
        arguments: {
          username: username,
          password: 'SecureAIPass123!'
        }
      });

      // Extract token
      const loginData = JSON.parse(loginResult.content[0].text);
      const token = loginData.token;

      // Step 5: AI gets user information
      console.log('\n📊 Step 5: AI retrieves user information');
      await this.sendRequest('tools/call', {
        name: 'auth_get_current_user',
        arguments: {
          token: token
        }
      });

      // Step 6: AI logs out the user
      console.log('\n👋 Step 6: AI logs out the user');
      await this.sendRequest('tools/call', {
        name: 'auth_logout',
        arguments: {
          token: token
        }
      });

      console.log('\n🎉 AI Workflow Demo Completed Successfully!');
      console.log('\n📝 Summary:');
      console.log('   • AI checked system health');
      console.log('   • AI discovered available tools');
      console.log('   • AI registered a new user');
      console.log('   • AI authenticated the user');
      console.log('   • AI retrieved user information');
      console.log('   • AI securely logged out the user');

    } catch (error) {
      console.error('\n❌ Demo failed:', error.message);
    }
  }

  async stop() {
    if (this.serverProcess) {
      console.log('\n🛑 Stopping MCP Server...');
      this.serverProcess.kill();
      this.serverProcess = null;
    }
  }
}

// Run the demo
async function runDemo() {
  const demo = new MCPServerDemo();
  
  try {
    await demo.startServer();
    await demo.demonstrateAIWorkflow();
  } catch (error) {
    console.error('❌ Demo error:', error);
  } finally {
    await demo.stop();
    process.exit(0);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down demo...');
  process.exit(0);
});

console.log('🤖 MCP Server AI Integration Demo');
console.log('🔗 This demonstrates how an AI assistant would use the authentication MCP server');
console.log('⚠️  Make sure your FastAPI backend is running on http://localhost:8000\n');

runDemo();
