/**
 * Load Footer Module
 * Dynamically loads and injects the footer into all pages
 */
(function() {
    'use strict';
    
    // Determine the correct path to footer.html based on script location
    function getFooterPath() {
        const currentScript = document.currentScript;
        
        if (currentScript && currentScript.src) {
            try {
                const scriptUrl = new URL(currentScript.src, window.location.href);
                const scriptPath = scriptUrl.pathname;
                const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
                
                // Count directory depth (excluding leading slash and js folder)
                const parts = scriptDir.split('/').filter(Boolean);
                const depth = parts.length - 1; // -1 because js is one level
                
                if (depth <= 0) {
                    // We're at root level
                    return '/footer.html';
                } else {
                    // Calculate relative path
                    return '../'.repeat(depth) + 'footer.html';
                }
            } catch (e) {
                console.warn('Error calculating footer path:', e);
            }
        }
        
        // Fallback: try absolute path
        return '/footer.html';
    }
    
    // Load and inject footer
    function loadFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) {
            console.warn('Footer container not found');
            return;
        }
        
        const footerPath = getFooterPath();
        
        fetch(footerPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load footer: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
                
                // Update copyright year dynamically
                const currentYear = new Date().getFullYear();
                const copyrightText = footerContainer.querySelector('.footer-bottom p');
                if (copyrightText) {
                    copyrightText.innerHTML = copyrightText.innerHTML.replace(/© \d{4}/, `© ${currentYear}`);
                }
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Fallback: show a basic footer if loading fails
                footerContainer.innerHTML = `
                    <footer class="footer">
                        <div class="container footer-container">
                            <div class="footer-bottom">
                                <p>© ${new Date().getFullYear()} Therapy Council. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                `;
            });
    }
    
    // Load footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();

