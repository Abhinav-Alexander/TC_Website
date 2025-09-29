/**
 * Integration tests for form submission functionality
 */
import { JSDOM } from 'jsdom';

// Create a comprehensive DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
  <form id="bookingForm" action="https://script.google.com/macros/s/test/exec" method="POST" data-redirect="/thank-you">
    <div class="form-group">
      <label for="name">Your Name *</label>
      <input type="text" id="name" name="fullName" required minlength="2" 
             data-error-empty="Please enter your full name"
             data-error-short="Name should be at least 2 characters"
             data-success="Great! We'll use this name for your session">
      <small class="error-msg" id="nameErr"></small>
      <small class="success-msg" id="nameSuccess"></small>
    </div>
    
    <div class="form-group">
      <label for="email">Email Address *</label>
      <input type="email" id="email" name="email" required
             data-error-empty="Please provide your email address"
             data-error-invalid="Please enter a valid email"
             data-success="Excellent! We'll send session details to this email">
      <small class="error-msg" id="emailErr"></small>
      <small class="success-msg" id="emailSuccess"></small>
    </div>
    
    <div class="form-group">
      <label for="phone">Phone Number *</label>
      <input type="tel" id="phone" name="phone" required
             data-error-empty="We need your phone number to confirm your appointment"
             data-error-invalid="Please enter a valid phone number"
             data-success="Perfect! We can reach you at this number">
      <small class="error-msg" id="phoneErr"></small>
      <small class="success-msg" id="phoneSuccess"></small>
    </div>
    
    <div class="form-group">
      <label for="concern">What brings you here?</label>
      <select id="concern" name="concern"
              data-success="Thank you for sharing - this helps us prepare for your session">
        <option value="">I'm not sure yet</option>
        <option value="Anxiety & Stress">Anxiety & Stress</option>
        <option value="Depression">Depression</option>
        <option value="Relationships">Relationships</option>
      </select>
      <small class="success-msg" id="concernSuccess"></small>
    </div>
    
    <button type="submit" class="cta-button premium-cta">
      <div class="cta-content">
        <span class="cta-main">Book your free 10‑min discovery call</span>
        <span class="cta-sub">No payment required • 100% confidential</span>
      </div>
      <i class="fas fa-arrow-right"></i>
    </button>
  </form>
  
  <div class="form-toast"></div>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// Mock fetch globally
global.fetch = jest.fn();

describe('Form Submission Integration', () => {
  let form;
  let formHandler;

  beforeEach(() => {
    form = document.getElementById('bookingForm');
    jest.clearAllMocks();
    
    // Mock successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200
    });
  });

  test('should validate all required fields before submission', async () => {
    // Test with empty form
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Form should not submit due to validation
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should submit form with valid data', async () => {
    // Fill form with valid data
    document.getElementById('name').value = 'John Doe';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('phone').value = '+91 9876543210';
    document.getElementById('concern').value = 'Anxiety & Stress';
    
    // Trigger form submission
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Should call fetch with form data
    expect(global.fetch).toHaveBeenCalledWith(
      'https://script.google.com/macros/s/test/exec',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      })
    );
  });

  test('should handle form submission errors gracefully', async () => {
    // Mock failed fetch response
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    // Fill form with valid data
    document.getElementById('name').value = 'John Doe';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('phone').value = '+91 9876543210';
    
    // Trigger form submission
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Should handle error gracefully
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check that error handling doesn't break the page
    expect(document.body.innerHTML).toContain('bookingForm');
  });

  test('should add security features to form', () => {
    // Check for honeypot field
    const honeypot = form.querySelector('input[name="website"]');
    expect(honeypot).toBeTruthy();
    expect(honeypot.style.display).toBe('none');
    
    // Check for timestamp field
    const timestamp = form.querySelector('input[name="formTimestamp"]');
    expect(timestamp).toBeTruthy();
    expect(timestamp.type).toBe('hidden');
  });

  test('should validate email format', () => {
    const emailField = document.getElementById('email');
    
    // Test invalid email
    emailField.value = 'invalid-email';
    emailField.dispatchEvent(new Event('blur'));
    
    expect(emailField.classList.contains('invalid')).toBe(true);
    
    // Test valid email
    emailField.value = 'valid@example.com';
    emailField.dispatchEvent(new Event('blur'));
    
    expect(emailField.classList.contains('valid')).toBe(true);
  });

  test('should validate phone number format', () => {
    const phoneField = document.getElementById('phone');
    
    // Test invalid phone (too short)
    phoneField.value = '123';
    phoneField.dispatchEvent(new Event('blur'));
    
    expect(phoneField.classList.contains('invalid')).toBe(true);
    
    // Test valid phone
    phoneField.value = '+91 9876543210';
    phoneField.dispatchEvent(new Event('blur'));
    
    expect(phoneField.classList.contains('valid')).toBe(true);
  });

  test('should validate name minimum length', () => {
    const nameField = document.getElementById('name');
    
    // Test short name
    nameField.value = 'A';
    nameField.dispatchEvent(new Event('blur'));
    
    expect(nameField.classList.contains('invalid')).toBe(true);
    
    // Test valid name
    nameField.value = 'John Doe';
    nameField.dispatchEvent(new Event('blur'));
    
    expect(nameField.classList.contains('valid')).toBe(true);
  });

  test('should show success messages for valid fields', () => {
    const nameField = document.getElementById('name');
    const nameSuccess = document.getElementById('nameSuccess');
    
    nameField.value = 'John Doe';
    nameField.dispatchEvent(new Event('blur'));
    
    expect(nameSuccess.classList.contains('show')).toBe(true);
    expect(nameSuccess.textContent).toContain("Great! We'll use this name");
  });

  test('should show error messages for invalid fields', () => {
    const emailField = document.getElementById('email');
    const emailErr = document.getElementById('emailErr');
    
    emailField.value = 'invalid-email';
    emailField.dispatchEvent(new Event('blur'));
    
    expect(emailErr.classList.contains('show')).toBe(true);
    expect(emailErr.textContent).toContain('Please enter a valid email');
  });

  test('should handle form submission with custom redirect', async () => {
    // Set custom redirect
    form.setAttribute('data-redirect', '/custom-thank-you');
    
    // Fill form with valid data
    document.getElementById('name').value = 'John Doe';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('phone').value = '+91 9876543210';
    
    // Mock successful submission
    global.fetch.mockResolvedValueOnce({ ok: true });
    
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
    
    // Trigger form submission
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Should redirect to custom URL
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(window.location.href).toBe('/custom-thank-you');
  });
});
