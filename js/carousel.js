// ===== CAROUSEL FUNCTIONALITY =====

class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.autoAdvanceInterval = null;
        this.autoAdvanceDelay = 8000; // 8 seconds
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAutoAdvance();
        this.setupHoverPause();
    }
    
    setupEventListeners() {
        // Previous button
        const prevBtn = document.querySelector('.carousel-btn.prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        // Next button
        const nextBtn = document.querySelector('.carousel-btn.next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    setupHoverPause() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.stopAutoAdvance());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoAdvance());
        }
    }
    
    showSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        const track = document.getElementById('carouselTrack');
        
        if (!slides.length || !track) return;
        
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        // Move track
        track.style.transform = `translateX(-${index * 100}%)`;
        this.currentSlide = index;
        
        // Track event
        if (window.AppUtils && window.AppUtils.trackEvent) {
            window.AppUtils.trackEvent('carousel_slide_changed', { 
                slideIndex: index,
                slideTitle: this.getSlideTitle(index)
            });
        }
    }
    
    getSlideTitle(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides[index]) {
            const title = slides[index].querySelector('h4');
            return title ? title.textContent : `Slide ${index + 1}`;
        }
        return `Slide ${index + 1}`;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }
    
    startAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
        }
        
        this.autoAdvanceInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoAdvanceDelay);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
    
    // Public method to manually control auto-advance
    toggleAutoAdvance() {
        if (this.autoAdvanceInterval) {
            this.stopAutoAdvance();
        } else {
            this.startAutoAdvance();
        }
    }
    
    // Get current slide info
    getCurrentSlideInfo() {
        return {
            index: this.currentSlide,
            title: this.getSlideTitle(this.currentSlide),
            total: this.totalSlides
        };
    }
    
    // Destroy carousel (cleanup)
    destroy() {
        this.stopAutoAdvance();
        // Remove event listeners if needed
    }
}

// Global carousel instance
let carouselInstance = null;

// Initialize carousel when DOM is ready
function initializeCarousel() {
    if (document.querySelector('.carousel-container')) {
        carouselInstance = new Carousel();
    }
}

// Global functions for onclick handlers
function nextSlide() {
    if (carouselInstance) {
        carouselInstance.nextSlide();
    }
}

function previousSlide() {
    if (carouselInstance) {
        carouselInstance.previousSlide();
    }
}

function goToSlide(index) {
    if (carouselInstance) {
        carouselInstance.goToSlide(index);
    }
}

// Export carousel instance and functions
window.CarouselManager = {
    instance: null,
    nextSlide,
    previousSlide,
    goToSlide,
    initializeCarousel
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCarousel);
} else {
    initializeCarousel();
} 