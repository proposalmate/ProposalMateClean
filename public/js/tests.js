// Client-side end-to-end testing script
document.addEventListener('DOMContentLoaded', function() {
    // Only run tests if in test mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'true') {
        runEndToEndTests();
    }
});

async function runEndToEndTests() {
    console.log('Running end-to-end tests...');
    
    // Create test container
    const testContainer = document.createElement('div');
    testContainer.id = 'test-results';
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
    testContainer.innerHTML = '<h3>Test Results</h3>';
    document.body.appendChild(testContainer);
    
    // Test API connectivity
    await testApiConnectivity();
    
    // Test authentication flows
    await testAuthenticationFlows();
    
    // Test proposal management
    await testProposalManagement();
    
    // Test navigation and UI responsiveness
    await testNavigationAndUI();
    
    // Test subscription flows
    await testSubscriptionFlows();
    
    // Final summary
    logTestResult('All tests completed', 'See console for detailed results');
}

async function testApiConnectivity() {
    logTestResult('API Connectivity Test', 'Running...');
    
    try {
        // Test if API client exists
        if (typeof api === 'undefined') {
            throw new Error('API client not found');
        }
        
        // Test basic API methods exist
        const requiredMethods = [
            'login', 'register', 'getCurrentUser', 'getProposals', 
            'createProposal', 'getSubscription'
        ];
        
        const missingMethods = requiredMethods.filter(method => typeof api[method] !== 'function');
        
        if (missingMethods.length > 0) {
            throw new Error(`Missing API methods: ${missingMethods.join(', ')}`);
        }
        
        logTestResult('API Connectivity Test', 'PASSED - API client properly initialized');
    } catch (error) {
        logTestResult('API Connectivity Test', `FAILED - ${error.message}`, true);
        console.error('API Connectivity Test Error:', error);
    }
}

async function testAuthenticationFlows() {
    logTestResult('Authentication Flows Test', 'Running...');
    
    try {
        // Test token handling
        const token = localStorage.getItem('token');
        if (token) {
            // Test current user endpoint
            try {
                const user = await api.getCurrentUser();
                if (user && user.name) {
                    logTestResult('Current User Test', `PASSED - Retrieved user: ${user.name}`);
                } else {
                    throw new Error('User data incomplete');
                }
            } catch (error) {
                logTestResult('Current User Test', `FAILED - ${error.message}`, true);
            }
        } else {
            logTestResult('Token Test', 'No token found - login/register functionality should be available');
            
            // Check if login form exists and is properly connected
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                logTestResult('Login Form Test', 'PASSED - Login form found');
                
                // Check if form has submit handler
                const hasSubmitHandler = loginForm.onsubmit || 
                    (loginForm.getAttribute('onsubmit') !== null) ||
                    loginForm._events;
                
                if (hasSubmitHandler) {
                    logTestResult('Login Handler Test', 'PASSED - Submit handler attached');
                } else {
                    logTestResult('Login Handler Test', 'WARNING - No submit handler detected', true);
                }
            }
            
            // Check if signup form exists and is properly connected
            const signupForm = document.getElementById('signup-form');
            if (signupForm) {
                logTestResult('Signup Form Test', 'PASSED - Signup form found');
                
                // Check if form has submit handler
                const hasSubmitHandler = signupForm.onsubmit || 
                    (signupForm.getAttribute('onsubmit') !== null) ||
                    signupForm._events;
                
                if (hasSubmitHandler) {
                    logTestResult('Signup Handler Test', 'PASSED - Submit handler attached');
                } else {
                    logTestResult('Signup Handler Test', 'WARNING - No submit handler detected', true);
                }
            }
        }
    } catch (error) {
        logTestResult('Authentication Flows Test', `FAILED - ${error.message}`, true);
        console.error('Authentication Test Error:', error);
    }
}

async function testProposalManagement() {
    logTestResult('Proposal Management Test', 'Running...');
    
    try {
        // Check if we're on a proposal-related page
        const onProposalPage = window.location.pathname.includes('proposal');
        
        if (onProposalPage) {
            // Test specific proposal page functionality
            if (window.location.pathname.includes('create-proposal')) {
                testCreateProposalPage();
            } else if (window.location.pathname.includes('view-proposal')) {
                testViewProposalPage();
            } else if (window.location.pathname.includes('edit-proposal')) {
                testEditProposalPage();
            }
        } else if (window.location.pathname.includes('dashboard')) {
            // Test proposal listing on dashboard
            testProposalListing();
        } else {
            logTestResult('Proposal Management Test', 'Not on a proposal-related page, skipping tests');
        }
    } catch (error) {
        logTestResult('Proposal Management Test', `FAILED - ${error.message}`, true);
        console.error('Proposal Management Test Error:', error);
    }
}

function testCreateProposalPage() {
    const proposalForm = document.getElementById('proposal-form');
    if (proposalForm) {
        logTestResult('Create Proposal Form Test', 'PASSED - Form found');
        
        // Check if form has submit handler
        const hasSubmitHandler = proposalForm.onsubmit || 
            (proposalForm.getAttribute('onsubmit') !== null) ||
            proposalForm._events;
        
        if (hasSubmitHandler) {
            logTestResult('Create Proposal Handler Test', 'PASSED - Submit handler attached');
        } else {
            logTestResult('Create Proposal Handler Test', 'WARNING - No submit handler detected', true);
        }
        
        // Check for client selection
        const clientSelect = document.getElementById('client-select');
        if (clientSelect) {
            logTestResult('Client Selection Test', 'PASSED - Client dropdown found');
        } else {
            logTestResult('Client Selection Test', 'FAILED - Client dropdown not found', true);
        }
        
        // Check for template selection
        const templateSelect = document.getElementById('template-select');
        if (templateSelect) {
            logTestResult('Template Selection Test', 'PASSED - Template selection found');
        } else {
            logTestResult('Template Selection Test', 'FAILED - Template selection not found', true);
        }
    } else {
        logTestResult('Create Proposal Form Test', 'FAILED - Form not found', true);
    }
}

function testViewProposalPage() {
    const proposalContainer = document.querySelector('.proposal-container');
    if (proposalContainer) {
        logTestResult('View Proposal Test', 'PASSED - Proposal container found');
        
        // Check if proposal data is loaded
        const proposalContent = proposalContainer.querySelector('.proposal-content');
        if (proposalContent) {
            logTestResult('Proposal Content Test', 'PASSED - Proposal content found');
        } else {
            const loading = proposalContainer.querySelector('.loading');
            if (loading) {
                logTestResult('Proposal Content Test', 'Loading state detected - proposal may still be loading');
            } else {
                logTestResult('Proposal Content Test', 'FAILED - No content or loading state found', true);
            }
        }
        
        // Check for action buttons
        const actionButtons = document.querySelectorAll('.proposal-actions .btn, .proposal-actions .btn-icon');
        if (actionButtons.length > 0) {
            logTestResult('Proposal Actions Test', `PASSED - ${actionButtons.length} action buttons found`);
        } else {
            logTestResult('Proposal Actions Test', 'WARNING - No action buttons found', true);
        }
    } else {
        logTestResult('View Proposal Test', 'FAILED - Proposal container not found', true);
    }
}

function testEditProposalPage() {
    const proposalForm = document.getElementById('proposal-form');
    if (proposalForm) {
        logTestResult('Edit Proposal Form Test', 'PASSED - Form found');
        
        // Check if form has submit handler
        const hasSubmitHandler = proposalForm.onsubmit || 
            (proposalForm.getAttribute('onsubmit') !== null) ||
            proposalForm._events;
        
        if (hasSubmitHandler) {
            logTestResult('Edit Proposal Handler Test', 'PASSED - Submit handler attached');
        } else {
            logTestResult('Edit Proposal Handler Test', 'WARNING - No submit handler detected', true);
        }
        
        // Check if form fields are populated
        const titleField = document.getElementById('proposal-title');
        if (titleField && titleField.value) {
            logTestResult('Proposal Data Loading Test', 'PASSED - Form fields populated');
        } else {
            logTestResult('Proposal Data Loading Test', 'WARNING - Form fields may not be populated', true);
        }
    } else {
        logTestResult('Edit Proposal Form Test', 'FAILED - Form not found', true);
    }
}

function testProposalListing() {
    const proposalList = document.querySelector('.proposal-list');
    if (proposalList) {
        logTestResult('Proposal Listing Test', 'PASSED - Proposal list found');
        
        // Check if proposals are loaded
        const proposals = proposalList.querySelectorAll('.proposal-item');
        if (proposals.length > 0) {
            logTestResult('Proposal Items Test', `PASSED - ${proposals.length} proposals found`);
            
            // Check if proposal items have action buttons
            const firstProposal = proposals[0];
            const actionButtons = firstProposal.querySelectorAll('.proposal-actions .btn-icon');
            if (actionButtons.length > 0) {
                logTestResult('Proposal Item Actions Test', `PASSED - ${actionButtons.length} action buttons found`);
            } else {
                logTestResult('Proposal Item Actions Test', 'WARNING - No action buttons found', true);
            }
        } else {
            const emptyState = proposalList.querySelector('.empty-state');
            if (emptyState) {
                logTestResult('Proposal Items Test', 'PASSED - Empty state displayed (no proposals)');
            } else {
                const loading = proposalList.querySelector('.loading');
                if (loading) {
                    logTestResult('Proposal Items Test', 'Loading state detected - proposals may still be loading');
                } else {
                    logTestResult('Proposal Items Test', 'FAILED - No proposals, empty state, or loading indicator found', true);
                }
            }
        }
    } else {
        logTestResult('Proposal Listing Test', 'Not on dashboard or proposal list not found');
    }
}

async function testNavigationAndUI() {
    logTestResult('Navigation and UI Test', 'Running...');
    
    try {
        // Test responsive navigation
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            logTestResult('Mobile Navigation Test', 'PASSED - Mobile toggle found');
            
            // Check if it has click handler
            const hasClickHandler = mobileToggle.onclick || 
                (mobileToggle.getAttribute('onclick') !== null) ||
                mobileToggle._events;
            
            if (hasClickHandler) {
                logTestResult('Mobile Toggle Handler Test', 'PASSED - Click handler attached');
            } else {
                logTestResult('Mobile Toggle Handler Test', 'WARNING - No click handler detected', true);
            }
        }
        
        // Test sidebar navigation (if on dashboard)
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            logTestResult('Sidebar Navigation Test', 'PASSED - Sidebar found');
            
            // Check sidebar links
            const sidebarLinks = sidebar.querySelectorAll('a');
            if (sidebarLinks.length > 0) {
                logTestResult('Sidebar Links Test', `PASSED - ${sidebarLinks.length} links found`);
                
                // Check if at least one link has active class
                const activeLinks = sidebar.querySelectorAll('a.active');
                if (activeLinks.length > 0) {
                    logTestResult('Active Link Test', 'PASSED - Active link found');
                } else {
                    logTestResult('Active Link Test', 'WARNING - No active link found', true);
                }
            } else {
                logTestResult('Sidebar Links Test', 'FAILED - No links found', true);
            }
        }
        
        // Test user menu (if on dashboard)
        const userMenu = document.querySelector('#user-menu');
        if (userMenu) {
            logTestResult('User Menu Test', 'PASSED - User menu found');
            
            // Check if user name is loaded
            const userName = userMenu.querySelector('.user-name');
            if (userName && userName.textContent && userName.textContent !== 'Loading...') {
                logTestResult('User Name Test', `PASSED - User name loaded: ${userName.textContent}`);
            } else {
                logTestResult('User Name Test', 'WARNING - User name may not be loaded', true);
            }
        }
    } catch (error) {
        logTestResult('Navigation and UI Test', `FAILED - ${error.message}`, true);
        console.error('Navigation and UI Test Error:', error);
    }
}

async function testSubscriptionFlows() {
    logTestResult('Subscription Flows Test', 'Running...');
    
    try {
        // Check if we're on subscription-related page
        const onSubscriptionPage = window.location.pathname.includes('subscription');
        
        if (onSubscriptionPage) {
            // Test subscription page specific functionality
            testSubscriptionPage();
        } else if (window.location.pathname.includes('dashboard')) {
            // Test subscription info on dashboard
            testDashboardSubscription();
        } else {
            logTestResult('Subscription Flows Test', 'Not on a subscription-related page, skipping tests');
        }
    } catch (error) {
        logTestResult('Subscription Flows Test', `FAILED - ${error.message}`, true);
        console.error('Subscription Flows Test Error:', error);
    }
}

function testSubscriptionPage() {
    const subscriptionContainer = document.querySelector('.subscription-container');
    if (subscriptionContainer) {
        logTestResult('Subscription Page Test', 'PASSED - Subscription container found');
        
        // Check for subscription details
        const subscriptionDetails = subscriptionContainer.querySelector('.subscription-details');
        if (subscriptionDetails) {
            logTestResult('Subscription Details Test', 'PASSED - Subscription details found');
        } else {
            logTestResult('Subscription Details Test', 'WARNING - Subscription details not found', true);
        }
        
        // Check for action buttons
        const actionButtons = subscriptionContainer.querySelectorAll('.btn');
        if (actionButtons.length > 0) {
            logTestResult('Subscription Actions Test', `PASSED - ${actionButtons.length} action buttons found`);
        } else {
            logTestResult('Subscription Actions Test', 'WARNING - No action buttons found', true);
        }
    } else {
        logTestResult('Subscription Page Test', 'FAILED - Subscription container not found', true);
    }
}

function testDashboardSubscription() {
    const subscriptionCard = document.querySelector('.subscription-status');
    if (subscriptionCard) {
        logTestResult('Dashboard Subscription Test', 'PASSED - Subscription card found');
        
        // Check if subscription info is loaded
        const subscriptionInfo = subscriptionCard.querySelector('.subscription-info');
        if (subscriptionInfo) {
            logTestResult('Subscription Info Test', 'PASSED - Subscription info found');
            
            // Check for subscription status
            const statusElement = subscriptionInfo.querySelector('.status-active, .status-inactive, .status-trialing');
            if (statusElement) {
                logTestResult('Subscription Status Test', `PASSED - Status found: ${statusElement.textContent}`);
            } else {
                logTestResult('Subscription Status Test', 'WARNING - Status element not found', true);
            }
        } else {
            logTestResult('Subscription Info Test', 'FAILED - Subscription info not found', true);
        }
    } else {
        logTestResult('Dashboard Subscription Test', 'Subscription card not found on dashboard');
    }
}

function logTestResult(test, result, isError = false) {
    const testContainer = document.getElementById('test-results');
    if (!testContainer) return;
    
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
