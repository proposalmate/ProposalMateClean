// Stripe payment and subscription handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Stripe payment script loaded');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = 'login.html?redirect=account';
        return;
    }
    
    // Elements
    const subscriptionStatus = document.getElementById('subscription-status');
    const subscriptionDetails = document.getElementById('subscription-details');
    const upgradeBtn = document.getElementById('upgrade-btn');
    const cancelBtn = document.getElementById('cancel-subscription-btn');
    const resumeBtn = document.getElementById('resume-subscription-btn');
    const updatePaymentBtn = document.getElementById('update-payment-btn');
    
    // Get subscription details
    async function getSubscriptionDetails() {
        try {
            console.log('Fetching subscription details');
            
            // Get the base URL dynamically
            const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? '' // Empty for local development
                : ''; // Empty for production too since we're using relative URLs
            
            const apiUrl = `${baseUrl}/api/v1/stripe/subscription`;
            console.log('API URL for subscription details:', apiUrl);
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'same-origin'
            });
            
            console.log('Subscription API response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                throw new Error(errorData.error || 'Failed to fetch subscription details');
            }
            
            const data = await response.json();
            console.log('Subscription details:', data);
            
            if (data.success && data.data) {
                updateSubscriptionUI(data.data);
            } else {
                console.error('Invalid subscription data format:', data);
                throw new Error('Invalid subscription data format');
            }
        } catch (error) {
            console.error('Error fetching subscription details:', error);
            showNotification('Failed to load subscription details. Please try again.', 'error');
            
            // Show default "no subscription" state
            if (subscriptionStatus && subscriptionDetails) {
                updateSubscriptionUI({
                    status: 'none',
                    trialEndDate: null,
                    currentPeriodEnd: null,
                    cancelAtPeriodEnd: false
                });
            }
        }
    }
    
    // Update subscription UI
    function updateSubscriptionUI(subscription) {
        if (!subscriptionStatus || !subscriptionDetails) {
            console.warn('Subscription UI elements not found');
            return;
        }
        
        // Update status
        let statusText = '';
        let statusClass = '';
        
        switch (subscription.status) {
            case 'trialing':
                statusText = 'Free Trial';
                statusClass = 'status-trial';
                break;
            case 'active':
                statusText = 'Active Subscription';
                statusClass = 'status-active';
                break;
            case 'past_due':
                statusText = 'Payment Past Due';
                statusClass = 'status-warning';
                break;
            case 'canceled':
                statusText = 'Canceled';
                statusClass = 'status-canceled';
                break;
            case 'none':
                statusText = 'No Subscription';
                statusClass = 'status-none';
                break;
            default:
                statusText = subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
                statusClass = 'status-default';
        }
        
        subscriptionStatus.textContent = statusText;
        subscriptionStatus.className = `subscription-status ${statusClass}`;
        
        // Update details
        let detailsHtml = '';
        
        if (subscription.status === 'trialing') {
            const trialEnd = new Date(subscription.trialEndDate);
            const daysLeft = Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24));
            
            detailsHtml = `
                <p>Your free trial ends on ${trialEnd.toLocaleDateString()}.</p>
                <p>${daysLeft > 0 ? `${daysLeft} days remaining.` : 'Your trial ends today.'}</p>
                <p>Upgrade now to continue using all features after your trial.</p>
            `;
            
            // Show upgrade button
            if (upgradeBtn) {
                upgradeBtn.style.display = 'block';
            }
            
            // Hide cancel/resume buttons
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (resumeBtn) resumeBtn.style.display = 'none';
            
        } else if (subscription.status === 'active') {
            const periodEnd = new Date(subscription.currentPeriodEnd);
            
            detailsHtml = `
                <p>Your subscription is active.</p>
                <p>Next billing date: ${periodEnd.toLocaleDateString()}</p>
            `;
            
            // Hide upgrade button
            if (upgradeBtn) {
                upgradeBtn.style.display = 'none';
            }
            
            // Show cancel button if not already canceled
            if (cancelBtn && !subscription.cancelAtPeriodEnd) {
                cancelBtn.style.display = 'block';
                if (resumeBtn) resumeBtn.style.display = 'none';
            }
            
            // Show resume button if canceled at period end
            if (resumeBtn && subscription.cancelAtPeriodEnd) {
                resumeBtn.style.display = 'block';
                if (cancelBtn) cancelBtn.style.display = 'none';
                
                detailsHtml += `
                    <p class="warning-text">Your subscription will be canceled on ${periodEnd.toLocaleDateString()}.</p>
                `;
            }
            
        } else if (subscription.status === 'past_due') {
            detailsHtml = `
                <p class="warning-text">Your payment is past due. Please update your payment method to continue using all features.</p>
            `;
            
            // Show update payment button
            if (updatePaymentBtn) {
                updatePaymentBtn.style.display = 'block';
            }
            
        } else if (subscription.status === 'canceled') {
            detailsHtml = `
                <p>Your subscription has been canceled.</p>
                <p>You can resubscribe anytime to regain access to all features.</p>
            `;
            
            // Show upgrade button
            if (upgradeBtn) {
                upgradeBtn.style.display = 'block';
            }
            
            // Hide cancel/resume buttons
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (resumeBtn) resumeBtn.style.display = 'none';
            
        } else {
            detailsHtml = `
                <p>You don't have an active subscription.</p>
                <p>Upgrade now to access all premium features.</p>
            `;
            
            // Show upgrade button
            if (upgradeBtn) {
                upgradeBtn.style.display = 'block';
            }
            
            // Hide cancel/resume buttons
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (resumeBtn) resumeBtn.style.display = 'none';
        }
        
        subscriptionDetails.innerHTML = detailsHtml;
    }
    
    // Handle upgrade button click
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', async function() {
            try {
                console.log('Starting checkout session');
                
                // Get the base URL dynamically
                const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? '' // Empty for local development
                    : ''; // Empty for production too since we're using relative URLs
                
                const apiUrl = `${baseUrl}/api/v1/stripe/checkout-session`;
                console.log('API URL for checkout session:', apiUrl);
                
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'same-origin'
                });
                
                console.log('Checkout API response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API error response:', errorData);
                    throw new Error(errorData.error || 'Failed to create checkout session');
                }
                
                const data = await response.json();
                console.log('Checkout session created:', data);
                
                if (data.success && data.url) {
                    // Redirect to Stripe checkout
                    window.location.href = data.url;
                } else {
                    console.error('Invalid checkout data format:', data);
                    throw new Error('Invalid checkout data format');
                }
            } catch (error) {
                console.error('Error creating checkout session:', error);
                showNotification('Failed to start checkout process. Please try again.', 'error');
            }
        });
    }
    
    // Handle cancel subscription button click
    if (cancelBtn) {
        cancelBtn.addEventListener('click', async function() {
            if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.')) {
                return;
            }
            
            try {
                console.log('Canceling subscription');
                
                // Get the base URL dynamically
                const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? '' // Empty for local development
                    : ''; // Empty for production too since we're using relative URLs
                
                const apiUrl = `${baseUrl}/api/v1/stripe/subscription`;
                console.log('API URL for subscription cancellation:', apiUrl);
                
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'same-origin'
                });
                
                console.log('Cancellation API response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API error response:', errorData);
                    throw new Error(errorData.error || 'Failed to cancel subscription');
                }
                
                const data = await response.json();
                console.log('Subscription canceled:', data);
                
                showNotification('Your subscription has been canceled and will end at the current billing period.', 'success');
                
                // Refresh subscription details
                getSubscriptionDetails();
                
            } catch (error) {
                console.error('Error canceling subscription:', error);
                showNotification('Failed to cancel subscription. Please try again.', 'error');
            }
        });
    }
    
    // Handle resume subscription button click
    if (resumeBtn) {
        resumeBtn.addEventListener('click', async function() {
            try {
                console.log('Resuming subscription');
                
                // Get the base URL dynamically
                const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? '' // Empty for local development
                    : ''; // Empty for production too since we're using relative URLs
                
                const apiUrl = `${baseUrl}/api/v1/stripe/subscription/resume`;
                console.log('API URL for subscription resumption:', apiUrl);
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'same-origin'
                });
                
                console.log('Resumption API response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API error response:', errorData);
                    throw new Error(errorData.error || 'Failed to resume subscription');
                }
                
                const data = await response.json();
                console.log('Subscription resumed:', data);
                
                showNotification('Your subscription has been resumed successfully.', 'success');
                
                // Refresh subscription details
                getSubscriptionDetails();
                
            } catch (error) {
                console.error('Error resuming subscription:', error);
                showNotification('Failed to resume subscription. Please try again.', 'error');
            }
        });
    }
    
    // Handle update payment button click
    if (updatePaymentBtn) {
        updatePaymentBtn.addEventListener('click', async function() {
            try {
                console.log('Getting setup intent for payment update');
                
                // Get the base URL dynamically
                const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? '' // Empty for local development
                    : ''; // Empty for production too since we're using relative URLs
                
                const apiUrl = `${baseUrl}/api/v1/stripe/update-payment-method`;
                console.log('API URL for payment update:', apiUrl);
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'same-origin'
                });
                
                console.log('Payment update API response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API error response:', errorData);
                    throw new Error(errorData.error || 'Failed to create setup intent');
                }
                
                const data = await response.json();
                console.log('Setup intent created:', data);
                
                if (data.success && data.clientSecret) {
                    // Redirect to payment update page
                    window.location.href = `update-payment.html?setup_intent=${data.clientSecret}`;
                } else {
                    console.error('Invalid setup intent data format:', data);
                    throw new Error('Invalid setup intent data format');
                }
            } catch (error) {
                console.error('Error creating setup intent:', error);
                showNotification('Failed to start payment update process. Please try again.', 'error');
            }
        });
    }
    
    // Check for successful checkout
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
        console.log('Checkout session completed:', sessionId);
        showNotification('Thank you for your subscription! Your account has been upgraded.', 'success');
        
        // Remove session_id from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Show notification
    function showNotification(message, type = 'error') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            document.body.removeChild(existingNotification);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Initialize
    if (subscriptionStatus && subscriptionDetails) {
        getSubscriptionDetails();
    } else {
        console.warn('Subscription UI elements not found, skipping initialization');
    }
});
