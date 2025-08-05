#!/usr/bin/env node

/**
 * 🚀 TravelQuest Development Environment Setup
 * 
 * Features:
 * - Automated dependency installation
 * - Local DynamoDB setup
 * - Seed data generation
 * - Development server startup
 * - Hot reload configuration
 * - Database migration management
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌟 TravelQuest Development Setup Starting...\n');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.cyan) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    log(`🔄 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    success(`${description} completed`);
    return true;
  } catch (err) {
    error(`${description} failed: ${err.message}`);
    return false;
  }
}

async function main() {
  try {
    // Step 1: Environment Check
    log('🔍 Checking environment prerequisites...', colors.blue);
    
    const requiredTools = ['node', 'npm', 'aws', 'sam', 'docker'];
    const missingTools = [];
    
    for (const tool of requiredTools) {
      try {
        execSync(`${tool} --version`, { stdio: 'ignore' });
        success(`${tool} is installed`);
      } catch {
        error(`${tool} is not installed`);
        missingTools.push(tool);
      }
    }
    
    if (missingTools.length > 0) {
      error(`Missing required tools: ${missingTools.join(', ')}`);
      console.log('\n📚 Installation guides:');
      console.log('- Node.js: https://nodejs.org/');
      console.log('- AWS CLI: https://aws.amazon.com/cli/');
      console.log('- SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html');
      console.log('- Docker: https://www.docker.com/get-started');
      process.exit(1);
    }

    // Step 2: Install Dependencies
    log('\n📦 Installing project dependencies...', colors.blue);
    if (!executeCommand('npm install', 'Installing npm dependencies')) {
      process.exit(1);
    }

    // Step 3: Setup Local Environment
    log('\n⚙️  Setting up local environment...', colors.blue);
    
    // Create .env.local if it doesn't exist
    if (!fs.existsSync('.env.local')) {
      const envContent = `# TravelQuest Local Development Environment
NODE_ENV=development
AWS_REGION=us-east-1
DYNAMODB_ENDPOINT=http://localhost:8000
TABLE_NAME=TravelQuest-Destinations-local
CORS_ORIGIN=http://localhost:3001

# Local development settings
LOG_LEVEL=debug
ENABLE_HOT_RELOAD=true
MOCK_EXTERNAL_SERVICES=true

# Authentication (development only)
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Database settings
DB_MIGRATION_AUTO=true
SEED_DATA_AUTO=true
`;
      fs.writeFileSync('.env.local', envContent);
      success('Created .env.local configuration');
    } else {
      warning('.env.local already exists');
    }

    // Step 4: Setup Local DynamoDB
    log('\n🗄️  Setting up local DynamoDB...', colors.blue);
    
    // Check if DynamoDB Local is running
    try {
      execSync('curl -s http://localhost:8000/', { stdio: 'ignore' });
      success('DynamoDB Local is already running');
    } catch {
      log('Starting DynamoDB Local...');
      
      // Start DynamoDB Local in background
      const dynamoProcess = spawn('docker', [
        'run', '-d', '-p', '8000:8000',
        '--name', 'travelquest-dynamodb-local',
        'amazon/dynamodb-local:latest'
      ], { stdio: 'inherit' });
      
      // Wait for DynamoDB to start
      await new Promise(resolve => setTimeout(resolve, 5000));
      success('DynamoDB Local started');
    }

    // Step 5: Create Local Tables
    log('\n🏗️  Creating database tables...', colors.blue);
    
    const createTablesScript = `
      aws dynamodb create-table \\
        --table-name TravelQuest-Destinations-local \\
        --attribute-definitions \\
          AttributeName=id,AttributeType=S \\
          AttributeName=region,AttributeType=S \\
          AttributeName=category,AttributeType=S \\
        --key-schema \\
          AttributeName=id,KeyType=HASH \\
        --global-secondary-indexes \\
          IndexName=region-category-index,KeySchema=[{AttributeName=region,KeyType=HASH},{AttributeName=category,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \\
        --provisioned-throughput \\
          ReadCapacityUnits=5,WriteCapacityUnits=5 \\
        --endpoint-url http://localhost:8000 \\
        --region us-east-1
    `;
    
    try {
      execSync(createTablesScript, { stdio: 'inherit' });
      success('Database tables created');
    } catch (err) {
      if (err.message.includes('ResourceInUseException')) {
        warning('Tables already exist');
      } else {
        error(`Table creation failed: ${err.message}`);
      }
    }

    // Step 6: Seed Development Data
    log('\n🌱 Seeding development data...', colors.blue);
    executeCommand('node scripts/seed-data.js', 'Seeding sample data');

    // Step 7: Build Application
    log('\n🏗️  Building application...', colors.blue);
    executeCommand('npm run build', 'Building TypeScript application');
    executeCommand('sam build', 'Building SAM application');

    // Step 8: Development Server Ready
    log('\n🎉 Development environment setup complete!', colors.green);
    console.log(`
${colors.bright}🚀 TravelQuest Development Environment Ready!${colors.reset}

${colors.cyan}Available Commands:${colors.reset}
  ${colors.yellow}npm run dev${colors.reset}           - Start development server with hot reload
  ${colors.yellow}npm run sam:local${colors.reset}     - Start SAM local API server
  ${colors.yellow}npm run test:watch${colors.reset}    - Run tests in watch mode
  ${colors.yellow}npm run lint:fix${colors.reset}      - Fix linting issues
  ${colors.yellow}npm run db:seed${colors.reset}       - Reseed database with sample data

${colors.cyan}Development URLs:${colors.reset}
  🌐 API Gateway: http://localhost:3000
  🗄️  DynamoDB Admin: http://localhost:8001
  📊 Test Coverage: file://./coverage/lcov-report/index.html

${colors.cyan}Quick Start:${colors.reset}
  1. Run ${colors.yellow}npm run dev${colors.reset} to start the development server
  2. Open http://localhost:3000/destinations to test the API
  3. Check http://localhost:3000/health for health status

${colors.magenta}Happy coding! 🎯${colors.reset}
    `);

    // Optional: Start development server
    console.log('\n🤔 Would you like to start the development server now? (y/N)');
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', (data) => {
      const key = data.toString();
      if (key.toLowerCase() === 'y') {
        log('\n🚀 Starting development server...', colors.green);
        spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
      } else {
        log('\n👋 Setup complete! Run "npm run dev" when ready to start developing.', colors.cyan);
        process.exit(0);
      }
    });

  } catch (error) {
    error(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n🛑 Setup interrupted by user', colors.yellow);
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n🛑 Setup terminated', colors.yellow);
  process.exit(0);
});

main().catch(console.error);
