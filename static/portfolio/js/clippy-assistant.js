/**
 * Clippy-inspired Portfolio Assistant
 * A friendly, animated guide for portfolio visitors
 */

class ClippyAssistant {
    constructor() {
        this.isVisible = false;
        this.isBubbleVisible = false;
        this.dismissedKey = 'clippy-assistant-dismissed';
        this.lastMessageTimeKey = 'clippy-last-message-time';
        this.messages = [
            "Hi! Welcome to my portfolio.",
            "Need help finding something?",
            "Try asking Roland AI about my projects!",
            "Want to learn more about my experience?",
            "Check out my latest projects!",
            "Explore my achievements and certifications.",
            "Click me to chat with Roland AI!",
            "Looking for something specific?",
            "Discover my skills and expertise.",
            "Have a question? I'm here to help!"
        ];
        
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        // Check if assistant was dismissed
        const isDismissed = localStorage.getItem(this.dismissedKey) === 'true';
        if (isDismissed) {
            this.createShowButton();
            return;
        }

        // Create the assistant elements
        this.createAssistant();
        
        // Delay appearance for 5-8 seconds
        const delay = 5000 + Math.random() * 3000;
        this.appearanceTimeout = setTimeout(() => this.show(), delay);
    }

    createAssistant() {
        const container = document.createElement('div');
        container.className = 'clippy-container';
        container.id = 'clippyContainer';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-label', 'Portfolio assistant');
        
        // SVG Paperclip character
        container.innerHTML = `
            <div class="clippy-wrapper">
                <svg class="clippy-character" viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <!-- Body (paperclip shape) -->
                    <path class="clippy-body" d="M32 15 Q20 15 20 25 Q20 35 32 45 Q44 35 44 25 Q44 15 32 15" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    
                    <!-- Eyes -->
                    <circle class="clippy-eye" cx="28" cy="25" r="2" fill="white"/>
                    <circle class="clippy-eye" cx="36" cy="25" r="2" fill="white"/>
                    
                    <!-- Mouth -->
                    <path class="clippy-mouth" d="M28 32 Q32 35 36 32" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    
                    <!-- Left arm -->
                    <path class="clippy-arm clippy-arm-left" d="M24 28 L16 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    
                    <!-- Right arm -->
                    <path class="clippy-arm clippy-arm-right" d="M40 28 L48 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    
                    <!-- Shine effect -->
                    <ellipse class="clippy-shine" cx="28" cy="22" rx="3" ry="4" fill="rgba(255,255,255,0.4)"/>
                </svg>
                
                <button 
                    type="button" 
                    class="clippy-button" 
                    id="clippyButton"
                    aria-label="Open portfolio assistant"
                    aria-pressed="false">
                    <span class="sr-only">Portfolio Assistant</span>
                </button>
            </div>
            
            <div class="clippy-bubble" id="clippyBubble" role="tooltip">
                <div class="clippy-bubble-arrow"></div>
                <div class="clippy-bubble-text" id="clippyText"></div>
            </div>
            
            <div class="clippy-controls">
                <button 
                    type="button" 
                    class="clippy-close-btn" 
                    id="clippyCloseBtn"
                    aria-label="Dismiss portfolio assistant"
                    title="Dismiss">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(container);
        this.container = container;
        this.button = document.getElementById('clippyButton');
        this.bubble = document.getElementById('clippyBubble');
        this.bubbleText = document.getElementById('clippyText');
        this.closeBtn = document.getElementById('clippyCloseBtn');
        
        this.attachEventListeners();
    }

    attachEventListeners() {
        if (this.button) {
            this.button.addEventListener('click', () => this.openRolandAI());
            this.button.addEventListener('mouseenter', () => this.enlargeCharacter());
            this.button.addEventListener('mouseleave', () => this.normalizeCharacter());
        }
        
        if (this.bubble) {
            this.bubble.addEventListener('click', () => this.openRolandAI());
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.dismiss());
        }
        
        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (this.isVisible && e.key === 'Escape') {
                this.dismiss();
            }
            if (this.isVisible && e.key === ' ' && e.target === this.button) {
                e.preventDefault();
                this.openRolandAI();
            }
        });
    }

    show() {
        if (this.isVisible || !this.container) return;
        
        this.isVisible = true;
        
        // Force apply styles via inline style (workaround for CSS issues)
        // Temporarily disable transition for immediate effect
        const originalTransition = this.container.style.transition;
        this.container.style.transition = 'none';
        
        this.container.classList.add('clippy-visible');
        this.container.style.opacity = '1 !important';
        this.container.style.transform = 'translateY(0) scale(1)';
        this.container.style.pointerEvents = 'auto';
        
        // Re-enable transition after a tick
        setTimeout(() => {
            if (this.container) {
                this.container.style.transition = originalTransition;
            }
        }, 10);
        
        // Show a random message
        this.showBubble();
        
        // Start idle animations
        this.startIdleAnimations();
    }

    showBubble() {
        if (!this.bubble || !this.bubbleText) return;
        
        const message = this.getRandomMessage();
        this.bubbleText.textContent = message;
        this.isBubbleVisible = true;
        this.bubble.classList.add('clippy-bubble-visible');
        
        // Auto-hide bubble after 6 seconds
        clearTimeout(this.bubbleTimeout);
        this.bubbleTimeout = setTimeout(() => this.hideBubble(), 6000);
    }

    hideBubble() {
        if (!this.bubble) return;
        this.isBubbleVisible = false;
        this.bubble.classList.remove('clippy-bubble-visible');
    }

    getRandomMessage() {
        return this.messages[Math.floor(Math.random() * this.messages.length)];
    }

    enlargeCharacter() {
        if (!this.container || this.prefersReducedMotion) return;
        this.container.classList.add('clippy-enlarged');
    }

    normalizeCharacter() {
        if (!this.container) return;
        this.container.classList.remove('clippy-enlarged');
    }

    startIdleAnimations() {
        if (this.prefersReducedMotion) return;
        
        // Blink every 3-5 seconds
        this.scheduleNextBlink();
        
        // Bounce every 20-30 seconds
        this.scheduleNextBounce();
        
        // Show bubble randomly every 30-45 seconds
        this.scheduleNextBubble();
    }

    scheduleNextBlink() {
        clearTimeout(this.blinkTimeout);
        const delay = 3000 + Math.random() * 2000;
        this.blinkTimeout = setTimeout(() => {
            if (this.isVisible && this.container) {
                this.container.classList.add('clippy-blink');
                setTimeout(() => {
                    if (this.container) this.container.classList.remove('clippy-blink');
                }, 150);
                this.scheduleNextBlink();
            }
        }, delay);
    }

    scheduleNextBounce() {
        clearTimeout(this.bounceTimeout);
        const delay = 20000 + Math.random() * 10000;
        this.bounceTimeout = setTimeout(() => {
            if (this.isVisible && this.container) {
                this.container.classList.add('clippy-bounce');
                setTimeout(() => {
                    if (this.container) this.container.classList.remove('clippy-bounce');
                }, 600);
                this.scheduleNextBounce();
            }
        }, delay);
    }

    scheduleNextBubble() {
        clearTimeout(this.bubbleShowTimeout);
        const delay = 30000 + Math.random() * 15000;
        this.bubbleShowTimeout = setTimeout(() => {
            if (this.isVisible && !this.isBubbleVisible) {
                this.showBubble();
            }
            this.scheduleNextBubble();
        }, delay);
    }

    openRolandAI() {
        const assistantToggle = document.getElementById('assistantToggle');
        if (assistantToggle) {
            assistantToggle.click();
        }
    }

    dismiss() {
        if (!this.container) return;
        
        localStorage.setItem(this.dismissedKey, 'true');
        this.isVisible = false;
        
        // Clear all timeouts
        clearTimeout(this.appearanceTimeout);
        clearTimeout(this.bubbleTimeout);
        clearTimeout(this.blinkTimeout);
        clearTimeout(this.bounceTimeout);
        clearTimeout(this.bubbleShowTimeout);
        
        // Fade out and remove
        this.container.classList.remove('clippy-visible');
        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(100px) scale(0.8)';
        this.container.style.pointerEvents = 'none';
        
        setTimeout(() => {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            this.createShowButton();
        }, 300);
    }

    createShowButton() {
        // Create a small button to restore the assistant
        const showBtnContainer = document.createElement('div');
        showBtnContainer.className = 'clippy-show-container';
        showBtnContainer.id = 'clippyShowContainer';
        showBtnContainer.innerHTML = `
            <button 
                type="button" 
                class="clippy-show-btn" 
                id="clippyShowBtn"
                aria-label="Show portfolio assistant"
                title="Show Assistant">
                <i class="fas fa-paperclip" aria-hidden="true"></i>
            </button>
        `;
        
        document.body.appendChild(showBtnContainer);
        
        const showBtn = document.getElementById('clippyShowBtn');
        if (showBtn) {
            showBtn.addEventListener('click', () => this.restore());
        }
    }

    restore() {
        // Remove the show button
        const showContainer = document.getElementById('clippyShowContainer');
        if (showContainer && showContainer.parentNode) {
            showContainer.parentNode.removeChild(showContainer);
        }
        
        // Clear dismissed state
        localStorage.removeItem(this.dismissedKey);
        
        // Recreate and show
        this.init();
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ClippyAssistant();
    });
} else {
    new ClippyAssistant();
}
