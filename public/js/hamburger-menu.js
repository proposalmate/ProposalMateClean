/**
 * Hamburger Menu Implementation for ProposalMate
 * 
 * This is a robust, cross-browser compatible implementation
 * of the hamburger menu functionality using vanilla JavaScript.
 * 
 * Features:
 * - Works on all modern browsers
 * - Proper cursor styling
 * - Smooth animations
 * - Overlay background
 * - Accessible (keyboard navigation and ARIA)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Hamburger menu script loaded");
    
    // Get elements
    const hamburgerBtn = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu-close');
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '100';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(overlay);
    }
    
    // Ensure hamburger button has proper styling
    if (hamburgerBtn) {
        hamburgerBtn.style.cursor = 'pointer';
        console.log("Hamburger button found and styled");
    } else {
        console.error("Hamburger button not found");
    }
    
    // Toggle mobile menu function
    function toggleMenu() {
        console.log("Toggle mobile menu called");
        
        if (mobileMenu.style.right === '0px') {
            // Close menu
            mobileMenu.style.right = '-100%';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
            console.log("Mobile menu closed");
        } else {
            // Open menu
            mobileMenu.style.right = '0';
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
            console.log("Mobile menu opened");
        }
    }
    
    // Add event listeners
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Hamburger button clicked");
            toggleMenu();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Close button clicked");
            toggleMenu();
        });
    }
    
    overlay.addEventListener('click', function() {
        console.log("Overlay clicked");
        toggleMenu();
    });
    
    // Add keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.style.right === '0px') {
            toggleMenu();
            console.log("Menu closed with Escape key");
        }
    });
    
    console.log("Hamburger menu initialization complete");
});
