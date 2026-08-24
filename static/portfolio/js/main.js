// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const brandLink = document.querySelector('.nav-brand a');

    if (brandLink) {
        const BRAND_STATE_KEY = 'brand-name-visible';
        let brandNameVisible = false;

        try {
            brandNameVisible = window.sessionStorage.getItem(BRAND_STATE_KEY) === 'true';
        } catch (e) {
            // Keep the interaction working when browser storage is unavailable.
        }

        brandLink.classList.toggle('is-clicked', brandNameVisible);
        brandLink.addEventListener('click', function () {
            brandNameVisible = !brandNameVisible;
            brandLink.classList.toggle('is-clicked', brandNameVisible);

            try {
                window.sessionStorage.setItem(BRAND_STATE_KEY, String(brandNameVisible));
            } catch (e) {
                // The visual state still works without browser storage.
            }
        });
    }

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

    const motionSections = document.querySelectorAll('main > section');
    const motionItems = document.querySelectorAll(
        '.timeline-item, .project-card, .certificate-item, .skill-item, .soft-skill-item, .contact-item, .about-stat, .feature-card'
    );

    document.documentElement.classList.add('motion-ready');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries, currentObserver) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -48px' });

        motionSections.forEach((section, index) => {
            section.classList.add('motion-section');
            section.style.setProperty('--motion-section-delay', `${Math.min(index, 3) * 80}ms`);
            revealObserver.observe(section);
        });

        motionItems.forEach((item, index) => {
            item.classList.add('motion-item');
            item.style.setProperty('--motion-delay', `${Math.min(index % 6, 5) * 70}ms`);
            revealObserver.observe(item);
        });
    } else {
        motionSections.forEach(section => section.classList.add('is-visible'));
        motionItems.forEach(item => item.classList.add('is-visible'));
    }

    const homeHero = document.querySelector('.hero');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (homeHero && !prefersReducedMotion) {
        document.body.classList.add('home-interactive');

        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('pointermove', function(event) {
                if (event.pointerType === 'touch') return;

                const bounds = card.getBoundingClientRect();
                const horizontalOffset = (event.clientX - bounds.left) / bounds.width - 0.5;
                const verticalOffset = (event.clientY - bounds.top) / bounds.height - 0.5;

                card.style.setProperty('--card-rotate-x', `${(verticalOffset * -4).toFixed(2)}deg`);
                card.style.setProperty('--card-rotate-y', `${(horizontalOffset * 4).toFixed(2)}deg`);
                card.classList.add('is-pointer-active');
            });

            card.addEventListener('pointerleave', function() {
                card.classList.remove('is-pointer-active');
                card.style.removeProperty('--card-rotate-x');
                card.style.removeProperty('--card-rotate-y');
            });
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

    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function(event) {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const targetUrl = new URL(link.href, window.location.href);
            const isInternalPageLink = targetUrl.origin === window.location.origin
                && targetUrl.pathname !== window.location.pathname
                && !link.hasAttribute('download')
                && !link.classList.contains('media-link');

            if (!isInternalPageLink) return;

            event.preventDefault();
            document.body.classList.add('page-exit');
            window.setTimeout(() => {
                window.location.href = targetUrl.href;
            }, 180);
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
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('is-submitting');
                submitButton.setAttribute('aria-busy', 'true');
            }
        });
    }
});

// Certificate Modal Functions
function getMediaSource(element) {
    if (!element) return '';

    return element.dataset.mediaSrc
        || element.currentSrc
        || element.getAttribute('src')
        || element.src
        || element.getAttribute('href')
        || element.href
        || '';
}

function openModal(img) {
    const modal = document.getElementById('certificateModal');
    const modalImg = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalKind = document.getElementById('modalKind');
    const modalTitle = document.getElementById('modalTitle');
    const captionText = document.getElementById('modalCaption');

    if (!modal || !modalImg || !modalVideo || !modalKind || !modalTitle || !captionText || !img) return;
    const mediaSource = getMediaSource(img);
    if (!mediaSource) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modalVideo.classList.remove('active');

    modalImg.src = mediaSource;
    modalImg.alt = img.alt || '';
    modalImg.classList.add('active');
    modalKind.textContent = 'Certificate Image';
    modalTitle.textContent = img.alt || 'Certificate Preview';
    captionText.textContent = img.alt || '';

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('certificateModal');
    const modalImg = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalKind = document.getElementById('modalKind');
    const modalTitle = document.getElementById('modalTitle');
    if (!modal || !modalImg || !modalVideo || !modalKind || !modalTitle) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.classList.remove('active');
    modalImg.removeAttribute('src');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modalVideo.classList.remove('active');
    modalKind.textContent = 'Media Preview';
    modalTitle.textContent = 'Project Media';

    // Restore body scroll
    document.body.style.overflow = '';
}

function openMediaModal(event, link) {
    event.preventDefault();

    const modal = document.getElementById('certificateModal');
    const modalImg = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalKind = document.getElementById('modalKind');
    const modalTitle = document.getElementById('modalTitle');
    const captionText = document.getElementById('modalCaption');

    if (!modal || !modalImg || !modalVideo || !modalKind || !modalTitle || !captionText || !link) return;

    const mediaSource = getMediaSource(link);
    const mediaType = link.dataset.mediaType || (mediaSource.split('?')[0].toLowerCase().endsWith('.mp4') ? 'video' : 'image');
    if (!mediaSource) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modalImg.classList.remove('active');
    modalVideo.classList.remove('active');
    modalImg.removeAttribute('src');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modalKind.textContent = mediaType === 'video' ? 'Project Video' : 'Project Image';
    modalTitle.textContent = link.getAttribute('aria-label') || (mediaType === 'video' ? 'Video Preview' : 'Image Preview');
    captionText.textContent = link.getAttribute('aria-label') || (mediaType === 'video' ? 'Project video' : 'Project image');

    if (mediaType === 'video') {
        modalVideo.src = encodeURI(mediaSource);
        modalVideo.classList.add('active');
        modalVideo.load();
        modalVideo.play().catch(function () {
            modalVideo.muted = true;
            modalVideo.play().catch(function () {
                captionText.textContent = 'The project video could not be played. Use the video controls to retry.';
            });
        });
    } else {
        modalImg.src = mediaSource;
        modalImg.alt = link.getAttribute('aria-label') || 'Project image';
        modalImg.classList.add('active');
    }

    document.body.style.overflow = 'hidden';
}

// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.media-link').forEach(function (link) {
        link.addEventListener('click', function (event) {
            openMediaModal(event, link);
        });
    });

    document.addEventListener('click', function (event) {
        const overlay = event.target.closest('.certificate-overlay, .achievement-overlay');
        if (!overlay) return;

        const image = overlay.parentElement.querySelector('img');
        if (!image) return;

        event.preventDefault();
        event.stopPropagation();
        openModal(image);
    });

    document.querySelectorAll('.experience-photo-item').forEach(function (photoItem) {
        const image = photoItem.querySelector('.experience-photo');
        if (!image || photoItem.querySelector('.experience-photo-preview')) return;

        const previewButton = document.createElement('button');
        previewButton.type = 'button';
        previewButton.className = 'experience-photo-preview';
        previewButton.setAttribute('aria-label', `View full image: ${image.alt || 'Experience photo'}`);
        previewButton.innerHTML = '<i class="fas fa-eye" aria-hidden="true"></i>';
        previewButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            openModal(image);
        });
        photoItem.appendChild(previewButton);

        image.addEventListener('click', function () {
            openModal(image);
        });
    });

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
            ? 'linear-gradient(135deg, #0b1220 0%, #172554 100%)'
            : 'linear-gradient(135deg, #f8fbff 0%, #eaf2ff 100%)';
        document.body.style.color = theme === 'dark' ? '#eff6ff' : '#0f1f3d';

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

/* Experience & Achievement Gallery Functions */

/**
 * Open experience/achievement photo gallery modal
 * @param {string} galleryId - The ID of the gallery modal to open
 */
function openGalleryModal(galleryId) {
    const gallery = document.getElementById(galleryId);
    if (gallery) {
        gallery.classList.add('active');
        gallery.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const closeButton = gallery.querySelector('.gallery-close-btn');
        if (closeButton) {
            setTimeout(() => closeButton.focus(), 0);
        }
    }
}

/**
 * Close experience/achievement photo gallery modal
 * @param {Event} event - The click event
 * @param {string} galleryId - The ID of the gallery modal to close
 */
function closeGalleryModal(event, galleryId) {
    if (event) {
        event.preventDefault();
    }
    const gallery = document.getElementById(galleryId);
    if (gallery) {
        gallery.classList.remove('active');
        gallery.setAttribute('aria-hidden', 'true');

        const hasOpenGallery = document.querySelector('.experience-gallery-modal.active');
        if (!hasOpenGallery) {
            document.body.style.overflow = '';
        }
    }
}

document.addEventListener('click', function(event) {
    const trigger = event.target.closest('[data-gallery-target]');
    if (!trigger) return;

    const galleryId = trigger.dataset.galleryTarget;
    if (!galleryId) return;

    event.preventDefault();
    openGalleryModal(galleryId);
});

/**
 * Open achievement modal with image and details
 * @param {string} achievementId - The ID of the achievement modal to open
 */
function openAchievementModal(achievementId) {
    const modal = document.getElementById(achievementId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.focus();
    }
}

/**
 * Close achievement modal
 * @param {string} achievementId - The ID of the achievement modal to close
 */
function closeAchievementModal(achievementId) {
    const modal = document.getElementById(achievementId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close gallery modals when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    // Gallery modals
    document.querySelectorAll('.experience-gallery-modal').forEach(function(modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                const galleryId = this.id;
                closeGalleryModal(null, galleryId);
            }
        });
    });

    // Achievement modals
    document.querySelectorAll('.achievement-modal-panel').forEach(function(modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                const achievementId = this.id;
                closeAchievementModal(achievementId);
            }
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Close gallery modals
            document.querySelectorAll('.experience-gallery-modal.active').forEach(function(modal) {
                const galleryId = modal.id;
                closeGalleryModal(null, galleryId);
            });

            // Close achievement modals
            document.querySelectorAll('.achievement-modal-panel.active').forEach(function(modal) {
                const achievementId = modal.id;
                closeAchievementModal(achievementId);
            });
        }
    });
});


