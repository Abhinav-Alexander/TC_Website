/**
 * Unit tests for Therapists Carousel functionality
 */
import { JSDOM } from 'jsdom';

// Create a mock DOM environment with carousel
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
  <div class="therapists">
    <div class="carousel-viewport">
      <div class="carousel-track">
        <div class="therapist-card">Therapist 1</div>
        <div class="therapist-card">Therapist 2</div>
        <div class="therapist-card">Therapist 3</div>
        <div class="therapist-card">Therapist 4</div>
      </div>
    </div>
    <button class="carousel-btn prev">Previous</button>
    <button class="carousel-btn next">Next</button>
    <div class="carousel-dots"></div>
  </div>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// Mock carousel functionality (extracted from script.js)
class TherapistsCarousel {
  constructor() {
    this.track = document.querySelector('.therapists .carousel-track');
    this.prev = document.querySelector('.therapists .carousel-btn.prev');
    this.next = document.querySelector('.therapists .carousel-btn.next');
    this.dotsWrap = document.querySelector('.therapists .carousel-dots');
    this.viewport = document.querySelector('.therapists .carousel-viewport');
    
    if (!this.track || !this.prev || !this.next || !this.dotsWrap) return;
    
    this.cards = Array.from(this.track.children);
    this.index = 0;
    
    this.init();
  }
  
  init() {
    this.renderDots();
    this.update();
    this.setupEventListeners();
  }
  
  getVisibleCount() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }
  
  getCardWidth() {
    const first = this.cards[0];
    if (!first) return 0;
    return first.getBoundingClientRect().width + 12;
  }
  
  renderDots() {
    this.dotsWrap.innerHTML = '';
    const visible = this.getVisibleCount();
    const totalPages = Math.max(1, Math.ceil(this.cards.length / visible));
    
    for (let i = 0; i < totalPages; i++) {
      const button = document.createElement('button');
      button.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === Math.floor(this.index / visible)) button.classList.add('active');
      button.addEventListener('click', () => {
        this.index = i * visible;
        this.clampIndex();
        this.update();
      });
      this.dotsWrap.appendChild(button);
    }
  }
  
  clampIndex() {
    const visible = this.getVisibleCount();
    const maxIndex = Math.max(0, this.cards.length - visible);
    this.index = Math.min(Math.max(0, this.index), maxIndex);
  }
  
  update() {
    const card = this.cards[0];
    if (!card) return;
    
    const cardWidth = this.getCardWidth();
    this.track.style.transform = `translateX(${-this.index * cardWidth}px)`;
    
    this.renderDots();
  }
  
  setupEventListeners() {
    this.prev.addEventListener('click', () => {
      const visible = this.getVisibleCount();
      const maxIndex = Math.max(0, this.cards.length - visible);
      if (this.index <= 0) {
        this.index = maxIndex;
      } else {
        this.index -= 1;
      }
      this.update();
    });
    
    this.next.addEventListener('click', () => {
      const visible = this.getVisibleCount();
      const maxIndex = Math.max(0, this.cards.length - visible);
      if (this.index >= maxIndex) {
        this.index = 0;
      } else {
        this.index += 1;
      }
      this.update();
    });
    
    window.addEventListener('resize', () => {
      this.clampIndex();
      this.update();
    });
  }
}

describe('TherapistsCarousel', () => {
  let carousel;

  beforeEach(() => {
    // Mock getBoundingClientRect for cards
    const cards = document.querySelectorAll('.therapist-card');
    cards.forEach(card => {
      card.getBoundingClientRect = jest.fn(() => ({
        width: 300,
        height: 200,
        top: 0,
        left: 0,
        right: 300,
        bottom: 200
      }));
    });
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
    
    carousel = new TherapistsCarousel();
  });

  test('should initialize with correct properties', () => {
    expect(carousel.track).toBeTruthy();
    expect(carousel.prev).toBeTruthy();
    expect(carousel.next).toBeTruthy();
    expect(carousel.dotsWrap).toBeTruthy();
    expect(carousel.cards.length).toBe(4);
    expect(carousel.index).toBe(0);
  });

  test('should get correct visible count based on screen width', () => {
    // Desktop
    window.innerWidth = 1024;
    expect(carousel.getVisibleCount()).toBe(3);
    
    // Tablet
    window.innerWidth = 800;
    expect(carousel.getVisibleCount()).toBe(2);
    
    // Mobile
    window.innerWidth = 400;
    expect(carousel.getVisibleCount()).toBe(1);
  });

  test('should render dots correctly', () => {
    carousel.renderDots();
    const dots = carousel.dotsWrap.querySelectorAll('button');
    expect(dots.length).toBe(2); // 4 cards / 3 visible = 2 pages
    expect(dots[0].classList.contains('active')).toBe(true);
    expect(dots[1].classList.contains('active')).toBe(false);
  });

  test('should update track position', () => {
    carousel.index = 1;
    carousel.update();
    expect(carousel.track.style.transform).toContain('translateX');
  });

  test('should clamp index correctly', () => {
    // Test going below 0
    carousel.index = -1;
    carousel.clampIndex();
    expect(carousel.index).toBe(0);
    
    // Test going above max
    carousel.index = 10;
    carousel.clampIndex();
    expect(carousel.index).toBe(1); // max index for 4 cards with 3 visible
  });

  test('should handle next button click', () => {
    const nextButton = carousel.next;
    const initialIndex = carousel.index;
    
    nextButton.click();
    expect(carousel.index).toBe(initialIndex + 1);
  });

  test('should handle previous button click', () => {
    carousel.index = 1;
    const prevButton = carousel.prev;
    
    prevButton.click();
    expect(carousel.index).toBe(0);
  });

  test('should wrap around at boundaries', () => {
    // Test next at end
    carousel.index = 1; // max index for 4 cards with 3 visible
    carousel.next.click();
    expect(carousel.index).toBe(0);
    
    // Test prev at start
    carousel.index = 0;
    carousel.prev.click();
    expect(carousel.index).toBe(1);
  });

  test('should handle dot navigation', () => {
    carousel.renderDots();
    const dots = carousel.dotsWrap.querySelectorAll('button');
    
    // Click second dot
    dots[1].click();
    expect(carousel.index).toBe(3); // 1 * 3 visible cards
  });
});
