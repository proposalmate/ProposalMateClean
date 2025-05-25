// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard script loaded');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Get user data from localStorage or fetch from API
    let userData = null;
    try {
        userData = JSON.parse(localStorage.getItem('user'));
        console.log('User data from localStorage:', userData);
    } catch (e) {
        console.log('Error parsing user data from localStorage:', e);
    }
    
    // Elements
    const userNameElement = document.getElementById('user-name');
    const proposalsList = document.getElementById('proposals-list');
    const createProposalBtn = document.getElementById('create-proposal-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Set user name from localStorage first (for immediate display)
    if (userData && userData.name && userNameElement) {
        console.log('Setting user name from localStorage:', userData.name);
        userNameElement.textContent = userData.name;
    } else if (userNameElement) {
        console.log('No user data in localStorage, setting placeholder');
        userNameElement.textContent = 'User'; // Changed from "John" to generic "User"
    }
    
    // Fetch current user data from API
    async function fetchUserData() {
        try {
            console.log('Fetching user data from API');
            
            // Get the base URL dynamically
            const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? '' // Empty for local development
                : ''; // Empty for production too since we're using relative URLs
            
            const apiUrl = `${baseUrl}/api/v1/auth/me`;
            console.log('API URL for user data:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });
            
            console.log('User data API response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('User data fetched from API:', data);
            
            if (data.success && data.data) {
                // Update localStorage with fresh data
                localStorage.setItem('user', JSON.stringify(data.data));
                console.log('Updated localStorage with fresh user data');
                
                // Update UI with user name
                if (userNameElement && data.data.name) {
                    console.log('Updating user name from API:', data.data.name);
                    userNameElement.textContent = data.data.name;
                } else {
                    console.warn('User name element not found or name missing in data');
                    // Fallback to email if name is missing
                    if (userNameElement && data.data.email) {
                        const username = data.data.email.split('@')[0];
                        userNameElement.textContent = username;
                        console.log('Using email username as fallback:', username);
                    }
                }
            } else {
                console.warn('API response missing success or data:', data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            
            // If API call fails but we have localStorage data, ensure it's displayed
            if (userData && userData.name && userNameElement) {
                console.log('Using localStorage data as fallback after API error');
                userNameElement.textContent = userData.name;
            }
        }
    }
    
    // Fetch user proposals
    async function fetchProposals() {
        try {
            console.log('Fetching user proposals');
            
            // Get the base URL dynamically
            const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? '' // Empty for local development
                : ''; // Empty for production too since we're using relative URLs
            
            const apiUrl = `${baseUrl}/api/v1/proposals`;
            console.log('API URL for proposals:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });
            
            console.log('Proposals API response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch proposals: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Proposals fetched:', data);
            
            if (data.success && data.data && proposalsList) {
                renderProposals(data.data);
            } else {
                console.warn('API response missing success or data:', data);
                if (proposalsList) {
                    proposalsList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-file-alt"></i>
                            <h3>No Proposals Found</h3>
                            <p>Create your first proposal to get started.</p>
                            <a href="create.html" class="btn btn-primary">Create Proposal</a>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Error fetching proposals:', error);
            if (proposalsList) {
                proposalsList.innerHTML = `
                    <div class="error-message">
                        <p>Failed to load proposals. Please try again later.</p>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            }
        }
    }
    
    // Render proposals to the list
    function renderProposals(proposals) {
        if (!proposalsList) {
            console.warn('Proposals list element not found');
            return;
        }
        
        if (!proposals || proposals.length === 0) {
            proposalsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No Proposals Yet</h3>
                    <p>Create your first proposal to get started.</p>
                    <a href="create.html" class="btn btn-primary">Create Proposal</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        proposals.forEach(proposal => {
            const date = new Date(proposal.createdAt).toLocaleDateString();
            const status = proposal.status || 'draft';
            
            html += `
                <div class="proposal-card">
                    <div class="proposal-header">
                        <h3>${proposal.title || 'Untitled Proposal'}</h3>
                        <span class="proposal-status ${status}">${status}</span>
                    </div>
                    <div class="proposal-details">
                        <p class="proposal-client">${proposal.clientName || 'No client specified'}</p>
                        <p class="proposal-date">Created: ${date}</p>
                    </div>
                    <div class="proposal-actions">
                        <a href="view-proposal.html?id=${proposal._id}" class="btn btn-outline btn-sm">View</a>
                        <a href="edit-proposal.html?id=${proposal._id}" class="btn btn-outline btn-sm">Edit</a>
                        <button class="btn btn-danger btn-sm" data-id="${proposal._id}" onclick="deleteProposal('${proposal._id}')">Delete</button>
                    </div>
                </div>
            `;
        });
        
        proposalsList.innerHTML = html;
    }
    
    // Delete proposal
    window.deleteProposal = async function(id) {
        if (!confirm('Are you sure you want to delete this proposal?')) {
            return;
        }
        
        try {
            const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? '' : '';
            
            const apiUrl = `${baseUrl}/api/v1/proposals/${id}`;
            
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to delete proposal: ${response.status}`);
            }
            
            // Refresh proposals list
            fetchProposals();
        } catch (error) {
            console.error('Error deleting proposal:', error);
            alert('Failed to delete proposal. Please try again.');
        }
    };
    
    // Logout function
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
    
    // Add event listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    } else {
        // Find logout link in sidebar if the dedicated button doesn't exist
        const logoutLink = document.querySelector('a[href="../index.html"].dashboard-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
    
    if (createProposalBtn) {
        createProposalBtn.addEventListener('click', function() {
            window.location.href = 'create.html';
        });
    }
    
    // Initialize - fetch user data first, then proposals
    fetchUserData().then(() => {
        fetchProposals();
    });
});
