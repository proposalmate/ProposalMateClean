// Main JavaScript for ProposalMate
document.addEventListener('DOMContentLoaded', function () {
    console.log('Main script loaded');
    setupMobileMenu();
    setupAuthenticationHandling();
    setupFormValidation();
    setupSmoothScrolling();
    initializeInteractiveElements();
    setupSidebarNavigation();
    setupLogoutFunctionality();
});

// Authentication Handling
function setupAuthenticationHandling() {
    // Check for login redirect parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    // Store redirect information if present
    if (redirect) {
        localStorage.setItem('loginRedirect', redirect);
        console.log('Stored login redirect:', redirect);
    }
    
    // Handle post-login redirects
    const loginRedirect = localStorage.getItem('loginRedirect');
    const token = localStorage.getItem('token');
    
    if (token && loginRedirect && window.location.pathname.includes('login.html')) {
        console.log('User logged in with redirect pending:', loginRedirect);
        localStorage.removeItem('loginRedirect');
        
        // Handle specific redirects
        if (loginRedirect === 'create') {
            const pendingTemplate = localStorage.getItem('pendingTemplate');
            if (pendingTemplate) {
                localStorage.setItem('selectedTemplate', pendingTemplate);
                localStorage.removeItem('pendingTemplate');
                window.location.href = 'create.html';
            } else {
                window.location.href = 'create.html';
            }
        } else if (loginRedirect === 'templates') {
            window.location.href = 'templates.html';
        } else if (loginRedirect === 'dashboard') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
    
    // Check if current page requires authentication
    const requiresAuth = [
        'dashboard.html',
        'create.html',
        'account.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (requiresAuth.includes(currentPage) && !token) {
        console.log('Protected page accessed without token, redirecting to login');
        localStorage.setItem('loginRedirect', currentPage.replace('.html', ''));
        window.location.href = 'login.html';
    }
}

// Mobile Menu Setup
function setupMobileMenu() {
    const header = document.querySelector('header');
    if (!header) return;

    const nav = header.querySelector('nav');
    if (!nav) return;

    if (!document.querySelector('.mobile-menu-toggle')) {
        const mobileToggle = document.createElement('div');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        nav.appendChild(mobileToggle);

        if (!document.querySelector('.mobile-menu')) {
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';

            const closeButton = document.createElement('div');
            closeButton.className = 'mobile-menu-close';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            mobileMenu.appendChild(closeButton);

            const menuLinks = document.createElement('div');
            menuLinks.className = 'mobile-menu-links';

            const navLinks = header.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                const newLink = link.cloneNode(true);
                menuLinks.appendChild(newLink);
            });

            mobileMenu.appendChild(menuLinks);
            document.body.appendChild(mobileMenu);

            closeButton.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
            });

            mobileToggle.addEventListener('click', function () {
                mobileMenu.classList.add('active');
            });
        }
    }
}

// Form Validation
function setupFormValidation() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            const terms = document.getElementById('terms');

            if (!name.value.trim()) {
                showError(name, 'Name is required');
                return;
            }

            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                return;
            }

            if (password.value.length < 8) {
                showError(password, 'Password must be at least 8 characters long');
                return;
            }

            if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                return;
            }

            if (terms && !terms.checked) {
                showError(terms, 'You must accept the Terms of Service and Privacy Policy');
                return;
            }

            // Registration is now handled by register.js
            console.log('Form validation passed, registration will be handled by register.js');
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showError(input, message) {
    const parent = input.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
        parent.removeChild(existingError);
    }

    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    parent.appendChild(errorDiv);
    input.focus();
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const selector = this.getAttribute('href');
            if (selector && selector.startsWith('#') && selector !== '#') {
                const target = document.querySelector(selector);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Interactive Elements
function initializeInteractiveElements() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('hover'));
        card.addEventListener('mouseleave', () => card.classList.remove('hover'));
    });
}

// Sidebar Navigation
function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
}

// Logout Functionality
function setupLogoutFunctionality() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logging out user');
            
            // Clear authentication data
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user');
            
            // Redirect to home page
            window.location.href = '../index.html';
        });
    }
}
