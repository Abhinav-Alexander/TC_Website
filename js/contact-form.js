/* ── Contact Form Handler - Mobile Optimized ──────────────────── */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Form field elements
        const nameField = document.getElementById('contactName');
        const emailField = document.getElementById('contactEmail');
        const phoneField = document.getElementById('contactPhone');
        const messageField = document.getElementById('contactMessage');
        const charCountEl = document.getElementById('charCount');
        
        // Mobile-specific improvements
        const isMobile = window.innerWidth <= 768;
        
        // Character counter for message field
        if (messageField && charCountEl) {
            messageField.addEventListener('input', () => {
                const count = messageField.value.length;
                charCountEl.textContent = count;
                
                // Visual feedback for good message length
                if (count > 20 && count < 500) {
                    charCountEl.style.color = '#10b981';
                } else if (count >= 500) {
                    charCountEl.style.color = '#f59e0b';
                } else {
                    charCountEl.style.color = '#6b7280';
                }
                
                // Auto-resize textarea on mobile
                if (isMobile) {
                    messageField.style.height = 'auto';
                    messageField.style.height = (messageField.scrollHeight) + 'px';
                }
            });
        }
        
        // Live phone filter: digits only
        if (phoneField) {
            phoneField.addEventListener('input', () => {
                phoneField.value = phoneField.value.replace(/[^0-9]/g, '');
            });
        }
        
        // Add encouraging placeholders that change (disabled on mobile for better UX)
        if (!isMobile && messageField) {
            const encouragingMessages = [
                "Share what brought you here today...",
                "Tell us how we can help you...",
                "What questions do you have for us?",
                "We're here to listen and support you...",
                "Every journey starts with a single step..."
            ];
            
            let messageIndex = 0;
            setInterval(() => {
                if (messageField.value === '' && document.activeElement !== messageField) {
                    messageField.placeholder = encouragingMessages[messageIndex];
                    messageIndex = (messageIndex + 1) % encouragingMessages.length;
                }
            }, 4000);
        }
        
        // Custom validity and error messages
        const validationChecks = {
            name: {
                field: nameField,
                errEl: document.getElementById('contactNameErr'),
                msg: 'Please enter your first and last name.'
            },
            email: {
                field: emailField,
                errEl: document.getElementById('contactEmailErr'),
                msg: 'Please enter a valid email address.'
            },
            phone: {
                field: phoneField,
                errEl: document.getElementById('contactPhoneErr'),
                msg: 'Phone must be 10-15 digits if provided.'
            },
            message: {
                field: messageField,
                errEl: document.getElementById('contactMessageErr'),
                msg: 'Please share what\'s on your mind - even a few words help us understand how to support you.'
            }
        };
        
        // Attach validation handlers with mobile-friendly UX
        Object.values(validationChecks).forEach(({ field, errEl, msg }) => {
            if (field && errEl) {
                field.addEventListener('invalid', (e) => {
                    e.preventDefault(); // Prevent browser validation popup on mobile
                    field.setCustomValidity(msg);
                    errEl.textContent = msg;
                    field.style.borderColor = '#ef4444';
                    field.classList.add('error');
                    
                    // Add shake animation for better feedback
                    const formGroup = field.closest('.form-group');
                    if (formGroup) {
                        formGroup.classList.add('shake');
                        setTimeout(() => formGroup.classList.remove('shake'), 500);
                    }
                });
                
                field.addEventListener('input', () => {
                    field.setCustomValidity('');
                    errEl.textContent = '';
                    field.style.borderColor = '';
                    field.classList.remove('error');
                    
                    // Add positive visual feedback
                    if (field.value.length > 0 && field.checkValidity()) {
                        field.style.borderColor = '#10b981';
                        field.classList.add('success');
                    } else {
                        field.classList.remove('success');
                    }
                });
                
                field.addEventListener('focus', () => {
                    if (!field.classList.contains('error')) {
                        field.style.borderColor = '#0d9488';
                    }
                    
                    // Scroll field into view on mobile
                    if (isMobile) {
                        setTimeout(() => {
                            field.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }, 300);
                    }
                });
                
                field.addEventListener('blur', () => {
                    if (field.style.borderColor === 'rgb(13, 148, 136)') {
                        field.style.borderColor = '';
                    }
                });
            }
        });
        
        // Form submission with enhanced mobile UX
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Scroll to top of form on mobile for better visibility
            if (isMobile) {
                contactForm.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
            
            // Run browser validation first
            const isValid = contactForm.checkValidity();
            if (!isValid) {
                // Find first invalid field and focus it
                const firstInvalid = contactForm.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    if (isMobile) {
                        firstInvalid.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }
                }
                showContactToast('Please check the highlighted fields above.', true);
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Honeypot spam check
            if (formData.get('website')) return;
            
            // Enhanced validation
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                showContactToast('Please fill in all required fields.', true);
                return;
            }
            

            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitButton.innerHTML;
            
            // Enhanced loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            // Prevent form re-submission
            contactForm.style.pointerEvents = 'none';
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    // Success state
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitButton.classList.remove('loading');
                    submitButton.classList.add('success');
                    
                    showContactToast('🎉 Thank you! Your message has been sent. We\'ll respond within 4 hours.', false);
                    
                    // Haptic feedback on mobile (if available)
                    if (navigator.vibrate && isMobile) {
                        navigator.vibrate([100, 50, 100]);
                    }
                    
                    // Reset form after short delay
                    setTimeout(() => {
                        contactForm.reset();
                        if (charCountEl) charCountEl.textContent = '0';
                        
                        // Clear all validation states
                        const allFields = contactForm.querySelectorAll('input, textarea, select');
                        allFields.forEach(field => {
                            field.style.borderColor = '';
                            field.classList.remove('error', 'success');
                        });
                        
                        // Reset button after animation
                        setTimeout(() => {
                            submitButton.innerHTML = originalHTML;
                            submitButton.disabled = false;
                            submitButton.classList.remove('success');
                            contactForm.style.pointerEvents = '';
                        }, 1000);
                    }, 2000);
                    
                } else {
                    throw new Error(`Server responded with status ${response.status}`);
                }
            } catch (error) {
                console.error('Error:', error);
                showContactToast('Oops! Something went wrong. Please try again or call us at (+91) 9211-750-322.', true);
                
                // Reset button state on error
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                contactForm.style.pointerEvents = '';
            }
        });
    }
    
    // Enhanced toast notification function with mobile optimizations
    function showContactToast(message, isError = false) {
        // Remove existing toast
        const existingToast = document.querySelector('.contact-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `contact-toast ${isError ? 'error' : 'success'}`;
        
        // Create toast content
        const icon = isError ? '⚠️' : '✅';
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${icon}</span>
                <span>${message}</span>
            </div>
        `;
        
        // Mobile-responsive toast positioning
        const isMobile = window.innerWidth <= 768;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: isMobile ? '10px' : '20px',
            right: isMobile ? '10px' : '20px',
            left: isMobile ? '10px' : 'auto',
            background: isError ? '#ef4444' : '#10b981',
            color: 'white',
            padding: isMobile ? '12px 16px' : '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: '10000',
            transform: isMobile ? 'translateY(-100px)' : 'translateX(400px)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            maxWidth: isMobile ? 'calc(100vw - 20px)' : '400px',
            fontSize: isMobile ? '13px' : '14px',
            lineHeight: '1.4',
            fontWeight: '500'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = isMobile ? 'translateY(0)' : 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        const displayTime = isError ? 6000 : 5000;
        setTimeout(() => {
            toast.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, displayTime);
        
        // Allow manual dismiss on mobile by tapping
        if (isMobile) {
            toast.addEventListener('click', () => {
                toast.style.transform = 'translateY(-100px)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            });
        }
    }
    
    // Add micro-interactions with mobile considerations
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label && !window.matchMedia('(max-width: 768px)').matches) {
            // Only add hover effects on non-mobile devices
            input.addEventListener('focus', () => {
                label.style.color = '#0d9488';
                label.style.transform = 'translateY(-2px)';
                label.style.transition = 'all 0.2s ease';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.color = '';
                    label.style.transform = '';
                }
            });
        }
    });
    
    // Handle viewport changes (orientation change, keyboard show/hide)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            // Adjust layout when mobile keyboard appears/disappears
            const isKeyboardOpen = window.visualViewport.height < window.innerHeight * 0.75;
            document.body.style.paddingBottom = isKeyboardOpen ? '20px' : '0';
        });
    }
    
    // Prevent zoom on iOS when focusing inputs
    const addMaximumScaleToMetaViewport = () => {
        const el = document.querySelector('meta[name=viewport]');
        if (el !== null) {
            let content = el.getAttribute('content');
            let re = /maximum\-scale=[0-9\.]+/g;
            if (re.test(content)) {
                content = content.replace(re, 'maximum-scale=1.0');
            } else {
                content = [content, 'maximum-scale=1.0'].join(', ');
            }
            el.setAttribute('content', content);
        }
    };
    
    const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;
    
    // Enable zoom again when not focusing on input
    const enableIosTextFieldZoom = () => {
        const el = document.querySelector('meta[name=viewport]');
        if (el !== null) {
            let content = el.getAttribute('content');
            content = content.replace(/maximum\-scale=[0-9\.]+/g, 'maximum-scale=5.0');
            el.setAttribute('content', content);
        }
    };
    
    // Apply iOS zoom fix
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputElements = contactForm.querySelectorAll('input, textarea, select');
        inputElements.forEach(input => {
            input.addEventListener('focus', disableIosTextFieldZoom, false);
            input.addEventListener('blur', enableIosTextFieldZoom, false);
        });
    }
});

/* ── Auto-resize textarea ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('contactMessage');
    if (textarea) {
        // Set initial height
        textarea.style.height = 'auto';
        textarea.style.minHeight = '100px';
        
        // Auto-resize function
        const autoResize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.max(100, textarea.scrollHeight) + 'px';
        };
        
        textarea.addEventListener('input', autoResize);
        textarea.addEventListener('focus', autoResize);
        
        // Initial resize
        autoResize();
    }
});