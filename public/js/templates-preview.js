// Template preview functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Templates preview script loaded');
    
    // Check if user is logged in - with improved token validation
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const currentTime = new Date().getTime();
    
    // Function to check if token is valid
    function isTokenValid() {
        if (!token) {
            console.log('No token found');
            return false;
        }
        
        // If we have an expiry time, check if token is expired
        if (tokenExpiry && parseInt(tokenExpiry) < currentTime) {
            console.log('Token expired');
            return false;
        }
        
        return true;
    }
    
    // Only redirect if not logged in AND not on a public page
    // This prevents the redirect loop when already logged in
    if (!isTokenValid() && !window.location.pathname.includes('index.html') && 
        !window.location.pathname.includes('about.html') && 
        !window.location.pathname.includes('pricing.html')) {
        console.log('Invalid token, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Elements
    const templateCards = document.querySelectorAll('.template-card');
    const previewModal = document.getElementById('template-preview-modal');
    const modalContent = document.querySelector('.modal-content');
    const closeModal = document.querySelector('.close-modal');
    const useTemplateBtn = document.getElementById('use-template-btn');
    
    // Template data
    const templates = {
        photography: {
            title: 'Wedding Photography',
            description: 'A professional template designed for wedding photographers to showcase their packages, style, and approach.',
            features: [
                'Elegant layout for showcasing photography packages',
                'Sections for your photography style and approach',
                'Package comparison table',
                'Timeline and delivery expectations',
                'Terms and conditions section'
            ],
            preview: '../images/templates/photography-template-full.jpg'
        },
        planning: {
            title: 'Wedding Planning',
            description: 'A comprehensive template for wedding planners to present their services, process, and coordination packages.',
            features: [
                'Detailed planning service packages',
                'Wedding planning process timeline',
                'Coordination checklist',
                'Client testimonials section',
                'Payment schedule and terms'
            ],
            preview: '../images/templates/planning-template-full.jpg'
        },
        venue: {
            title: 'Wedding Venue',
            description: 'A stunning template for wedding venues to showcase their spaces, amenities, and booking packages.',
            features: [
                'Venue spaces and capacity details',
                'Amenities and services included',
                'Catering and bar options',
                'Pricing and availability calendar',
                'Booking terms and deposit information'
            ],
            preview: '../images/templates/venue-template-full.jpg'
        },
        catering: {
            title: 'Wedding Catering',
            description: 'An appetizing template for wedding caterers to present their menus, service styles, and culinary approach.',
            features: [
                'Multiple menu options and service styles',
                'Food and beverage packages',
                'Dietary accommodations section',
                'Staffing and rental information',
                'Tasting and customization options'
            ],
            preview: '../images/templates/catering-template-full.jpg'
        }
    };
    
    // Handle template card clicks
    if (templateCards && templateCards.length > 0) {
        console.log('Found template cards:', templateCards.length);
        templateCards.forEach(card => {
            card.addEventListener('click', function() {
                const templateType = this.getAttribute('data-template');
                console.log('Template clicked:', templateType);
                
                if (templateType && templates[templateType]) {
                    showTemplatePreview(templateType);
                }
            });
        });
    } else {
        console.warn('No template cards found in the document');
    }
    
    // Show template preview
    function showTemplatePreview(templateType) {
        if (!previewModal || !modalContent) {
            console.error('Preview modal elements not found');
            return;
        }
        
        const template = templates[templateType];
        if (!template) {
            console.error('Template data not found for:', templateType);
            return;
        }
        
        console.log('Showing preview for template:', templateType);
        
        // Build modal content
        let featuresHtml = '';
        template.features.forEach(feature => {
            featuresHtml += `<li><i class="fas fa-check"></i> ${feature}</li>`;
        });
        
        modalContent.innerHTML = `
            <h2>${template.title} Template</h2>
            <p class="template-description">${template.description}</p>
            
            <div class="template-preview-image">
                <img src="${template.preview}" alt="${template.title} Template Preview">
            </div>
            
            <div class="template-features">
                <h3>Template Features</h3>
                <ul>${featuresHtml}</ul>
            </div>
            
            <div class="template-actions">
                <button id="use-template-btn" class="btn btn-primary" data-template="${templateType}">Use This Template</button>
            </div>
        `;
        
        // Show modal
        previewModal.style.display = 'flex';
        
        // Add event listener to use template button
        const useBtn = document.getElementById('use-template-btn');
        if (useBtn) {
            useBtn.addEventListener('click', function() {
                const selectedTemplate = this.getAttribute('data-template');
                useTemplate(selectedTemplate);
            });
        }
    }
    
    // Use template
    function useTemplate(templateType) {
        console.log('Using template:', templateType);
        
        // Check if user is logged in before proceeding
        if (!isTokenValid()) {
            console.log('User not logged in, redirecting to login');
            // Store the selected template to use after login
            localStorage.setItem('pendingTemplate', templateType);
            window.location.href = 'login.html?redirect=create';
            return;
        }
        
        // Store selected template in localStorage
        localStorage.setItem('selectedTemplate', templateType);
        
        // Redirect to create proposal page
        window.location.href = 'create.html';
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            previewModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
    
    // Check if a template was pre-selected (e.g., from homepage)
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedTemplate = urlParams.get('template');
    
    if (preselectedTemplate && templates[preselectedTemplate]) {
        console.log('Pre-selected template found:', preselectedTemplate);
        showTemplatePreview(preselectedTemplate);
    }
    
    // Handle hash links for template sections
    const hash = window.location.hash.substring(1);
    if (hash && templates[hash]) {
        console.log('Template hash found:', hash);
        
        // Scroll to template section
        const templateSection = document.getElementById(`${hash}-template`);
        if (templateSection) {
            templateSection.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the template card
            const templateCard = document.querySelector(`.template-card[data-template="${hash}"]`);
            if (templateCard) {
                templateCard.classList.add('highlight');
                
                // Remove highlight after a few seconds
                setTimeout(() => {
                    templateCard.classList.remove('highlight');
                }, 2000);
            }
        }
    }
});
