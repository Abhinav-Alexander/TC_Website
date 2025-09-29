/**
 * Unit tests for SecurityMonitor class
 */
import { JSDOM } from 'jsdom';

// Create a mock DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
  <a href="mailto:test@example.com">Email Link</a>
  <a href="mailto:another@test.com">Another Email</a>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// Mock the SecurityMonitor class (extracted from script.js)
class SecurityMonitor {
  constructor() {
    this.suspiciousActivity = 0;
    this.startTime = Date.now();
    this.init();
  }
  
  init() {
    this.protectEmails();
  }
  
  protectEmails() {
    setTimeout(() => {
      const emailElements = document.querySelectorAll('[href^="mailto:"]');
      emailElements.forEach(el => {
        const email = el.getAttribute('href').replace('mailto:', '');
        el.setAttribute('data-email', email);
      });
    }, 1000);
  }
  
  logSuspiciousActivity(activity) {
    this.suspiciousActivity++;
    console.warn('Security Notice:', activity);
    
    if (this.suspiciousActivity > 20) {
      console.warn('Multiple security alerts detected');
    }
  }
}

describe('SecurityMonitor', () => {
  let securityMonitor;

  beforeEach(() => {
    securityMonitor = new SecurityMonitor();
    jest.clearAllMocks();
  });

  test('should initialize with zero suspicious activity', () => {
    expect(securityMonitor.suspiciousActivity).toBe(0);
    expect(securityMonitor.startTime).toBeGreaterThan(0);
  });

  test('should protect email addresses', (done) => {
    setTimeout(() => {
      const emailLinks = document.querySelectorAll('[href^="mailto:"]');
      emailLinks.forEach(link => {
        expect(link.getAttribute('data-email')).toBeTruthy();
        expect(link.getAttribute('data-email')).not.toContain('mailto:');
      });
      done();
    }, 1100);
  });

  test('should log suspicious activity', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    
    securityMonitor.logSuspiciousActivity('Test activity');
    
    expect(securityMonitor.suspiciousActivity).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith('Security Notice:', 'Test activity');
  });

  test('should warn about multiple security alerts', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    
    // Simulate multiple suspicious activities
    for (let i = 0; i < 25; i++) {
      securityMonitor.logSuspiciousActivity(`Activity ${i}`);
    }
    
    expect(consoleSpy).toHaveBeenCalledWith('Multiple security alerts detected');
  });
});
