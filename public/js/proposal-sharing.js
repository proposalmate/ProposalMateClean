// Proposal sharing workflow functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the view-proposal page
  const isViewProposalPage = window.location.pathname.includes('view-proposal.html');
  const isEditProposalPage = window.location.pathname.includes('edit-proposal.html');
  
  if (isViewProposalPage) {
    setupViewProposalPage();
  } else if (isEditProposalPage) {
    setupEditProposalPage();
  }
  
  // Setup sharing buttons on dashboard if they exist
  setupSharingButtons();
});

// Setup view proposal page functionality
function setupViewProposalPage() {
  // Get proposal ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const proposalId = urlParams.get('id');
  
  if (!proposalId) {
    showError('No proposal ID provided');
    return;
  }
  
  // Check authentication
  if (!window.requireAuth()) return;
  
  // Load proposal data
  loadProposalData(proposalId);
  
  // Setup sharing options
  setupSharingOptions(proposalId);
}

// Setup edit proposal page functionality
function setupEditProposalPage() {
  // Get proposal ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const proposalId = urlParams.get('id');
  
  if (!proposalId) {
    showError('No proposal ID provided');
    return;
  }
  
  // Check authentication
  if (!window.requireAuth()) return;
  
  // Load proposal data for editing
  loadProposalDataForEdit(proposalId);
}

// Load proposal data
function loadProposalData(proposalId) {
  const proposalContent = document.getElementById('proposal-content');
  const loadingIndicator = document.getElementById('loading-indicator');
  
  if (!proposalContent) return;
  
  // Show loading indicator
  if (loadingIndicator) loadingIndicator.style.display = 'block';
  
  // Fetch proposal data
  window.ProposalMateAPI.proposals.getById(proposalId)
    .then(response => {
      if (!response || !response.data) {
        throw new Error('Failed to load proposal data');
      }
      
      const proposal = response.data;
      
      // Update page title
      document.title = `${proposal.title} - ProposalMate`;
      
      // Update proposal content
      renderProposal(proposal, proposalContent);
      
      // Hide loading indicator
      if (loadingIndicator) loadingIndicator.style.display = 'none';
    })
    .catch(error => {
      console.error('Error loading proposal:', error);
      showError('Failed to load proposal. Please try again later.');
      
      // Hide loading indicator
      if (loadingIndicator) loadingIndicator.style.display = 'none';
    });
}

// Load proposal data for editing
function loadProposalDataForEdit(proposalId) {
  const form = document.getElementById('edit-proposal-form');
  const loadingIndicator = document.getElementById('loading-indicator');
  
  if (!form) return;
  
  // Show loading indicator
  if (loadingIndicator) loadingIndicator.style.display = 'block';
  
  // Fetch proposal data
  window.ProposalMateAPI.proposals.getById(proposalId)
    .then(response => {
      if (!response || !response.data) {
        throw new Error('Failed to load proposal data');
      }
      
      const proposal = response.data;
      
      // Update page title
      document.title = `Edit: ${proposal.title} - ProposalMate`;
      
      // Populate form fields
      populateEditForm(proposal, form);
      
      // Hide loading indicator
      if (loadingIndicator) loadingIndicator.style.display = 'none';
    })
    .catch(error => {
      console.error('Error loading proposal for edit:', error);
      showError('Failed to load proposal. Please try again later.');
      
      // Hide loading indicator
      if (loadingIndicator) loadingIndicator.style.display = 'none';
    });
}

// Render proposal content
function renderProposal(proposal, container) {
  // Get template data if available
  const templateType = proposal.template || 'default';
  const template = window.WeddingTemplates ? window.WeddingTemplates[templateType] : null;
  
  let html = '';
  
  // Proposal header
  html += `
    <div class="proposal-header">
      <h1>${proposal.title}</h1>
      <div class="proposal-meta">
        <p>Created: ${new Date(proposal.createdAt).toLocaleDateString()}</p>
        <p>Status: <span class="status-badge status-${proposal.status || 'draft'}">${proposal.status || 'Draft'}</span></p>
      </div>
    </div>
  `;
  
  // Client information
  if (proposal.client) {
    html += `
      <div class="proposal-section">
        <h2>Client Information</h2>
        <div class="client-info">
          <p><strong>Name:</strong> ${proposal.client.name || proposal.clientName || 'N/A'}</p>
          <p><strong>Email:</strong> ${proposal.client.email || 'N/A'}</p>
          ${proposal.client.company ? `<p><strong>Company:</strong> ${proposal.client.company}</p>` : ''}
          ${proposal.client.phone ? `<p><strong>Phone:</strong> ${proposal.client.phone}</p>` : ''}
        </div>
      </div>
    `;
  }
  
  // If we have template data, use it to structure the proposal
  if (template && template.sections) {
    template.sections.forEach(section => {
      html += `<div class="proposal-section">
        <h2>${section.title}</h2>`;
        
      // Check if we have corresponding content in the proposal
      const sectionKey = section.title.toLowerCase().replace(/\s+/g, '_');
      const sectionContent = proposal[sectionKey] || section.content;
      
      if (typeof sectionContent === 'string') {
        // Simple text content
        html += `<div class="section-content">${sectionContent.replace(/\n/g, '<br>')}</div>`;
      } else if (Array.isArray(sectionContent)) {
        // Complex content (packages, menus, etc.)
        if (sectionContent[0] && sectionContent[0].name && sectionContent[0].price) {
          // Packages or pricing
          html += `<div class="packages-grid">`;
          sectionContent.forEach(package => {
            html += `
              <div class="package-card">
                <h3>${package.name}</h3>
                <div class="package-price">${package.price}</div>
                <ul class="package-features">`;
            
            if (package.features) {
              package.features.forEach(feature => {
                html += `<li>${feature}</li>`;
              });
            } else if (package.items) {
              package.items.forEach(item => {
                html += `<li>${item}</li>`;
              });
            }
            
            html += `</ul>
              </div>`;
          });
          html += `</div>`;
        } else if (sectionContent[0] && sectionContent[0].name && sectionContent[0].description) {
          // Service styles or spaces
          html += `<div class="services-list">`;
          sectionContent.forEach(service => {
            html += `
              <div class="service-item">
                <h3>${service.name}</h3>`;
            
            if (service.capacity) {
              html += `<p class="service-capacity">${service.capacity}</p>`;
            }
            
            html += `<p>${service.description}</p>
              </div>`;
          });
          html += `</div>`;
        }
      }
      
      html += `</div>`;
    });
  } else {
    // If no template, just show the content we have
    if (proposal.content) {
      html += `
        <div class="proposal-section">
          <h2>Proposal Details</h2>
          <div class="section-content">${proposal.content}</div>
        </div>
      `;
    }
    
    if (proposal.projectDetails && proposal.projectDetails.description) {
      html += `
        <div class="proposal-section">
          <h2>Project Details</h2>
          <div class="section-content">${proposal.projectDetails.description}</div>
        </div>
      `;
    }
    
    if (proposal.pricing && proposal.pricing.total) {
      html += `
        <div class="proposal-section">
          <h2>Pricing</h2>
          <div class="pricing-info">
            <p><strong>Total:</strong> ${proposal.pricing.currency || '£'}${proposal.pricing.total}</p>
            ${proposal.pricing.paymentTerms ? `<p><strong>Payment Terms:</strong> ${proposal.pricing.paymentTerms}</p>` : ''}
          </div>
        </div>
      `;
    }
  }
  
  // Acceptance section
  html += `
    <div class="proposal-section acceptance-section">
      <h2>Acceptance</h2>
      <p>To accept this proposal, please click the button below:</p>
      <button id="accept-proposal" class="btn btn-primary">Accept Proposal</button>
      <div id="acceptance-form" style="display: none;">
        <form id="client-acceptance-form">
          <div class="form-group">
            <label for="client-name">Full Name</label>
            <input type="text" id="client-name" name="clientName" required>
          </div>
          <div class="form-group">
            <label for="client-email">Email</label>
            <input type="email" id="client-email" name="clientEmail" required>
          </div>
          <div class="form-group">
            <label for="client-signature">Digital Signature</label>
            <div id="signature-pad" class="signature-pad"></div>
            <input type="hidden" id="client-signature" name="clientSignature">
          </div>
          <div class="form-actions">
            <button type="button" id="clear-signature" class="btn btn-outline">Clear</button>
            <button type="submit" class="btn btn-primary">Submit Acceptance</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Set the HTML content
  container.innerHTML = html;
  
  // Setup acceptance functionality
  setupAcceptanceForm();
}

// Populate edit form with proposal data
function populateEditForm(proposal, form) {
  // Basic fields
  const titleInput = form.querySelector('#proposal-title');
  const clientNameInput = form.querySelector('#proposal-client');
  const templateSelect = form.querySelector('#proposal-template');
  const dueDateInput = form.querySelector('#proposal-due-date');
  
  if (titleInput) titleInput.value = proposal.title || '';
  if (clientNameInput) clientNameInput.value = proposal.client?.name || proposal.clientName || '';
  if (templateSelect) templateSelect.value = proposal.template || '';
  if (dueDateInput && proposal.dueDate) {
    // Format date as YYYY-MM-DD for input
    const date = new Date(proposal.dueDate);
    const formattedDate = date.toISOString().split('T')[0];
    dueDateInput.value = formattedDate;
  }
  
  // Additional fields based on template
  // This would be expanded based on the specific template structure
}

// Setup sharing options
function setupSharingOptions(proposalId) {
  const sharingContainer = document.getElementById('sharing-options');
  if (!sharingContainer) return;
  
  // Create sharing options HTML
  sharingContainer.innerHTML = `
    <h2>Share This Proposal</h2>
    <div class="sharing-buttons">
      <button id="share-email" class="btn btn-outline"><i class="fas fa-envelope"></i> Email</button>
      <button id="share-link" class="btn btn-outline"><i class="fas fa-link"></i> Copy Link</button>
      <button id="share-pdf" class="btn btn-outline"><i class="fas fa-file-pdf"></i> Download PDF</button>
    </div>
    <div id="email-form" class="sharing-form" style="display: none;">
      <form id="send-email-form">
        <div class="form-group">
          <label for="recipient-email">Recipient Email</label>
          <input type="email" id="recipient-email" name="recipientEmail" required>
        </div>
        <div class="form-group">
          <label for="email-subject">Subject</label>
          <input type="text" id="email-subject" name="emailSubject" value="Proposal from ProposalMate" required>
        </div>
        <div class="form-group">
          <label for="email-message">Message</label>
          <textarea id="email-message" name="emailMessage" rows="4" required>I'm pleased to share this proposal with you. Please review and let me know if you have any questions.</textarea>
        </div>
        <div class="form-actions">
          <button type="button" id="cancel-email" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Send Email</button>
        </div>
      </form>
    </div>
  `;
  
  // Setup event listeners
  const emailButton = document.getElementById('share-email');
  const linkButton = document.getElementById('share-link');
  const pdfButton = document.getElementById('share-pdf');
  const emailForm = document.getElementById('email-form');
  const cancelEmailButton = document.getElementById('cancel-email');
  const sendEmailForm = document.getElementById('send-email-form');
  
  // Email sharing
  if (emailButton) {
    emailButton.addEventListener('click', function() {
      emailForm.style.display = 'block';
    });
  }
  
  if (cancelEmailButton) {
    cancelEmailButton.addEventListener('click', function() {
      emailForm.style.display = 'none';
    });
  }
  
  if (sendEmailForm) {
    sendEmailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const recipientEmail = document.getElementById('recipient-email').value;
      const emailSubject = document.getElementById('email-subject').value;
      const emailMessage = document.getElementById('email-message').value;
      
      // Send email via API
      sendProposalEmail(proposalId, recipientEmail, emailSubject, emailMessage);
    });
  }
  
  // Copy link
  if (linkButton) {
    linkButton.addEventListener('click', function() {
      // Generate shareable link
      const shareableLink = generateShareableLink(proposalId);
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          // Show success message
          const originalText = linkButton.innerHTML;
          linkButton.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
          
          // Reset button text after 2 seconds
          setTimeout(() => {
            linkButton.innerHTML = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy link:', err);
          alert('Failed to copy link. Please try again.');
        });
    });
  }
  
  // Download PDF
  if (pdfButton) {
    pdfButton.addEventListener('click', function() {
      // Generate and download PDF
      generateProposalPDF(proposalId);
    });
  }
}

// Setup sharing buttons on dashboard
function setupSharingButtons() {
  const sharingButtons = document.querySelectorAll('.share-proposal-btn');
  
  sharingButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const proposalId = this.getAttribute('data-id');
      if (!proposalId) return;
      
      // Show sharing modal
      showSharingModal(proposalId);
    });
  });
}

// Show sharing modal
function showSharingModal(proposalId) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('sharing-modal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'sharing-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Share Proposal</h2>
        <div class="sharing-buttons">
          <button id="modal-share-email" class="btn btn-outline"><i class="fas fa-envelope"></i> Email</button>
          <button id="modal-share-link" class="btn btn-outline"><i class="fas fa-link"></i> Copy Link</button>
          <button id="modal-share-pdf" class="btn btn-outline"><i class="fas fa-file-pdf"></i> Download PDF</button>
        </div>
        <div id="modal-email-form" class="sharing-form" style="display: none;">
          <form id="modal-send-email-form">
            <div class="form-group">
              <label for="modal-recipient-email">Recipient Email</label>
              <input type="email" id="modal-recipient-email" name="recipientEmail" required>
            </div>
            <div class="form-group">
              <label for="modal-email-subject">Subject</label>
              <input type="text" id="modal-email-subject" name="emailSubject" value="Proposal from ProposalMate" required>
            </div>
            <div class="form-group">
              <label for="modal-email-message">Message</label>
              <textarea id="modal-email-message" name="emailMessage" rows="4" required>I'm pleased to share this proposal with you. Please review and let me know if you have any questions.</textarea>
            </div>
            <div class="form-actions">
              <button type="button" id="modal-cancel-email" class="btn btn-outline">Cancel</button>
              <button type="submit" class="btn btn-primary">Send Email</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup close button
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Close when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Update modal with current proposal ID
  const emailButton = document.getElementById('modal-share-email');
  const linkButton = document.getElementById('modal-share-link');
  const pdfButton = document.getElementById('modal-share-pdf');
  const emailForm = document.getElementById('modal-email-form');
  const cancelEmailButton = document.getElementById('modal-cancel-email');
  const sendEmailForm = document.getElementById('modal-send-email-form');
  
  // Email sharing
  emailButton.addEventListener('click', function() {
    emailForm.style.display = 'block';
  });
  
  cancelEmailButton.addEventListener('click', function() {
    emailForm.style.display = 'none';
  });
  
  sendEmailForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const recipientEmail = document.getElementById('modal-recipient-email').value;
    const emailSubject = document.getElementById('modal-email-subject').value;
    const emailMessage = document.getElementById('modal-email-message').value;
    
    // Send email via API
    sendProposalEmail(proposalId, recipientEmail, emailSubject, emailMessage);
  });
  
  // Copy link
  linkButton.addEventListener('click', function() {
    // Generate shareable link
    const shareableLink = generateShareableLink(proposalId);
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        // Show success message
        const originalText = linkButton.innerHTML;
        linkButton.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
        
        // Reset button text after 2 seconds
        setTimeout(() => {
          linkButton.innerHTML = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        alert('Failed to copy link. Please try again.');
      });
  });
  
  // Download PDF
  pdfButton.addEventListener('click', function() {
    // Generate and download PDF
    generateProposalPDF(proposalId);
  });
  
  // Show modal
  modal.style.display = 'block';
}

// Setup acceptance form
function setupAcceptanceForm() {
  const acceptButton = document.getElementById('accept-proposal');
  const acceptanceForm = document.getElementById('acceptance-form');
  const clientForm = document.getElementById('client-acceptance-form');
  const signaturePad = document.getElementById('signature-pad');
  const signatureInput = document.getElementById('client-signature');
  const clearButton = document.getElementById('clear-signature');
  
  if (!acceptButton || !acceptanceForm || !clientForm || !signaturePad) return;
  
  // Initialize signature pad
  const canvas = document.createElement('canvas');
  canvas.width = signaturePad.offsetWidth;
  canvas.height = 200;
  signaturePad.appendChild(canvas);
  
  const pad = new SignaturePad(canvas, {
    backgroundColor: 'rgb(255, 255, 255)',
    penColor: 'rgb(0, 0, 0)'
  });
  
  // Show acceptance form when accept button is clicked
  acceptButton.addEventListener('click', function() {
    acceptButton.style.display = 'none';
    acceptanceForm.style.display = 'block';
  });
  
  // Clear signature
  clearButton.addEventListener('click', function() {
    pad.clear();
  });
  
  // Handle form submission
  clientForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const clientName = document.getElementById('client-name').value;
    const clientEmail = document.getElementById('client-email').value;
    
    // Get signature data
    if (pad.isEmpty()) {
      alert('Please provide your signature');
      return;
    }
    
    const signatureData = pad.toDataURL();
    signatureInput.value = signatureData;
    
    // Get proposal ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const proposalId = urlParams.get('id');
    
    if (!proposalId) {
      showError('No proposal ID provided');
      return;
    }
    
    // Submit acceptance
    submitProposalAcceptance(proposalId, clientName, clientEmail, signatureData);
  });
}

// Send proposal via email
function sendProposalEmail(proposalId, recipientEmail, subject, message) {
  // Show loading state
  const submitButton = document.querySelector('#send-email-form button[type="submit"]') || 
                       document.querySelector('#modal-send-email-form button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  
  // Call API to send email
  fetch(`/api/v1/proposals/${proposalId}/share/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      recipientEmail,
      subject,
      message
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      return response.json();
    })
    .then(data => {
      // Show success message
      alert('Email sent successfully!');
      
      // Hide email form
      const emailForm = document.getElementById('email-form') || document.getElementById('modal-email-form');
      if (emailForm) emailForm.style.display = 'none';
      
      // Hide modal if it exists
      const modal = document.getElementById('sharing-modal');
      if (modal) modal.style.display = 'none';
    })
    .catch(error => {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    })
    .finally(() => {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

// Generate shareable link
function generateShareableLink(proposalId) {
  // Get current origin
  const origin = window.location.origin;
  
  // Create shareable link
  return `${origin}/pages/view-proposal.html?id=${proposalId}&share=true`;
}

// Generate and download PDF
function generateProposalPDF(proposalId) {
  // Show loading state
  const pdfButton = document.getElementById('share-pdf') || document.getElementById('modal-share-pdf');
  const originalText = pdfButton.innerHTML;
  pdfButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  pdfButton.disabled = true;
  
  // Call API to generate PDF
  fetch(`/api/v1/proposals/${proposalId}/pdf`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      return response.blob();
    })
    .then(blob => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'proposal.pdf';
      
      // Append to document and trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Hide modal if it exists
      const modal = document.getElementById('sharing-modal');
      if (modal) modal.style.display = 'none';
    })
    .catch(error => {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again later.');
    })
    .finally(() => {
      // Reset button state
      pdfButton.innerHTML = originalText;
      pdfButton.disabled = false;
    });
}

// Submit proposal acceptance
function submitProposalAcceptance(proposalId, clientName, clientEmail, signatureData) {
  // Show loading state
  const submitButton = document.querySelector('#client-acceptance-form button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;
  
  // Call API to submit acceptance
  fetch(`/api/v1/proposals/${proposalId}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clientName,
      clientEmail,
      signature: signatureData
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit acceptance');
      }
      return response.json();
    })
    .then(data => {
      // Show success message
      const acceptanceForm = document.getElementById('acceptance-form');
      acceptanceForm.innerHTML = `
        <div class="acceptance-success">
          <i class="fas fa-check-circle"></i>
          <h3>Thank You!</h3>
          <p>Your acceptance has been recorded. The proposal owner will be notified.</p>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error submitting acceptance:', error);
      alert('Failed to submit acceptance. Please try again later.');
      
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

// Show error message
function showError(message) {
  const container = document.querySelector('.container') || document.body;
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <p>${message}</p>
  `;
  
  container.prepend(errorDiv);
}

// SignaturePad polyfill (simplified version)
class SignaturePad {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = options;
    
    // Set background color
    this.backgroundColor = options.backgroundColor || 'rgb(255, 255, 255)';
    this.penColor = options.penColor || 'rgb(0, 0, 0)';
    this.penWidth = options.penWidth || 2;
    
    // Initialize
    this.clear();
    this._setupEvents();
  }
  
  clear() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this._isEmpty = true;
  }
  
  isEmpty() {
    return this._isEmpty;
  }
  
  toDataURL(type = 'image/png', encoderOptions) {
    return this.canvas.toDataURL(type, encoderOptions);
  }
  
  _setupEvents() {
    this.canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
    document.addEventListener('mouseup', this._handleMouseUp.bind(this));
    
    this.canvas.addEventListener('touchstart', this._handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this._handleTouchMove.bind(this));
    document.addEventListener('touchend', this._handleTouchEnd.bind(this));
  }
  
  _handleMouseDown(event) {
    this._isDrawing = true;
    this._lastPoint = this._createPoint(event);
    this._strokeBegin();
  }
  
  _handleMouseMove(event) {
    if (!this._isDrawing) return;
    
    const point = this._createPoint(event);
    this._strokeUpdate(point);
  }
  
  _handleMouseUp() {
    if (!this._isDrawing) return;
    
    this._isDrawing = false;
    this._strokeEnd();
  }
  
  _handleTouchStart(event) {
    event.preventDefault();
    
    if (event.touches.length === 1) {
      this._isDrawing = true;
      this._lastPoint = this._createPoint(event.touches[0]);
      this._strokeBegin();
    }
  }
  
  _handleTouchMove(event) {
    event.preventDefault();
    
    if (!this._isDrawing) return;
    
    if (event.touches.length === 1) {
      const point = this._createPoint(event.touches[0]);
      this._strokeUpdate(point);
    }
  }
  
  _handleTouchEnd(event) {
    if (!this._isDrawing) return;
    
    this._isDrawing = false;
    this._strokeEnd();
  }
  
  _createPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  
  _strokeBegin() {
    this.ctx.beginPath();
    this.ctx.moveTo(this._lastPoint.x, this._lastPoint.y);
  }
  
  _strokeUpdate(point) {
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.penWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
    
    this._lastPoint = point;
    this._isEmpty = false;
  }
  
  _strokeEnd() {
    this.ctx.closePath();
  }
}
