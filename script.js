document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Helper Functions ---
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => scope.querySelectorAll(selector);

    // --- Configuration ---
    const STICKY_HEADER_THRESHOLD = 50;
    const SCROLL_ANIMATION_OFFSET = 100;
    const TOAST_DURATION = 4000;
    const TYPED_STRINGS = [
        'AI Engineer',
        'LLM Specialist',
        'RAG Systems Architect',
        'NLP Enthusiast',
        'Creative Problem Solver',
        'Agentic AI Developer'
    ];

    // --- Core Elements Cache ---
    const body = document.body;
    const header = qs('header');
    const nav = qs('nav#main-navigation');
    const mobileMenuBtn = qs('.mobile-menu-btn');
    const themeToggleBtn = qs('.theme-toggle');
    const heroSubtitleEl = qs('.hero-subtitle');
    const contactForm = qs('#contactForm');
    const backToTopBtn = qs('.back-to-top');
    const preloader = qs('.preloader');
    const navLinks = qsa('nav a[href^="#"]');
    const yearSpan = qs('#current-year');

    // --- Initializations ---

    /**
     * Preloader
     */
    const initPreloader = () => {
        if (preloader) {
            window.addEventListener('load', () => {
                setTimeout(() => { // Ensure a minimum display time if loading is too fast
                    preloader.classList.add('hidden');
                }, 300);
            });
        }
    };

    /**
     * Smooth Scrolling & Active Link Highlighting
     */
    const initSmoothScrollingAndActiveLinks = () => {
        const allScrollLinks = qsa('a[href^="#"]');

        allScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = qs(targetId);

                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    let targetPosition = targetSection.offsetTop - headerHeight;

                    // Small adjustment for sections other than home for better alignment
                    if (targetId !== '#home') {
                        targetPosition +=10;
                    }


                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if active
                    if (nav?.classList.contains('nav--active')) {
                        nav.classList.remove('nav--active');
                        if (mobileMenuBtn) {
                            mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
                            mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                } else {
                    console.warn(`Smooth scroll target not found: ${targetId}`);
                }
            });
        });

        // Active link highlighting on scroll
        const sections = qsa('section[id]');
        const updateActiveLink = () => {
            let currentSectionId = '';
            const headerHeight = header ? header.offsetHeight : 0;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50; // Adjusted offset
                if (window.scrollY >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active-link');
                }
            });
        };
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink(); // Initial check
    };


    /**
     * Mobile Menu Toggle
     */
    const initMobileMenu = () => {
        if (!mobileMenuBtn || !nav) {
            console.warn("Mobile menu init failed: Button or Nav element not found.");
            return;
        }
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = nav.classList.toggle('nav--active');
            this.innerHTML = isExpanded ?
                '<i class="fas fa-times" aria-hidden="true"></i>' :
                '<i class="fas fa-bars" aria-hidden="true"></i>';
            this.setAttribute('aria-expanded', isExpanded.toString());
            body.classList.toggle('no-scroll', isExpanded); // Optional: Prevent body scroll when menu is open
        });
    };

    /**
     * Sticky Header
     */
    const initStickyHeader = () => {
        if (!header) {
            console.warn("Sticky header init failed: Header element not found.");
            return;
        }
        let headerHeight = header.offsetHeight;

        const updateStickyState = () => {
            if (window.scrollY > STICKY_HEADER_THRESHOLD) {
                if (!header.classList.contains('header--sticky')) {
                    header.classList.add('header--sticky');
                    // body.style.paddingTop = `${headerHeight}px`; // This is handled by CSS body padding-top now
                    body.classList.add('has-sticky-header');
                }
            } else {
                if (header.classList.contains('header--sticky')) {
                    header.classList.remove('header--sticky');
                    // body.style.paddingTop = '0';
                    body.classList.remove('has-sticky-header');
                }
            }
        };
        window.addEventListener('scroll', updateStickyState);
        window.addEventListener('resize', () => { // Re-calculate on resize if header height changes
            headerHeight = header.offsetHeight;
            if(body.classList.contains('has-sticky-header')) {
                 // body.style.paddingTop = `${headerHeight}px`; // Re-apply if needed for dynamic height headers
            }
        });
        updateStickyState(); // Initial check
    };

    /**
     * Skills Tag Interaction (Primarily CSS-driven)
     */
    const initSkillsInteraction = () => {
        const skillTags = qsa('.skill-tag');
        skillTags.forEach(tag => {
            if (tag.tagName !== 'A' && tag.tagName !== 'BUTTON' && !tag.hasAttribute('tabindex')) {
                tag.setAttribute('tabindex', '0'); // Make focusable for keyboard users if not already interactive
            }
            // Hover/focus effects are handled by CSS :hover and :focus-visible
        });
    };

    /**
     * Animate Elements on Scroll
     */
    const initScrollAnimations = () => {
        const animatedElements = qsa('section, .experience-item, .project-item, .achievement-item, .skill-category');
        if (animatedElements.length === 0) return;

        animatedElements.forEach(el => el.classList.add('animate-on-scroll'));

        const observer = new IntersectionObserver((entries, observerRef) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after animation if it should only happen once
                    // observerRef.unobserve(entry.target);
                } else {
                    // Optional: remove class if element scrolls back out of view to re-animate
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, { rootMargin: `0px 0px -${SCROLL_ANIMATION_OFFSET}px 0px` }); // Trigger when element is X pixels from bottom

        animatedElements.forEach(el => observer.observe(el));
    };


    /**
     * Typed.js Effect for Hero Section
     */
    const initTypedEffect = () => {
        if (!heroSubtitleEl) {
            console.warn("Typed.js init failed: .hero-subtitle element not found.");
            return;
        }
        if (typeof Typed === 'undefined') {
            console.error("Typed.js library is not loaded. Ensure it's included before this script.");
            heroSubtitleEl.textContent = TYPED_STRINGS[0] || 'AI Engineer'; // Fallback
            return;
        }
        try {
            new Typed(heroSubtitleEl, {
                strings: TYPED_STRINGS,
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 1800,
                startDelay: 500,
                loop: true,
                smartBackspace: true,
                fadeOut: false, // Keep if you prefer fade out effect
                // fadeOutClass: 'typed-fade-out', // Default
                // fadeOutDelay: 500, // Default
            });
        } catch (e) {
            console.error("Typed.js initialization failed:", e);
            heroSubtitleEl.textContent = TYPED_STRINGS[0] || 'AI Engineer'; // Fallback
        }
    };

    /**
     * Contact Form Handling with Toast Notification
     */
    const initContactForm = () => {
        if (!contactForm) {
            // console.warn("Contact form not found in HTML.");
            return;
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = qs('button[type="submit"]', this);
            const originalButtonText = submitButton.innerHTML;

            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }

            submitButton.disabled = true;
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;

            const formData = new FormData(this);
            // For Formspree or similar services, use fetch:
            try {
                const response = await fetch(this.action, {
                    method: this.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    displayToast('Message Sent!', 'Thank you for reaching out. I\'ll get back to you soon.');
                    this.reset();
                } else {
                    // Try to get error message from Formspree
                    const data = await response.json();
                    if (data.errors && data.errors.length > 0) {
                        const errorMessage = data.errors.map(error => error.message).join(", ");
                        displayToast('Submission Error', `Oops! ${errorMessage}`, 'error');
                    } else {
                        displayToast('Submission Error', 'Oops! Something went wrong. Please try again.', 'error');
                    }
                }
            } catch (error) {
                console.error('Form submission error:', error);
                displayToast('Network Error', 'Could not send message. Please check your connection.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    };

    /**
     * Toast Notification
     */
    let activeToastTimeout = null;
    const displayToast = (title, message, type = 'success') => {
        const existingToast = qs('.toast-notification');
        if (existingToast) {
            existingToast.remove();
            clearTimeout(activeToastTimeout);
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification toast--${type}`; // Add type class for styling
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');

        const iconClass = type === 'error' ? 'fa-times-circle' : 'fa-check-circle';
        toast.innerHTML = `
            <i class="fas ${iconClass}" aria-hidden="true"></i>
            <div class="toast-message">
                <p>${title}</p>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        activeToastTimeout = setTimeout(() => {
            toast.classList.remove('is-visible');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, TOAST_DURATION);
    };


    /**
     * Dark/Light Mode Toggle
     */
    const initThemeToggle = () => {
        if (!themeToggleBtn) {
            console.warn("Theme toggle button not found.");
            return;
        }

        const applyTheme = (theme) => {
            if (theme === 'light') {
                body.classList.add('light-mode');
                themeToggleBtn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
                themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
            } else {
                body.classList.remove('light-mode');
                themeToggleBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
                themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
            }
        };

        themeToggleBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(newTheme);
            try {
                localStorage.setItem('portfolio-theme', newTheme);
            } catch (e) {
                console.warn("Could not save theme preference to localStorage.", e);
            }
        });

        let savedTheme = 'dark'; // Default
        try {
            const storedTheme = localStorage.getItem('portfolio-theme');
            if (storedTheme) {
                savedTheme = storedTheme;
            } else { // Check system preference if no theme saved
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                    savedTheme = 'light';
                }
            }
        } catch (e) {
            console.warn("Could not read theme preference from localStorage.", e);
        }
        applyTheme(savedTheme);
    };

    /**
     * Project Filtering Capability
     */
    const initProjectFilters = () => {
        const filterContainer = qs('.project-filters');
        const projectItems = qsa('.project-item');

        if (!filterContainer || projectItems.length === 0) {
            // console.warn("Project filters or items not found.");
            return;
        }

        // Optional: Dynamically generate filter buttons from data-tags if needed
        // For now, assuming buttons are in HTML or a few common ones are added.

        filterContainer.addEventListener('click', (e) => {
            if (!e.target.matches('.filter-btn')) return;

            const clickedButton = e.target;
            const filterValue = clickedButton.dataset.filter.toLowerCase();

            qsa('.filter-btn', filterContainer).forEach(btn => {
                const isSelected = btn === clickedButton;
                btn.classList.toggle('is-active', isSelected);
                btn.setAttribute('aria-selected', isSelected.toString());
            });

            projectItems.forEach(item => {
                const itemTags = (item.dataset.tags || '').toLowerCase().split(',');
                const matchesFilter = filterValue === 'all' || itemTags.some(tag => tag.trim() === filterValue);

                item.classList.toggle('is-hidden', !matchesFilter);
                item.setAttribute('aria-hidden', (!matchesFilter).toString());
            });
        });
    };

    /**
     * Back to Top Button
     */
    const initBackToTopButton = () => {
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    /**
     * Update Copyright Year
     */
    const updateCopyrightYear = () => {
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    };


    // --- Run Initializations ---
    initPreloader();
    initSmoothScrollingAndActiveLinks();
    initMobileMenu();
    initStickyHeader();
    initSkillsInteraction();
    initScrollAnimations();
    initTypedEffect();
    initContactForm();
    initThemeToggle();
    initProjectFilters();
    initBackToTopButton();
    updateCopyrightYear();

    console.log("Portfolio Enhancements Initialized. Ready to showcase!");

}); // End DOMContentLoaded