// Create proposal functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Create proposal script loaded');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Elements
    const proposalForm = document.getElementById('proposal-form');
    const templateSelector = document.getElementById('template');
    const previewBtn = document.getElementById('preview-btn');
    
    // Handle form submission
    if (proposalForm) {
        proposalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Proposal form submitted');
            
            // Get form data
            const title = document.getElementById('title').value;
            const clientName = document.getElementById('client-name').value;
            const clientEmail = document.getElementById('client-email').value;
            const content = document.getElementById('content').value;
            const template = templateSelector ? templateSelector.value : 'default';
            
            // Show loading state
            const submitBtn = proposalForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
            try {
                console.log('Sending proposal data to API');
                
                // Get the base URL dynamically
                const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? '' // Empty for local development
                    : ''; // Empty for production too since we're using relative URLs
                
                const apiUrl = `${baseUrl}/api/v1/proposals`;
                console.log('API URL for proposal creation:', apiUrl);
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        clientName,
                        clientEmail,
                        content,
                        template,
                        status: 'draft'
                    }),
                    credentials: 'same-origin'
                });
                
                console.log('API response status:', response.status);
                const data = await response.json();
                console.log('API response data:', data);
                
                if (!response.ok) {
                    throw new Error(data.error || data.message || 'Failed to create proposal');
                }
                
                if (!data.success) {
                    throw new Error('API returned success: false');
                }
                
                // Store the proposal ID for reference
                if (data.data && data.data._id) {
                    // Save the last created proposal ID
                    localStorage.setItem('lastCreatedProposal', data.data._id);
                    console.log('Saved proposal ID to localStorage:', data.data._id);
                }
                
                // Show success message
                showNotification('Proposal created successfully!', 'success');
                
                // Redirect to dashboard after a delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } catch (error) {
                console.error('Error creating proposal:', error);
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Show error message
                showNotification(error.message || 'An error occurred while creating the proposal', 'error');
                
                // Log detailed error for debugging
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack
                });
            }
        });
    } else {
        console.warn('Proposal form not found in the document');
    }
    
    // Preview functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            // Get form data
            const title = document.getElementById('title').value || 'Untitled Proposal';
            const clientName = document.getElementById('client-name').value || 'Client';
            const content = document.getElementById('content').value || 'No content provided';
            const template = templateSelector ? templateSelector.value : 'default';
            
            // Store preview data in localStorage
            const previewData = {
                title,
                clientName,
                content,
                template,
                previewMode: true
            };
            
            localStorage.setItem('proposalPreview', JSON.stringify(previewData));
            
            // Open preview in new tab/window
            window.open('preview-proposal.html', '_blank');
        });
    }
    
    // Template selection change handler
    if (templateSelector) {
        templateSelector.addEventListener('change', function() {
            const selectedTemplate = this.value;
            console.log('Template selected:', selectedTemplate);
            
            // You could load template-specific fields or content here
            loadTemplateContent(selectedTemplate);
        });
        
        // Load initial template content
        const initialTemplate = templateSelector.value;
        if (initialTemplate) {
            loadTemplateContent(initialTemplate);
        }
    }
    
    // Load template-specific content
    function loadTemplateContent(template) {
        const contentField = document.getElementById('content');
        if (!contentField) return;
        
        // Only pre-fill if the field is empty
        if (contentField.value.trim() === '') {
            let templateContent = '';
            
            switch (template) {
                case 'photography':
                    templateContent = `# Wedding Photography Proposal

## About Us
[Your photography business description]

## Our Approach
We believe in capturing authentic moments that tell your unique love story.

## Packages

### Essential Package - £1,200
- 6 hours of coverage
- 1 photographer
- Online gallery with 300+ edited images
- Print release

### Classic Package - £1,800
- 8 hours of coverage
- 2 photographers
- Engagement session
- Online gallery with 500+ edited images
- Print release
- USB with high-resolution images

### Premium Package - £2,500
- 10 hours of coverage
- 2 photographers
- Engagement session
- Bridal session
- Online gallery with 700+ edited images
- Print release
- USB with high-resolution images
- 20-page wedding album

## Our Process
1. Initial consultation
2. Booking and contract
3. Pre-wedding planning
4. Wedding day coverage
5. Image editing (4-6 weeks)
6. Image delivery
7. Album design (if applicable)

## Terms & Conditions
[Your terms and conditions]`;
                    break;
                    
                case 'planning':
                    templateContent = `# Wedding Planning Proposal

## About Us
[Your planning business description]

## Our Approach
We believe in creating personalized, meaningful celebrations that reflect your unique love story.

## Services

### Month-of Coordination - £800
- 3 planning meetings
- Vendor coordination
- Timeline creation
- Rehearsal direction
- Full wedding day coordination (10 hours)

### Partial Planning - £1,500
- 6 planning meetings
- Vendor recommendations and coordination
- Budget management
- Timeline creation
- Rehearsal direction
- Full wedding day coordination (12 hours)

### Full Planning - £3,000
- Unlimited planning meetings
- Venue selection
- Complete vendor management
- Design and styling
- Budget management
- Timeline creation
- Rehearsal direction
- Full wedding day coordination (14 hours)

## Planning Process
1. Initial consultation
2. Vision and concept development
3. Budget planning
4. Vendor selection
5. Design and styling
6. Logistics and timeline
7. Final details
8. Rehearsal
9. Wedding day execution

## Terms & Conditions
[Your terms and conditions]`;
                    break;
                    
                case 'venue':
                    templateContent = `# Wedding Venue Proposal

## About Our Venue
[Your venue description]

## Our Spaces

### Grand Ballroom
- Up to 200 guests
- Features crystal chandeliers, hardwood floors, and floor-to-ceiling windows

### Garden Terrace
- Up to 150 guests
- Beautiful outdoor space with a permanent marquee

### Intimate Library
- Up to 60 guests
- Charming room with original features

## Packages

### Essential Package - £3,500
- Venue hire for ceremony and reception (8 hours)
- Basic setup and cleanup
- Tables and chairs
- Parking for guests
- Bridal suite access

### Classic Package - £5,500
- Venue hire for ceremony and reception (10 hours)
- Setup and cleanup
- Tables, chairs, and linens
- Basic lighting package
- Parking for guests
- Bridal suite access
- Dedicated venue coordinator

### Premium Package - £7,500
- Exclusive venue hire for entire day
- Setup and cleanup
- Premium tables, chairs, and linens
- Enhanced lighting package
- Parking for guests
- Bridal suite access
- Dedicated venue coordinator
- Champagne welcome reception
- Menu tasting for up to 4 people

## Terms & Conditions
[Your terms and conditions]`;
                    break;
                    
                case 'catering':
                    templateContent = `# Wedding Catering Proposal

## About Us
[Your catering business description]

## Our Approach
We believe food is a central part of any celebration and create seasonal, locally-sourced menus.

## Service Styles

### Plated Service
Elegant, formal dining experience with individually plated courses served to seated guests.

### Family Style
Communal dining experience with large platters of food placed at each table for guests to share.

### Buffet
Casual, flexible dining experience with food stations where guests serve themselves.

### Food Stations
Interactive experience with themed food stations around the venue.

## Sample Menus

### Classic Menu - £55 per person
- Starter: Garden salad with seasonal vegetables and house vinaigrette
- Main: Herb-roasted chicken with garlic mashed potatoes and seasonal vegetables
- Dessert: Classic vanilla cheesecake with berry compote

### Premium Menu - £75 per person
- Starter: Seared scallops with pea puree and crispy pancetta
- Main: Filet mignon with truffle butter, roasted potatoes, and asparagus
- Dessert: Chocolate fondant with vanilla ice cream and salted caramel sauce

### Vegetarian Menu - £55 per person
- Starter: Roasted beetroot and goat cheese salad with candied walnuts
- Main: Wild mushroom risotto with truffle oil and parmesan crisp
- Dessert: Lemon tart with raspberry sorbet

## Terms & Conditions
[Your terms and conditions]`;
                    break;
                    
                default:
                    templateContent = `# Proposal

## Introduction
[Introduce your services and why you're the right choice]

## Services Offered
[Detail the services you're proposing]

## Pricing
[Outline your pricing structure]

## Timeline
[Provide a timeline for delivery]

## Terms & Conditions
[Your terms and conditions]`;
            }
            
            contentField.value = templateContent;
        }
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
});
