/**
 * End-to-end tests for complete user workflows
 */
import { JSDOM } from 'jsdom';

// Create a comprehensive DOM environment simulating the full website
const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Therapy Council - Professional Online Therapy</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/header-footer.css">
  <link rel="stylesheet" href="css/home.css">
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="container header-container">
      <div class="logo-container">
        <div class="logo-image">
          <img src="logo/logo_white.png" alt="Therapy Council Logo">
        </div>
        <span class="logo-text">THERAPY COUNCIL</span>
      </div>
      
      <button class="nav-toggle" aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>
      
      <nav>
        <ul class="nav-links">
          <li><a href="/" class="active">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/resources">Resources</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <!-- Hero Section -->
  <section class="hero">
    <div class="container hero-container">
      <div class="hero-content">
        <div class="hero-badge">
          <i class="fas fa-star"></i>
          <span>Premium Mental Health Care</span>
        </div>
        <h1>Feeling anxious, stuck, or overwhelmed?</h1>
        <p>Talk to a licensed clinical psychologist this week. First session <strong>₹650</strong>. 100% confidential online.</p>
        <div class="hero-chips">
          <span class="hero-chip">Licensed clinicians</span>
          <span class="hero-chip">Same‑week sessions</span>
          <span class="hero-chip">Private & secure</span>
        </div>
      </div>
      
      <!-- Booking Form -->
      <div class="signup-card">
        <div class="form-header">
          <div class="authority-badge">
            <i class="fas fa-award"></i>
            <span>Trusted by 3,200+ Clients</span>
          </div>
          <h2>Reserve Your Special Session</h2>
          <div class="form-subtitle">
            <strong>57% OFF</strong> • Usually ₹1,499, now just <strong>₹650</strong>
          </div>
        </div>
        
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
            <label for="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" required
                   data-error-empty="We need your phone number to confirm your appointment"
                   data-error-invalid="Please enter a valid phone number"
                   data-success="Perfect! We can reach you at this number">
            <small class="error-msg" id="phoneErr"></small>
            <small class="success-msg" id="phoneSuccess"></small>
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
            <label for="concern">What brings you here?</label>
            <select id="concern" name="concern"
                    data-success="Thank you for sharing - this helps us prepare for your session">
              <option value="">I'm not sure yet</option>
              <option value="Anxiety & Stress">Anxiety & Stress</option>
              <option value="Depression">Depression</option>
              <option value="Relationships">Relationships</option>
              <option value="Self-Discovery">Self-Discovery</option>
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
      </div>
    </div>
  </section>
  
  <!-- Therapists Section -->
  <section class="therapists" id="therapists">
    <div class="container">
      <h2>Meet Our Therapists</h2>
      <p>Licensed psychologists with years of experience.</p>
      <div class="therapists-carousel">
        <button class="carousel-btn prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
        <div class="carousel-viewport">
          <div class="carousel-track">
            <div class="therapist-card">
              <div class="therapist-avatar">
                <img src="Therapists/Pragya.webp" alt="Pragya Alexander">
              </div>
              <h3 class="therapist-name">Pragya Alexander</h3>
              <p class="therapist-meta">Co‑Founder • MSc Clinical Psychology • Psychologist</p>
            </div>
            <div class="therapist-card">
              <div class="therapist-avatar">
                <img src="Therapists/Falguni.webp" alt="Falguni Sharma">
              </div>
              <h3 class="therapist-name">Falguni Sharma</h3>
              <p class="therapist-meta">MA Clinical Psychology • Psychologist</p>
            </div>
            <div class="therapist-card">
              <div class="therapist-avatar">
                <img src="Therapists/Bhupinder.webp" alt="Dr. Bhupinder Chaudhary">
              </div>
              <h3 class="therapist-name">Dr. Bhupinder Chaudhary</h3>
              <p class="therapist-meta">BAMS • MSc Clinical Psychology • Psychologist</p>
            </div>
          </div>
        </div>
        <button class="carousel-btn next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
        <div class="carousel-dots" aria-label="Therapist navigation"></div>
      </div>
    </div>
  </section>
  
  <!-- Sticky CTA -->
  <div class="sticky-cta" id="stickyCta">
    <button class="cta-button" id="stickyCtaBtn">Book your first session – ₹650</button>
    <a class="cta-button secondary" id="stickyCtaCall" href="https://wa.me/919211750322">Free 10‑min call</a>
  </div>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-sections">
        <div class="footer-brand">
          <h3>Therapy Council</h3>
          <p>For Every Mind, Everywhere</p>
        </div>
        <div class="footer-contact">
          <h3>Contact Us</h3>
          <p>support@therapycouncil.org</p>
          <p>(+91) 9211-750-322</p>
        </div>
      </div>
    </div>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// Mock fetch globally
global.fetch = jest.fn();

describe('Complete User Workflow E2E Tests', () => {
  let form;
  let navToggle;
  let navLinks;
  let carouselPrev;
  let carouselNext;
  let stickyBtn;

  beforeEach(() => {
    form = document.getElementById('bookingForm');
    navToggle = document.querySelector('.nav-toggle');
    navLinks = document.querySelector('.nav-links');
    carouselPrev = document.querySelector('.carousel-btn.prev');
    carouselNext = document.querySelector('.carousel-btn.next');
    stickyBtn = document.getElementById('stickyCtaBtn');
    
    jest.clearAllMocks();
    
    // Mock successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200
    });
    
    // Mock window.location
    delete window.location;
    window.location = { href: '' };
  });

  describe('Complete Booking Workflow', () => {
    test('should complete full booking process from landing to submission', async () => {
      // Step 1: User lands on homepage
      expect(document.title).toContain('Therapy Council');
      expect(document.querySelector('h1').textContent).toContain('anxious, stuck, or overwhelmed');
      
      // Step 2: User sees the booking form
      expect(form).toBeTruthy();
      expect(document.querySelector('.signup-card')).toBeTruthy();
      
      // Step 3: User fills out the form
      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const phoneField = document.getElementById('phone');
      const concernField = document.getElementById('concern');
      
      nameField.value = 'John Doe';
      emailField.value = 'john@example.com';
      phoneField.value = '+91 9876543210';
      concernField.value = 'Anxiety & Stress';
      
      // Step 4: Form validation should pass
      nameField.dispatchEvent(new Event('blur'));
      emailField.dispatchEvent(new Event('blur'));
      phoneField.dispatchEvent(new Event('blur'));
      
      expect(nameField.classList.contains('valid')).toBe(true);
      expect(emailField.classList.contains('valid')).toBe(true);
      expect(phoneField.classList.contains('valid')).toBe(true);
      
      // Step 5: User submits the form
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      // Step 6: Form should submit successfully
      expect(global.fetch).toHaveBeenCalledWith(
        'https://script.google.com/macros/s/test/exec',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
    });

    test('should handle form validation errors gracefully', () => {
      // Test with invalid data
      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      
      // Short name
      nameField.value = 'A';
      nameField.dispatchEvent(new Event('blur'));
      expect(nameField.classList.contains('invalid')).toBe(true);
      
      // Invalid email
      emailField.value = 'invalid-email';
      emailField.dispatchEvent(new Event('blur'));
      expect(emailField.classList.contains('invalid')).toBe(true);
      
      // Form should not submit
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Navigation and User Experience', () => {
    test('should handle mobile navigation workflow', () => {
      // User opens mobile menu
      navToggle.click();
      expect(navLinks.classList.contains('open')).toBe(true);
      
      // User navigates to different page
      const aboutLink = navLinks.querySelector('a[href="/about"]');
      aboutLink.click();
      expect(navLinks.classList.contains('open')).toBe(false);
    });

    test('should handle therapist carousel interaction', () => {
      const carouselTrack = document.querySelector('.carousel-track');
      const initialTransform = carouselTrack.style.transform;
      
      // User clicks next button
      carouselNext.click();
      
      // Carousel should move
      expect(carouselTrack.style.transform).not.toBe(initialTransform);
      
      // User clicks previous button
      carouselPrev.click();
      
      // Should return to original position
      expect(carouselTrack.style.transform).toBe(initialTransform);
    });

    test('should handle sticky CTA interaction', () => {
      // User clicks sticky CTA
      stickyBtn.click();
      expect(window.location.href).toBe('/#bookingForm');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle network errors gracefully', async () => {
      // Mock network error
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('phone').value = '+91 9876543210';
      
      // Submit form
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      // Should handle error gracefully
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(document.body.innerHTML).toContain('bookingForm');
    });

    test('should handle rapid form submissions', () => {
      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('phone').value = '+91 9876543210';
      
      // Submit multiple times rapidly
      for (let i = 0; i < 5; i++) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
      
      // Should only submit once (rate limiting)
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('should handle browser back/forward navigation', () => {
      // Mock history API
      const mockHistory = {
        pushState: jest.fn(),
        replaceState: jest.fn(),
        back: jest.fn(),
        forward: jest.fn()
      };
      window.history = mockHistory;
      
      // Simulate back button
      const popStateEvent = new PopStateEvent('popstate');
      window.dispatchEvent(popStateEvent);
      
      // Should handle gracefully
      expect(document.body.innerHTML).toContain('bookingForm');
    });
  });

  describe('Accessibility and SEO', () => {
    test('should have proper semantic structure', () => {
      // Check for proper heading hierarchy
      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      expect(h1).toBeTruthy();
      expect(h2).toBeTruthy();
      
      // Check for proper form labels
      const labels = document.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
      
      // Check for ARIA labels
      const ariaElements = document.querySelectorAll('[aria-label]');
      expect(ariaElements.length).toBeGreaterThan(0);
    });

    test('should have proper meta tags for SEO', () => {
      const title = document.querySelector('title');
      const metaDescription = document.querySelector('meta[name="description"]');
      
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Therapy Council');
      expect(metaDescription).toBeTruthy();
    });

    test('should support keyboard navigation', () => {
      // Test tab navigation
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // Test form accessibility
      const formInputs = form.querySelectorAll('input, select');
      formInputs.forEach(input => {
        expect(input.getAttribute('id')).toBeTruthy();
        const label = document.querySelector(`label[for="${input.id}"]`);
        expect(label).toBeTruthy();
      });
    });
  });

  describe('Performance and Loading', () => {
    test('should load all critical resources', () => {
      // Check for CSS files
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      expect(cssLinks.length).toBeGreaterThan(0);
      
      // Check for JavaScript
      const scripts = document.querySelectorAll('script[src]');
      expect(scripts.length).toBeGreaterThan(0);
      
      // Check for images
      const images = document.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
    });

    test('should handle slow network conditions', async () => {
      // Mock slow fetch
      global.fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({ ok: true }), 1000)
        )
      );
      
      // Fill and submit form
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('phone').value = '+91 9876543210';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      // Should handle slow response
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
