/**
 * Unit tests for SecureFormHandler class
 */
import { JSDOM } from 'jsdom';

// Create a mock DOM environment with form
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
  <form id="bookingForm" action="https://script.google.com/test" method="POST">
    <input type="text" id="name" name="fullName" required minlength="2" 
           data-error-empty="Please enter your full name"
           data-error-short="Name should be at least 2 characters"
           data-success="Great! We'll use this name for your session">
    <input type="email" id="email" name="email" required
           data-error-empty="Please provide your email address"
           data-error-invalid="Please enter a valid email"
           data-success="Excellent! We'll send session details to this email">
    <input type="tel" id="phone" name="phone" required
           data-error-empty="We need your phone number to confirm your appointment"
           data-error-invalid="Please enter a valid phone number"
           data-success="Perfect! We can reach you at this number">
    <select id="concern" name="concern"
            data-success="Thank you for sharing - this helps us prepare for your session">
      <option value="">Select a concern</option>
      <option value="Anxiety">Anxiety</option>
    </select>
    <button type="submit">Submit</button>
    <small class="error-msg" id="nameErr"></small>
    <small class="success-msg" id="nameSuccess"></small>
    <small class="error-msg" id="emailErr"></small>
    <small class="success-msg" id="emailSuccess"></small>
    <small class="error-msg" id="phoneErr"></small>
    <small class="success-msg" id="phoneSuccess"></small>
    <small class="success-msg" id="concernSuccess"></small>
  </form>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// Mock SecureFormHandler class (simplified version for testing)
class SecureFormHandler {
  constructor(formId, endpoint, formType = 'booking') {
    this.form = document.getElementById(formId);
    this.endpoint = endpoint;
    this.formType = formType;
    this.rateLimitKey = `formRateLimit_${formId}`;
    
    if (this.form) {
      this.init();
    }
  }
  
  init() {
    this.setupBasicValidation();
    this.addSecurityFeatures();
  }
  
  setupBasicValidation() {
    const fields = this.form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      if (field.type !== 'hidden') {
        field.addEventListener('input', () => this.validateFieldEnhanced(field));
        field.addEventListener('blur', () => this.validateFieldEnhanced(field));
        field.addEventListener('change', () => this.validateFieldEnhanced(field));
      }
    });
  }
  
  addSecurityFeatures() {
    // Add honeypot
    if (!this.form.querySelector('input[name="website"]')) {
      const honeypot = document.createElement('input');
      honeypot.type = 'text';
      honeypot.name = 'website';
      honeypot.style.display = 'none';
      honeypot.tabIndex = -1;
      this.form.appendChild(honeypot);
    }
    
    // Add timestamp
    const timestamp = document.createElement('input');
    timestamp.type = 'hidden';
    timestamp.name = 'formTimestamp';
    timestamp.value = Date.now();
    this.form.appendChild(timestamp);
  }
  
  validateFieldEnhanced(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    let successMessage = '';
    
    switch (field.type) {
      case 'email':
        if (field.hasAttribute('required') && !value) {
          isValid = false;
          message = field.getAttribute('data-error-empty') || 'Email is required';
        } else if (value && !field.validity.valid) {
          isValid = false;
          message = field.getAttribute('data-error-invalid') || 'Please enter a valid email';
        } else if (value && field.validity.valid) {
          successMessage = field.getAttribute('data-success') || 'Email looks good!';
        }
        break;
        
      case 'tel':
        if (field.hasAttribute('required') && !value) {
          isValid = false;
          message = field.getAttribute('data-error-empty') || 'Phone number is required';
        } else if (value) {
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length < 7) {
            isValid = false;
            message = field.getAttribute('data-error-invalid') || 'Please enter a valid phone number';
          } else {
            successMessage = field.getAttribute('data-success') || 'Phone number looks good!';
          }
        }
        break;
        
      case 'text':
        if (field.hasAttribute('required') && !value) {
          isValid = false;
          message = field.getAttribute('data-error-empty') || 'This field is required';
        } else if (field.hasAttribute('minlength')) {
          const minLength = parseInt(field.getAttribute('minlength'));
          if (value && value.length < minLength) {
            isValid = false;
            message = field.getAttribute('data-error-short') || `Please enter at least ${minLength} characters`;
          } else if (value && value.length >= minLength) {
            successMessage = field.getAttribute('data-success') || 'Looks good!';
          }
        } else if (value) {
          successMessage = field.getAttribute('data-success') || 'Thank you!';
        }
        break;
        
      default:
        if (field.tagName === 'SELECT') {
          if (value && value !== '') {
            successMessage = field.getAttribute('data-success') || 'Selection noted!';
          }
        }
    }
    
    this.updateFieldUI(field, isValid, message, successMessage);
    return { valid: isValid, message };
  }
  
  updateFieldUI(field, isValid, errorMessage, successMessage) {
    const errorElement = document.getElementById(field.id + 'Err');
    const successElement = document.getElementById(field.id + 'Success');
    
    field.classList.remove('valid', 'invalid');
    
    if (errorElement) {
      errorElement.classList.remove('show');
      errorElement.textContent = '';
    }
    
    if (successElement) {
      successElement.classList.remove('show');
      successElement.textContent = '';
    }
    
    if (field.value.trim()) {
      if (isValid) {
        field.classList.add('valid');
        if (successElement && successMessage) {
          successElement.textContent = successMessage;
          successElement.classList.add('show');
        }
      } else {
        field.classList.add('invalid');
        if (errorElement && errorMessage) {
          errorElement.textContent = errorMessage;
          errorElement.classList.add('show');
        }
      }
    }
  }
}

describe('SecureFormHandler', () => {
  let formHandler;
  let form;

  beforeEach(() => {
    form = document.getElementById('bookingForm');
    formHandler = new SecureFormHandler('bookingForm', 'https://script.google.com/test', 'booking');
  });

  test('should initialize with correct properties', () => {
    expect(formHandler.form).toBe(form);
    expect(formHandler.endpoint).toBe('https://script.google.com/test');
    expect(formHandler.formType).toBe('booking');
    expect(formHandler.rateLimitKey).toBe('formRateLimit_bookingForm');
  });

  test('should add security features', () => {
    const honeypot = form.querySelector('input[name="website"]');
    const timestamp = form.querySelector('input[name="formTimestamp"]');
    
    expect(honeypot).toBeTruthy();
    expect(honeypot.style.display).toBe('none');
    expect(timestamp).toBeTruthy();
    expect(timestamp.type).toBe('hidden');
  });

  test('should validate email field correctly', () => {
    const emailField = document.getElementById('email');
    
    // Test empty required field
    emailField.value = '';
    const result1 = formHandler.validateFieldEnhanced(emailField);
    expect(result1.valid).toBe(false);
    expect(emailField.classList.contains('invalid')).toBe(true);
    
    // Test invalid email
    emailField.value = 'invalid-email';
    const result2 = formHandler.validateFieldEnhanced(emailField);
    expect(result2.valid).toBe(false);
    
    // Test valid email
    emailField.value = 'test@example.com';
    const result3 = formHandler.validateFieldEnhanced(emailField);
    expect(result3.valid).toBe(true);
    expect(emailField.classList.contains('valid')).toBe(true);
  });

  test('should validate phone field correctly', () => {
    const phoneField = document.getElementById('phone');
    
    // Test empty required field
    phoneField.value = '';
    const result1 = formHandler.validateFieldEnhanced(phoneField);
    expect(result1.valid).toBe(false);
    
    // Test short phone number
    phoneField.value = '123';
    const result2 = formHandler.validateFieldEnhanced(phoneField);
    expect(result2.valid).toBe(false);
    
    // Test valid phone number
    phoneField.value = '+91 9876543210';
    const result3 = formHandler.validateFieldEnhanced(phoneField);
    expect(result3.valid).toBe(true);
  });

  test('should validate text field with minlength', () => {
    const nameField = document.getElementById('name');
    
    // Test short name
    nameField.value = 'A';
    const result1 = formHandler.validateFieldEnhanced(nameField);
    expect(result1.valid).toBe(false);
    
    // Test valid name
    nameField.value = 'John Doe';
    const result2 = formHandler.validateFieldEnhanced(nameField);
    expect(result2.valid).toBe(true);
  });

  test('should update field UI correctly', () => {
    const nameField = document.getElementById('name');
    const errorElement = document.getElementById('nameErr');
    const successElement = document.getElementById('nameSuccess');
    
    // Test error state
    formHandler.updateFieldUI(nameField, false, 'Error message', '');
    expect(nameField.classList.contains('invalid')).toBe(true);
    expect(nameField.classList.contains('valid')).toBe(false);
    
    // Test success state
    formHandler.updateFieldUI(nameField, true, '', 'Success message');
    expect(nameField.classList.contains('valid')).toBe(true);
    expect(nameField.classList.contains('invalid')).toBe(false);
  });
});
