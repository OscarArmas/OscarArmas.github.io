// ===== MAIN JAVASCRIPT FUNCTIONALITY =====

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeTimelineAnimations();
    initializeTimelineExpand();
    initializeCompanyLinks();
});

// Initialize all functionality
function initializeApp() {
    setupNavigation();
    setupIntersectionObserver();
    loadSavedMessage();
    setupEventListeners();
}

// ===== NAVIGATION FUNCTIONALITY =====
function setupNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNav);
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== INTERSECTION OBSERVER =====
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ===== MESSAGE BUBBLE FUNCTIONALITY =====
function loadSavedMessage() {
    const savedMessage = localStorage.getItem('oscarCustomMessage');
    if (savedMessage) {
        const messageDiv = document.getElementById('bubbleMessage');
        if (messageDiv) {
            messageDiv.textContent = savedMessage;
        }
    }
}

function setupEventListeners() {
    // Close bubble when clicking outside
    document.addEventListener('click', function(event) {
        const bubble = document.getElementById('messageBubble');
        const quickMessages = document.getElementById('quickMessages');
        const avatar = document.querySelector('.hero-avatar');
        
        if (bubble && avatar && !avatar.contains(event.target)) {
            bubble.classList.remove('show');
            if (quickMessages) {
                quickMessages.classList.remove('show');
            }
        }
    });

    // Prevent bubble from closing when clicking inside it
    const messageBubble = document.getElementById('messageBubble');
    if (messageBubble) {
        messageBubble.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    const quickMessages = document.getElementById('quickMessages');
    if (quickMessages) {
        quickMessages.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
}

// ===== UTILITY FUNCTIONS =====
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

// Throttle function for performance
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

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttled scroll handler
const throttledScrollHandler = throttle(updateActiveNav, 100);
window.addEventListener('scroll', throttledScrollHandler);

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Escape key to close modals/bubbles
    if (event.key === 'Escape') {
        const bubble = document.getElementById('messageBubble');
        const quickMessages = document.getElementById('quickMessages');
        
        if (bubble && bubble.classList.contains('show')) {
            bubble.classList.remove('show');
        }
        if (quickMessages && quickMessages.classList.contains('show')) {
            quickMessages.classList.remove('show');
        }
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    // You could send this to an error tracking service
});

// ===== PWA SUPPORT (if needed in the future) =====
if ('serviceWorker' in navigator) {
    // Register service worker for offline functionality
    // navigator.serviceWorker.register('/sw.js');
}

// ===== ANALYTICS (if needed) =====
function trackEvent(eventName, eventData = {}) {
    // Google Analytics or other tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Custom tracking
    console.log('Event tracked:', eventName, eventData);
}

// ===== EXPORT FUNCTIONS FOR OTHER MODULES =====
window.AppUtils = {
    debounce,
    throttle,
    trackEvent
};



// Timeline animations
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Add staggered animation when scrolling into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 200);
            }
        });
    }, {
        threshold: 0.1
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Utility function to detect mobile devices
function isMobile() {
    return window.innerWidth <= 768 || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
}

// Timeline expand/collapse functionality
function initializeTimelineExpand() {
    const expandBtn = document.getElementById('expandTimelineBtn');
    const timelineTrack = document.getElementById('timelineTrack');
    const expandableItems = document.querySelectorAll('.timeline-item.expandable');
    
    if (!expandBtn || !timelineTrack) return;
    
    let isExpanded = false;
    
    expandBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            // Expand timeline
            timelineTrack.classList.add('expanded');
            expandBtn.classList.add('expanded');
            expandBtn.querySelector('.btn-text').textContent = 'View less';
            
            // Show expandable items with staggered animation
            expandableItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('show');
                }, index * 100);
            });
            
        } else {
            // Collapse timeline
            timelineTrack.classList.remove('expanded');
            expandBtn.classList.remove('expanded');
            expandBtn.querySelector('.btn-text').textContent = 'View more experiences';
            
            // Hide expandable items
            expandableItems.forEach(item => {
                item.classList.remove('show');
            });
            
            // Scroll back to top of timeline
            timelineTrack.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// Global function for timeline toggle (called from HTML)
function toggleTimeline() {
    const expandBtn = document.querySelector('button[onclick="toggleTimeline()"]');
    const timelineTrack = document.getElementById('timelineTrack');
    const expandableItems = document.querySelectorAll('.timeline-item.expandable');
    const btnText = expandBtn.querySelector('.btn-text');
    const btnIcon = expandBtn.querySelector('.btn-icon');
    
    if (!timelineTrack) return;
    
    const isExpanded = timelineTrack.classList.contains('expanded');
    
    if (!isExpanded) {
        // Expand timeline
        timelineTrack.classList.add('expanded');
        btnText.textContent = 'View less';
        btnIcon.style.transform = 'rotate(180deg)';
        
        // Show expandable items with staggered animation
        expandableItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show');
            }, index * 100);
        });
        
    } else {
        // Collapse timeline
        timelineTrack.classList.remove('expanded');
        btnText.textContent = 'View more experiences';
        btnIcon.style.transform = 'rotate(0deg)';
        
        // Hide expandable items
        expandableItems.forEach(item => {
            item.classList.remove('show');
        });
        
        // Scroll back to top of timeline
        timelineTrack.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize company links
function initializeCompanyLinks() {
    const companyLinks = document.querySelectorAll('.company-link');
    
    companyLinks.forEach(link => {
        // Add click event to open the company link
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}