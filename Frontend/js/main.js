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
            
            // If all validations pass, simulate form submission
            simulateSignup(name.value, email.value);
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

// Simulate signup process
function simulateSignup(name, email) {
    // Show loading state
    const submitButton = document.querySelector('#signup-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(function() {
        // Redirect to dashboard after successful signup
        window.location.href = 'dashboard.html';
    }, 2000);
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
    
    // Dashboard functionality
    setupDashboardInteractions();
}

// Dashboard Interactions
function setupDashboardInteractions() {
    // User menu dropdown
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <ul>
                <li><a href="#"><i class="fas fa-user"></i> Profile</a></li>
                <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="#"><i class="fas fa-credit-card"></i> Subscription</a></li>
                <li><a href="../index.html"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        `;
        
        // Add dropdown to header
        const header = document.querySelector('header');
        header.appendChild(dropdown);
        
        // Toggle dropdown on click
        userMenu.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // Proposal actions
    const proposalActions = document.querySelectorAll('.proposal-actions .btn-icon');
    proposalActions.forEach(action => {
        action.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get action type from icon
            const icon = this.querySelector('i');
            const actionType = icon.className.includes('eye') ? 'view' :
                              icon.className.includes('edit') ? 'edit' :
                              icon.className.includes('trash') ? 'delete' : '';
            
            // Get proposal title
            const proposalItem = this.closest('.proposal-item');
            const proposalTitle = proposalItem.querySelector('.proposal-title').textContent;
            
            // Handle different actions
            switch(actionType) {
                case 'view':
                    alert(`Viewing proposal: ${proposalTitle}`);
                    break;
                case 'edit':
                    alert(`Editing proposal: ${proposalTitle}`);
                    break;
                case 'delete':
                    if (confirm(`Are you sure you want to delete "${proposalTitle}"?`)) {
                        // Simulate deletion with animation
                        proposalItem.style.opacity = '0';
                        setTimeout(() => {
                            proposalItem.style.height = '0';
                            proposalItem.style.padding = '0';
                            proposalItem.style.margin = '0';
                            proposalItem.style.overflow = 'hidden';
                            
                            setTimeout(() => {
                                proposalItem.remove();
                            }, 300);
                        }, 300);
                    }
                    break;
            }
        });
    });
}
