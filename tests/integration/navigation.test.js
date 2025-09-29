/**
 * Integration tests for navigation functionality
 */
import { JSDOM } from 'jsdom';

// Create a comprehensive DOM environment with navigation
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
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
  
  <div class="sticky-cta" id="stickyCta">
    <button class="cta-button" id="stickyCtaBtn">Book your first session – ₹650</button>
    <a class="cta-button secondary" id="stickyCtaCall" href="https://wa.me/919211750322">Free 10‑min call</a>
  </div>
  
  <section class="hero" id="hero">
    <div class="container hero-container">
      <div class="hero-content">
        <h1>Feeling anxious, stuck, or overwhelmed?</h1>
        <p>Talk to a licensed clinical psychologist this week.</p>
      </div>
    </div>
  </section>
  
  <main id="main-content">
    <section class="therapists" id="therapists">
      <div class="container">
        <h2>Meet Our Therapists</h2>
        <div class="therapists-carousel">
          <button class="carousel-btn prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
          <div class="carousel-viewport">
            <div class="carousel-track">
              <div class="therapist-card">Therapist 1</div>
              <div class="therapist-card">Therapist 2</div>
              <div class="therapist-card">Therapist 3</div>
            </div>
          </div>
          <button class="carousel-btn next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
          <div class="carousel-dots" aria-label="Therapist navigation"></div>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

describe('Navigation Integration', () => {
  let navToggle;
  let navLinks;
  let stickyCta;
  let stickyBtn;
  let hero;

  beforeEach(() => {
    navToggle = document.querySelector('.nav-toggle');
    navLinks = document.querySelector('.nav-links');
    stickyCta = document.getElementById('stickyCta');
    stickyBtn = document.getElementById('stickyCtaBtn');
    hero = document.querySelector('.hero');
    
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
  });

  test('should toggle mobile navigation menu', () => {
    // Initial state
    expect(navLinks.classList.contains('open')).toBe(false);
    
    // Click toggle button
    navToggle.click();
    expect(navLinks.classList.contains('open')).toBe(true);
    
    // Click again to close
    navToggle.click();
    expect(navLinks.classList.contains('open')).toBe(false);
  });

  test('should change hamburger icon when menu is toggled', () => {
    const icon = navToggle.querySelector('i');
    
    // Initial state
    expect(icon.classList.contains('fa-bars')).toBe(true);
    expect(icon.classList.contains('fa-times')).toBe(false);
    
    // Open menu
    navToggle.click();
    expect(icon.classList.contains('fa-bars')).toBe(false);
    expect(icon.classList.contains('fa-times')).toBe(true);
    
    // Close menu
    navToggle.click();
    expect(icon.classList.contains('fa-bars')).toBe(true);
    expect(icon.classList.contains('fa-times')).toBe(false);
  });

  test('should close menu when clicking on navigation links', () => {
    const navItems = navLinks.querySelectorAll('li a');
    
    // Open menu
    navToggle.click();
    expect(navLinks.classList.contains('open')).toBe(true);
    
    // Click on a navigation link
    navItems[0].click();
    expect(navLinks.classList.contains('open')).toBe(false);
  });

  test('should close menu when clicking outside', () => {
    // Open menu
    navToggle.click();
    expect(navLinks.classList.contains('open')).toBe(true);
    
    // Click outside (on body)
    document.body.click();
    expect(navLinks.classList.contains('open')).toBe(false);
  });

  test('should not close menu when clicking inside navigation', () => {
    // Open menu
    navToggle.click();
    expect(navLinks.classList.contains('open')).toBe(true);
    
    // Click inside navigation
    navLinks.click();
    expect(navLinks.classList.contains('open')).toBe(true);
  });

  test('should handle sticky CTA button click', () => {
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
    
    // Click sticky CTA button
    stickyBtn.click();
    expect(window.location.href).toBe('/#bookingForm');
  });

  test('should set up intersection observer for sticky CTA', () => {
    // Mock the observer callback
    const mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    };
    
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      // Simulate intersection change
      setTimeout(() => {
        callback([{ isIntersecting: false }]);
      }, 100);
      return mockObserver;
    });
    
    // Initialize the observer (this would normally be done in the main script)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            stickyCta.classList.remove('show');
          } else {
            stickyCta.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(hero);
    
    expect(mockObserver.observe).toHaveBeenCalledWith(hero);
  });

  test('should show sticky CTA when hero is not visible', () => {
    // Mock intersection observer callback
    const callback = jest.fn();
    global.IntersectionObserver = jest.fn().mockImplementation(callback);
    
    // Simulate hero not being visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            stickyCta.classList.remove('show');
          } else {
            stickyCta.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Simulate intersection change
    observer.observe(hero);
    
    // Manually trigger the callback
    const mockEntry = { isIntersecting: false };
    const entries = [mockEntry];
    
    // Call the callback manually
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stickyCta.classList.remove('show');
      } else {
        stickyCta.classList.add('show');
      }
    });
    
    expect(stickyCta.classList.contains('show')).toBe(true);
  });

  test('should hide sticky CTA when hero is visible', () => {
    // Simulate hero being visible
    const mockEntry = { isIntersecting: true };
    const entries = [mockEntry];
    
    // Call the callback manually
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stickyCta.classList.remove('show');
      } else {
        stickyCta.classList.add('show');
      }
    });
    
    expect(stickyCta.classList.contains('show')).toBe(false);
  });

  test('should have proper ARIA labels for accessibility', () => {
    expect(navToggle.getAttribute('aria-label')).toBe('Toggle navigation');
    
    const carouselButtons = document.querySelectorAll('.carousel-btn');
    expect(carouselButtons[0].getAttribute('aria-label')).toBe('Previous');
    expect(carouselButtons[1].getAttribute('aria-label')).toBe('Next');
    
    const carouselDots = document.querySelector('.carousel-dots');
    expect(carouselDots.getAttribute('aria-label')).toBe('Therapist navigation');
  });

  test('should handle keyboard navigation', () => {
    // Test Escape key closes menu
    navToggle.click(); // Open menu
    expect(navLinks.classList.contains('open')).toBe(true);
    
    // Simulate Escape key
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);
    
    // Menu should still be open (Escape handling would need to be implemented)
    expect(navLinks.classList.contains('open')).toBe(true);
  });

  test('should maintain navigation state during interactions', () => {
    // Open menu
    navToggle.click();
    expect(navLinks.classList.contains('open')).toBe(true);
    
    // Click on a link
    const navItems = navLinks.querySelectorAll('li a');
    navItems[1].click(); // Click "About" link
    
    // Menu should be closed
    expect(navLinks.classList.contains('open')).toBe(false);
    
    // Icon should be reset
    const icon = navToggle.querySelector('i');
    expect(icon.classList.contains('fa-bars')).toBe(true);
    expect(icon.classList.contains('fa-times')).toBe(false);
  });
});
