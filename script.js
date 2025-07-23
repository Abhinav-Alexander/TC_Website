/* ── Enhanced Secure Script - Contact Form Update ──────────────────── */

// Security configuration - user-friendly
const SECURITY_CONFIG = {
    maxFormAttempts: 15,  // More lenient
    lockoutTime: 5 * 60 * 1000, // Reduced to 5 minutes
    suspiciousActivityThreshold: 20, // Higher threshold
    allowedDomains: ['therapycouncil.org', 'script.google.com']
};

/* ── Basic Security Monitor (Non-Intrusive) ──────────────────── */
class SecurityMonitor {
    constructor() {
        this.suspiciousActivity = 0;
        this.startTime = Date.now();
        this.init();
    }
    
    init() {
        // Only essential security - no dev tools blocking
        this.protectEmails();
        // Removed aggressive detection methods
    }
    
    protectEmails() {
        // Simple email protection
        setTimeout(() => {
            const emailElements = document.querySelectorAll('[href^="mailto:"]');
            emailElements.forEach(el => {
                const email = el.getAttribute('href').replace('mailto:', '');
                // Simple protection without breaking functionality
                el.setAttribute('data-email', email);
            });
        }, 1000);
    }
    
    logSuspiciousActivity(activity) {
        this.suspiciousActivity++;
        console.warn('Security Notice:', activity);
        
        // Only act on extreme cases
        if (this.suspiciousActivity > SECURITY_CONFIG.suspiciousActivityThreshold) {
            console.warn('Multiple security alerts detected');
        }
    }
}

/* ── Secure Form Handler ──────────────────────────────────────── */
class SecureFormHandler {
    constructor(formId, endpoint, formType = 'booking') {
        this.form = document.getElementById(formId);
        this.endpoint = endpoint;
        this.formType = formType; // 'booking' or 'contact'
        this.rateLimitKey = `formRateLimit_${formId}`;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Check rate limiting
        if (!this.checkRateLimit()) {
            this.showWarning('Please wait before submitting again');
            return;
        }
        
        this.setupBasicValidation();
        this.addSecurityFeatures();
        this.initializeProgress();
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    checkRateLimit() {
        const storedData = localStorage.getItem(this.rateLimitKey);
        if (storedData) {
            const data = JSON.parse(storedData);
            const timePassed = Date.now() - data.timestamp;
            
            if (timePassed < SECURITY_CONFIG.lockoutTime && data.attempts >= SECURITY_CONFIG.maxFormAttempts) {
                return false;
            }
            
            if (timePassed >= SECURITY_CONFIG.lockoutTime) {
                localStorage.removeItem(this.rateLimitKey);
            }
        }
        return true;
    }
    
    updateRateLimit() {
        const storedData = localStorage.getItem(this.rateLimitKey);
        let attempts = 1;
        
        if (storedData) {
            const data = JSON.parse(storedData);
            const timePassed = Date.now() - data.timestamp;
            
            if (timePassed < SECURITY_CONFIG.lockoutTime) {
                attempts = data.attempts + 1;
            }
        }
        
        localStorage.setItem(this.rateLimitKey, JSON.stringify({
            attempts,
            timestamp: Date.now()
        }));
        
        return attempts <= SECURITY_CONFIG.maxFormAttempts;
    }
    
    setupBasicValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            if (field.type !== 'hidden') {
                field.addEventListener('input', () => this.validateFieldEnhanced(field));
                field.addEventListener('blur', () => this.validateFieldEnhanced(field));
            }
        });
        
        // Phone number cleanup - allow more flexible formatting
        const phoneField = this.form.querySelector('#phone, #contactPhone');
        if (phoneField) {
            phoneField.addEventListener('input', (e) => {
                // Allow numbers, spaces, hyphens, parentheses, and plus sign
                e.target.value = e.target.value.replace(/[^0-9\s\-\(\)\+]/g, '');
            });
        }
    }
    
    addSecurityFeatures() {
        // Add simple honeypot if not exists
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
    
    // Form Progress Tracking
    initializeProgress() {
        this.totalSteps = this.form.querySelectorAll('[data-step]').length;
        this.currentStep = 0;
        this.completedSteps = new Set();
        
        if (this.totalSteps > 0) {
            this.updateProgress();
        }
    }
    
    updateProgress() {
        const progressBar = document.getElementById(this.formType + 'Progress');
        const progressText = document.getElementById(this.formType + 'ProgressText');
        
        if (!progressBar || !progressText) return;
        
        const progressPercentage = (this.completedSteps.size / this.totalSteps) * 100;
        progressBar.style.width = progressPercentage + '%';
        
        // Update progress text
        const stepMessages = {
            booking: [
                "Step 1 of 4 - Tell us your name",
                "Step 2 of 4 - How can we reach you?",
                "Step 3 of 4 - Your email address",
                "Step 4 of 4 - What brings you here?"
            ],
            contact: [
                "Step 1 of 4 - Tell us your name",
                "Step 2 of 4 - Your email address", 
                "Step 3 of 4 - Contact preferences",
                "Step 4 of 4 - Share your thoughts"
            ]
        };
        
        const messages = stepMessages[this.formType] || stepMessages.booking;
        const nextStep = Math.min(this.completedSteps.size, this.totalSteps - 1);
        
        if (this.completedSteps.size === this.totalSteps) {
            progressText.textContent = "All set! Ready to submit";
            progressBar.classList.add('animating');
        } else {
            progressText.textContent = messages[nextStep];
            progressBar.classList.remove('animating');
        }
    }
    
    // Enhanced field validation with better messaging
    validateFieldEnhanced(field) {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group');
        const step = fieldGroup?.getAttribute('data-step');
        
        let isValid = true;
        let message = '';
        let successMessage = '';
        
        // Field-specific validation
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
                if (field.tagName === 'TEXTAREA') {
                    if (field.hasAttribute('required') && !value) {
                        isValid = false;
                        message = field.getAttribute('data-error-empty') || 'Please fill in this field';
                    } else if (value && value.length < 10) {
                        isValid = false;
                        message = field.getAttribute('data-error-short') || 'Please tell us a bit more';
                    } else if (value && value.length >= 10) {
                        successMessage = field.getAttribute('data-success') || 'Thank you for sharing!';
                    }
                } else if (field.tagName === 'SELECT') {
                    if (value) {
                        successMessage = field.getAttribute('data-success') || 'Selection noted!';
                    }
                } else if (field.hasAttribute('required') && !value) {
                    isValid = false;
                    message = 'This field is required';
                } else if (value) {
                    successMessage = field.getAttribute('data-success') || 'Thank you!';
                }
        }
        
        // Update UI
        this.updateFieldUI(field, isValid, message, successMessage);
        
        // Update progress
        if (step) {
            if (isValid && value) {
                this.completedSteps.add(parseInt(step));
            } else {
                this.completedSteps.delete(parseInt(step));
            }
            this.updateProgress();
        }
        
        return { valid: isValid, message };
    }
    
    updateFieldUI(field, isValid, errorMessage, successMessage) {
        const errorElement = document.getElementById(field.id + 'Err');
        const successElement = document.getElementById(field.id + 'Success');
        
        // Remove existing classes
        field.classList.remove('valid', 'invalid');
        
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
        
        if (successElement) {
            successElement.classList.remove('show');
            successElement.textContent = '';
        }
        
        // Apply new state
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
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Rate limiting
        if (!this.updateRateLimit()) {
            this.showError('Too many attempts. Please wait 10 minutes.');
            return;
        }
        
        const formData = new FormData(this.form);
        
        // Simple honeypot check
        if (formData.get('website')) {
            return; // Silent fail for bots
        }
        
        // Basic validation
        if (!this.form.reportValidity()) {
            return;
        }
        
        await this.submitForm(formData);
    }
    
    async submitForm(formData) {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        try {
            button.disabled = true;
            button.textContent = 'Sending...';
            
            // Add basic metadata
            formData.append('timestamp', Date.now());
            formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
            
            const response = await fetch(this.endpoint, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                // Clear rate limiting on success
                localStorage.removeItem(this.rateLimitKey);
                
                // UPDATED: Form-specific redirect
                this.redirectToThankYou();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showError('Sorry, there was a problem. Please try again.');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    }
    
    // UPDATED: Form-specific redirect method
    redirectToThankYou() {
        // Get current path to determine correct redirect
        const currentPath = window.location.pathname;
        let thankYouPath;
        
        // Determine which thank you page based on form type
        const thankYouPage = this.formType === 'contact' ? 'thank-you-contact.html' : 'thank-you.html';
        
        if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html')) {
            // From homepage
            thankYouPath = `./src/${thankYouPage}`;
        } else if (currentPath.includes('/src/')) {
            // From src directory pages
            thankYouPath = `./${thankYouPage}`;
        } else {
            // Fallback - try to construct absolute path
            const baseUrl = window.location.origin;
            thankYouPath = `${baseUrl}/src/${thankYouPage}`;
        }
        
        console.log(`Redirecting ${this.formType} form to:`, thankYouPath);
        window.location.href = thankYouPath;
    }
    
    showError(message) {
        this.showToast(message, 'error');
    }
    
    showWarning(message) {
        this.showToast(message, 'warning');
    }
    
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.form-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `form-toast ${type}`;
        
        const colors = {
            error: '#ef4444',
            success: '#10b981',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
            font-weight: 500;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

/* ── Initialize Everything ──────────────────────────────────────── */
let securityMonitor;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize security (gentle mode)
    securityMonitor = new SecurityMonitor();
    
    // Initialize form handlers with form types
    new SecureFormHandler('bookingForm', 
        'https://script.google.com/macros/s/AKfycbx_ndXraqa85Bvji1R9sVY-K_i9CTLHpfI2Zpd-caP46X2--5Gh9Ls-O0j7w0zOKp01NA/exec',
        'booking'); // Booking form -> thank-you.html
    
    if (document.getElementById('contactForm')) {
        new SecureFormHandler('contactForm', 
            'https://script.google.com/macros/s/AKfycbwKthmvnNJkSOfmrRx7rynPcQFGa2wt_gWtuhJMJ2yzdQqVp5c2xkp31yS_LrO91GQN/exec',
            'contact'); // Contact form -> thank-you-contact.html
    }
    
    // Original hamburger menu functionality
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

        // Close menu when clicking on a link
        const navItems = navLinks.querySelectorAll('li a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
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
    }
});

/* ── Basic Clickjacking Protection ─────────────────────────────── */
if (window.top !== window.self) {
    window.top.location = window.self.location;
}