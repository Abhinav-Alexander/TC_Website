/* ▸ MINIMAL FOCUS THANK YOU PAGE JAVASCRIPT - Clean & Simple */

document.addEventListener('DOMContentLoaded', function() {
    initializeMinimalThankYou();
});

function initializeMinimalThankYou() {
    // Initialize mobile navigation
    setupMobileNavigation();
    
    // Setup email status simulation
    simulateEmailDelivery();
    
    // Initialize modal handlers
    setupModalHandlers();
    
    // Track page analytics
    trackPageAnalytics();
    
    // Setup accessibility features
    enhanceAccessibility();
}

// Mobile Navigation Setup
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
            'event_label': 'minimal_thank_you'
        });
    }
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Return focus to trigger button
        const emailButton = document.querySelector('.primary-button');
        if (emailButton) {
            emailButton.focus();
        }
    }
}

// Email Resend Function
function resendEmail() {
    const button = document.querySelector('.secondary-button');
    const emailStatus = document.getElementById('emailStatus');
    
    if (!button || !emailStatus) return;
    
    // Show loading state
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;
    
    // Simulate email resend
    setTimeout(() => {
        // Reset button
        button.classList.remove('loading');
        button.innerHTML = '<i class="fas fa-redo"></i> Resend Email';
        button.disabled = false;
        
        // Update status
        emailStatus.className = 'email-status success';
        emailStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Email resent successfully!</span>';
        
        // Show success notification
        showNotification('Email resent! Please check your inbox in 2-3 minutes.', 'success');
        
        // Track resend
        trackEvent('email_resend_requested', {
            'event_category': 'engagement',
            'event_label': 'minimal_thank_you'
        });
        
        // Reset status after 5 seconds
        setTimeout(() => {
            emailStatus.className = 'email-status';
            emailStatus.innerHTML = '<i class="fas fa-clock"></i><span>Email typically arrives within 2-3 minutes</span>';
        }, 5000);
    }, 2000);
}

// Simulate Email Delivery
function simulateEmailDelivery() {
    const emailStatus = document.getElementById('emailStatus');
    if (!emailStatus) return;
    
    // After 3 seconds, show email sent
    setTimeout(() => {
        emailStatus.className = 'email-status success';
        emailStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Email sent successfully! Check your inbox.</span>';
        
        // Add gentle animation
        emailStatus.style.transform = 'scale(1.02)';
        setTimeout(() => {
            emailStatus.style.transform = 'scale(1)';
        }, 200);
        
    }, 3000);
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

// Notification System
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
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="${icons[type]}" style="font-size: 18px;"></i>
            <span>${message}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; padding: 0; margin-left: 12px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: colors[type],
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
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
            'page_title': 'Thank You - Minimal Layout',
            'page_location': window.location.href,
            'custom_parameter_1': 'minimal_thank_you'
        });
    }
    
    // Track time spent on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            'event_category': 'engagement',
            'value': timeSpent,
            'custom_parameter_1': 'minimal_thank_you'
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
            'custom_parameter_1': 'minimal_thank_you'
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
}

// URL Parameter Handling
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const status = urlParams.get('status');
    
    if (email && validateEmail(email)) {
        console.log('User email from URL:', email);
        // Could pre-fill email-related information if needed
    }
    
    if (status === 'scheduled') {
        showNotification('Great! Your session has been scheduled successfully.', 'success');
        
        // Update email status to show completion
        const emailStatus = document.getElementById('emailStatus');
        if (emailStatus) {
            emailStatus.className = 'email-status success';
            emailStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Session scheduled successfully!</span>';
        }
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
        if (event.filename && event.filename.includes('minimal-thank-you')) {
            showNotification('Something went wrong. Please refresh the page.', 'error');
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initializeMinimalThankYou();
    handleUrlParameters();
    handleErrors();
});

// Expose necessary functions globally
window.openEmailModal = openEmailModal;
window.closeEmailModal = closeEmailModal;
window.resendEmail = resendEmail;