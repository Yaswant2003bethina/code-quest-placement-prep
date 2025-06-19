
// Main JavaScript file for CodePlace platform

// Global variables
let isNavOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFlashMessages();
    initializeFormValidation();
    initializeAnimations();
    initializePlatformFeatures();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            toggleNavigation();
        });
        
        // Close navigation when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeNavigation();
                }
            });
        });
        
        // Close navigation when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                closeNavigation();
            }
        });
    }
    
    // Handle dropdown menus
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (toggle && content) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDropdown(dropdown);
            });
        }
    });
}

function toggleNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    isNavOpen = !isNavOpen;
    
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when nav is open
    document.body.style.overflow = isNavOpen ? 'hidden' : '';
}

function closeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (isNavOpen) {
        isNavOpen = false;
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function toggleDropdown(dropdown) {
    const content = dropdown.querySelector('.dropdown-content');
    const isOpen = content.style.opacity === '1';
    
    // Close all dropdowns
    document.querySelectorAll('.dropdown-content').forEach(item => {
        item.style.opacity = '0';
        item.style.visibility = 'hidden';
        item.style.transform = 'translateY(-10px)';
    });
    
    // Open this dropdown if it wasn't open
    if (!isOpen) {
        content.style.opacity = '1';
        content.style.visibility = 'visible';
        content.style.transform = 'translateY(0)';
    }
}

// Flash message functionality
function initializeFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-message');
    
    flashMessages.forEach(message => {
        const closeBtn = message.querySelector('.flash-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                hideFlashMessage(message);
            });
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideFlashMessage(message);
        }, 5000);
    });
}

function hideFlashMessage(message) {
    message.style.transform = 'translateX(100%)';
    message.style.opacity = '0';
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 300);
}

function showFlashMessage(text, type = 'info') {
    const container = document.querySelector('.flash-container') || createFlashContainer();
    
    const message = document.createElement('div');
    message.className = `flash-message flash-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'exclamation-triangle';
    
    message.innerHTML = `
        <i class="fas fa-${icon}"></i>
        ${text}
        <button class="flash-close">&times;</button>
    `;
    
    container.appendChild(message);
    
    // Add event listener for close button
    const closeBtn = message.querySelector('.flash-close');
    closeBtn.addEventListener('click', function() {
        hideFlashMessage(message);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideFlashMessage(message);
    }, 5000);
}

function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-container';
    document.body.appendChild(container);
    return container;
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                clearInputError(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFlashMessage('Please fix the errors below', 'error');
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Password validation
    else if (type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters long';
        }
    }
    
    if (!isValid) {
        showInputError(input, errorMessage);
    } else {
        clearInputError(input);
    }
    
    return isValid;
}

function showInputError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorDiv);
}

function clearInputError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    const cards = document.querySelectorAll('.feature-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .problem-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Hero animation
    const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 200));
    });
}

// Platform-specific features
function initializePlatformFeatures() {
    // Code editor themes
    initializeThemeToggle();
    
    // Keyboard shortcuts
    initializeKeyboardShortcuts();
    
    // Auto-save functionality
    initializeAutoSave();
    
    // Search functionality
    initializeSearch();
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to run code
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const runButton = document.querySelector('[onclick="runCode()"]');
            if (runButton) {
                runButton.click();
            }
        }
        
        // Ctrl/Cmd + S to save/submit
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const submitButton = document.querySelector('[onclick="submitCode()"]');
            if (submitButton) {
                submitButton.click();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal[style*="flex"]');
            if (modal) {
                closeModal();
            }
        }
    });
}

function initializeAutoSave() {
    let autoSaveTimer;
    const codeEditor = document.getElementById('codeEditor');
    
    if (codeEditor && typeof editor !== 'undefined') {
        editor.onDidChangeModelContent(() => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveToLocalStorage();
            }, 2000);
        });
        
        // Load from localStorage on page load
        loadFromLocalStorage();
    }
}

function saveToLocalStorage() {
    if (typeof editor !== 'undefined') {
        const code = editor.getValue();
        const language = document.getElementById('languageSelect')?.value || 'python';
        const problemId = window.location.pathname.split('/').pop();
        
        const saveData = {
            code: code,
            language: language,
            timestamp: Date.now()
        };
        
        localStorage.setItem(`code_${problemId}`, JSON.stringify(saveData));
    }
}

function loadFromLocalStorage() {
    const problemId = window.location.pathname.split('/').pop();
    const saved = localStorage.getItem(`code_${problemId}`);
    
    if (saved && typeof editor !== 'undefined') {
        try {
            const saveData = JSON.parse(saved);
            const timeDiff = Date.now() - saveData.timestamp;
            
            // Only load if saved within last 24 hours
            if (timeDiff < 24 * 60 * 60 * 1000) {
                editor.setValue(saveData.code);
                
                const languageSelect = document.getElementById('languageSelect');
                if (languageSelect) {
                    languageSelect.value = saveData.language;
                    changeLanguage();
                }
            }
        } catch (e) {
            console.error('Error loading saved code:', e);
        }
    }
}

function initializeSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        let searchTimer;
        
        input.addEventListener('input', function() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
    });
}

function performSearch(query) {
    const searchableElements = document.querySelectorAll('[data-searchable]');
    
    searchableElements.forEach(element => {
        const searchText = element.getAttribute('data-searchable').toLowerCase();
        const matches = searchText.includes(query.toLowerCase());
        
        element.style.display = matches || !query ? 'block' : 'none';
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showFlashMessage('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showFlashMessage('Failed to copy text', 'error');
    });
}

function downloadFile(filename, content, type = 'text/plain') {
    const blob = new Blob([content], { type: type });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// API helpers
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Performance monitoring
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showFlashMessage('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showFlashMessage('An unexpected error occurred', 'error');
});

// Service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export for use in other files
window.CodePlace = {
    showFlashMessage,
    hideFlashMessage,
    toggleTheme,
    copyToClipboard,
    downloadFile,
    apiRequest,
    formatTime,
    formatBytes,
    debounce,
    throttle
};
