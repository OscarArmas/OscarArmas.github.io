console.log('Carousel.js loaded successfully');

// ===== DIAGRAMS NAVIGATOR =====
class DiagramsNavigator {
    constructor() {
        this.currentIndex = 0;
        this.totalCards = 5;
        this.cardWidth = 400 + 16; // card width (400px) + gap (16px)
        console.log('DiagramsNavigator initialized');
        this.init();
    }
    
    init() {
        console.log('Initializing DiagramsNavigator...');
        this.setupEventListeners();
        this.updateNavigation();
        this.updateCardWidth();
        console.log('DiagramsNavigator setup complete');
    }
    
    updateCardWidth() {
        // Update card width based on screen size
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1200) {
            this.cardWidth = 400 + 16; // 400px + 16px gap
        } else if (screenWidth >= 768) {
            this.cardWidth = 350 + 16; // 350px + 16px gap
        } else if (screenWidth >= 480) {
            this.cardWidth = 300 + 16; // 300px + 16px gap
        } else {
            this.cardWidth = 280 + 12; // 280px + 12px gap
        }
        console.log('Card width updated:', this.cardWidth);
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation buttons
        const prevBtn = document.querySelector('.nav-btn.prev');
        const nextBtn = document.querySelector('.nav-btn.next');
        
        console.log('Found buttons:', { prevBtn: !!prevBtn, nextBtn: !!nextBtn });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Previous button clicked');
                this.previous();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                this.next();
            });
        }
        
        // Indicators
        const indicators = document.querySelectorAll('.indicator');
        console.log('Found indicators:', indicators.length);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Indicator clicked:', index);
                this.goTo(index);
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.updateCardWidth();
            this.updateTrack();
        });
    }
    
    goTo(index) {
        console.log('Going to index:', index);
        if (index < 0 || index >= this.totalCards) {
            console.log('Invalid index:', index);
            return;
        }
        
        this.currentIndex = index;
        this.updateTrack();
        this.updateIndicators();
        this.updateNavigation();
    }
    
    next() {
        console.log('Next called, current index:', this.currentIndex);
        if (this.currentIndex < this.totalCards - 1) {
            this.goTo(this.currentIndex + 1);
        } else {
            console.log('Already at last card');
        }
    }
    
    previous() {
        console.log('Previous called, current index:', this.currentIndex);
        if (this.currentIndex > 0) {
            this.goTo(this.currentIndex - 1);
        } else {
            console.log('Already at first card');
        }
    }
    
    updateTrack() {
        const track = document.querySelector('.diagrams-track');
        if (!track) {
            console.error('Track not found!');
            return;
        }
        
        const translateX = -(this.currentIndex * this.cardWidth);
        console.log('Updating track, translateX:', translateX);
        track.style.transform = `translateX(${translateX}px)`;
    }
    
    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateNavigation() {
        const prevBtn = document.querySelector('.nav-btn.prev');
        const nextBtn = document.querySelector('.nav-btn.next');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentIndex === this.totalCards - 1;
        }
    }
}

// ===== INITIALIZATION =====
let diagramsNavigator = null;

function initializeDiagramsNavigator() {
    console.log('Initializing DiagramsNavigator...');
    if (document.querySelector('.diagrams-track')) {
        console.log('Found diagrams track, creating navigator');
        diagramsNavigator = new DiagramsNavigator();
    } else {
        console.error('Diagrams track not found!');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDiagramsNavigator);
} else {
    initializeDiagramsNavigator();
}

// Export navigator
window.DiagramsNavigator = {
    instance: diagramsNavigator,
    initializeDiagramsNavigator
};

// ===== CSS ANIMATIONS =====
// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 