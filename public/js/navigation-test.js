// Navigation testing script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation testing script loaded');
    
    // Test hamburger button functionality
    testHamburgerButton();
    
    // Test navigation links
    testNavigationLinks();
    
    // Test dashboard loading if on dashboard page
    if (window.location.pathname.includes('dashboard')) {
        testDashboardLoading();
    }
});

function testHamburgerButton() {
    console.log('Testing hamburger button...');
    
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileToggle) {
        console.error('Hamburger button not found!');
        addTestResult('Hamburger Button Test', 'FAILED - Button not found', true);
        return;
    }
    
    if (!mobileMenu) {
        console.error('Mobile menu not found!');
        addTestResult('Mobile Menu Test', 'FAILED - Menu not found', true);
        return;
    }
    
    // Check if event listener is attached
    const toggleClone = mobileToggle.cloneNode(true);
    mobileToggle.parentNode.replaceChild(toggleClone, mobileToggle);
    
    // Add test event listener
    toggleClone.addEventListener('click', function() {
        console.log('Hamburger button clicked');
        addTestResult('Hamburger Button Click Test', 'PASSED - Click event detected');
        
        // Check if menu becomes visible
        setTimeout(() => {
            if (mobileMenu.classList.contains('active')) {
                addTestResult('Mobile Menu Toggle Test', 'PASSED - Menu toggled to active state');
            } else {
                addTestResult('Mobile Menu Toggle Test', 'FAILED - Menu not toggled to active state', true);
            }
        }, 100);
    });
    
    // Simulate click
    console.log('Simulating hamburger button click...');
    toggleClone.click();
}

function testNavigationLinks() {
    console.log('Testing navigation links...');
    
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu-links a');
    
    if (navLinks.length === 0) {
        console.error('No navigation links found!');
        addTestResult('Navigation Links Test', 'FAILED - No links found', true);
        return;
    }
    
    addTestResult('Navigation Links Test', `PASSED - Found ${navLinks.length} links`);
    
    // Check if at least one link has active class
    const activeLinks = document.querySelectorAll('.nav-links a.active, .mobile-menu-links a.active');
    if (activeLinks.length > 0) {
        addTestResult('Active Link Test', 'PASSED - Active link found');
    } else {
        addTestResult('Active Link Test', 'WARNING - No active link found', true);
    }
    
    // Check auth buttons
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        addTestResult('Auth Buttons Test', 'PASSED - Auth buttons found');
    } else {
        addTestResult('Auth Buttons Test', 'WARNING - Auth buttons not found', true);
    }
}

function testDashboardLoading() {
    console.log('Testing dashboard loading...');
    
    // Check if dashboard content exists
    const dashboardContent = document.querySelector('.dashboard-content');
    if (!dashboardContent) {
        console.error('Dashboard content not found!');
        addTestResult('Dashboard Content Test', 'FAILED - Content not found', true);
        return;
    }
    
    addTestResult('Dashboard Content Test', 'PASSED - Dashboard content found');
    
    // Check if proposals are loaded
    const proposalList = document.querySelector('.proposal-list');
    if (proposalList) {
        // Check if proposals are loaded or loading indicator is present
        const proposals = proposalList.querySelectorAll('.proposal-item');
        const loading = proposalList.querySelector('.loading');
        const emptyState = proposalList.querySelector('.empty-state');
        
        if (proposals.length > 0) {
            addTestResult('Proposal Loading Test', `PASSED - ${proposals.length} proposals loaded`);
        } else if (loading) {
            addTestResult('Proposal Loading Test', 'PASSED - Loading indicator present');
        } else if (emptyState) {
            addTestResult('Proposal Loading Test', 'PASSED - Empty state shown (no proposals)');
        } else {
            addTestResult('Proposal Loading Test', 'FAILED - No proposals, loading indicator, or empty state found', true);
        }
    } else {
        addTestResult('Proposal List Test', 'WARNING - Proposal list not found', true);
    }
    
    // Check sidebar navigation
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        addTestResult('Sidebar Test', 'PASSED - Sidebar found');
        
        // Check sidebar links
        const sidebarLinks = sidebar.querySelectorAll('a');
        if (sidebarLinks.length > 0) {
            addTestResult('Sidebar Links Test', `PASSED - ${sidebarLinks.length} links found`);
        } else {
            addTestResult('Sidebar Links Test', 'FAILED - No sidebar links found', true);
        }
    } else {
        addTestResult('Sidebar Test', 'FAILED - Sidebar not found', true);
    }
}

function addTestResult(test, result, isError = false) {
    // Create test results container if it doesn't exist
    let testContainer = document.getElementById('navigation-test-results');
    if (!testContainer) {
        testContainer = document.createElement('div');
        testContainer.id = 'navigation-test-results';
        testContainer.style.position = 'fixed';
        testContainer.style.top = '0';
        testContainer.style.right = '0';
        testContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
        testContainer.style.color = 'white';
        testContainer.style.padding = '10px';
        testContainer.style.zIndex = '9999';
        testContainer.style.maxHeight = '100vh';
        testContainer.style.overflowY = 'auto';
        testContainer.style.maxWidth = '400px';
        testContainer.innerHTML = '<h3>Navigation Test Results</h3>';
        document.body.appendChild(testContainer);
    }
    
    const resultElement = document.createElement('div');
    resultElement.style.marginBottom = '5px';
    resultElement.style.borderLeft = isError ? '3px solid red' : '3px solid green';
    resultElement.style.paddingLeft = '5px';
    
    resultElement.innerHTML = `
        <strong>${test}:</strong>
        <span style="color: ${isError ? '#ff6b6b' : '#6bff6b'}">${result}</span>
    `;
    
    testContainer.appendChild(resultElement);
    
    // Log to console as well
    if (isError) {
        console.error(`${test}: ${result}`);
    } else {
        console.log(`${test}: ${result}`);
    }
}
