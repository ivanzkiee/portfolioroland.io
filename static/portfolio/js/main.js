// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Animate skill bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 100);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-item').forEach(item => {
        observer.observe(item);
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to your backend
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
});

// Certificate Modal Functions
function openModal(img) {
    const modal = document.getElementById('certificateModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');

    if (!modal || !modalImg || !captionText || !img) return;

    modal.classList.add('active');
    modal.style.display = 'flex';
    modalImg.src = img.src || '';
    modalImg.alt = img.alt || '';
    captionText.innerHTML = img.alt || '';

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('certificateModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.style.display = 'none';

    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});

// Theme Toggle (Light/Dark)
document.addEventListener('DOMContentLoaded', function () {
    if (window.__themeToggleBound) return;
    window.__themeToggleBound = true;

    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const icon = toggle.querySelector('i');
    const THEME_KEY = 'theme';

    function readStoredTheme() {
        try {
            return window.localStorage ? window.localStorage.getItem(THEME_KEY) : null;
        } catch (e) {
            return null;
        }
    }

    function persistTheme(theme) {
        try {
            window.localStorage && window.localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            // Ignore if storage is blocked
        }
    }

    function applyTheme(theme, persist) {
        if (!theme) return;

        document.documentElement.dataset.theme = theme;
        document.documentElement.classList.toggle('theme-dark', theme === 'dark');
        document.documentElement.classList.toggle('theme-light', theme === 'light');

        document.body.style.background = theme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
        document.body.style.color = theme === 'dark' ? '#f1f5f9' : '#0f172a';

        if (icon) {
            icon.classList.remove('fa-sun', 'fa-moon');
            icon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun');
        }

        if (persist) persistTheme(theme);
    }

    const storedTheme = readStoredTheme();
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = document.documentElement.dataset.theme || storedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme, false);

    toggle.addEventListener('click', function () {
        const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
    });

    const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mql && !storedTheme) {
        const handler = function (e) {
            applyTheme(e.matches ? 'dark' : 'light', false);
        };
        if (mql.addEventListener) mql.addEventListener('change', handler);
        else if (mql.addListener) mql.addListener(handler);
    }
});

