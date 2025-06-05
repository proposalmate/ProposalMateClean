/**
 * User Flow Test Script
 * 
 * This script validates all core user flows in the ProposalMate application
 * to ensure proper functionality after architectural consolidation.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize test status display
    const testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    testContainer.style.position = 'fixed';
    testContainer.style.top = '20px';
    testContainer.style.right = '20px';
    testContainer.style.width = '300px';
    testContainer.style.padding = '15px';
    testContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    testContainer.style.border = '1px solid #ddd';
    testContainer.style.borderRadius = '5px';
    testContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    testContainer.style.zIndex = '9999';
    testContainer.style.maxHeight = '80vh';
    testContainer.style.overflowY = 'auto';
    
    const testHeader = document.createElement('h3');
    testHeader.textContent = 'User Flow Tests';
    testHeader.style.margin = '0 0 10px 0';
    
    const testList = document.createElement('ul');
    testList.id = 'test-list';
    testList.style.listStyle = 'none';
    testList.style.padding = '0';
    testList.style.margin = '0';
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Hide Tests';
    toggleButton.style.marginTop = '10px';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.backgroundColor = '#f0f0f0';
    toggleButton.style.border = '1px solid #ddd';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.cursor = 'pointer';
    
    testContainer.appendChild(testHeader);
    testContainer.appendChild(testList);
    testContainer.appendChild(toggleButton);
    
    document.body.appendChild(testContainer);
    
    // Toggle test container visibility
    toggleButton.addEventListener('click', function() {
        const isVisible = testList.style.display !== 'none';
        testList.style.display = isVisible ? 'none' : 'block';
        toggleButton.textContent = isVisible ? 'Show Tests' : 'Hide Tests';
    });
    
    // Test result logger
    function logTest(name, status, message) {
        const testItem = document.createElement('li');
        testItem.style.padding = '5px 0';
        testItem.style.borderBottom = '1px solid #eee';
        
        const statusIndicator = document.createElement('span');
        statusIndicator.style.display = 'inline-block';
        statusIndicator.style.width = '10px';
        statusIndicator.style.height = '10px';
        statusIndicator.style.borderRadius = '50%';
        statusIndicator.style.marginRight = '10px';
        
        if (status === 'pass') {
            statusIndicator.style.backgroundColor = '#4CAF50';
            testItem.style.color = '#2E7D32';
        } else if (status === 'fail') {
            statusIndicator.style.backgroundColor = '#F44336';
            testItem.style.color = '#C62828';
        } else {
            statusIndicator.style.backgroundColor = '#FFC107';
            testItem.style.color = '#F57F17';
        }
        
        const testName = document.createElement('span');
        testName.textContent = name;
        testName.style.fontWeight = 'bold';
        
        const testMessage = document.createElement('div');
        testMessage.textContent = message || '';
        testMessage.style.fontSize = '12px';
        testMessage.style.marginTop = '3px';
        testMessage.style.marginLeft = '20px';
        
        testItem.appendChild(statusIndicator);
        testItem.appendChild(testName);
        if (message) {
            testItem.appendChild(testMessage);
        }
        
        testList.appendChild(testItem);
        
        console.log(`[TEST] ${name}: ${status.toUpperCase()} ${message ? '- ' + message : ''}`);
    }
    
    // Test hamburger menu functionality
    function testHamburgerMenu() {
        try {
            const hamburgerButton = document.querySelector('.hamburger-menu');
            
            if (!hamburgerButton) {
                logTest('Hamburger Button', 'fail', 'Button not found in DOM');
                return;
            }
            
            // Check if button is visible on mobile viewport
            const computedStyle = window.getComputedStyle(hamburgerButton);
            const isVisible = computedStyle.display !== 'none';
            
            if (!isVisible && window.innerWidth <= 768) {
                logTest('Hamburger Button Visibility', 'fail', 'Button should be visible on mobile viewport');
            } else {
                logTest('Hamburger Button Visibility', 'pass');
            }
            
            // Check if button has cursor pointer
            if (computedStyle.cursor !== 'pointer') {
                logTest('Hamburger Button Cursor', 'fail', `Cursor is ${computedStyle.cursor}, should be pointer`);
            } else {
                logTest('Hamburger Button Cursor', 'pass');
            }
            
            // Test click event
            hamburgerButton.click();
            
            // Check if mobile menu appears
            setTimeout(() => {
                const mobileMenu = document.querySelector('.mobile-menu');
                
                if (!mobileMenu) {
                    logTest('Mobile Menu Creation', 'fail', 'Menu not created after click');
                    return;
                }
                
                const menuStyle = window.getComputedStyle(mobileMenu);
                const isMenuVisible = menuStyle.display !== 'none' && menuStyle.transform !== 'translateX(100%)';
                
                if (!isMenuVisible) {
                    logTest('Mobile Menu Display', 'fail', 'Menu not visible after click');
                } else {
                    logTest('Mobile Menu Display', 'pass');
                }
                
                // Test close button
                const closeButton = mobileMenu.querySelector('.close-menu');
                
                if (!closeButton) {
                    logTest('Mobile Menu Close Button', 'fail', 'Close button not found');
                } else {
                    logTest('Mobile Menu Close Button', 'pass');
                    
                    // Test closing the menu
                    closeButton.click();
                    
                    setTimeout(() => {
                        const menuStyleAfterClose = window.getComputedStyle(mobileMenu);
                        const isMenuHidden = menuStyleAfterClose.transform === 'translateX(100%)';
                        
                        if (!isMenuHidden) {
                            logTest('Mobile Menu Close', 'fail', 'Menu not hidden after close button click');
                        } else {
                            logTest('Mobile Menu Close', 'pass');
                        }
                    }, 400);
                }
            }, 400);
        } catch (error) {
            logTest('Hamburger Menu Test', 'fail', error.message);
        }
    }
    
    // Test navigation links
    function testNavigationLinks() {
        try {
            const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
            
            if (navLinks.length === 0) {
                logTest('Navigation Links', 'fail', 'No navigation links found');
                return;
            }
            
            logTest('Navigation Links', 'pass', `Found ${navLinks.length} navigation links`);
            
            // Check for broken links
            let brokenLinks = 0;
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                
                if (!href || href === '#' || href === 'javascript:void(0)') {
                    brokenLinks++;
                    console.warn(`Potentially broken link: ${link.textContent} with href="${href}"`);
                }
            });
            
            if (brokenLinks > 0) {
                logTest('Navigation Link Integrity', 'fail', `Found ${brokenLinks} potentially broken links`);
            } else {
                logTest('Navigation Link Integrity', 'pass');
            }
        } catch (error) {
            logTest('Navigation Links Test', 'fail', error.message);
        }
    }
    
    // Test templates page functionality
    function testTemplatesPage() {
        try {
            // Check if we're on the templates page
            if (!window.location.pathname.includes('templates.html')) {
                logTest('Templates Page', 'info', 'Not on templates page, skipping test');
                return;
            }
            
            // Check for templates container
            const templatesContainer = document.querySelector('.templates-container') || document.getElementById('templates-grid');
            
            if (!templatesContainer) {
                logTest('Templates Container', 'fail', 'Templates container not found');
                return;
            }
            
            logTest('Templates Container', 'pass');
            
            // Check if templates are loading
            const loadingIndicator = document.getElementById('loading-indicator');
            
            if (loadingIndicator && loadingIndicator.style.display !== 'none') {
                logTest('Templates Loading', 'info', 'Templates are currently loading');
            }
            
            // Check for templates after a delay
            setTimeout(() => {
                const templateCards = templatesContainer.querySelectorAll('.template-card');
                
                if (templateCards.length === 0) {
                    logTest('Templates Loading', 'fail', 'No templates loaded after delay');
                } else {
                    logTest('Templates Loading', 'pass', `Loaded ${templateCards.length} templates`);
                    
                    // Check template card structure
                    const firstCard = templateCards[0];
                    const hasImage = !!firstCard.querySelector('.template-image img');
                    const hasTitle = !!firstCard.querySelector('.template-info h3');
                    const hasButton = !!firstCard.querySelector('.use-template-btn');
                    
                    if (!hasImage || !hasTitle || !hasButton) {
                        logTest('Template Card Structure', 'fail', `Missing elements: ${!hasImage ? 'image, ' : ''}${!hasTitle ? 'title, ' : ''}${!hasButton ? 'button' : ''}`);
                    } else {
                        logTest('Template Card Structure', 'pass');
                    }
                }
            }, 2000);
        } catch (error) {
            logTest('Templates Page Test', 'fail', error.message);
        }
    }
    
    // Test API client
    function testApiClient() {
        try {
            // Check if API client is available
            if (typeof ApiClient === 'undefined' && typeof getApiClient === 'undefined') {
                logTest('API Client', 'fail', 'API client not found');
                return;
            }
            
            const api = window.getApiClient ? getApiClient() : new ApiClient();
            
            if (!api) {
                logTest('API Client Instance', 'fail', 'Could not create API client instance');
                return;
            }
            
            logTest('API Client', 'pass');
            
            // Check for required methods
            const requiredMethods = ['login', 'register', 'getProposals', 'createProposal', 'getTemplates'];
            const missingMethods = requiredMethods.filter(method => typeof api[method] !== 'function');
            
            if (missingMethods.length > 0) {
                logTest('API Client Methods', 'fail', `Missing methods: ${missingMethods.join(', ')}`);
            } else {
                logTest('API Client Methods', 'pass');
            }
        } catch (error) {
            logTest('API Client Test', 'fail', error.message);
        }
    }
    
    // Run tests with slight delays to avoid overwhelming the browser
    setTimeout(testHamburgerMenu, 500);
    setTimeout(testNavigationLinks, 1000);
    setTimeout(testApiClient, 1500);
    setTimeout(testTemplatesPage, 2000);
});
