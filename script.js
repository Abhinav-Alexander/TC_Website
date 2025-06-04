/* ── Enhanced Secure Script - Gentle Version ──────────────────── */

// Security configuration - less aggressive
const SECURITY_CONFIG = {
    maxFormAttempts: 5,  // Increased from 3 to 5
    lockoutTime: 10 * 60 * 1000, // Reduced to 10 minutes
    maxFieldLength: 2000,
    suspiciousActivityThreshold: 10, // Increased threshold
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
    constructor(formId, endpoint) {
        this.form = document.getElementById(formId);
        this.endpoint = endpoint;
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
                field.addEventListener('input', () => this.validateField(field));
            }
        });
        
        // Phone number filter
        const phoneField = this.form.querySelector('#phone');
        if (phoneField) {
            phoneField.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
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
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        // Basic security check - only block obvious attacks
        const dangerousPatterns = [
            /<script/gi,
            /javascript:/gi
        ];
        
        for (let pattern of dangerousPatterns) {
            if (pattern.test(value)) {
                isValid = false;
                message = 'Invalid characters detected';
                break;
            }
        }
        
        // Field validation
        if (isValid) {
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (field.hasAttribute('required') && value && !emailRegex.test(value)) {
                        isValid = false;
                        message = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'tel':
                    const digitsOnly = value.replace(/\D/g, '');
                    if (value && (digitsOnly.length < 10 || digitsOnly.length > 15)) {
                        isValid = false;
                        message = 'Please enter a valid phone number';
                    }
                    break;
                    
                default:
                    if (field.hasAttribute('required') && !value) {
                        isValid = false;
                        message = 'This field is required';
                    } else if (field.hasAttribute('pattern')) {
                        const pattern = new RegExp(field.getAttribute('pattern'));
                        if (value && !pattern.test(value)) {
                            isValid = false;
                            message = 'Invalid format';
                        }
                    }
            }
        }
        
        // Update error display
        const errorElement = document.getElementById(field.id + 'Err');
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        return { valid: isValid, message };
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
                
                // Redirect to thank you page
                window.location.href = '/src/thank-you.html';
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
    
    // Initialize form handlers
    new SecureFormHandler('bookingForm', 
        'https://script.google.com/macros/s/AKfycbx_ndXraqa85Bvji1R9sVY-K_i9CTLHpfI2Zpd-caP46X2--5Gh9Ls-O0j7w0zOKp01NA/exec');
    
    if (document.getElementById('contactForm')) {
        new SecureFormHandler('contactForm', 
            'https://script.google.com/macros/s/AKfycbwKthmvnNJkSOfmrRx7rynPcQFGa2wt_gWtuhJMJ2yzdQqVp5c2xkp31yS_LrO91GQN/exec');
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