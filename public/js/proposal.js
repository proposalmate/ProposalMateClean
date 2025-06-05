// Create proposal page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    initializeProposalForm();
    
    // Load client data for dropdown
    loadClientData();
    
    // Load template options
    loadTemplateOptions();
    
    // Setup form submission
    setupFormSubmission();
});

function initializeProposalForm() {
    // Initialize any rich text editors
    const descriptionField = document.getElementById('proposal-description');
    if (descriptionField) {
        // Simple placeholder for rich text editor initialization
        // In a real implementation, you might use a library like TinyMCE, CKEditor, etc.
        console.log('Rich text editor would be initialized here');
    }
    
    // Initialize date pickers
    const datePickers = document.querySelectorAll('input[type="date"]');
    datePickers.forEach(picker => {
        // Set default value to today if not already set
        if (!picker.value) {
            const today = new Date().toISOString().split('T')[0];
            picker.value = today;
        }
    });
    
    // Initialize price inputs with currency formatting
    const priceInputs = document.querySelectorAll('.price-input');
    priceInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                // Format as currency
                const value = parseFloat(this.value.replace(/[^0-9.-]+/g, ''));
                if (!isNaN(value)) {
                    this.value = value.toFixed(2);
                }
            }
        });
    });
}

function loadClientData() {
    const clientSelect = document.getElementById('client-select');
    if (!clientSelect) return;
    
    // Show loading state
    clientSelect.innerHTML = '<option value="">Loading clients...</option>';
    clientSelect.disabled = true;
    
    // Use the API client to get clients
    api.getClients()
        .then(clients => {
            // Clear loading option
            clientSelect.innerHTML = '<option value="">Select a client</option>';
            
            if (clients && clients.length > 0) {
                // Add client options
                clients.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client._id;
                    option.textContent = client.name;
                    clientSelect.appendChild(option);
                });
            } else {
                // No clients found
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "No clients found - create one first";
                clientSelect.appendChild(option);
            }
            
            // Enable select
            clientSelect.disabled = false;
            
            // Add option to create new client
            const newClientOption = document.createElement('option');
            newClientOption.value = "new";
            newClientOption.textContent = "➕ Add New Client";
            clientSelect.appendChild(newClientOption);
            
            // Handle new client selection
            clientSelect.addEventListener('change', function() {
                if (this.value === 'new') {
                    showNewClientForm();
                    this.value = ""; // Reset select
                }
            });
        })
        .catch(err => {
            console.error("Failed to load clients:", err);
            clientSelect.innerHTML = '<option value="">Error loading clients</option>';
            clientSelect.disabled = false;
        });
}

function showNewClientForm() {
    // Check if form already exists
    if (document.getElementById('new-client-form')) return;
    
    const clientSelect = document.getElementById('client-select');
    const formContainer = document.createElement('div');
    formContainer.id = 'new-client-form';
    formContainer.className = 'new-client-form';
    formContainer.innerHTML = `
        <h3>Add New Client</h3>
        <div class="form-group">
            <label for="client-name">Client Name</label>
            <input type="text" id="client-name" name="client-name" required>
        </div>
        <div class="form-group">
            <label for="client-email">Client Email</label>
            <input type="email" id="client-email" name="client-email" required>
        </div>
        <div class="form-group">
            <label for="client-phone">Client Phone (optional)</label>
            <input type="tel" id="client-phone" name="client-phone">
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            <button type="button" class="btn btn-primary save-btn">Save Client</button>
        </div>
    `;
    
    // Insert form after client select
    clientSelect.parentNode.insertBefore(formContainer, clientSelect.nextSibling);
    
    // Setup cancel button
    const cancelBtn = formContainer.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', function() {
        formContainer.remove();
    });
    
    // Setup save button
    const saveBtn = formContainer.querySelector('.save-btn');
    saveBtn.addEventListener('click', function() {
        const name = document.getElementById('client-name').value;
        const email = document.getElementById('client-email').value;
        const phone = document.getElementById('client-phone').value;
        
        if (!name || !email) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Show loading state
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        
        // Use the API client to create a new client
        api.createClient({ name, email, phone })
            .then(client => {
                // Add new client to select and select it
                const option = document.createElement('option');
                option.value = client._id;
                option.textContent = client.name;
                
                // Insert before the "Add New Client" option
                const newClientOption = clientSelect.querySelector('option[value="new"]');
                clientSelect.insertBefore(option, newClientOption);
                
                // Select the new client
                clientSelect.value = client._id;
                
                // Remove the form
                formContainer.remove();
            })
            .catch(err => {
                console.error("Failed to create client:", err);
                alert('Failed to create client. Please try again.');
                saveBtn.textContent = 'Save Client';
                saveBtn.disabled = false;
            });
    });
}

function loadTemplateOptions() {
    const templateSelect = document.getElementById('template-select');
    if (!templateSelect) return;
    
    // Define available templates
    const templates = [
        { id: 'photography', name: 'Photography Package', image: '/images/templates/photography-template.jpg' },
        { id: 'planning', name: 'Wedding Planning', image: '/images/templates/planner-template.jpg' },
        { id: 'venue', name: 'Venue Booking', image: '/images/templates/venue-template.jpg' },
        { id: 'catering', name: 'Catering Services', image: '/images/templates/catering-template.jpg' }
    ];
    
    // Create template selection cards
    const templateContainer = document.querySelector('.template-selection');
    if (templateContainer) {
        templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.dataset.templateId = template.id;
            card.innerHTML = `
                <div class="template-image">
                    <img src="${template.image}" alt="${template.name} Template">
                </div>
                <h3 class="template-name">${template.name}</h3>
                <button type="button" class="btn btn-secondary select-template">Select</button>
            `;
            templateContainer.appendChild(card);
            
            // Add click event to select button
            const selectBtn = card.querySelector('.select-template');
            selectBtn.addEventListener('click', function() {
                // Remove active class from all cards
                document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
                
                // Add active class to selected card
                card.classList.add('active');
                
                // Update hidden input value
                templateSelect.value = template.id;
                
                // Show success message
                const message = document.createElement('div');
                message.className = 'success-message';
                message.textContent = `${template.name} template selected`;
                message.style.opacity = '1';
                
                // Remove any existing messages
                const existingMessage = document.querySelector('.success-message');
                if (existingMessage) existingMessage.remove();
                
                // Add message after template container
                templateContainer.parentNode.insertBefore(message, templateContainer.nextSibling);
                
                // Fade out message after 2 seconds
                setTimeout(() => {
                    message.style.opacity = '0';
                    setTimeout(() => message.remove(), 500);
                }, 2000);
            });
        });
    }
}

function setupFormSubmission() {
    const proposalForm = document.getElementById('proposal-form');
    if (!proposalForm) return;
    
    proposalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const title = document.getElementById('proposal-title').value;
        const clientId = document.getElementById('client-select').value;
        const templateId = document.getElementById('template-select').value;
        const description = document.getElementById('proposal-description').value;
        const validUntil = document.getElementById('valid-until').value;
        
        // Validate required fields
        if (!title) {
            alert('Please enter a proposal title');
            return;
        }
        
        if (!clientId) {
            alert('Please select a client');
            return;
        }
        
        if (!templateId) {
            alert('Please select a template');
            return;
        }
        
        // Get items from dynamic item list
        const items = [];
        const itemRows = document.querySelectorAll('.proposal-item');
        itemRows.forEach(row => {
            const description = row.querySelector('.item-description').value;
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            
            if (description && quantity > 0 && price > 0) {
                items.push({
                    description,
                    quantity,
                    price,
                    total: quantity * price
                });
            }
        });
        
        // Create proposal data object
        const proposalData = {
            title,
            clientId,
            templateId,
            description,
            validUntil,
            items,
            status: 'draft'
        };
        
        // Show loading state
        const submitButton = proposalForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Creating Proposal...';
        submitButton.disabled = true;
        
        // Use the API client to create a new proposal
        api.createProposal(proposalData)
            .then(proposal => {
                // Redirect to proposal view page
                window.location.href = `/pages/view-proposal.html?id=${proposal._id}`;
            })
            .catch(err => {
                console.error("Failed to create proposal:", err);
                alert('Failed to create proposal. Please try again.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    });
    
    // Setup dynamic item list
    setupDynamicItemList();
}

function setupDynamicItemList() {
    const itemList = document.querySelector('.proposal-items');
    const addItemBtn = document.querySelector('.add-item-btn');
    
    if (!itemList || !addItemBtn) return;
    
    // Add initial item row if none exists
    if (itemList.querySelectorAll('.proposal-item').length === 0) {
        addItemRow();
    }
    
    // Setup add item button
    addItemBtn.addEventListener('click', function() {
        addItemRow();
    });
    
    function addItemRow() {
        const row = document.createElement('div');
        row.className = 'proposal-item';
        row.innerHTML = `
            <div class="item-row">
                <div class="form-group">
                    <input type="text" class="item-description" placeholder="Item description">
                </div>
                <div class="form-group">
                    <input type="number" class="item-quantity" placeholder="Qty" min="1" value="1">
                </div>
                <div class="form-group">
                    <input type="number" class="item-price price-input" placeholder="Price" step="0.01" min="0">
                </div>
                <div class="form-group item-total">
                    £0.00
                </div>
                <button type="button" class="remove-item-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        itemList.appendChild(row);
        
        // Setup remove button
        const removeBtn = row.querySelector('.remove-item-btn');
        removeBtn.addEventListener('click', function() {
            row.remove();
            updateTotals();
        });
        
        // Setup price and quantity change events
        const quantityInput = row.querySelector('.item-quantity');
        const priceInput = row.querySelector('.item-price');
        const totalElement = row.querySelector('.item-total');
        
        [quantityInput, priceInput].forEach(input => {
            input.addEventListener('input', function() {
                const quantity = parseFloat(quantityInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                const total = quantity * price;
                totalElement.textContent = `£${total.toFixed(2)}`;
                updateTotals();
            });
        });
    }
    
    function updateTotals() {
        let subtotal = 0;
        
        // Calculate subtotal from all items
        document.querySelectorAll('.proposal-item').forEach(row => {
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            subtotal += quantity * price;
        });
        
        // Update subtotal display
        const subtotalElement = document.querySelector('.subtotal-value');
        if (subtotalElement) {
            subtotalElement.textContent = `£${subtotal.toFixed(2)}`;
        }
        
        // Calculate tax if applicable
        const taxRate = 0.20; // 20% VAT
        const tax = subtotal * taxRate;
        
        // Update tax display
        const taxElement = document.querySelector('.tax-value');
        if (taxElement) {
            taxElement.textContent = `£${tax.toFixed(2)}`;
        }
        
        // Calculate total
        const total = subtotal + tax;
        
        // Update total display
        const totalElement = document.querySelector('.total-value');
        if (totalElement) {
            totalElement.textContent = `£${total.toFixed(2)}`;
        }
    }
}
