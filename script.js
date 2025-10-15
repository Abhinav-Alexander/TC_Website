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
        console.log(`Setting up validation for ${fields.length} fields in form:`, this.form.id);
        
        fields.forEach(field => {
            if (field.type !== 'hidden') {
                console.log(`Adding listeners to field:`, field.id, field.type);
                
                field.addEventListener('input', () => {
                    console.log(`Input event on field:`, field.id);
                    this.validateFieldEnhanced(field);
                });
                
                field.addEventListener('blur', () => {
                    console.log(`Blur event on field:`, field.id);
                    this.validateFieldEnhanced(field);
                });
                
                field.addEventListener('change', () => {
                    console.log(`Change event on field:`, field.id);
                    this.validateFieldEnhanced(field);
                });
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
    


    
    // Enhanced field validation with better messaging
    validateFieldEnhanced(field) {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group');
        
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
                } else if (!field.hasAttribute('required')) {
                    // Optional phone field with no value is valid
                    isValid = true;
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
                    if (value && value !== '') {
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
            // Fallback: if booking form has a data-redirect, send user there so payment can still proceed
            const fallbackRedirect = this.form.getAttribute('data-redirect');
            if (fallbackRedirect) {
                try {
                    window.location.href = fallbackRedirect;
                    return;
                } catch (e) {}
            }
            // Otherwise, send to appropriate thank-you page to confirm receipt intent
            try {
                this.redirectToThankYou();
                return;
            } catch (e) {}
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
        // If form asks for explicit redirect (e.g., to booking page), honor it
        const customRedirect = this.form.getAttribute('data-redirect');
        if (customRedirect) {
            window.location.href = customRedirect;
            return;
        }
        
        // Determine which thank you page based on form type
        const cleanThankYou = this.formType === 'contact' ? '/thank-you-contact' : '/thank-you';
        
        if (currentPath.startsWith('/src/')) {
            // local dev within src -> prefer clean local shim
            thankYouPath = cleanThankYou;
        } else {
            thankYouPath = cleanThankYou;
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
    
    // Initialize booking form handler as before (Apps Script submission)
    new SecureFormHandler('bookingForm', 
        'https://script.google.com/macros/s/AKfycbx_ndXraqa85Bvji1R9sVY-K_i9CTLHpfI2Zpd-caP46X2--5Gh9Ls-O0j7w0zOKp01NA/exec',
        'booking'); // Booking form -> thank-you.html
    
    if (document.getElementById('contactForm')) {
        new SecureFormHandler('contactForm', 
            'https://script.google.com/macros/s/AKfycbwKthmvnNJkSOfmrRx7rynPcQFGa2wt_gWtuhJMJ2yzdQqVp5c2xkp31yS_LrO91GQN/exec',
            'contact'); // Contact form -> thank-you-contact.html
    }


    // Normalize internal links for clean URLs when deployed (and dev fallback)
    const anchors = document.querySelectorAll('a');
    anchors.forEach(a => {
        const url = a.getAttribute('href');
        if (!url || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) return;
        const map = new Map([
            ['index.html', '/'],
            ['src/about.html', '/about'],
            ['src/services.html', '/services'],
            ['src/pricing.html', '/pricing'],
            ['src/contact.html', '/contact'],
            ['src/thank-you.html', '/thank-you']
        ]);
        if (map.has(url)) {
            a.setAttribute('href', map.get(url));
        }
    });
    
    // Sticky CTA behavior (mobile)
    const stickyCta = document.getElementById('stickyCta');
    const stickyBtn = document.getElementById('stickyCtaBtn');
    const bookingForm = document.getElementById('bookingForm');
    
    if (stickyBtn) {
        stickyBtn.addEventListener('click', () => {
            window.location.href = '/#bookingForm';
        });
        
        // Show sticky CTA after user scrolls past hero title
        const hero = document.querySelector('.hero');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyCta.classList.remove('show');
                } else {
                    stickyCta.classList.add('show');
                }
            });
        }, { threshold: 0.1 });
        if (hero) observer.observe(hero);
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

    // Therapists carousel initialization (seamless infinite)
    (function initTherapistsCarousel(){
        const track = document.querySelector('.therapists .carousel-track');
        const prev = document.querySelector('.therapists .carousel-btn.prev');
        const next = document.querySelector('.therapists .carousel-btn.next');
        const dotsWrap = document.querySelector('.therapists .carousel-dots');
        const viewport = document.querySelector('.therapists .carousel-viewport');
        if (!track || !prev || !next || !dotsWrap) return;

        // mark originals
        Array.from(track.children).forEach(el => el.dataset.original = 'true');
        let originals = Array.from(track.querySelectorAll('[data-original="true"]'));
        let originalCount = originals.length;
        let index = 0; // will be set in setup

        function getVisibleCount(){
            const w = window.innerWidth;
            if (w >= 1024) return 3;
            if (w >= 768) return 2;
            return 1;
        }
        function getGap(){
            const gapStr = getComputedStyle(track).gap || '12px';
            const n = parseFloat(gapStr);
            return isNaN(n) ? 12 : n;
        }
        function getCardWidth(){
            const first = track.querySelector('.therapist-card');
            if (!first) return 0;
            return first.getBoundingClientRect().width + getGap();
        }
        function clearClones(){ track.querySelectorAll('[data-clone="true"]').forEach(n=>n.remove()); }

        function setup(){
            clearClones();
            originals = Array.from(track.querySelectorAll('[data-original="true"]'));
            originalCount = originals.length;
            const visible = getVisibleCount();

            const firstClones = originals.slice(0, visible).map(c=>{const n=c.cloneNode(true); n.dataset.clone='true'; return n;});
            const lastClones = originals.slice(-visible).map(c=>{const n=c.cloneNode(true); n.dataset.clone='true'; return n;});
            lastClones.forEach((n,i)=> track.insertBefore(lastClones[lastClones.length-1-i], track.firstChild));
            firstClones.forEach(n=> track.appendChild(n));

            index = visible; // start at first real item
            track.style.transition='none';
            track.style.transform = `translateX(${-index * getCardWidth()}px)`;
            void track.offsetHeight; // reflow
            track.style.transition='';

            renderDots();
            setActiveDot();
        }

        // Wait until cards have a measurable width before first setup
        function setupWhenReady(attempt = 0){
            const width = getCardWidth();
            if (width && width > 0) {
                setup();
                return;
            }
            if (attempt < 40) { // up to ~2s @ 50ms
                setTimeout(() => setupWhenReady(attempt + 1), 50);
            } else {
                // Last resort, try once more on next frame
                requestAnimationFrame(setup);
            }
        }

        function goTo(newIndex){
            index = newIndex;
            track.style.transition = 'transform 0.3s ease';
            track.style.transform = `translateX(${-index * getCardWidth()}px)`;
            setActiveDot();
        }
        function onTransitionEnd(){
            const visible = getVisibleCount();
            const start = visible;
            const end = visible + originalCount - 1;
            if (index > end){
                track.style.transition='none';
                index = start;
                track.style.transform = `translateX(${-index * getCardWidth()}px)`;
                void track.offsetHeight; track.style.transition='';
            } else if (index < start){
                track.style.transition='none';
                index = end;
                track.style.transform = `translateX(${-index * getCardWidth()}px)`;
                void track.offsetHeight; track.style.transition='';
            }
        }

        function getPageCount(){
            return Math.max(1, Math.ceil(originalCount / getVisibleCount()));
        }
        function getLogicalPage(){
            const visible = getVisibleCount();
            const logicalIndex = (index - visible + originalCount) % originalCount;
            return Math.floor(logicalIndex / visible);
        }
        function renderDots(){
            dotsWrap.innerHTML='';
            const pages = getPageCount();
            for (let i=0;i<pages;i++){
                const b=document.createElement('button');
                b.setAttribute('aria-label', `Go to slide ${i+1}`);
                b.addEventListener('click', ()=>{
                    const visible = getVisibleCount();
                    goTo(visible + i*visible);
                });
                dotsWrap.appendChild(b);
            }
        }
        function setActiveDot(){
            const buttons = dotsWrap.querySelectorAll('button');
            const activePage = getLogicalPage();
            buttons.forEach((b,i)=>{
                if (i===activePage) b.classList.add('active'); else b.classList.remove('active');
            });
        }

        prev.addEventListener('click', ()=> goTo(index-1));
        next.addEventListener('click', ()=> goTo(index+1));
        track.addEventListener('transitionend', onTransitionEnd);

        // Touch/drag
        let startX=0, isDragging=false, dragDelta=0;
        function onTouchStart(e){ const t=e.touches?e.touches[0]:e; startX=t.clientX; isDragging=true; dragDelta=0; track.style.transition='none'; }
        function onTouchMove(e){ if(!isDragging) return; const t=e.touches?e.touches[0]:e; dragDelta=t.clientX-startX; const base=-(index*getCardWidth()); track.style.transform=`translateX(${base+dragDelta}px)`; }
        function onTouchEnd(){ if(!isDragging) return; isDragging=false; track.style.transition=''; const threshold=Math.min(120, getCardWidth()*0.25); if(dragDelta>threshold) goTo(index-1); else if(dragDelta<-threshold) goTo(index+1); else goTo(index); dragDelta=0; }
        if (viewport){
            viewport.addEventListener('touchstart', onTouchStart, {passive:true});
            viewport.addEventListener('touchmove', onTouchMove, {passive:true});
            viewport.addEventListener('touchend', onTouchEnd);
            viewport.addEventListener('mousedown', (e)=>{ e.preventDefault(); onTouchStart(e); });
            window.addEventListener('mousemove', onTouchMove);
            window.addEventListener('mouseup', onTouchEnd);
        }

        // Run after DOM ready, window load, and fonts ready to avoid first-load blank state
        setupWhenReady();
        window.addEventListener('load', () => setupWhenReady());
        if (document.fonts && document.fonts.ready) { document.fonts.ready.then(() => setupWhenReady()); }
        // Recalculate on resize
        window.addEventListener('resize', ()=>{ setupWhenReady(); });
    })();

    // Testimonials carousel initialization (seamless infinite)
    (function initTestimonialsCarousel(){
        const track = document.querySelector('.testimonials-carousel .carousel-track');
        const prev = document.querySelector('.testimonials-carousel .carousel-btn.prev');
        const next = document.querySelector('.testimonials-carousel .carousel-btn.next');
        const viewport = document.querySelector('.testimonials-carousel .carousel-viewport');
        if (!track || !prev || !next) return;

        let originals = Array.from(track.children);
        originals.forEach(el => el.dataset.original = 'true');
        let originalCount = originals.length;
        let index = 0; // will be set to visible in setup
        const leftOffset = -8;

        function getVisibleCount(){
            return window.innerWidth >= 768 ? 3 : 1;
        }

        function getGap(){
            const gapStr = getComputedStyle(track).gap || '4px';
            const n = parseFloat(gapStr);
            return isNaN(n) ? 4 : n;
        }

        function getCardWidth(){
            const first = track.querySelector('.testimonial-card');
            if (!first) return 0;
            return first.getBoundingClientRect().width + getGap();
        }

        function clearClones(){
            track.querySelectorAll('[data-clone="true"]').forEach(n => n.remove());
        }

        function setup(){
            clearClones();
            originals = Array.from(track.querySelectorAll('[data-original="true"]'));
            originalCount = originals.length;
            const visible = getVisibleCount();

            const firstClones = originals.slice(0, visible).map(c => { const n=c.cloneNode(true); n.dataset.clone='true'; return n; });
            const lastClones = originals.slice(-visible).map(c => { const n=c.cloneNode(true); n.dataset.clone='true'; return n; });

            // prepend last clones (keep order)
            lastClones.forEach((n,i)=> track.insertBefore(lastClones[lastClones.length-1-i], track.firstChild));
            // append first clones
            firstClones.forEach(n=> track.appendChild(n));

            // start at first real slide
            index = visible;
            track.style.transition = 'none';
            track.style.transform = `translateX(${-(index * getCardWidth()) + leftOffset}px)`;
            // force reflow to apply
            void track.offsetHeight;
            track.style.transition = '';
        }

        // Wait until card width is measurable to prevent blank first render
        function setupWhenReady(attempt = 0){
            const width = getCardWidth();
            if (width && width > 0) {
                setup();
                return;
            }
            if (attempt < 40) {
                setTimeout(() => setupWhenReady(attempt + 1), 50);
            } else {
                requestAnimationFrame(setup);
            }
        }

        function goTo(newIndex){
            index = newIndex;
            track.style.transition = 'transform 0.3s ease';
            track.style.transform = `translateX(${-(index * getCardWidth()) + leftOffset}px)`;
        }

        function onTransitionEnd(){
            const visible = getVisibleCount();
            const start = visible;
            const end = visible + originalCount - 1;
            if (index > end){
                track.style.transition = 'none';
                index = start;
                track.style.transform = `translateX(${-(index * getCardWidth()) + leftOffset}px)`;
                void track.offsetHeight;
                track.style.transition = '';
            } else if (index < start){
                track.style.transition = 'none';
                index = end;
                track.style.transform = `translateX(${-(index * getCardWidth()) + leftOffset}px)`;
                void track.offsetHeight;
                track.style.transition = '';
            }
        }

        prev.addEventListener('click', ()=> goTo(index - 1));
        next.addEventListener('click', ()=> goTo(index + 1));
        track.addEventListener('transitionend', onTransitionEnd);

        // Touch/drag
        let startX=0, isDragging=false, dragDelta=0;
        function onTouchStart(e){ const t=e.touches?e.touches[0]:e; startX=t.clientX; isDragging=true; dragDelta=0; track.style.transition='none'; }
        function onTouchMove(e){ if(!isDragging) return; const t=e.touches?e.touches[0]:e; dragDelta=t.clientX-startX; const base=-(index*getCardWidth())+leftOffset; track.style.transform=`translateX(${base+dragDelta}px)`; }
        function onTouchEnd(){ if(!isDragging) return; isDragging=false; track.style.transition=''; const threshold=Math.min(120, getCardWidth()*0.25); if(dragDelta>threshold) goTo(index-1); else if(dragDelta<-threshold) goTo(index+1); else goTo(index); dragDelta=0; }
        if (viewport){
            viewport.addEventListener('touchstart', onTouchStart, {passive:true});
            viewport.addEventListener('touchmove', onTouchMove, {passive:true});
            viewport.addEventListener('touchend', onTouchEnd);
            viewport.addEventListener('mousedown', (e)=>{ e.preventDefault(); onTouchStart(e); });
            window.addEventListener('mousemove', onTouchMove);
            window.addEventListener('mouseup', onTouchEnd);
        }

        // init and handle resize rebuild, robust against late layout
        setupWhenReady();
        window.addEventListener('load', () => setupWhenReady());
        if (document.fonts && document.fonts.ready) { document.fonts.ready.then(() => setupWhenReady()); }
        window.addEventListener('resize', ()=> setupWhenReady());
    })();

    /* ── Resources Carousel Functionality ──────────────────────────────── */
    (function() {
        const track = document.getElementById('resourcesTrack');
        const prevBtn = document.getElementById('resourcesPrev');
        const nextBtn = document.getElementById('resourcesNext');
        const dotsContainer = document.getElementById('resourcesDots');
        
        if (!track || !prevBtn || !nextBtn || !dotsContainer) {
            console.log('Resources carousel elements not found:', {track, prevBtn, nextBtn, dotsContainer});
            return;
        }
        
        const cards = track.querySelectorAll('.resource-card');
        if (cards.length === 0) {
            console.log('No resource cards found');
            return;
        }
        
        console.log('Resources carousel initialized with', cards.length, 'cards');
        
        let index = 0;
        let cardsPerView = 3;
        const totalCards = cards.length;
        
        function updateCardsPerView() {
            const width = window.innerWidth;
            if (width < 768) cardsPerView = 1;
            else if (width < 1024) cardsPerView = 2;
            else cardsPerView = 3;
        }
        
        function getCardWidth() {
            return cards[0].offsetWidth;
        }
        
        function getGap() {
            return 24;
        }
        
        function updateCarousel() {
            const cardWidth = getCardWidth();
            const gap = getGap();
            const offset = -(index * (cardWidth + gap));
            track.style.transform = `translateX(${offset}px)`;
            
            // Update buttons
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index >= Math.max(0, totalCards - cardsPerView);
            
            // Update dots
            updateDots();
        }
        
        function createDots() {
            dotsContainer.innerHTML = '';
            const maxIndex = Math.max(1, totalCards - cardsPerView + 1);
            
            for (let i = 0; i < maxIndex; i++) {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }
            updateDots();
        }
        
        function updateDots() {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        function goTo(newIndex) {
            const maxIndex = Math.max(0, totalCards - cardsPerView);
            index = Math.max(0, Math.min(newIndex, maxIndex));
            updateCarousel();
        }
        
        function setupWhenReady() {
            updateCardsPerView();
            createDots();
            updateCarousel();
            console.log('Resources carousel setup complete, showing', cardsPerView, 'cards per view');
        }
        
        prevBtn.addEventListener('click', () => {
            console.log('Prev button clicked, current index:', index);
            goTo(index - 1);
        });
        nextBtn.addEventListener('click', () => {
            console.log('Next button clicked, current index:', index);
            goTo(index + 1);
        });
        
        // Touch/drag support
        let startX = 0;
        let isDragging = false;
        let dragDelta = 0;
        const viewport = track.parentElement;
        
        function onTouchStart(e) {
            if (!viewport) return;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            isDragging = true;
            dragDelta = 0;
            track.style.transition = 'none';
        }
        
        function onTouchMove(e) {
            if (!isDragging) return;
            const currentX = e.touches ? e.touches[0].clientX : e.clientX;
            dragDelta = currentX - startX;
            const cardWidth = getCardWidth();
            const gap = getGap();
            const baseOffset = -(index * (cardWidth + gap));
            track.style.transform = `translateX(${baseOffset + dragDelta}px)`;
        }
        
        function onTouchEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = '';
            const threshold = Math.min(120, getCardWidth() * 0.25);
            if (dragDelta > threshold) goTo(index - 1);
            else if (dragDelta < -threshold) goTo(index + 1);
            else goTo(index);
            dragDelta = 0;
        }
        
        if (viewport) {
            viewport.addEventListener('touchstart', onTouchStart, {passive: true});
            viewport.addEventListener('touchmove', onTouchMove, {passive: true});
            viewport.addEventListener('touchend', onTouchEnd);
            viewport.addEventListener('mousedown', (e) => { e.preventDefault(); onTouchStart(e); });
            window.addEventListener('mousemove', onTouchMove);
            window.addEventListener('mouseup', onTouchEnd);
        }
        
        // Initialize and handle resize
        setTimeout(() => {
            setupWhenReady();
            console.log('Initial setup triggered');
        }, 100);
        
        window.addEventListener('load', () => {
            setupWhenReady();
            console.log('Load event setup triggered');
        });
        
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                setupWhenReady();
                console.log('Fonts ready setup triggered');
            });
        }
        
        window.addEventListener('resize', () => {
            setupWhenReady();
            console.log('Resize setup triggered');
        });
    })();

    /* ── FAQ Accordion Functionality ──────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

});

/* ══════════════════════════════════════════════════════════════════
   ► FAQ ACCORDION (SITEWIDE) - MOVED TO MAIN DOMContentLoaded LISTENER
   ══════════════════════════════════════════════════════════════════ */

/* ── Basic Clickjacking Protection ─────────────────────────────── */
if (window.top !== window.self) {
    window.top.location = window.self.location;
}