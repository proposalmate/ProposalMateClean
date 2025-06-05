// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log("Dashboard JS is running");
  setupSidebarNavigation();
  loadUserData();
  loadProposals();
  setupActionButtons();
});

function setupSidebarNavigation() {
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const closeButton = document.querySelector(".close-sidebar");
  const sidebarLinks = document.querySelectorAll(".dashboard-link");

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
  }

  if (closeButton && sidebar) {
    closeButton.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  });
}

function loadUserData() {
  // Show loading state
  const nameElement = document.querySelector(".user-name");
  if (nameElement) {
    nameElement.textContent = "Loading...";
  }

  // Use the API client to get user data
  api.getCurrentUser()
    .then(data => {
      // Update user name in the header
      if (nameElement && data && data.name) {
        nameElement.textContent = data.name;
      }
      
      // Update welcome message
      const welcomeHeading = document.querySelector(".dashboard-content h1");
      if (welcomeHeading && data && data.name) {
        welcomeHeading.textContent = `Welcome, ${data.name.split(' ')[0]}!`;
      }
      
      // Update subscription info if available
      if (data.subscription) {
        updateSubscriptionInfo(data.subscription);
      } else {
        // Load subscription data separately if not included with user data
        loadSubscriptionData();
      }
    })
    .catch(err => {
      console.error("Failed to load user data:", err);
      // Handle authentication errors
      if (err.message && (err.message.includes('unauthorized') || err.message.includes('token'))) {
        // Redirect to login if authentication failed
        window.location.href = '/pages/login.html';
      }
    });
}

function loadSubscriptionData() {
  api.getSubscription()
    .then(data => {
      updateSubscriptionInfo(data);
    })
    .catch(err => {
      console.error("Failed to load subscription data:", err);
      // Show error in subscription card
      const subscriptionInfo = document.querySelector(".subscription-info");
      if (subscriptionInfo) {
        subscriptionInfo.innerHTML = `
          <p><strong>Status:</strong> <span class="status-error">Error loading subscription</span></p>
          <p>Please try refreshing the page.</p>
        `;
      }
    });
}

function updateSubscriptionInfo(subscription) {
  const subscriptionInfo = document.querySelector(".subscription-info");
  if (!subscriptionInfo) return;
  
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    const nextBillingDate = subscription.currentPeriodEnd 
      ? new Date(subscription.currentPeriodEnd).toLocaleDateString() 
      : 'Not available';
    
    subscriptionInfo.innerHTML = `
      <p><strong>Plan:</strong> Monthly (£7/month)</p>
      <p><strong>Status:</strong> <span class="status-active">${subscription.status === 'trialing' ? 'Trial' : 'Active'}</span></p>
      <p><strong>Next billing date:</strong> ${nextBillingDate}</p>
    `;
  } else {
    subscriptionInfo.innerHTML = `
      <p><strong>Plan:</strong> None</p>
      <p><strong>Status:</strong> <span class="status-inactive">${subscription.status || 'Inactive'}</span></p>
      <p><a href="#" class="subscribe-link">Subscribe now</a> to access all features.</p>
    `;
    
    // Add event listener to subscribe link
    const subscribeLink = subscriptionInfo.querySelector('.subscribe-link');
    if (subscribeLink) {
      subscribeLink.addEventListener('click', function(e) {
        e.preventDefault();
        initiateSubscription();
      });
    }
  }
}

function loadProposals() {
  // Show loading state
  const container = document.querySelector(".proposal-list");
  if (!container) return;
  
  container.innerHTML = '<div class="loading">Loading proposals...</div>';
  
  // Use the API client to get proposals
  api.getProposals()
    .then(data => {
      container.innerHTML = "";
      
      if (!data || data.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-file-alt empty-icon"></i>
            <p>No proposals yet.</p>
            <a href="/pages/create-proposal.html" class="btn btn-primary">Create Your First Proposal</a>
          </div>
        `;
        return;
      }
      
      // Update proposal stats
      updateProposalStats(data);
      
      // Display proposals
      data.forEach(proposal => {
        const div = document.createElement("div");
        div.classList.add("proposal-item");
        
        // Determine status class
        const statusClass = getStatusClass(proposal.status);
        
        div.innerHTML = `
          <div class="proposal-info">
            <div class="proposal-title">${proposal.title}</div>
            <div class="proposal-date">Created: ${new Date(proposal.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="proposal-status ${statusClass}">${proposal.status}</div>
          <div class="proposal-actions">
            <a href="/pages/view-proposal.html?id=${proposal._id}" class="btn-icon" title="View"><i class="fas fa-eye"></i></a>
            <a href="/pages/edit-proposal.html?id=${proposal._id}" class="btn-icon" title="Edit"><i class="fas fa-edit"></i></a>
            <a href="#" class="btn-icon delete-proposal" data-id="${proposal._id}" title="Delete"><i class="fas fa-trash"></i></a>
          </div>
        `;
        container.appendChild(div);
        
        // Add event listener for delete button
        const deleteButton = div.querySelector('.delete-proposal');
        deleteButton.addEventListener('click', function(e) {
          e.preventDefault();
          const proposalId = this.getAttribute('data-id');
          deleteProposal(proposalId, div);
        });
      });
    })
    .catch(err => {
      console.error("Failed to load proposals:", err);
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <p>Failed to load proposals. Please try again.</p>
          <button class="btn btn-secondary retry-button">Retry</button>
        </div>
      `;
      
      // Add event listener to retry button
      const retryButton = container.querySelector('.retry-button');
      if (retryButton) {
        retryButton.addEventListener('click', loadProposals);
      }
    });
}

function getStatusClass(status) {
  switch(status.toLowerCase()) {
    case 'draft': return 'status-draft';
    case 'sent': return 'status-sent';
    case 'viewed': return 'status-viewed';
    case 'accepted': return 'status-accepted';
    case 'rejected': return 'status-rejected';
    default: return 'status-draft';
  }
}

function updateProposalStats(proposals) {
  const totalProposals = proposals.length;
  const sentProposals = proposals.filter(p => p.status.toLowerCase() === 'sent').length;
  const viewedProposals = proposals.filter(p => p.status.toLowerCase() === 'viewed').length;
  const acceptedProposals = proposals.filter(p => p.status.toLowerCase() === 'accepted').length;
  
  // Update stats in the dashboard
  const statsElements = document.querySelectorAll('.stat-number');
  if (statsElements.length >= 4) {
    statsElements[0].textContent = totalProposals;
    statsElements[1].textContent = sentProposals;
    statsElements[2].textContent = viewedProposals;
    statsElements[3].textContent = acceptedProposals;
  }
}

function deleteProposal(proposalId, element) {
  if (confirm('Are you sure you want to delete this proposal?')) {
    // Show loading state
    element.classList.add('deleting');
    
    // Use the API client to delete the proposal
    api.deleteProposal(proposalId)
      .then(() => {
        // Remove the proposal from the UI with animation
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.height = '0';
          element.style.padding = '0';
          element.style.margin = '0';
          element.style.overflow = 'hidden';
          
          setTimeout(() => {
            element.remove();
            // Reload proposals to update stats
            loadProposals();
          }, 300);
        }, 300);
      })
      .catch(err => {
        console.error("Failed to delete proposal:", err);
        element.classList.remove('deleting');
        alert('Failed to delete proposal. Please try again.');
      });
  }
}

function setupActionButtons() {
  // Setup subscription management button
  const manageSubscriptionBtn = document.querySelector('.subscription-actions .btn');
  if (manageSubscriptionBtn) {
    manageSubscriptionBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/pages/subscription.html';
    });
  }
  
  // Setup quick action buttons
  const createProposalBtn = document.querySelector('.action-buttons .btn-primary');
  if (createProposalBtn) {
    createProposalBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/pages/create-proposal.html';
    });
  }
  
  const addClientBtn = document.querySelector('.action-buttons .btn-secondary');
  if (addClientBtn) {
    addClientBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/pages/add-client.html';
    });
  }
  
  // Setup logout functionality
  const logoutLink = document.querySelector('a[href="../index.html"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      api.logout()
        .then(() => {
          window.location.href = '../index.html';
        })
        .catch(err => {
          console.error("Logout error:", err);
          // Force logout even if API call fails
          api.clearToken();
          window.location.href = '../index.html';
        });
    });
  }
}

function initiateSubscription() {
  // Show loading state
  const subscriptionInfo = document.querySelector(".subscription-info");
  if (subscriptionInfo) {
    subscriptionInfo.innerHTML = '<p>Loading checkout...</p>';
  }
  
  // Use the API client to get checkout session
  api.getCheckoutSession()
    .then(data => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    })
    .catch(err => {
      console.error("Failed to initiate subscription:", err);
      if (subscriptionInfo) {
        subscriptionInfo.innerHTML = `
          <p><strong>Error:</strong> Failed to load checkout.</p>
          <p><a href="#" class="subscribe-link">Try again</a></p>
        `;
        
        // Re-add event listener
        const subscribeLink = subscriptionInfo.querySelector('.subscribe-link');
        if (subscribeLink) {
          subscribeLink.addEventListener('click', function(e) {
            e.preventDefault();
            initiateSubscription();
          });
        }
      }
    });
}
