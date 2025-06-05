// View proposal page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get proposal ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const proposalId = urlParams.get('id');
    
    if (proposalId) {
        loadProposalData(proposalId);
        setupActionButtons(proposalId);
    } else {
        showError('No proposal ID specified');
    }
});

function loadProposalData(proposalId) {
    // Show loading state
    const proposalContainer = document.querySelector('.proposal-container');
    if (proposalContainer) {
        proposalContainer.innerHTML = '<div class="loading">Loading proposal...</div>';
    }
    
    // Use the API client to get proposal data
    api.getProposal(proposalId)
        .then(proposal => {
            if (!proposal) {
                showError('Proposal not found');
                return;
            }
            
            // Render proposal data
            renderProposal(proposal);
            
            // Load client data
            if (proposal.clientId) {
                loadClientData(proposal.clientId);
            }
        })
        .catch(err => {
            console.error("Failed to load proposal:", err);
            showError('Failed to load proposal. Please try again.');
        });
}

function renderProposal(proposal) {
    const proposalContainer = document.querySelector('.proposal-container');
    if (!proposalContainer) return;
    
    // Clear loading state
    proposalContainer.innerHTML = '';
    
    // Set proposal title
    const titleElement = document.querySelector('.page-header h1');
    if (titleElement) {
        titleElement.textContent = proposal.title;
    }
    
    // Create proposal header
    const header = document.createElement('div');
    header.className = 'proposal-header';
    header.innerHTML = `
        <div class="proposal-meta">
            <p><strong>Proposal #:</strong> ${proposal._id.substring(0, 8)}</p>
            <p><strong>Created:</strong> ${new Date(proposal.createdAt).toLocaleDateString()}</p>
            <p><strong>Valid Until:</strong> ${new Date(proposal.validUntil).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${proposal.status.toLowerCase()}">${proposal.status}</span></p>
        </div>
    `;
    proposalContainer.appendChild(header);
    
    // Create proposal content
    const content = document.createElement('div');
    content.className = 'proposal-content';
    
    // Add description if available
    if (proposal.description) {
        const description = document.createElement('div');
        description.className = 'proposal-description';
        description.innerHTML = `
            <h2>Proposal Details</h2>
            <div class="description-content">${proposal.description}</div>
        `;
        content.appendChild(description);
    }
    
    // Add items if available
    if (proposal.items && proposal.items.length > 0) {
        const itemsSection = document.createElement('div');
        itemsSection.className = 'proposal-items-section';
        itemsSection.innerHTML = '<h2>Services & Products</h2>';
        
        const itemsTable = document.createElement('table');
        itemsTable.className = 'items-table';
        itemsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = itemsTable.querySelector('tbody');
        let subtotal = 0;
        
        proposal.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>£${item.price.toFixed(2)}</td>
                <td>£${item.total.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
            subtotal += item.total;
        });
        
        // Add totals
        const tax = subtotal * 0.20; // 20% VAT
        const total = subtotal + tax;
        
        const totalsHtml = `
            <tfoot>
                <tr class="subtotal-row">
                    <td colspan="3">Subtotal</td>
                    <td>£${subtotal.toFixed(2)}</td>
                </tr>
                <tr class="tax-row">
                    <td colspan="3">VAT (20%)</td>
                    <td>£${tax.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="3">Total</td>
                    <td>£${total.toFixed(2)}</td>
                </tr>
            </tfoot>
        `;
        
        itemsTable.innerHTML += totalsHtml;
        itemsSection.appendChild(itemsTable);
        content.appendChild(itemsSection);
    }
    
    // Add terms and conditions
    const terms = document.createElement('div');
    terms.className = 'proposal-terms';
    terms.innerHTML = `
        <h2>Terms & Conditions</h2>
        <p>This proposal is valid until ${new Date(proposal.validUntil).toLocaleDateString()}. By accepting this proposal, you agree to the following terms:</p>
        <ul>
            <li>50% deposit required to secure booking</li>
            <li>Final payment due 14 days before event date</li>
            <li>Cancellation policy: Full refund if cancelled 30+ days before event, 50% refund if cancelled 15-29 days before event, no refund if cancelled within 14 days of event</li>
        </ul>
    `;
    content.appendChild(terms);
    
    proposalContainer.appendChild(content);
    
    // Add acceptance section if proposal is sent or viewed
    if (proposal.status === 'Sent' || proposal.status === 'Viewed') {
        const acceptance = document.createElement('div');
        acceptance.className = 'proposal-acceptance';
        acceptance.innerHTML = `
            <h2>Accept Proposal</h2>
            <p>Ready to proceed? Click the button below to accept this proposal.</p>
            <button class="btn btn-primary accept-proposal-btn">Accept Proposal</button>
        `;
        proposalContainer.appendChild(acceptance);
        
        // Add event listener to accept button
        const acceptBtn = acceptance.querySelector('.accept-proposal-btn');
        acceptBtn.addEventListener('click', function() {
            acceptProposal(proposal._id);
        });
    }
}

function loadClientData(clientId) {
    // Use the API client to get client data
    api.getClient(clientId)
        .then(client => {
            if (!client) return;
            
            // Create client info section
            const clientInfo = document.createElement('div');
            clientInfo.className = 'client-info';
            clientInfo.innerHTML = `
                <h2>Client Information</h2>
                <p><strong>Name:</strong> ${client.name}</p>
                <p><strong>Email:</strong> ${client.email}</p>
                ${client.phone ? `<p><strong>Phone:</strong> ${client.phone}</p>` : ''}
            `;
            
            // Insert after proposal header
            const proposalHeader = document.querySelector('.proposal-header');
            if (proposalHeader) {
                proposalHeader.parentNode.insertBefore(clientInfo, proposalHeader.nextSibling);
            }
        })
        .catch(err => {
            console.error("Failed to load client data:", err);
        });
}

function setupActionButtons(proposalId) {
    // Setup edit button
    const editBtn = document.querySelector('.edit-proposal-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            window.location.href = `/pages/edit-proposal.html?id=${proposalId}`;
        });
    }
    
    // Setup delete button
    const deleteBtn = document.querySelector('.delete-proposal-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this proposal?')) {
                // Use the API client to delete the proposal
                api.deleteProposal(proposalId)
                    .then(() => {
                        window.location.href = '/pages/dashboard.html';
                    })
                    .catch(err => {
                        console.error("Failed to delete proposal:", err);
                        alert('Failed to delete proposal. Please try again.');
                    });
            }
        });
    }
    
    // Setup send button
    const sendBtn = document.querySelector('.send-proposal-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            showSendProposalModal(proposalId);
        });
    }
    
    // Setup download PDF button
    const pdfBtn = document.querySelector('.download-pdf-btn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            generatePDF(proposalId);
        });
    }
}

function showSendProposalModal(proposalId) {
    // Create modal if it doesn't exist
    if (!document.getElementById('send-proposal-modal')) {
        const modal = document.createElement('div');
        modal.id = 'send-proposal-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Send Proposal</h2>
                <form id="send-proposal-form">
                    <div class="form-group">
                        <label for="recipient-email">Recipient Email</label>
                        <input type="email" id="recipient-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="email-subject">Subject</label>
                        <input type="text" id="email-subject" name="subject" value="Your Proposal is Ready" required>
                    </div>
                    <div class="form-group">
                        <label for="email-message">Message</label>
                        <textarea id="email-message" name="message" rows="4" required>I'm pleased to share this proposal with you. Please review and let me know if you have any questions.</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Proposal</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Setup close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Setup form submission
        const form = modal.querySelector('#send-proposal-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('recipient-email').value;
            const subject = document.getElementById('email-subject').value;
            const message = document.getElementById('email-message').value;
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Use the API client to send the proposal
            api.sendProposal(proposalId, { email, subject, message })
                .then(() => {
                    // Close modal
                    modal.style.display = 'none';
                    
                    // Show success message
                    alert('Proposal sent successfully!');
                    
                    // Reload proposal to update status
                    loadProposalData(proposalId);
                })
                .catch(err => {
                    console.error("Failed to send proposal:", err);
                    alert('Failed to send proposal. Please try again.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Show modal
    const modal = document.getElementById('send-proposal-modal');
    modal.style.display = 'block';
}

function generatePDF(proposalId) {
    // Show loading message
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-overlay';
    loadingMessage.innerHTML = '<div class="loading-message">Generating PDF...</div>';
    document.body.appendChild(loadingMessage);
    
    // Use the API client to generate PDF
    api.generateProposalPDF(proposalId)
        .then(data => {
            // Remove loading message
            loadingMessage.remove();
            
            // Create download link
            if (data.pdfUrl) {
                const link = document.createElement('a');
                link.href = data.pdfUrl;
                link.download = `proposal-${proposalId.substring(0, 8)}.pdf`;
                link.click();
            } else {
                throw new Error('No PDF URL received');
            }
        })
        .catch(err => {
            console.error("Failed to generate PDF:", err);
            loadingMessage.remove();
            alert('Failed to generate PDF. Please try again.');
        });
}

function acceptProposal(proposalId) {
    // Create acceptance modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Accept Proposal</h2>
            <p>By accepting this proposal, you agree to the terms and conditions outlined above.</p>
            <form id="accept-proposal-form">
                <div class="form-group">
                    <label for="signature">Digital Signature (Type your full name)</label>
                    <input type="text" id="signature" name="signature" required>
                </div>
                <div class="form-group form-checkbox">
                    <input type="checkbox" id="terms-accepted" name="terms-accepted" required>
                    <label for="terms-accepted">I agree to the terms and conditions</label>
                </div>
                <button type="submit" class="btn btn-primary">Accept Proposal</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Setup close button
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Setup form submission
    const form = modal.querySelector('#accept-proposal-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const signature = document.getElementById('signature').value;
        const termsAccepted = document.getElementById('terms-accepted').checked;
        
        if (!signature || !termsAccepted) {
            alert('Please complete all fields to accept the proposal');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Use the API client to accept the proposal
        api.acceptProposal(proposalId, { signature })
            .then(() => {
                // Close modal
                modal.remove();
                
                // Show success message and update UI
                const proposalContainer = document.querySelector('.proposal-container');
                if (proposalContainer) {
                    const acceptanceSection = document.querySelector('.proposal-acceptance');
                    if (acceptanceSection) {
                        acceptanceSection.innerHTML = `
                            <div class="acceptance-confirmation">
                                <i class="fas fa-check-circle"></i>
                                <h2>Proposal Accepted!</h2>
                                <p>Thank you for accepting this proposal. We'll be in touch shortly to discuss next steps.</p>
                                <p><strong>Signed by:</strong> ${signature}</p>
                                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>
                        `;
                    }
                    
                    // Update status badge
                    const statusBadge = document.querySelector('.status-badge');
                    if (statusBadge) {
                        statusBadge.className = 'status-badge status-accepted';
                        statusBadge.textContent = 'Accepted';
                    }
                }
            })
            .catch(err => {
                console.error("Failed to accept proposal:", err);
                alert('Failed to accept proposal. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
    
    // Show modal
    modal.style.display = 'block';
}

function showError(message) {
    const container = document.querySelector('.proposal-container') || document.querySelector('.dashboard-content');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <a href="/pages/dashboard.html" class="btn btn-secondary">Back to Dashboard</a>
            </div>
        `;
    }
}
