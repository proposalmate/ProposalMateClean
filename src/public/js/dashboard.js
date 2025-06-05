// Dashboard main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Fetch user data and update UI
    fetchUserData();
    
    // Fetch proposal statistics
    fetchProposalStats();
    
    // Fetch recent proposals
    fetchRecentProposals();
    
    // Setup user menu dropdown
    setupUserMenu();
});

// Fetch user data from API
async function fetchUserData() {
    try {
        const response = await fetch('/api/v1/auth/me', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Update user name in the UI
            document.getElementById('user-name').textContent = data.data.name;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Fetch proposal statistics
async function fetchProposalStats() {
    try {
        const response = await fetch('/api/v1/proposals', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch proposals');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Update total proposals count
            document.getElementById('total-proposals').textContent = data.count;
            
            // Calculate accepted and pending proposals
            const accepted = data.data.filter(proposal => proposal.status === 'accepted').length;
            const pending = data.data.filter(proposal => proposal.status === 'draft' || proposal.status === 'sent').length;
            
            document.getElementById('accepted-proposals').textContent = accepted;
            document.getElementById('pending-proposals').textContent = pending;
        }
    } catch (error) {
        console.error('Error fetching proposal stats:', error);
    }
}

// Fetch recent proposals
async function fetchRecentProposals() {
    try {
        const response = await fetch('/api/v1/proposals', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch proposals');
        }
        
        const data = await response.json();
        
        if (data.success && data.count > 0) {
            // Get the recent proposals list element
            const recentProposalsList = document.getElementById('recent-proposals-list');
            
            // Clear any existing content
            recentProposalsList.innerHTML = '';
            
            // Get the 5 most recent proposals
            const recentProposals = data.data
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5);
            
            // Create HTML for each proposal
            recentProposals.forEach(proposal => {
                const proposalElement = document.createElement('div');
                proposalElement.className = 'proposal-item';
                
                const statusClass = getStatusClass(proposal.status);
                
                proposalElement.innerHTML = `
                    <div class="proposal-info">
                        <h4>${proposal.title}</h4>
                        <p>Client: ${proposal.client.name}</p>
                        <p>Last updated: ${new Date(proposal.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div class="proposal-status">
                        <span class="status-badge ${statusClass}">${proposal.status}</span>
                    </div>
                    <div class="proposal-actions">
                        <a href="/dashboard/proposals?id=${proposal._id}" class="btn btn-secondary">View</a>
                    </div>
                `;
                
                recentProposalsList.appendChild(proposalElement);
            });
        }
    } catch (error) {
        console.error('Error fetching recent proposals:', error);
    }
}

// Fetch subscription status
async function fetchSubscriptionStatus() {
    try {
        const response = await fetch('/api/v1/stripe/subscription', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch subscription status');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Update subscription status in the UI
            const statusElement = document.getElementById('subscription-status');
            const status = data.data.status;
            
            statusElement.textContent = capitalizeFirstLetter(status);
            
            // Add appropriate class based on status
            if (status === 'active' || status === 'trialing') {
                statusElement.className = 'status-badge status-active';
            } else if (status === 'past_due') {
                statusElement.className = 'status-badge status-warning';
            } else {
                statusElement.className = 'status-badge status-inactive';
            }
        }
    } catch (error) {
        console.error('Error fetching subscription status:', error);
    }
}

// Setup user menu dropdown
function setupUserMenu() {
    const userAvatar = document.querySelector('.user-avatar');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('active');
        });
    }
}

// Helper function to get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Helper function to get status class
function getStatusClass(status) {
    switch (status) {
        case 'draft':
            return 'status-draft';
        case 'sent':
            return 'status-sent';
        case 'viewed':
            return 'status-viewed';
        case 'accepted':
            return 'status-accepted';
        case 'rejected':
            return 'status-rejected';
        default:
            return '';
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
