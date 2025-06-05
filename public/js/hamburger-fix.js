// Hamburger button fix for ProposalMate
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hamburger button fix script loaded');
    
    // Check if mobile toggle exists, if not create it
    let mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (!mobileToggle) {
        console.log('Creating missing hamburger button');
        mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Find the nav element to append the button to
        const nav = document.querySelector('nav');
        if (nav) {
            nav.appendChild(mobileToggle);
            console.log('Hamburger button added to navigation');
        } else {
            console.error('Navigation element not found');
        }
    } else {
        // Convert div to button for accessibility if needed
        if (mobileToggle.tagName.toLowerCase() !== 'button') {
            console.log('Converting div to button for accessibility');
            const newButton = document.createElement('button');
            newButton.className = mobileToggle.className;
            newButton.setAttribute('aria-label', 'Toggle mobile menu');
            newButton.innerHTML = mobileToggle.innerHTML;
            mobileToggle.parentNode.replaceChild(newButton, mobileToggle);
            mobileToggle = newButton;
        }
    }
    
    // Check if mobile menu exists, if not create it
    let mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
        console.log('Creating missing mobile menu');
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-menu-close';
        closeButton.setAttribute('aria-label', 'Close mobile menu');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        mobileMenu.appendChild(closeButton);
        
        // Create menu links container
        const menuLinks = document.createElement('div');
        menuLinks.className = 'mobile-menu-links';
        
        // Clone navigation links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            menuLinks.appendChild(newLink);
        });
        
        mobileMenu.appendChild(menuLinks);
        document.body.appendChild(mobileMenu);
        console.log('Mobile menu created and added to body');
    }
    
    // Add event listeners
    if (mobileToggle && mobileMenu) {
        console.log('Setting up event listeners for mobile menu');
        
        // Toggle menu on hamburger click
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger button clicked');
            
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenu.style.right = '-300px';
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'block';
                // Small delay to ensure display change takes effect before animation
                setTimeout(() => {
                    mobileMenu.classList.add('active');
                    mobileMenu.style.right = '0';
                }, 10);
            }
        });
        
        // Close menu on close button click
        const closeButton = mobileMenu.querySelector('.mobile-menu-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                console.log('Close button clicked');
                mobileMenu.classList.remove('active');
                mobileMenu.style.right = '-300px';
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                }, 300); // Match transition duration
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileMenu.classList.contains('active') && 
                !event.target.closest('.mobile-menu') && 
                !event.target.closest('.mobile-menu-toggle')) {
                console.log('Clicked outside, closing menu');
                mobileMenu.classList.remove('active');
                mobileMenu.style.right = '-300px';
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                }, 300); // Match transition duration
            }
        });
    }
    
    // Add Font Awesome if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
        console.log('Adding Font Awesome for icons');
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    // Add hamburger-fix.css if not already present
    if (!document.querySelector('link[href*="hamburger-fix.css"]')) {
        console.log('Adding hamburger-fix.css');
        const hamburgerCSS = document.createElement('link');
        hamburgerCSS.rel = 'stylesheet';
        hamburgerCSS.href = '/css/hamburger-fix.css';
        document.head.appendChild(hamburgerCSS);
    }
    
    console.log('Hamburger button fix completed');
});
