// ProposalMate Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    setupMobileMenu();
    
    // Form validation
    setupFormValidation();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Initialize any interactive elements
    initializeInteractiveElements();
});

// Mobile Menu Setup
function setupMobileMenu() {
    const header = document.querySelector('header');
    
    // Only proceed if we're on a page with navigation
    if (!header) return;
    
    // Create mobile menu toggle button if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const nav = header.querySelector('nav');
        const mobileToggle = document.createElement('div');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        nav.appendChild(mobileToggle);
        
        // Create mobile menu if it doesn't exist
        if (!document.querySelector('.mobile-menu')) {
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            
            const closeButton = document.createElement('div');
            closeButton.className = 'mobile-menu-close';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            mobileMenu.appendChild(closeButton);
            
            const menuLinks = document.createElement('div');
            menuLinks.className = 'mobile-menu-links';
            
            // Clone navigation links
            const navLinks = header.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                const newLink = link.cloneNode(true);
                menuLinks.appendChild(newLink);
            });
            
            mobileMenu.appendChild(menuLinks);
            document.body.appendChild(mobileMenu);
            
            // Add event listener to close button
            closeButton.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        }
        
        // Add event listener to toggle button
        const mobileMenu = document.querySelector('.mobile-menu');
        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
    }
}

// Form Validation
function setupFormValidation() {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            const terms = document.getElementById('terms');
            
            // Validate name
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                return;
            }
            
            // Validate email
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                return;
            }
            
            // Validate password
            if (password.value.length < 8) {
                showError(password, 'Password must be at least 8 characters long');
                return;
            }
            
            // Validate password confirmation
            if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                return;
            }
            
            // Validate terms acceptance
            if (!terms.checked) {
                showError(terms, 'You must accept the Terms of Service and Privacy Policy');
                return;
            }
            
            // Show loading state
            const submitButton = document.querySelector('#signup-form button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            // Use the API client for registration
            api.register(name.value, email.value, password.value)
                .then(data => {
                    // Redirect to dashboard after successful signup
                    window.location.href = '/pages/dashboard.html';
                })
                .catch(error => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    showError(email, error.message || 'Registration failed. Please try again.');
                });
        });
    }
}

// Email validation helper
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Show error message
function showError(input, message) {
    // Remove any existing error messages
    const parent = input.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
        parent.removeChild(existingError);
    }
    
    // Add error class to input
    input.classList.add('error');
    
    // Create and append error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    parent.appendChild(errorDiv);
    
    // Focus on the input with error
    input.focus();
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Interactive Elements
function initializeInteractiveElements() {
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Check if user is logged in and update navigation accordingly
    updateNavigation();
}

// Update navigation based on authentication status
function updateNavigation() {
    const token = localStorage.getItem('token');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (token && authButtons) {
        // User is logged in, show dashboard link instead of login/signup
        authButtons.innerHTML = `
            <a href="/pages/dashboard.html" class="elevated-btn">Dashboard</a>
        `;
    }
    
    // Setup social login buttons if they exist
    const socialButtons = document.querySelectorAll('.social-login-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Social login integration coming soon!');
        });
    });
}
