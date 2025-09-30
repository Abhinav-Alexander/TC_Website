/* ▸ THANK YOU PAGE JAVASCRIPT - Aligned with Website Patterns */

document.addEventListener('DOMContentLoaded', function() {
    initializeThankYouPage();
});

function initializeThankYouPage() {
    // Initialize mobile navigation (consistent with site)
    setupMobileNavigation();
    
    // Setup email processing status
    showEmailProcessing();
    
    // Initialize modal handlers
    setupModalHandlers();
    
    // Track page analytics
    trackPageAnalytics();
    
    // Setup accessibility features
    enhanceAccessibility();
    
    // Handle URL parameters
    handleUrlParameters();
    
    // Setup error handling
    handleErrors();
}

// Mobile Navigation Setup (consistent with main site)
function setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on links
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Email Modal Functions
function openEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus on first focusable element
        const firstFocusable = modal.querySelector('button');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        // Track modal open
        trackEvent('email_modal_opened', {
            'event_category': 'engagement',
            'event_label': 'thank_you_page'
        });
    }
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Return focus to trigger button if it exists
        const emailButton = document.querySelector('.primary-button');
        if (emailButton) {
            emailButton.focus();
        }
    }
}

// Email status management (removed resend functionality)
function updateEmailStatus() {
    const emailStatus = document.getElementById('emailStatus');
    if (!emailStatus) return;
    
    // Simply show that consultation call is being prepared
    emailStatus.className = 'email-status success';
    emailStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Your consultation call is being prepared - we\'ll call you to schedule your session and match your therapist</span>';
    
    // Add gentle animation
    emailStatus.style.transform = 'scale(1.02)';
    setTimeout(() => {
        emailStatus.style.transform = 'scale(1)';
    }, 200);
}

// Email Processing Status
function showEmailProcessing() {
    const emailStatus = document.getElementById('emailStatus');
    if (!emailStatus) return;
    
    // After 6 seconds, show review is complete  
    setTimeout(() => {
        updateEmailStatus();
    }, 6000);
}

// Modal Handlers
function setupModalHandlers() {
    const modal = document.getElementById('emailModal');
    if (!modal) return;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeEmailModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeEmailModal();
        }
    });
    
    // Trap focus within modal
    modal.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    });
}

// Notification System (matching site style)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type]} notification-icon"></i>
            <span>${message}</span>
        </div>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style the notification (matching site patterns)
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: colors[type],
        color: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        zIndex: '10001',
        maxWidth: '400px',
        fontSize: '15px',
        fontWeight: '500',
        transform: 'translateX(450px)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(450px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }
    }, 5000);
}

// Analytics and Tracking
function trackPageAnalytics() {
    // Track page view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': 'Thank You - Booking Confirmation',
            'page_location': window.location.href,
            'custom_parameter_1': 'thank_you_page'
        });
    }
    
    // Track time spent on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            'event_category': 'engagement',
            'value': timeSpent,
            'custom_parameter_1': 'thank_you_page'
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
        }
    });
    
    window.addEventListener('beforeunload', function() {
        trackEvent('scroll_depth', {
            'event_category': 'engagement',
            'value': maxScroll,
            'custom_parameter_1': 'thank_you_page'
        });
    });
}

function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Console logging for development
    console.log('Event tracked:', eventName, parameters);
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add ARIA labels for better screen reader support
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
        if (!button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text);
            }
        }
    });
    
    // Enhance form accessibility
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
            }
        }
    });
    
    // Add skip link for keyboard users
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Announce success to screen readers
    setTimeout(() => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = 'Form submitted successfully. Please check your email for next steps.';
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 3000);
    }, 1000);
}

// URL Parameter Handling
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const status = urlParams.get('status');
    const source = urlParams.get('source');
    
    if (email && validateEmail(email)) {
        console.log('User email from URL:', email);
        // Could pre-fill email-related information if needed
        trackEvent('thank_you_with_email', {
            'event_category': 'conversion',
            'custom_parameter_1': 'email_provided'
        });
    }
    
    if (status === 'scheduled') {
        showNotification('Great! Your session has been scheduled successfully.', 'success');
        
        // Update email status to show completion
        const emailStatus = document.getElementById('emailStatus');
        if (emailStatus) {
            emailStatus.className = 'email-status success';
            emailStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Session scheduled successfully!</span>';
        }
        
        trackEvent('session_scheduled', {
            'event_category': 'conversion',
            'custom_parameter_1': 'scheduled_success'
        });
    }
    
    if (source) {
        trackEvent('thank_you_source', {
            'event_category': 'traffic',
            'custom_parameter_1': source
        });
    }
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Error Handling
function handleErrors() {
    window.addEventListener('error', function(event) {
        console.error('JavaScript error:', event.error);
        
        trackEvent('javascript_error', {
            'event_category': 'error',
            'error_message': event.message,
            'error_filename': event.filename,
            'error_lineno': event.lineno
        });
        
        // Show user-friendly error message for critical errors
        if (event.filename && event.filename.includes('thank-you')) {
            showNotification('Something went wrong. Please refresh the page.', 'error');
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        trackEvent('promise_rejection', {
            'event_category': 'error',
            'error_message': event.reason ? event.reason.toString() : 'Unknown error'
        });
    });
}

// Page Performance Tracking
function trackPagePerformance() {
    // Track page load time
    window.addEventListener('load', function() {
        setTimeout(() => {
            const performance = window.performance;
            if (performance && performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                
                trackEvent('page_load_time', {
                    'event_category': 'performance',
                    'value': Math.round(loadTime / 1000),
                    'custom_parameter_1': 'thank_you_page'
                });
            }
        }, 0);
    });
}

// Enhanced Modal Functions
function setupAdvancedModal() {
    // Add email info button if it doesn't exist
    const emailStatus = document.getElementById('emailStatus');
    if (emailStatus && !document.querySelector('.email-info-btn')) {
        const infoButton = document.createElement('button');
        infoButton.className = 'email-info-btn';
        infoButton.innerHTML = '<i class="fas fa-info-circle"></i> More info';
        infoButton.style.cssText = `
            background: none;
            border: none;
            color: #0d9488;
            font-size: 14px;
            cursor: pointer;
            margin-left: 8px;
            text-decoration: underline;
        `;
        
        infoButton.addEventListener('click', openEmailModal);
        emailStatus.appendChild(infoButton);
    }
}

// Cookie/Storage Management
function manageBrowserStorage() {
    // Clear any sensitive form data that might be stored
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('form') && key.includes('temp')) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Store successful completion flag
        sessionStorage.setItem('form_completed', Date.now().toString());
        
    } catch (error) {
        console.warn('Storage management error:', error);
    }
}

// Social Share Functions (optional)
function addSocialShareOptions() {
    const shareText = encodeURIComponent("I just took the first step towards better mental health with Therapy Council. Taking care of your mind is just as important as taking care of your body. 💚");
    const shareUrl = encodeURIComponent(window.location.origin);
    
    // Could add social sharing buttons if needed
    // This is just a placeholder for potential future feature
}

// Initialize additional features
function initializeAdvancedFeatures() {
    trackPagePerformance();
    setupAdvancedModal();
    manageBrowserStorage();
    
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Main initialization - updated
function initializeThankYouPage() {
    // Core functionality
    setupMobileNavigation();
    showEmailProcessing();
    setupModalHandlers();
    trackPageAnalytics();
    enhanceAccessibility();
    handleUrlParameters();
    handleErrors();
    
    // Advanced features
    initializeAdvancedFeatures();
}

// Expose necessary functions globally for HTML onclick handlers
window.openEmailModal = openEmailModal;
window.closeEmailModal = closeEmailModal;

// Additional event listeners for enhanced functionality
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // User returned to tab - could refresh email status
        console.log('User returned to thank you page');
        trackEvent('page_focus_returned', {
            'event_category': 'engagement',
            'custom_parameter_1': 'thank_you_page'
        });
    }
});

// Handle back button navigation
window.addEventListener('popstate', function(event) {
    trackEvent('back_button_used', {
        'event_category': 'navigation',
        'custom_parameter_1': 'thank_you_page'
    });
});