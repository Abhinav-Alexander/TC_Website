/**
 * Service Worker Registration Script
 * Register and manage service worker for caching
 */

(function() {
  'use strict';
  
  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    // Register on page load
    window.addEventListener('load', () => {
      registerServiceWorker();
    });
  } else {
    console.log('[SW] Service Workers not supported in this browser');
  }
  
  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('[SW] Service Worker registered successfully:', registration.scope);
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });
      
    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
    }
  }
  
  // Show update notification to user
  function showUpdateNotification() {
    // Simple notification (you can customize this)
    const shouldUpdate = confirm(
      'A new version of the website is available. Would you like to update now?'
    );
    
    if (shouldUpdate) {
      // Tell service worker to skip waiting
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page
      window.location.reload();
    }
  }
  
  // Listen for service worker messages
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('[SW] Cache updated');
    }
  });
  
  // Handle offline/online events
  window.addEventListener('online', () => {
    console.log('[SW] Back online');
    // Optionally show a notification
  });
  
  window.addEventListener('offline', () => {
    console.log('[SW] Gone offline');
    // Optionally show a notification
  });
  
})();

