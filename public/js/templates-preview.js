/**
 * Templates Preview JavaScript
 * 
 * This file handles the templates preview functionality,
 * including loading template data and handling user interactions.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize API client
    const api = window.getApiClient ? getApiClient() : new ApiClient();
    
    // DOM elements
    const templatesContainer = document.querySelector('.templates-container') || document.getElementById('templates-grid');
    const loadingIndicator = document.getElementById('loading-indicator') || createLoadingIndicator();
    
    // Create loading indicator if it doesn't exist
    function createLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'loading-indicator';
        indicator.textContent = 'Loading templates...';
        indicator.style.textAlign = 'center';
        indicator.style.padding = '20px';
        indicator.style.fontSize = '18px';
        
        if (templatesContainer) {
            templatesContainer.parentNode.insertBefore(indicator, templatesContainer);
        } else {
            document.body.appendChild(indicator);
        }
        
        return indicator;
    }
    
    // Show loading state
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        
        if (templatesContainer) {
            templatesContainer.style.opacity = '0.5';
        }
    }
    
    // Hide loading state
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        if (templatesContainer) {
            templatesContainer.style.opacity = '1';
        }
    }
    
    // Display error message
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message || 'An error occurred while loading templates.';
        errorElement.style.color = 'red';
        errorElement.style.padding = '20px';
        errorElement.style.textAlign = 'center';
        
        hideLoading();
        
        if (templatesContainer) {
            templatesContainer.innerHTML = '';
            templatesContainer.appendChild(errorElement);
        } else {
            document.body.appendChild(errorElement);
        }
    }
    
    // Template data (fallback if API fails)
    // Only include templates that have corresponding images in the /images/templates/ directory
    const fallbackTemplates = [
        {
            id: 'photography',
            name: 'Photography Proposal',
            description: 'Perfect for wedding and event photographers',
            image: '/images/templates/photography-template.jpg',
            category: 'Photography'
        },
        {
            id: 'venue',
            name: 'Venue Proposal',
            description: 'Ideal for venue and location services',
            image: '/images/templates/venue-template.jpg',
            category: 'Venues'
        },
        {
            id: 'planner',
            name: 'Event Planner Proposal',
            description: 'Comprehensive template for event planners',
            image: '/images/templates/planner-template.jpg',
            category: 'Planning'
        },
        {
            id: 'catering',
            name: 'Catering Proposal',
            description: 'Detailed template for catering services',
            image: '/images/templates/catering-template.jpg',
            category: 'Catering'
        }
    ];
    
    // Render templates
    function renderTemplates(templates) {
        if (!templatesContainer) {
            console.error('Templates container not found');
            return;
        }
        
        templatesContainer.innerHTML = '';
        
        if (!templates || templates.length === 0) {
            const noTemplatesMessage = document.createElement('div');
            noTemplatesMessage.className = 'no-templates';
            noTemplatesMessage.textContent = 'No templates available.';
            noTemplatesMessage.style.textAlign = 'center';
            noTemplatesMessage.style.padding = '40px';
            noTemplatesMessage.style.fontSize = '18px';
            templatesContainer.appendChild(noTemplatesMessage);
            return;
        }
        
        templates.forEach(template => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.dataset.id = template.id;
            
            // Create template image
            const imageContainer = document.createElement('div');
            imageContainer.className = 'template-image';
            
            const image = document.createElement('img');
            image.src = template.image;
            image.alt = template.name;
            image.onerror = function() {
                // Fallback image if template image fails to load
                this.src = '/images/templates/photography-template.jpg';
                this.onerror = null;
            };
            
            imageContainer.appendChild(image);
            
            // Create template info
            const infoContainer = document.createElement('div');
            infoContainer.className = 'template-info';
            
            const name = document.createElement('h3');
            name.textContent = template.name;
            
            const description = document.createElement('p');
            description.textContent = template.description;
            
            const category = document.createElement('span');
            category.className = 'template-category';
            category.textContent = template.category;
            
            infoContainer.appendChild(category);
            infoContainer.appendChild(name);
            infoContainer.appendChild(description);
            
            // Create action button
            const actionContainer = document.createElement('div');
            actionContainer.className = 'template-actions';
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'template-price';
            priceSpan.textContent = template.id === 'photography' || template.id === 'venue' ? 'Free' : 'Premium';
            
            const actionButton = document.createElement('a');
            actionButton.href = '#';
            actionButton.className = 'btn btn-secondary';
            actionButton.textContent = 'Use Template';
            actionButton.addEventListener('click', function(e) {
                e.preventDefault();
                useTemplate(template.id);
            });
            
            actionContainer.appendChild(priceSpan);
            actionContainer.appendChild(actionButton);
            
            // Assemble template card
            templateCard.appendChild(imageContainer);
            templateCard.appendChild(infoContainer);
            templateCard.appendChild(actionContainer);
            
            // Add to container
            templatesContainer.appendChild(templateCard);
        });
    }
    
    // Handle template selection
    function useTemplate(templateId) {
        // Check if user is logged in
        if (!api.token) {
            // Redirect to login page with return URL
            const returnUrl = encodeURIComponent('/pages/create-proposal.html?template=' + templateId);
            window.location.href = '/pages/login.html?redirect=' + returnUrl;
            return;
        }
        
        // Redirect to create proposal page with template ID
        window.location.href = '/pages/create-proposal.html?template=' + templateId;
    }
    
    // Skip API call and use fallback templates directly
    hideLoading();
    renderTemplates(fallbackTemplates);
});
