#!/usr/bin/env node

/**
 * Test runner script for Therapy Council website
 * Provides comprehensive testing for all functionality
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${colors.blue}${description}${colors.reset}`);
  log(`Running: ${command}`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    log(`✅ ${description} - PASSED`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red');
    log(`Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

function checkTestEnvironment() {
  log(`\n${colors.bold}🔍 Checking Test Environment${colors.reset}`);
  
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    log('Installing dependencies...', 'yellow');
    runCommand('npm install', 'Installing test dependencies');
  }
  
  // Check if Jest is available
  try {
    execSync('npx jest --version', { stdio: 'pipe' });
    log('✅ Jest is available', 'green');
  } catch (error) {
    log('❌ Jest not found. Installing...', 'red');
    runCommand('npm install --save-dev jest jest-environment-jsdom @testing-library/jest-dom @testing-library/dom jsdom', 'Installing Jest');
  }
}

function runAllTests() {
  log(`\n${colors.bold}🧪 Running All Tests${colors.reset}`);
  
  const results = {
    unit: runCommand('npm test tests/unit', 'Unit Tests'),
    integration: runCommand('npm test tests/integration', 'Integration Tests'),
    e2e: runCommand('npm test tests/e2e', 'End-to-End Tests')
  };
  
  return results;
}

function runSpecificTestSuite(suite) {
  log(`\n${colors.bold}🎯 Running ${suite} Tests${colors.reset}`);
  
  const command = `npm test tests/${suite}`;
  return runCommand(command, `${suite} Tests`);
}

function generateTestReport(results) {
  log(`\n${colors.bold}📊 Test Report${colors.reset}`);
  log('=' * 50);
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  
  log(`Total Test Suites: ${totalTests}`);
  log(`Passed: ${passedTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  
  if (failedTests > 0) {
    log(`\n${colors.red}❌ Some tests failed. Check the output above for details.${colors.reset}`);
    process.exit(1);
  } else {
    log(`\n${colors.green}✅ All tests passed!${colors.reset}`);
  }
}

function showTestCoverage() {
  log(`\n${colors.bold}📈 Generating Test Coverage Report${colors.reset}`);
  
  const coverageResult = runCommand('npm run test:coverage', 'Test Coverage Analysis');
  
  if (coverageResult.success) {
    log('✅ Coverage report generated in coverage/ directory', 'green');
    log('Open coverage/lcov-report/index.html in your browser to view detailed coverage', 'blue');
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  log(`${colors.bold}🧪 Therapy Council Test Suite${colors.reset}`);
  log('Comprehensive testing for all website functionality\n');
  
  // Check environment
  checkTestEnvironment();
  
  switch (command) {
    case 'unit':
      generateTestReport({ unit: runSpecificTestSuite('unit') });
      break;
      
    case 'integration':
      generateTestReport({ integration: runSpecificTestSuite('integration') });
      break;
      
    case 'e2e':
      generateTestReport({ e2e: runSpecificTestSuite('e2e') });
      break;
      
    case 'coverage':
      showTestCoverage();
      break;
      
    case 'watch':
      log('Starting test watcher...', 'blue');
      runCommand('npm run test:watch', 'Test Watcher');
      break;
      
    case 'ci':
      log('Running tests in CI mode...', 'blue');
      runCommand('npm run test:ci', 'CI Tests');
      break;
      
    default:
      // Run all tests
      const results = runAllTests();
      generateTestReport(results);
      
      // Show available commands
      log(`\n${colors.bold}Available Commands:${colors.reset}`);
      log('  node tests/run-tests.js unit        - Run unit tests only');
      log('  node tests/run-tests.js integration - Run integration tests only');
      log('  node tests/run-tests.js e2e         - Run end-to-end tests only');
      log('  node tests/run-tests.js coverage    - Generate coverage report');
      log('  node tests/run-tests.js watch       - Run tests in watch mode');
      log('  node tests/run-tests.js ci          - Run tests for CI/CD');
      break;
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`\n❌ Uncaught Exception: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`\n❌ Unhandled Rejection: ${reason}`, 'red');
  process.exit(1);
});

// Run the main function
main();
