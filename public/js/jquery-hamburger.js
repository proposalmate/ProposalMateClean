/**
 * Hamburger Menu Implementation using jQuery
 * 
 * This is a robust, cross-browser compatible implementation
 * of the hamburger menu functionality using jQuery.
 */

// Wait for document to be fully loaded
$(document).ready(function() {
    console.log("Hamburger menu script loaded");
    
    // Create mobile menu if it doesn't exist
    if ($('.mobile-menu').length === 0) {
        console.log("Creating mobile menu");
        
        // Create mobile menu container
        const mobileMenu = $('<div class="mobile-menu"></div>');
        mobileMenu.css({
            'position': 'fixed',
            'top': '0',
            'right': '-100%',
            'width': '80%',
            'max-width': '300px',
            'height': '100%',
            'background-color': '#fff',
            'box-shadow': '-2px 0 10px rgba(0,0,0,0.1)',
            'z-index': '1000',
            'padding': '60px 20px 20px',
            'transition': 'right 0.3s ease-in-out',
            'overflow-y': 'auto'
        });
        
        // Create close button
        const closeButton = $('<button class="mobile-menu-close" aria-label="Close menu">&times;</button>');
        closeButton.css({
            'position': 'absolute',
            'top': '20px',
            'right': '20px',
            'background': 'none',
            'border': 'none',
            'font-size': '24px',
            'color': '#333',
            'cursor': 'pointer'
        });
        
        // Create mobile menu links container
        const mobileMenuLinks = $('<div class="mobile-menu-links"></div>');
        mobileMenuLinks.css({
            'display': 'flex',
            'flex-direction': 'column'
        });
        
        // Clone navigation links
        const navLinks = $('.nav-links a, nav ul a').clone();
        navLinks.css({
            'padding': '15px 0',
            'border-bottom': '1px solid #eee',
            'text-decoration': 'none',
            'color': '#333',
            'font-weight': '500'
        });
        
        // Add links to mobile menu
        mobileMenuLinks.append(navLinks);
        
        // Assemble mobile menu
        mobileMenu.append(closeButton);
        mobileMenu.append(mobileMenuLinks);
        
        // Add mobile menu to body
        $('body').append(mobileMenu);
        
        // Create overlay
        const overlay = $('<div class="mobile-menu-overlay"></div>');
        overlay.css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0,0,0,0.5)',
            'z-index': '999',
            'opacity': '0',
            'visibility': 'hidden',
            'transition': 'opacity 0.3s ease'
        });
        
        $('body').append(overlay);
        
        console.log("Mobile menu created");
    }
    
    // Ensure hamburger button has proper styling
    $('.hamburger-menu, .mobile-menu-toggle, .mobile-toggle, button[aria-label="Toggle menu"]').css({
        'cursor': 'pointer !important'
    });
    
    // Toggle mobile menu function
    function toggleMobileMenu() {
        console.log("Toggle mobile menu called");
        
        const mobileMenu = $('.mobile-menu');
        const overlay = $('.mobile-menu-overlay');
        
        if (mobileMenu.css('right') === '-100%' || mobileMenu.css('right') === 'auto') {
            // Open menu
            mobileMenu.css('right', '0');
            overlay.css({
                'opacity': '1',
                'visibility': 'visible'
            });
            $('body').css('overflow', 'hidden');
            console.log("Mobile menu opened");
        } else {
            // Close menu
            mobileMenu.css('right', '-100%');
            overlay.css({
                'opacity': '0',
                'visibility': 'hidden'
            });
            $('body').css('overflow', '');
            console.log("Mobile menu closed");
        }
    }
    
    // Add event listeners
    $('.hamburger-menu, .mobile-menu-toggle, .mobile-toggle, button[aria-label="Toggle menu"]').on('click', function(e) {
        e.preventDefault();
        console.log("Hamburger button clicked");
        toggleMobileMenu();
    });
    
    $('.mobile-menu-close').on('click', function(e) {
        e.preventDefault();
        console.log("Close button clicked");
        toggleMobileMenu();
    });
    
    $('.mobile-menu-overlay').on('click', function() {
        console.log("Overlay clicked");
        toggleMobileMenu();
    });
    
    // Add CSS for mobile view
    const mobileStyle = $('<style></style>');
    mobileStyle.text(`
        @media (max-width: 768px) {
            .nav-links, nav ul:not(.mobile-menu-links) {
                display: none !important;
            }
            
            .hamburger-menu, .mobile-menu-toggle, .mobile-toggle, button[aria-label="Toggle menu"] {
                display: block !important;
                cursor: pointer !important;
            }
        }
        
        .hamburger-menu:hover, .mobile-menu-toggle:hover, .mobile-toggle:hover, button[aria-label="Toggle menu"]:hover {
            opacity: 0.8;
        }
    `);
    
    $('head').append(mobileStyle);
    
    console.log("Hamburger menu initialization complete");
});
