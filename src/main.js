// Main JavaScript file for Therapy Council website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navigation = document.querySelector('.navigation');
    
    if (mobileNavToggle && navigation) {
      mobileNavToggle.addEventListener('click', function() {
        navigation.classList.toggle('active');
        this.classList.toggle('active');
      });
    }
    
    // Close navigation when clicking outside
    document.addEventListener('click', function(event) {
      if (navigation && navigation.classList.contains('active')) {
        if (!navigation.contains(event.target) && !mobileNavToggle.contains(event.target)) {
          navigation.classList.remove('active');
          mobileNavToggle.classList.remove('active');
        }
      }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#" (empty hash)
        if (targetId === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(targetId);
        if (target) {
          // Add an offset for the fixed header
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          history.pushState(null, null, targetId);
        }
      });
    });
    
    // Testimonial slider functionality
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (testimonialSlides.length && dots.length) {
      let currentSlide = 0;
      
      // Show the initial slide
      showSlide(currentSlide);
      
      // Function to display a specific slide
      function showSlide(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
          slide.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
          dot.classList.remove('active');
        });
        
        // Show the current slide and activate corresponding dot
        testimonialSlides[index].style.display = 'block';
        dots[index].classList.add('active');
      }
      
      // Next button click
      if (nextBtn) {
        nextBtn.addEventListener('click', function() {
          currentSlide = (currentSlide + 1) % testimonialSlides.length;
          showSlide(currentSlide);
        });
      }
      
      // Previous button click
      if (prevBtn) {
        prevBtn.addEventListener('click', function() {
          currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
          showSlide(currentSlide);
        });
      }
      
      // Dot clicks
      dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
          currentSlide = index;
          showSlide(currentSlide);
        });
      });
      
      // Auto slide functionality
      let slideInterval = setInterval(function() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
      }, 5000); // Change slide every 5 seconds
      
      // Pause auto sliding when hovering over the testimonial section
      const testimonialSection = document.querySelector('.testimonials');
      if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', function() {
          clearInterval(slideInterval);
        });
        
        testimonialSection.addEventListener('mouseleave', function() {
          slideInterval = setInterval(function() {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
          }, 5000);
        });
      }
    }
    
    // FAQ Accordion (only if not already implemented inline)
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Open the clicked item if it wasn't already open
        if (!isActive) {
          faqItem.classList.add('active');
        }
      });
    });
    
    // Form validation (Contact page)
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
          // In a real application, you would send the form data to a server
          // For demonstration, we'll just show a success message
          alert('Thank you for your message! We will respond as soon as possible.');
          this.reset();
        } else {
          alert('Please fill in all required fields.');
        }
      });
    }
    
    // Add shadow to header on scroll
    const header = document.querySelector('.header');
    
    if (header) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
    
    // Add animation to elements when they come into view
    const animateOnScroll = function() {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animated');
        }
      });
    };
    
    // Run once on page load and then on scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
  });