// Navigation and dashboard loading functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup responsive navigation
    setupResponsiveNavigation();
    
    // Check authentication status and update UI accordingly
    checkAuthStatus();
    
    // Setup dashboard navigation if on dashboard page
    if (document.querySelector('.dashboard')) {
        setupDashboardNavigation();
    }
    
    // Log for debugging
    console.log('Navigation script loaded and initialized');
});

function setupResponsiveNavigation() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    // Check if mobile menu exists, if not create it
    let mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
        mobileMenu = createMobileMenu();
    }
    
    if (mobileToggle && mobileMenu) {
        console.log('Mobile toggle and menu found');
        
        // Add click event listener to toggle button with direct style manipulation
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile toggle clicked');
            
            // Toggle display and position directly
            if (mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
                mobileMenu.style.right = '-300px';
            } else {
                mobileMenu.style.display = 'block';
                mobileMenu.style.right = '0';
            }
            
            mobileToggle.classList.toggle('active');
        });
        
        // Add click event listener to close button
        const closeButton = mobileMenu.querySelector('.mobile-menu-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                mobileMenu.style.display = 'none';
                mobileMenu.style.right = '-300px';
                mobileToggle.classList.remove('active');
            });
        }
    } else {
        console.error('Mobile toggle or menu not found');
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && mobileMenu.style.display === 'block' && 
            !event.target.closest('.mobile-menu') && 
            !event.target.closest('.mobile-menu-toggle')) {
            mobileMenu.style.display = 'none';
            mobileMenu.style.right = '-300px';
            if (mobileToggle) mobileToggle.classList.remove('active');
        }
    });
    
    // Add active class to current page link
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a, .mobile-menu-links a');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || 
            (currentPath.includes('/pages/') && href.includes(currentPath.split('/').pop()))) {
            item.classList.add('active');
        }
    });
}

function createMobileMenu() {
    // Create mobile menu if it doesn't exist
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.style.position = 'fixed';
    mobileMenu.style.top = '0';
    mobileMenu.style.right = '-300px';
    mobileMenu.style.width = '300px';
    mobileMenu.style.height = '100vh';
    mobileMenu.style.backgroundColor = 'white';
    mobileMenu.style.boxShadow = '-2px 0 10px rgba(0, 0, 0, 0.1)';
    mobileMenu.style.zIndex = '1000';
    mobileMenu.style.transition = 'right 0.3s ease';
    mobileMenu.style.padding = '20px';
    mobileMenu.style.display = 'none';
    
    const closeButton = document.createElement('div');
    closeButton.className = 'mobile-menu-close';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.style.textAlign = 'right';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.marginBottom = '20px';
    closeButton.style.cursor = 'pointer';
    mobileMenu.appendChild(closeButton);
    
    const menuLinks = document.createElement('div');
    menuLinks.className = 'mobile-menu-links';
    menuLinks.style.display = 'flex';
    menuLinks.style.flexDirection = 'column';
    menuLinks.style.gap = '15px';
    
    // Clone navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const newLink = link.cloneNode(true);
        newLink.style.padding = '10px 0';
        newLink.style.borderBottom = '1px solid #E0E0E0';
        menuLinks.appendChild(newLink);
    });
    
    mobileMenu.appendChild(menuLinks);
    document.body.appendChild(mobileMenu);
    
    return mobileMenu;
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    
    // If no token, redirect to login if on protected page
    if (!token && isProtectedPage()) {
        window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return;
    }
    
    // If token exists, verify it and update UI
    if (token) {
        api.getCurrentUser()
            .then(user => {
                if (user) {
                    updateUIForAuthenticatedUser(user);
                } else {
                    // Token invalid or expired
                    handleInvalidToken();
                }
            })
            .catch(err => {
                console.error("Auth check failed:", err);
                // Only redirect if on protected page
                if (isProtectedPage()) {
                    handleInvalidToken();
                }
            });
    } else {
        // No token, update UI for guest
        updateUIForGuest();
    }
}

function isProtectedPage() {
    const protectedPaths = [
        '/pages/dashboard.html',
        '/pages/create-proposal.html',
        '/pages/view-proposal.html',
        '/pages/edit-proposal.html',
        '/pages/clients.html',
        '/pages/subscription.html',
        '/pages/settings.html'
    ];
    
    return protectedPaths.some(path => window.location.pathname.includes(path));
}

function handleInvalidToken() {
    // Clear token
    localStorage.removeItem('token');
    
    // Redirect to login if on protected page
    if (isProtectedPage()) {
        window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    } else {
        // Just update UI for guest
        updateUIForGuest();
    }
}

function updateUIForAuthenticatedUser(user) {
    // Update navigation
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <a href="/pages/dashboard.html" class="elevated-btn">Dashboard</a>
        `;
    }
    
    // Update user menu if exists
    const userMenu = document.querySelector('#user-menu');
    if (userMenu) {
        const userName = userMenu.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.name;
        }
    }
    
    // Update dashboard welcome message if exists
    const welcomeHeading = document.querySelector('.dashboard-content h1');
    if (welcomeHeading && welcomeHeading.textContent.includes('Welcome')) {
        welcomeHeading.textContent = `Welcome, ${user.name.split(' ')[0]}!`;
    }
}

function updateUIForGuest() {
    // Update navigation
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <a href="/pages/login.html" class="ghost-btn">Log In</a>
            <a href="/pages/signup.html" class="elevated-btn">Sign Up</a>
        `;
    }
}

function setupDashboardNavigation() {
    // Sidebar toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('active') && 
                !event.target.closest('.sidebar') && 
                !event.target.closest('.menu-toggle')) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    // Add active class to current sidebar link
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath.includes('/pages/') && href.includes(currentPath.split('/').pop()))) {
            link.classList.add('active');
        }
    });
    
    // Setup logout functionality
    const logoutLink = document.querySelector('.sidebar-menu a[href="../index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Use the API client to logout
            api.logout()
                .then(() => {
                    window.location.href = '../index.html';
                })
                .catch(err => {
                    console.error("Logout error:", err);
                    // Force logout even if API call fails
                    localStorage.removeItem('token');
                    window.location.href = '../index.html';
                });
        });
    }
    
    // Setup user dropdown menu
    const userMenu = document.querySelector('#user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle dropdown
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
                
                // Close dropdown when clicking outside
                const closeDropdownHandler = function(event) {
                    if (!event.target.closest('#user-menu') && !event.target.closest('.user-dropdown')) {
                        dropdown.classList.remove('active');
                        document.removeEventListener('click', closeDropdownHandler);
                    }
                };
                
                document.addEventListener('click', closeDropdownHandler);
            }
        });
    }
}
