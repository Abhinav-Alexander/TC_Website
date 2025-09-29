/* ── Simple Secure Contact Form Handler ──────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    console.log('Contact form found, initializing...');
    
    // Simple form handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submission started');
        
        // Get the submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerHTML : '';
        
        try {
            // Update button state
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Simple honeypot check
            if (formData.get('website')) {
                console.log('Honeypot triggered');
                return; // Silent fail for bots
            }
            
            // Basic validation
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                showSimpleToast('Please complete all required fields: name, email, and message', 'error');
                return;
            }
            
            // Enhanced email validation
            const emailField = contactForm.querySelector('#contactEmail');
            if (!emailField.validity.valid) {
                showSimpleToast('Please check your email format (e.g., name@example.com)', 'error');
                return;
            }
            
            // Message length validation
            if (message.length < 10) {
                showSimpleToast('Please tell us a bit more in your message (at least 10 characters)', 'error');
                return;
            }
            
            // Add timestamp
            formData.append('timestamp', Date.now());
            
            // Submit to your endpoint
            console.log('Submitting to:', contactForm.action);
            
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok) {
                // Success
                if (submitButton) {
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitButton.style.background = '#10b981';
                }
                
                showSimpleToast('✅ Thank you! Your message has been sent successfully.', 'success');
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    if (submitButton) {
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                        submitButton.style.background = '';
                    }
                }, 3000);
                
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showSimpleToast('Sorry, there was a problem sending your message. Please try again.', 'error');
            
            // Reset button
            if (submitButton) {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        }
    });
    
    // Add simple honeypot if it doesn't exist
    if (!contactForm.querySelector('input[name="website"]')) {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.tabIndex = -1;
        contactForm.appendChild(honeypot);
        console.log('Honeypot added');
    }
    
    // Character counter for message field
    const messageField = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');
    
    if (messageField && charCount) {
        messageField.addEventListener('input', function() {
            const count = messageField.value.length;
            charCount.textContent = count;
            
            if (count > 10 && count < 1000) {
                charCount.style.color = '#10b981';
            } else if (count >= 1000) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#6b7280';
            }
        });
    }
    
    // Phone number cleanup - allow flexible formatting
    const phoneField = document.getElementById('contactPhone');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            // Allow numbers, spaces, hyphens, parentheses, plus sign, and dots
            e.target.value = e.target.value.replace(/[^0-9+\-\s().]/g, '');
        });
    }
    
    console.log('Contact form handler initialized successfully');
});

// Simple toast notification function
function showSimpleToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.simple-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'simple-toast';
    
    const colors = {
        error: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    toast.innerHTML = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: colors[type] || colors.info,
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        maxWidth: '400px',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}