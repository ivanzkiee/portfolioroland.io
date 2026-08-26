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
            const isOpen = navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const motionItems = document.querySelectorAll(
        '.timeline-item, .project-card, .certificate-item, .skill-item, .soft-skill-item, .contact-item, .about-stat, .feature-card, .achievement-card, .honor-item'
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

        motionItems.forEach((item, index) => {
            item.classList.add('motion-item');
            item.style.setProperty('--motion-delay', `${Math.min(index % 6, 5) * 70}ms`);
            revealObserver.observe(item);
        });
    } else {
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
                if (progressBar && !entry.target.classList.contains('skill-progress-started')) {
                    entry.target.classList.add('skill-progress-started');
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
        item.addEventListener('click', function () {
            item.classList.toggle('is-expanded');
        });
        item.addEventListener('keydown', function (event) {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            item.classList.toggle('is-expanded');
        });
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

function initAssistant() {
    const toggle = document.getElementById('assistantToggle');
    const panel = document.getElementById('assistantPanel');
    const closeButton = document.getElementById('assistantClose');
    const messages = document.getElementById('assistantMessages');
    const suggestions = document.getElementById('assistantSuggestions');
    const form = document.getElementById('assistantForm');
    const input = document.getElementById('assistantInput');

    if (!toggle || !panel || !closeButton || !messages || !suggestions || !form || !input) return;

    let knowledge = null;

    function scrollMessagesToBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function normalizeText(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function singularize(word) {
        if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
        if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
        return word;
    }

    const questionStopWords = new Set([
        'a', 'about', 'an', 'and', 'are', 'can', 'did', 'do', 'for',
        'have', 'how', 'i', 'is', 'me', 'my', 'of', 'please', 'show',
        'tell', 'the', 'to', 'what', 'where', 'who', 'with', 'you', 'your'
    ]);

    function tokenize(value) {
        return normalizeText(value)
            .split(' ')
            .filter(word => word && !questionStopWords.has(word))
            .map(singularize);
    }

    function levenshteinDistance(a, b) {
        if (a === b) return 0;
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const prev = Array.from({ length: b.length + 1 }, (_, index) => index);
        const current = new Array(b.length + 1);

        for (let i = 1; i <= a.length; i += 1) {
            current[0] = i;
            for (let j = 1; j <= b.length; j += 1) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                current[j] = Math.min(
                    prev[j] + 1,
                    current[j - 1] + 1,
                    prev[j - 1] + cost
                );
            }
            for (let j = 0; j <= b.length; j += 1) {
                prev[j] = current[j];
            }
        }

        return current[b.length];
    }

    function fuzzyWordMatch(word, pattern) {
        const normalizedWord = singularize(normalizeText(word));
        const normalizedPattern = singularize(normalizeText(pattern));

        if (!normalizedWord || !normalizedPattern) return false;
        if (normalizedWord === normalizedPattern) return true;
        if (normalizedWord.includes(normalizedPattern) || normalizedPattern.includes(normalizedWord)) return true;
        if (normalizedWord.length <= 3 && normalizedPattern.length <= 3) return normalizedWord === normalizedPattern;

        return levenshteinDistance(normalizedWord, normalizedPattern) <= 1;
    }

    function phraseScore(questionText, phraseText) {
        const definedQuestion = normalizeText(questionText);
        const definedPhrase = normalizeText(phraseText);

        if (!definedQuestion || !definedPhrase) return 0;

        const questionWords = tokenize(questionText);
        const phraseWords = tokenize(phraseText);

        if (definedQuestion.includes(definedPhrase) && phraseWords.length > 1) return 30 + (phraseWords.length * 3);

        let score = 0;

        phraseWords.forEach(word => {
            if (!word) return;
            if (questionWords.includes(word)) {
                score += 8;
                return;
            }

            const fuzzyMatch = questionWords.some(questionWord => fuzzyWordMatch(questionWord, word));
            if (fuzzyMatch) {
                score += 5;
            }
        });

        if (phraseWords.length > 1 && score > 0) {
            score += phraseWords.filter(word => questionWords.includes(word)).length * 3;
        }

        return score;
    }

    function findAnswer(question) {
        if (!knowledge) return 'The assistant is still loading. Please try again in a moment.';

        const value = normalizeText(question);
        if (!value) return knowledge.fallback;

        let bestAnswer = null;
        let bestScore = 0;

        knowledge.answers.forEach(answer => {
            if (!answer) return;

            const fields = [
                { values: [answer.question], weight: 4 },
                { values: [answer.title], weight: 3 },
                { values: [answer.category], weight: 2 },
                { values: answer.keywords, weight: 2 },
                { values: answer.aliases, weight: 2 },
                { values: [answer.answer], weight: 1 }
            ];
            const score = fields.reduce((total, field) => {
                if (!Array.isArray(field.values)) return total;
                return total + field.values.reduce((fieldTotal, valueToScore) => {
                    return fieldTotal + (phraseScore(value, valueToScore) * field.weight);
                }, 0);
            }, 0);

            if (score > bestScore) {
                bestScore = score;
                bestAnswer = answer;
            }
        });

        if (!bestAnswer || bestScore < 6) {
            return knowledge.fallback;
        }

        return bestAnswer.answer;
    }

    function setOpen(isOpen) {
        toggle.setAttribute('aria-expanded', String(isOpen));
        panel.setAttribute('aria-hidden', String(!isOpen));
        panel.classList.toggle('is-open', isOpen);
        if (isOpen) {
            input.focus();
            suggestions.classList.add('is-visible');
        }
    }

    function addMessage(text, sender) {
        const message = document.createElement('div');
        message.className = `assistant-message assistant-message-${sender}`;
        message.textContent = text;
        messages.appendChild(message);
        scrollMessagesToBottom();
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'assistant-typing';
        typing.setAttribute('aria-label', 'Roland AI is typing');
        typing.innerHTML = `
            <span class="assistant-typing-label">Roland AI is typing...</span>
            <span class="assistant-typing-dots" aria-hidden="true">
                <span></span><span></span><span></span>
            </span>
        `;
        messages.appendChild(typing);
        scrollMessagesToBottom();
        return typing;
    }

    function ask(question) {
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion) return;

        addMessage(trimmedQuestion, 'user');
        input.value = '';
        const typing = showTyping();
        const delay = 500 + Math.random() * 500;

        window.setTimeout(() => {
            typing.remove();
            addMessage(findAnswer(trimmedQuestion), 'assistant');
        }, delay);
    }

    function renderSuggestions() {
        suggestions.innerHTML = '';
        knowledge.suggestions.forEach(question => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'assistant-suggestion';
            button.textContent = question;
            button.addEventListener('click', () => ask(question));
            suggestions.appendChild(button);
        });
    }

    toggle.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')));
    closeButton.addEventListener('click', () => setOpen(false));
    form.addEventListener('submit', event => {
        event.preventDefault();
        ask(input.value);
    });

    fetch('/static/portfolio/data/assistant-knowledge.json')
        .then(response => {
            if (!response.ok) throw new Error('Knowledge base unavailable');
            return response.json();
        })
        .then(data => {
            knowledge = data;
            renderSuggestions();
            addMessage(`Hi, I'm ${data.assistantName}. Ask me about Roland's portfolio.`, 'assistant');
            setOpen(false);
        })
        .catch(() => {
            knowledge = {
                assistantName: 'Ask Roland AI',
                fallback: "I'm sorry, I couldn't find an answer to that question.\n\nYou can ask me about:\n\n• Projects\n• TenantFlow\n• Internship\n• Leadership Experience\n• Technical Skills\n• Achievements\n• Certificates\n• Resume\n• Contact Information",
                suggestions: [],
                answers: []
            };
            addMessage("I don't have that information in Roland's portfolio yet.", 'assistant');
        });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && panel.classList.contains('is-open')) setOpen(false);
    });
}

document.addEventListener('DOMContentLoaded', initAssistant);

function openProjectDetails(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.project-details-close')?.focus();
}

function closeProjectDetails(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    restoreBodyScroll();
}

function visitLivePortfolio() {
    const liveUrl = 'https://portfolioroland-io.vercel.app/';
    if (window.location.hostname === 'portfolioroland-io.vercel.app') {
        const notification = document.createElement('div');
        notification.className = 'live-site-notification';
        notification.textContent = 'You are currently viewing the live portfolio.';
        document.body.appendChild(notification);
        window.setTimeout(() => notification.remove(), 3200);
        return;
    }
    window.open(liveUrl, '_blank', 'noopener,noreferrer');
}

document.addEventListener('DOMContentLoaded', function () {
    const projectModal = document.getElementById('portfolioProjectModal');
    if (!projectModal) return;

    projectModal.addEventListener('click', function (event) {
        if (event.target === projectModal) closeProjectDetails(projectModal.id);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectDetails(projectModal.id);
        }
    });
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
    restoreBodyScroll();
}

function restoreBodyScroll() {
    const hasOpenModal = document.querySelector('.certificate-modal.active, .experience-image-modal.active, .experience-gallery-modal.active, .achievement-modal-panel.active');
    document.body.style.overflow = hasOpenModal ? 'hidden' : '';
}

function openExperienceImageModal(img) {
    const modal = document.getElementById('experienceImageModal');
    const modalImg = document.getElementById('experienceModalImage');
    const caption = document.getElementById('experienceModalCaption');

    if (!modal || !modalImg || !caption || !img) return;
    const mediaSource = getMediaSource(img);
    if (!mediaSource) return;

    modalImg.src = mediaSource;
    modalImg.alt = img.alt || '';
    caption.textContent = img.alt || '';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeExperienceImageModal() {
    const modal = document.getElementById('experienceImageModal');
    const modalImg = document.getElementById('experienceModalImage');
    const caption = document.getElementById('experienceModalCaption');
    if (!modal || !modalImg || !caption) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.removeAttribute('src');
    caption.textContent = '';
    restoreBodyScroll();
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

    const experienceImageModal = document.getElementById('experienceImageModal');
    if (experienceImageModal) {
        experienceImageModal.addEventListener('click', function(event) {
            if (event.target === experienceImageModal) closeExperienceImageModal();
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

        restoreBodyScroll();
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
        restoreBodyScroll();
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
            if (document.getElementById('experienceImageModal')?.classList.contains('active')) {
                closeExperienceImageModal();
                return;
            }
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


