# Therapy Council Test Suite

Comprehensive testing suite for the Therapy Council website covering all functionality, user interactions, and edge cases.

## 🧪 Test Coverage

### Unit Tests
- **SecurityMonitor**: Email protection, suspicious activity detection
- **SecureFormHandler**: Form validation, submission, error handling
- **TherapistsCarousel**: Navigation, responsive behavior, touch support

### Integration Tests
- **Form Submission**: Complete form workflow, validation, error handling
- **Navigation**: Mobile menu, sticky CTA, accessibility
- **User Interactions**: Carousel controls, form interactions

### End-to-End Tests
- **Complete User Workflows**: Landing → Form → Submission → Thank You
- **Error Handling**: Network errors, validation failures, edge cases
- **Accessibility**: Keyboard navigation, screen readers, ARIA labels
- **Performance**: Loading, slow networks, resource optimization

## 🚀 Quick Start

### Install Dependencies
```bash
cd tests
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e        # End-to-end tests only
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Watch Mode (Development)
```bash
npm run test:watch
```

## 📋 Test Commands

### Using the Test Runner
```bash
# Run all tests
node tests/run-tests.js

# Run specific test suite
node tests/run-tests.js unit
node tests/run-tests.js integration
node tests/run-tests.js e2e

# Generate coverage report
node tests/run-tests.js coverage

# Watch mode for development
node tests/run-tests.js watch

# CI/CD mode
node tests/run-tests.js ci
```

### Direct Jest Commands
```bash
# Run all tests
npx jest

# Run with coverage
npx jest --coverage

# Run in watch mode
npx jest --watch

# Run specific test file
npx jest tests/unit/form-handler.test.js

# Run tests matching pattern
npx jest --testNamePattern="form validation"
```

## 🎯 Test Categories

### 1. Unit Tests (`tests/unit/`)

#### SecurityMonitor Tests
- ✅ Email protection functionality
- ✅ Suspicious activity logging
- ✅ Security threshold handling

#### FormHandler Tests
- ✅ Field validation (email, phone, text)
- ✅ Error message display
- ✅ Success message display
- ✅ Security features (honeypot, timestamp)

#### Carousel Tests
- ✅ Navigation controls
- ✅ Responsive behavior
- ✅ Touch/swipe support
- ✅ Dot navigation

### 2. Integration Tests (`tests/integration/`)

#### Form Submission Tests
- ✅ Complete form workflow
- ✅ Validation integration
- ✅ Error handling
- ✅ Success scenarios

#### Navigation Tests
- ✅ Mobile menu functionality
- ✅ Sticky CTA behavior
- ✅ Accessibility features
- ✅ Keyboard navigation

### 3. End-to-End Tests (`tests/e2e/`)

#### User Workflow Tests
- ✅ Complete booking process
- ✅ Error handling scenarios
- ✅ Accessibility compliance
- ✅ Performance testing

## 🔧 Configuration

### Jest Configuration
```json
{
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
  "testMatch": ["**/tests/**/*.test.js"],
  "collectCoverageFrom": [
    "script.js",
    "js/**/*.js",
    "!**/node_modules/**"
  ]
}
```

### Test Environment Setup
- **JSDOM**: Browser-like environment for DOM testing
- **Jest**: Test runner and assertion library
- **Testing Library**: DOM testing utilities
- **Puppeteer**: End-to-end testing (optional)

## 📊 Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## 🐛 Debugging Tests

### Run Tests with Verbose Output
```bash
npx jest --verbose
```

### Run Single Test File
```bash
npx jest tests/unit/form-handler.test.js
```

### Run Tests Matching Pattern
```bash
npx jest --testNamePattern="form validation"
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 🔍 Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── security-monitor.test.js
│   ├── form-handler.test.js
│   └── carousel.test.js
├── integration/             # Integration tests
│   ├── form-submission.test.js
│   └── navigation.test.js
├── e2e/                     # End-to-end tests
│   └── user-workflow.test.js
├── fixtures/               # Test data and mocks
├── setup.js                 # Test environment setup
├── run-tests.js             # Test runner script
├── package.json             # Test dependencies
└── README.md                # This file
```

## 🚨 Common Issues

### 1. Module Import Errors
```bash
# Ensure you're using ES modules
"type": "module" in package.json
```

### 2. DOM Environment Issues
```bash
# JSDOM should be properly configured in setup.js
```

### 3. Async Test Issues
```bash
# Use proper async/await or done() callbacks
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd tests && npm install
      - run: cd tests && npm test
      - run: cd tests && npm run test:coverage
```

## 🎉 Best Practices

1. **Write tests first** (TDD approach)
2. **Test user behavior**, not implementation details
3. **Use descriptive test names**
4. **Keep tests independent**
5. **Mock external dependencies**
6. **Test edge cases and error scenarios**
7. **Maintain high coverage**
8. **Run tests frequently during development**

## 📞 Support

For test-related issues or questions:
- Check the test output for specific error messages
- Review the Jest documentation
- Ensure all dependencies are installed
- Verify the test environment setup

---

**Happy Testing! 🧪✨**
