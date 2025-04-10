// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Helper Functions ---
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => scope.querySelectorAll(selector);

    // Helper to inject CSS rules - prevents adding the same styles multiple times
    const injectedStyles = new Set();
    const injectStyles = (id, cssRules) => {
        if (!injectedStyles.has(id) && !document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = cssRules;
            document.head.appendChild(style);
            injectedStyles.add(id);
        }
    };

    // --- Configuration ---
    const STICKY_HEADER_THRESHOLD = 100; // Pixels to scroll before header becomes sticky
    const SCROLL_ANIMATION_OFFSET = 100; // Offset for triggering section animations
    const TOAST_DURATION = 4000; // Duration toast message is shown (in ms)
    const TYPED_STRINGS = [
        'AI Engineer',
        'LLM Specialist',
        'RAG Systems Builder',
        'NLP Engineer',
        'Agentic AI Engineer' // Added another example
    ];

    // --- Core Elements Cache ---
    const header = qs('header');
    const nav = qs('nav');
    const body = document.body;

    // --- Feature Initializations ---

    /**
     * Smooth Scrolling for internal links
     */
    const initSmoothScrolling = () => {
        const scrollLinks = qsa('nav a[href^="#"], .hero a[href^="#"]');
        if (!header) {
            console.warn("Smooth scrolling init failed: Header element not found.");
            return;
        }

        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = qs(targetId);

                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if active after clicking a link
                    if (nav?.classList.contains('nav--active')) {
                        nav.classList.remove('nav--active');
                        const mobileMenuBtn = qs('.mobile-menu-btn');
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
    };

    /**
     * Mobile Menu Toggle Functionality
     */
    const initMobileMenu = () => {
        if (!header || !nav) {
            console.warn("Mobile menu init failed: Header or Nav element not found.");
            return;
        }

        const headerContent = qs('.header-content', header);
        if (!headerContent) {
             console.warn("Mobile menu init failed: .header-content not found within header.");
             return;
        }

        const mobileMenuBtn = document.createElement('button'); // Use button for accessibility
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>'; // Font Awesome icon
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-controls', 'main-navigation'); // Assuming nav has id="main-navigation"

        // Add basic styling via JS (better in CSS, but follows original pattern)
        mobileMenuBtn.style.display = 'none'; // Hidden by default, shown via CSS media query
        mobileMenuBtn.style.background = 'none';
        mobileMenuBtn.style.border = 'none';
        mobileMenuBtn.style.cursor = 'pointer';
        mobileMenuBtn.style.fontSize = '1.5rem';
        mobileMenuBtn.style.color = 'inherit'; // Inherit color
        mobileMenuBtn.style.marginLeft = 'auto'; // Push to the right if in flex container

        // Ensure nav has an ID for aria-controls
        nav.id = nav.id || 'main-navigation';

        // Append button to header content area
        headerContent.appendChild(mobileMenuBtn);

        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = nav.classList.toggle('nav--active');
            this.innerHTML = isExpanded ?
                '<i class="fas fa-times" aria-hidden="true"></i>' :
                '<i class="fas fa-bars" aria-hidden="true"></i>';
            this.setAttribute('aria-expanded', isExpanded.toString());
        });

        // Inject necessary CSS for mobile menu behavior
        const mobileMenuCSS = `
            .mobile-menu-btn { display: none; } /* Hidden by default */

            @media (max-width: 768px) {
                .mobile-menu-btn { display: block !important; } /* Show on mobile */

                nav {
                    position: absolute;
                    top: 100%; /* Position below header */
                    left: 0;
                    width: 100%;
                    background-color: var(--nav-mobile-bg, var(--dark, #0f172a)); /* Use CSS var or fallback */
                    padding: 0;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out;
                    z-index: 999; /* Ensure it's above other content */
                }

                nav.nav--active {
                    max-height: 50vh; /* Adjust as needed, use vh for viewport relative */
                    /* No transition needed here, it's on the base class */
                }

                nav ul {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 0;
                    margin: 0; /* Reset margin */
                    list-style: none; /* Reset list style */
                }

                nav ul li {
                    margin: 0;
                    width: 100%;
                    text-align: center;
                }

                nav ul li a { /* Style links for better visibility */
                    display: block;
                    padding: 1rem 0.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    color: var(--nav-mobile-link-color, white); /* Use CSS var or fallback */
                    text-decoration: none;
                    transition: background-color 0.2s ease;
                }
                nav ul li a:hover,
                nav ul li a:focus {
                     background-color: rgba(255, 255, 255, 0.1);
                }
                 nav ul li:first-child a {
                     border-top: none; /* Remove top border for the first item */
                 }
                 body.light-mode nav {
                      background-color: var(--nav-mobile-bg-light, var(--dark, #f8fafc));
                 }
                 body.light-mode nav ul li a {
                      border-top-color: rgba(0, 0, 0, 0.1);
                      color: var(--nav-mobile-link-color-light, var(--light, #0f172a));
                 }
                 body.light-mode nav ul li a:hover,
                 body.light-mode nav ul li a:focus {
                     background-color: rgba(0, 0, 0, 0.05);
                 }
            }
        `;
        injectStyles('mobile-menu-styles', mobileMenuCSS);
    };

    /**
     * Sticky Header Effect with Background Change
     */
    const initStickyHeader = () => {
        if (!header) {
            console.warn("Sticky header init failed: Header element not found.");
            return;
        }

        // Inject CSS for the sticky state
        const stickyHeaderCSS = `
            header.header--sticky {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: var(--header-sticky-bg, rgba(15, 23, 42, 0.95)); /* Use CSS var or fallback */
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s ease, box-shadow 0.3s ease;
                z-index: 1000; /* Ensure header stays on top */
            }
            body.light-mode header.header--sticky {
                 background: var(--header-sticky-bg-light, rgba(248, 250, 252, 0.95));
                 box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            /* Add padding to body to prevent content jump when header becomes fixed */
             body { /* Initial padding potentially */
                 padding-top: 0; /* Or header initial height if it's not overlaying */
                 transition: padding-top 0.3s ease; /* Smooth transition for padding */
             }
             body.has-sticky-header {
                 padding-top: ${header.offsetHeight}px; /* Adjust based on actual header height */
             }
        `;
        injectStyles('sticky-header-styles', stickyHeaderCSS);

        let lastKnownScrollY = 0;
        let ticking = false;
        let headerHeight = header.offsetHeight; // Get initial height

        const updateStickyState = () => {
             if (window.scrollY > STICKY_HEADER_THRESHOLD) {
                if (!header.classList.contains('header--sticky')) {
                    headerHeight = header.offsetHeight; // Update height just before becoming sticky
                    header.classList.add('header--sticky');
                    body.classList.add('has-sticky-header');
                    body.style.paddingTop = `${headerHeight}px`; // Apply padding
                }
            } else {
                if (header.classList.contains('header--sticky')) {
                    header.classList.remove('header--sticky');
                    body.classList.remove('has-sticky-header');
                    body.style.paddingTop = '0'; // Remove padding
                }
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            lastKnownScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateStickyState);
                ticking = true;
            }
        });

        // Re-calculate padding on resize if header height might change
        window.addEventListener('resize', () => {
            if (header.classList.contains('header--sticky')) {
                 headerHeight = header.offsetHeight;
                 body.style.paddingTop = `${headerHeight}px`;
            } else {
                 // Maybe recalculate initial height if needed
                 headerHeight = header.offsetHeight;
            }
        });

         // Initial check in case page loads already scrolled
         updateStickyState();
    };

    /**
     * Skills Tag Hover Animation (using CSS classes)
     */
    const initSkillsAnimation = () => {
        const skillTags = qsa('.skill-tag');
        if (skillTags.length === 0) return; // No tags found

        // Inject CSS for base and hover states
        const skillsCSS = `
            .skill-tag {
                transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
                 /* Base styles already defined in main CSS presumably */
            }
            .skill-tag:hover,
            .skill-tag:focus { /* Added focus for accessibility */
                transform: scale(1.05);
                background-color: var(--primary, #34d399); /* Use CSS var or fallback */
                color: var(--skill-hover-text-color, white); /* Use CSS var or fallback */
                cursor: default; /* Indicate it's not clickable unless it is */
            }
             body.light-mode .skill-tag {
                 background-color: var(--secondary-light, #e2e8f0); /* Example light mode base */
                 color: var(--primary-dark-light, #1e293b); /* Example light mode text */
             }
             body.light-mode .skill-tag:hover,
             body.light-mode .skill-tag:focus {
                 background-color: var(--primary-light, #10b981); /* Example light mode hover */
                 color: var(--skill-hover-text-color-light, white);
             }
        `;
        injectStyles('skills-animation-styles', skillsCSS);

         // Add tabindex="0" to make non-interactive elements focusable for :focus styles
         skillTags.forEach(tag => {
             if (tag.tagName !== 'A' && tag.tagName !== 'BUTTON' && !tag.hasAttribute('tabindex')) {
                 tag.setAttribute('tabindex', '0');
             }
         });

        // JS listeners are no longer needed if relying purely on :hover/:focus in CSS
        // The original JS listeners are removed for a cleaner CSS-based approach.
    };

    /**
     * Animate Sections/Elements on Scroll
     */
    const initScrollAnimations = () => {
        const animatedElements = qsa('section, .experience-item, .project-item, .achievement-item, .skill-category');
        if (animatedElements.length === 0) return;

        // Inject CSS for the animation states
        const scrollAnimationCSS = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }

            .animate-on-scroll.is-visible {
                opacity: 1;
                transform: translateY(0);
            }

            /* Staggered delay example (can be refined with more specific selectors if needed) */
            section.is-visible .animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
            section.is-visible .animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
            section.is-visible .animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
            section.is-visible .animate-on-scroll:nth-child(4) { transition-delay: 0.4s; }
            section.is-visible .animate-on-scroll:nth-child(5) { transition-delay: 0.5s; }
            /* Add more if needed */
        `;
        injectStyles('scroll-animation-styles', scrollAnimationCSS);

        // Add base class to elements that should be animated
        animatedElements.forEach(el => el.classList.add('animate-on-scroll'));

        let ticking = false;

        const animateVisibleElements = () => {
            const windowHeight = window.innerHeight;
            animatedElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                // Check if element is within viewport + offset and not already visible
                if (elementTop < windowHeight - SCROLL_ANIMATION_OFFSET && !el.classList.contains('is-visible')) {
                    el.classList.add('is-visible');
                }
                // Optional: Remove class if element scrolls back out of view
                // else if (elementTop > windowHeight && el.classList.contains('is-visible')) {
                //     el.classList.remove('is-visible');
                // }
            });
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(animateVisibleElements);
                ticking = true;
            }
        });

        // Initial check on load
         window.requestAnimationFrame(animateVisibleElements);
    };

    /**
     * Typed.js Effect for Hero Section
     */
    const initTypedEffect = () => {
        const heroTextContainer = qs('.hero-text'); // Target the container
         if (!heroTextContainer) {
              console.warn("Typed.js init failed: .hero-text container not found.");
              return;
         }
         const heroHeading = qs('h1', heroTextContainer);
         if (!heroHeading) {
             console.warn("Typed.js init failed: h1 not found within .hero-text.");
             return;
         }


        // Check if Typed.js library is loaded or load it
        if (typeof Typed === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js'; // Consider self-hosting
            script.onload = setupTypedInstance;
            script.onerror = () => console.error("Failed to load Typed.js library.");
            document.head.appendChild(script);
        } else {
            setupTypedInstance();
        }

        function setupTypedInstance() {
            // Create element for typed text if it doesn't exist
            let heroSubtitle = qs('.hero-subtitle', heroTextContainer);
            if (!heroSubtitle) {
                heroSubtitle = document.createElement('div');
                heroSubtitle.className = 'hero-subtitle';
                 // Inject styles for the subtitle
                 const typedCSS = `
                    .hero-subtitle {
                        color: var(--primary, #34d399); /* Use CSS var or fallback */
                        font-size: 1.5rem;
                        font-weight: 500;
                        margin-bottom: 1.5rem;
                        min-height: 2.2em; /* Prevent layout shift */
                    }
                     body.light-mode .hero-subtitle {
                          color: var(--primary-light-text, var(--primary)); /* Adjust if needed for light mode */
                     }
                `;
                injectStyles('typed-effect-styles', typedCSS);

                // Insert after h1
                heroHeading.insertAdjacentElement('afterend', heroSubtitle);
            }

            // Initialize Typed.js
            try {
                 new Typed('.hero-subtitle', {
                     strings: TYPED_STRINGS,
                     typeSpeed: 50,
                     backSpeed: 30,
                     backDelay: 1500,
                     startDelay: 500,
                     loop: true,
                     smartBackspace: true // Improves backspacing realism
                 });
             } catch (e) {
                  console.error("Typed.js initialization failed:", e);
                  // Display fallback text if Typed fails
                  if(heroSubtitle) heroSubtitle.textContent = TYPED_STRINGS[0] || 'Creative Developer';
             }
        }
    };

    /**
     * Contact Form Handling with Toast Notification
     */
    const initContactForm = () => {
        const contactSection = qs('#contact .container'); // Target a container within #contact
        if (!contactSection) {
            console.warn("Contact form setup failed: #contact .container not found.");
            return;
        }

        // Check if form already exists (e.g., static HTML)
        let formContainer = qs('.contact-form-container', contactSection);
        if (!formContainer) {
             formContainer = document.createElement('div');
             formContainer.className = 'contact-form-container';
             formContainer.style.marginTop = '2rem'; // Keep simple layout styles if needed

             formContainer.innerHTML = `
                 <form id="contactForm" class="contact-form">
                     <h3 style="text-align:center; margin-bottom: 1.5rem;">Get In Touch</h3>
                     <div class="form-group">
                         <label for="name" class="sr-only">Your Name</label>
                         <input type="text" id="name" name="name" placeholder="Your Name" required aria-required="true">
                     </div>
                     <div class="form-group">
                         <label for="email" class="sr-only">Your Email</label>
                         <input type="email" id="email" name="email" placeholder="Your Email" required aria-required="true">
                     </div>
                     <div class="form-group">
                          <label for="message" class="sr-only">Your Message</label>
                         <textarea id="message" name="message" placeholder="Your Message" rows="5" required aria-required="true"></textarea>
                     </div>
                     <div style="text-align: center;"> <button type="submit" class="btn btn--primary">Send Message</button>
                     </div>
                 </form>
             `;
             contactSection.appendChild(formContainer);
        }


        // Inject form and toast styles
        const formCSS = `
            .contact-form {
                max-width: 600px;
                margin: 0 auto;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            .form-group input, .form-group textarea {
                width: 100%;
                padding: 0.8rem 1rem; /* Adjusted padding */
                border-radius: 5px;
                border: 1px solid var(--form-border-color, var(--light-gray, #ccc)); /* Use CSS var or fallback */
                font-size: 1rem;
                transition: border-color 0.3s ease, box-shadow 0.3s ease;
                background-color: var(--form-bg, white); /* Control background */
                color: var(--form-text-color, inherit); /* Control text color */
            }
            .form-group input:focus, .form-group textarea:focus {
                outline: none;
                border-color: var(--primary, #34d399);
                box-shadow: 0 0 0 2px var(--primary-focus-shadow, rgba(52, 211, 153, 0.3)); /* Focus ring */
            }
             /* Basic button styling (assuming .btn is defined elsewhere) */
             .contact-form .btn {
                 display: inline-block;
                 padding: 0.8rem 2rem;
                 cursor: pointer;
                 border: none;
                 border-radius: 5px;
                 /* Add background, color, transitions in main CSS */
             }

            /* Simple Toast Notification Styles */
            .toast-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--toast-success-bg, #4CAF50);
                color: var(--toast-success-text, white);
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                z-index: 1001;
                transform: translateX(120%);
                transition: transform 0.4s ease-in-out;
                opacity: 0;
                 pointer-events: none; /* Initially not interactive */
            }
            .toast-notification.is-visible {
                transform: translateX(0);
                opacity: 1;
                 pointer-events: auto; /* Interactive when visible */
            }
            .toast-notification i { /* Style for icon */
                margin-right: 15px;
                font-size: 1.5rem;
            }
            .toast-message p {
                 margin: 0;
                 line-height: 1.4;
            }
            .toast-message p:first-child {
                 font-weight: bold;
                 margin-bottom: 0.25rem;
            }
             /* Screen Reader only class */
             .sr-only {
                 position: absolute;
                 width: 1px;
                 height: 1px;
                 padding: 0;
                 margin: -1px;
                 overflow: hidden;
                 clip: rect(0, 0, 0, 0);
                 white-space: nowrap;
                 border-width: 0;
             }
        `;
        injectStyles('contact-form-styles', formCSS);

        const contactForm = qs('#contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation check (HTML5 required handles most)
            if (!this.checkValidity()) {
                 this.reportValidity(); // Show browser validation messages
                 return;
             }


            const nameInput = qs('#name', this);
            const emailInput = qs('#email', this); // Get email for potential use
            const messageInput = qs('#message', this); // Get message for potential use

            const name = nameInput?.value.trim() || 'there';

            // --- Mock Sending ---
            // In a real app, you'd send data via fetch() here
            console.log('Form submitted (mock):');
            console.log('Name:', name);
            console.log('Email:', emailInput?.value);
            console.log('Message:', messageInput?.value);
            // Simulate network delay
            const submitButton = qs('button[type="submit"]', this);
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            setTimeout(() => {
                 // --- Show Toast Notification ---
                 displayToast(`Thank you, ${name}!`, 'Your message has been sent successfully.');

                 // Reset form and button
                 this.reset();
                 submitButton.disabled = false;
                 submitButton.textContent = originalButtonText;

             }, 1000); // Mock 1 second delay
        });
    };

    /** Helper to display toast notifications */
    let activeToastTimeout = null;
    const displayToast = (title, message) => {
         // Remove existing toast if any
         const existingToast = qs('.toast-notification');
         if (existingToast) {
             existingToast.remove();
             clearTimeout(activeToastTimeout);
         }

         const toast = document.createElement('div');
         toast.className = 'toast-notification';
         toast.setAttribute('role', 'status'); // Accessibility
         toast.setAttribute('aria-live', 'polite');

         toast.innerHTML = `
             <i class="fas fa-check-circle" aria-hidden="true"></i>
             <div class="toast-message">
                 <p>${title}</p>
                 <p>${message}</p>
             </div>
         `;
         document.body.appendChild(toast);

         // Trigger transition
         requestAnimationFrame(() => {
             requestAnimationFrame(() => { // Double requestAnimationFrame for reliability
                 toast.classList.add('is-visible');
             });
         });


         // Auto-remove toast
         activeToastTimeout = setTimeout(() => {
             toast.classList.remove('is-visible');
             // Remove from DOM after transition ends
             toast.addEventListener('transitionend', () => toast.remove(), { once: true });
         }, TOAST_DURATION);
     };


    /**
     * Dark/Light Mode Toggle
     */
    const initThemeToggle = () => {
        const headerContent = qs('.header-content', header);
         if (!headerContent) {
             console.warn("Theme toggle init failed: .header-content not found.");
             return;
         }


        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'theme-toggle';
        themeToggleBtn.setAttribute('aria-label', 'Toggle light/dark theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>'; // Default to dark mode icon (moon)

        // Basic styles (better in CSS)
         themeToggleBtn.style.background = 'none';
         themeToggleBtn.style.border = 'none';
        themeToggleBtn.style.marginLeft = '1rem';
        themeToggleBtn.style.cursor = 'pointer';
        themeToggleBtn.style.fontSize = '1.2rem';
        themeToggleBtn.style.color = 'inherit'; // Inherit color from header
         themeToggleBtn.style.verticalAlign = 'middle'; // Align icon better

        headerContent.appendChild(themeToggleBtn);

        // Inject CSS for light mode - Ideally, this should be in your main CSS file
        const lightModeCSS = `
            body.light-mode {
                --dark: #f8fafc; /* Light background */
                --light: #0f172a; /* Dark text */
                --gray: #64748b;  /* Medium gray text */
                --light-gray: #cbd5e1; /* Lighter gray for borders/accents */
                --secondary: #e2e8f0; /* Light secondary background */
                --primary-dark: #1e293b; /* Darker text/elements */
                 --header-bg: var(--dark);
                 --footer-bg: var(--dark);
                 --text-color: var(--light);
                 --link-color: var(--light);
                 --logo-color: var(--light);
                 --nav-mobile-bg: var(--dark);
                 --nav-mobile-link-color: var(--light);
                 --header-sticky-bg: rgba(248, 250, 252, 0.95); /* Light sticky header */
                 --form-border-color: var(--light-gray);
                 --form-bg: white;
                 --form-text-color: var(--light);

                color: var(--text-color);
                background-color: var(--dark); /* Set base background */
            }

            body.light-mode header,
            body.light-mode footer {
                background-color: var(--header-bg);
                color: var(--text-color);
                 box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* Lighter shadow */
            }

            body.light-mode nav ul li a,
            body.light-mode .footer-social a,
            body.light-mode .theme-toggle {
                color: var(--link-color);
            }
             body.light-mode .theme-toggle:hover,
             body.light-mode .theme-toggle:focus {
                 color: var(--primary); /* Highlight on hover */
             }

            body.light-mode .logo { /* Assuming a .logo class */
                color: var(--logo-color);
            }

            body.light-mode .hero { /* Example override for hero */
                background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                color: var(--text-color);
            }
             body.light-mode .hero h1 {
                  color: var(--primary-dark); /* Darker heading on light bg */
             }

            body.light-mode .copyright {
                color: var(--gray);
            }

             /* Other elements that need light mode styles */
             body.light-mode .section-title { /* Example */
                 color: var(--primary-dark);
             }
              body.light-mode .btn--primary { /* Example button */
                  background-color: var(--primary);
                  color: white;
              }
               body.light-mode .btn--secondary { /* Example button */
                   background-color: var(--secondary);
                   color: var(--primary-dark);
               }
               body.light-mode blockquote { /* Example */
                    border-left-color: var(--primary);
                    background-color: var(--secondary);
               }
        `;
        injectStyles('light-mode-theme', lightModeCSS);

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

        // Check saved theme preference on load
        let savedTheme = 'dark'; // Default to dark
         try {
             savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
         } catch (e) {
             console.warn("Could not read theme preference from localStorage.", e);
         }

        applyTheme(savedTheme);
    };


    /**
     * Project Filtering Capability (Demo Version)
     * Note: Real-world use would benefit from data attributes (e.g., `data-tags="js,api,ai"`) on project items.
     */
    const initProjectFilters = () => {
        const projectsSection = qs('#projects');
        if (!projectsSection) return; // Exit if no projects section

        const projectsContainer = qs('.container', projectsSection); // Assume projects are within a container
        if (!projectsContainer) return;

        const projectItems = qsa('.project-item', projectsContainer);
        if (projectItems.length === 0) return; // Exit if no project items

        // --- Tag Extraction (Simple Demo - Improve with data attributes) ---
        const tags = new Set(['All']); // Start with 'All'
        const commonWordsToIgnore = new Set(['a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'of', 'it', 'is', 'this', 'project', 'using', 'developed', 'feature']);
        projectItems.forEach(project => {
            const titleText = qs('.project-title', project)?.textContent?.toLowerCase() || '';
            const descText = qs('.project-description', project)?.textContent?.toLowerCase() || '';
            const techText = qs('.project-tech', project)?.textContent?.toLowerCase() || ''; // Assuming a tech list element

            const textToScan = `${titleText} ${descText} ${techText}`;
            // Simple keyword extraction (replace with data-tags in real projects)
             textToScan.split(/[\s,.;]+/) // Split by spaces and common punctuation
                .map(word => word.replace(/[^a-z0-9+#-]/g, '')) // Basic cleanup (allow #, +, - for things like C++)
                 .filter(word => word.length > 2 && !/^\d+$/.test(word) && !commonWordsToIgnore.has(word)) // Filter short/numeric/common words
                 .forEach(tag => tags.add(tag));
        });

         // Limit number of tags displayed for demo clarity if needed
         const displayedTags = Array.from(tags).slice(0, 8); // Show 'All' + 7 most relevant/frequent (improve selection logic)

        // --- Create Filter Buttons ---
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.setAttribute('role', 'tablist'); // Accessibility for filter controls
        filterContainer.setAttribute('aria-label', 'Filter projects by technology');


        displayedTags.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = tag;
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-controls', 'project-list'); // Assuming project list container has this ID
            button.setAttribute('aria-selected', tag === 'All' ? 'true' : 'false');
            button.dataset.filter = tag.toLowerCase(); // Use data attribute for filtering logic

            if (tag === 'All') {
                button.classList.add('is-active');
            }
            filterContainer.appendChild(button);
        });

         // Inject Filter Styles
         const filterCSS = `
             .project-filters {
                 margin-bottom: 2rem;
                 display: flex;
                 justify-content: center;
                 flex-wrap: wrap;
                 gap: 0.8rem;
             }
             .filter-btn {
                 background-color: var(--filter-btn-bg, var(--light-gray, #eee));
                 color: var(--filter-btn-text, var(--dark, #333));
                 border: 1px solid transparent; /* Adjust as needed */
                 padding: 0.5rem 1.2rem;
                 border-radius: 50px; /* Pill shape */
                 cursor: pointer;
                 transition: all 0.3s ease;
                 font-weight: 500;
             }
             .filter-btn:hover {
                 background-color: var(--filter-btn-hover-bg, var(--secondary, #ddd));
                 border-color: var(--filter-btn-hover-border, transparent);
             }
             .filter-btn.is-active {
                 background-color: var(--primary, #34d399);
                 color: var(--filter-btn-active-text, white);
                 border-color: var(--primary, #34d399);
             }
             .filter-btn:focus {
                 outline: none;
                 box-shadow: 0 0 0 2px var(--primary-focus-shadow, rgba(52, 211, 153, 0.5));
             }
             /* Styles for filtered items */
             .project-item {
                 transition: opacity 0.4s ease, transform 0.4s ease;
                 /* Ensure items are block or inline-block for hiding */
             }
             .project-item.is-hidden {
                 opacity: 0;
                 transform: scale(0.95);
                 pointer-events: none;
                 /* Use display: none; if layout needs to reflow completely */
                  /* display: none; */
                  /* Or manage height for smoother transition */
                  max-height: 0;
                  overflow: hidden;
                  margin-bottom: 0; /* Remove margin when hidden */
                  padding-top: 0;
                  padding-bottom: 0;
                  border: none; /* Remove borders when hidden */
                  transition: opacity 0.4s ease, transform 0.4s ease,
                              max-height 0.4s ease, margin 0.4s ease, padding 0.4s ease, border 0.4s ease;
             }
              /* Container for projects for potential layout adjustments */
              #project-list { /* Add this ID to the element wrapping .project-item elements */
                  /* display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; */ /* Example grid layout */
              }
         `;
         injectStyles('project-filter-styles', filterCSS);


        // Insert filters (e.g., after the section title)
        const sectionTitle = qs('h2', projectsContainer);
        if (sectionTitle) {
            sectionTitle.insertAdjacentElement('afterend', filterContainer);
        } else {
            projectsContainer.prepend(filterContainer); // Add at the beginning if no title found
        }

        // Add ID to project wrapper for aria-controls
        const projectListWrapper = projectItems[0].parentNode; // Get the parent containing the items
         if(projectListWrapper && !projectListWrapper.id) {
             projectListWrapper.id = 'project-list';
         }


        // Filter Functionality
        filterContainer.addEventListener('click', (e) => {
            if (!e.target.matches('.filter-btn')) return; // Ignore clicks outside buttons

            const clickedButton = e.target;
            const filterValue = clickedButton.dataset.filter;

            // Update active button state
            qsa('.filter-btn', filterContainer).forEach(btn => {
                const isSelected = btn === clickedButton;
                btn.classList.toggle('is-active', isSelected);
                btn.setAttribute('aria-selected', isSelected.toString());
            });

            // Filter project items
            projectItems.forEach(item => {
                 // Use combined text content for filtering (simple approach)
                 const itemText = item.textContent.toLowerCase();
                 // OR: Better approach - Check against data-tags attribute if implemented
                 // const itemTags = (item.dataset.tags || '').toLowerCase().split(',');
                 // const matchesFilter = filterValue === 'all' || itemTags.includes(filterValue);

                const matchesFilter = filterValue === 'all' || itemText.includes(filterValue);

                // Toggle visibility class
                 item.classList.toggle('is-hidden', !matchesFilter);

                // Accessibility: Hide hidden items from screen readers
                 item.setAttribute('aria-hidden', (!matchesFilter).toString());

            });
        });
    };


    /**
     * Simple Page Load Fade-In Animation
     */
    const initPageLoadAnimation = () => {
        body.style.opacity = '0';
        body.style.transition = 'opacity 0.8s ease-in-out';
        // Use requestAnimationFrame for smoother start
        requestAnimationFrame(() => {
            body.style.opacity = '1';
        });
    };

    // --- Initialize All Features ---
    initPageLoadAnimation();
    initSmoothScrolling();
    initMobileMenu();
    initStickyHeader();
    initSkillsAnimation(); // Now primarily CSS-driven
    initScrollAnimations();
    initTypedEffect();
    initContactForm();
    initThemeToggle();
    initProjectFilters();

    console.log("Portfolio Enhancements Initialized.");

}); // End DOMContentLoaded
