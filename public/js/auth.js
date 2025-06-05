// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const email = document.getElementById('login-email');
            const password = document.getElementById('login-password');
            
            // Validate email
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                return;
            }
            
            // Validate password
            if (!password.value) {
                showError(password, 'Password is required');
                return;
            }
            
            // Show loading state
            const submitButton = document.querySelector('#login-form button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Logging in...';
            submitButton.disabled = true;
            
            // Use the API client for login
            api.login(email.value, password.value)
                .then(data => {
                    // Redirect to dashboard after successful login
                    window.location.href = '/pages/dashboard.html';
                })
                .catch(error => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    showError(password, error.message || 'Login failed. Please check your credentials.');
                });
        });
    }
    
    // Password reset functionality
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email field
            const email = document.getElementById('reset-email');
            
            // Validate email
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                return;
            }
            
            // Show loading state
            const submitButton = document.querySelector('#reset-form button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Use the API client for password reset
            api.forgotPassword(email.value)
                .then(data => {
                    // Show success message
                    const resetForm = document.getElementById('reset-form');
                    resetForm.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3>Reset Link Sent</h3>
                            <p>We've sent a password reset link to ${email.value}. Please check your email and follow the instructions.</p>
                            <a href="login.html" class="btn btn-primary">Back to Login</a>
                        </div>
                    `;
                })
                .catch(error => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    showError(email, error.message || 'Failed to send reset link. Please try again.');
                });
        });
    }
});

// Email validation helper
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Show error message
function showError(input, message) {
    // Remove any existing error messages
    const parent = input.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
        parent.removeChild(existingError);
    }
    
    // Add error class to input
    input.classList.add('error');
    
    // Create and append error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    parent.appendChild(errorDiv);
    
    // Focus on the input with error
    input.focus();
}
