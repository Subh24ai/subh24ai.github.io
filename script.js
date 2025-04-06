// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .hero a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const headerHeight = document.querySelector('header').offsetHeight;
            
            window.scrollTo({
                top: targetSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    });
    
    // Mobile menu toggle
    const createMobileMenu = () => {
        const header = document.querySelector('.header-content');
        const nav = document.querySelector('nav');
        const mobileMenuBtn = document.createElement('div');
        
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.display = 'none';
        mobileMenuBtn.style.cursor = 'pointer';
        mobileMenuBtn.style.fontSize = '1.5rem';
        mobileMenuBtn.style.color = 'white';
        
        header.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.innerHTML = nav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
        
        // Add responsive styles for mobile menu
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block !important;
                }
                
                nav {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background-color: var(--dark);
                    padding: 0;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }
                
                nav.active {
                    max-height: 300px;
                    transition: max-height 0.3s ease;
                }
                
                nav ul {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 0;
                }
                
                nav ul li {
                    margin: 0;
                    width: 100%;
                    text-align: center;
                    padding: 1rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    createMobileMenu();
    
    // Sticky header effect with background change
    const header = document.querySelector('header');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > scrollThreshold) {
            header.classList.add('sticky');
            if (!header.style.cssText) {
                header.style.background = 'rgba(15, 23, 42, 0.95)';
                header.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                header.style.transition = 'background 0.3s, box-shadow 0.3s';
            }
        } else {
            header.classList.remove('sticky');
            header.style.background = 'var(--dark)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Skills animation
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.style.transition = 'transform 0.3s, background-color 0.3s';
        
        tag.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.backgroundColor = 'var(--primary)';
            this.style.color = 'white';
        });
        
        tag.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = 'var(--secondary)';
            this.style.color = 'var(--primary-dark)';
        });
    });
    
    // Animate sections on scroll
    const animateSections = () => {
        const sections = document.querySelectorAll('section');
        const windowHeight = window.innerHeight;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            // Add fade-in animation
            if (sectionTop < windowHeight - 100) {
                section.classList.add('visible');
            }
        });
        
        // Add this CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            section {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            section.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .experience-item, .project-item, .achievement-item, .skill-category {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            section.visible .experience-item, 
            section.visible .project-item, 
            section.visible .achievement-item,
            section.visible .skill-category {
                opacity: 1;
                transform: translateY(0);
            }
            
            section.visible .experience-item:nth-child(1),
            section.visible .project-item:nth-child(1),
            section.visible .skill-category:nth-child(1) {
                transition-delay: 0.1s;
            }
            
            section.visible .experience-item:nth-child(2),
            section.visible .project-item:nth-child(2),
            section.visible .skill-category:nth-child(2) {
                transition-delay: 0.2s;
            }
            
            section.visible .experience-item:nth-child(3),
            section.visible .project-item:nth-child(3),
            section.visible .skill-category:nth-child(3) {
                transition-delay: 0.3s;
            }
            
            section.visible .skill-category:nth-child(4) {
                transition-delay: 0.4s;
            }
        `;
        document.head.appendChild(style);
    };
    
    // Initialize animation and run on scroll
    animateSections();
    window.addEventListener('scroll', animateSections);
    
    // Typed.js effect for hero section (requires Typed.js library)
    const addTypedEffect = () => {
        // Check if CDN script already exists
        const existingScript = document.querySelector('script[src*="typed.js"]');
        if (!existingScript) {
            // Add Typed.js from CDN
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js';
            script.onload = initTyped;
            document.head.appendChild(script);
        } else {
            initTyped();
        }
        
        function initTyped() {
            // Create element for typed text
            const heroText = document.querySelector('.hero-text h1');
            const heroSubtitle = document.createElement('div');
            heroSubtitle.className = 'hero-subtitle';
            heroSubtitle.style.color = 'var(--primary)';
            heroSubtitle.style.fontSize = '1.5rem';
            heroSubtitle.style.fontWeight = '500';
            heroSubtitle.style.marginBottom = '1.5rem';
            
            // Insert after h1
            heroText.insertAdjacentElement('afterend', heroSubtitle);
            
            // Initialize Typed.js
            new Typed('.hero-subtitle', {
                strings: [
                    'AI Engineer', 
                    'LLM Specialist', 
                    'RAG Systems Builder',
                    'Machine Learning Developer'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 1500,
                startDelay: 500,
                loop: true
            });
        }
    };
    
    addTypedEffect();
    
    // Contact form handling
    const addContactForm = () => {
        const contactSection = document.querySelector('#contact .footer-content');
        const formContainer = document.createElement('div');
        formContainer.className = 'contact-form';
        formContainer.style.marginTop = '2rem';
        
        formContainer.innerHTML = `
            <form id="contactForm">
                <div class="form-group">
                    <input type="text" id="name" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="email" id="email" placeholder="Your Email" required>
                </div>
                <div class="form-group">
                    <textarea id="message" placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" class="btn">Send Message</button>
            </form>
        `;
        
        contactSection.appendChild(formContainer);
        
        // Add form styles
        const style = document.createElement('style');
        style.textContent = `
            .contact-form {
                max-width: 600px;
                margin: 0 auto;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-group input, .form-group textarea {
                width: 100%;
                padding: 1rem;
                border-radius: 5px;
                border: 1px solid var(--light-gray);
                font-size: 1rem;
                transition: border-color 0.3s;
            }
            
            .form-group input:focus, .form-group textarea:focus {
                outline: none;
                border-color: var(--primary);
            }
            
            .contact-form .btn {
                display: inline-block;
                padding: 0.8rem 2rem;
                cursor: pointer;
                border: none;
            }
        `;
        document.head.appendChild(style);
        
        // Form submission handling
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Create toast notification
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="fas fa-check-circle"></i>
                    <div class="toast-message">
                        <p>Thank you, ${name}!</p>
                        <p>Your message has been sent successfully.</p>
                    </div>
                </div>
            `;
            document.body.appendChild(toast);
            
            // Add toast styles
            const toastStyle = document.createElement('style');
            toastStyle.textContent = `
                .toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: #4CAF50;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    display: flex;
                    z-index: 1000;
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                }
                
                .toast-content {
                    display: flex;
                    align-items: center;
                }
                
                .toast-content i {
                    margin-right: 15px;
                    font-size: 24px;
                }
                
                .toast.show {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(toastStyle);
            
            // Show toast
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            // Remove toast after 4 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 4000);
            
            // Reset form
            this.reset();
        });
    };
    
    addContactForm();
    
    // Dark/Light mode toggle
    const addThemeToggle = () => {
        const header = document.querySelector('.header-content');
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.marginLeft = '20px';
        themeToggle.style.cursor = 'pointer';
        themeToggle.style.fontSize = '1.2rem';
        themeToggle.style.color = 'white';
        
        header.appendChild(themeToggle);
        
        // Add theme toggle styles
        const style = document.createElement('style');
        style.textContent = `
            body.light-mode {
                --dark: #f8fafc;
                --light: #0f172a;
                --gray: #94a3b8;
                --light-gray: #334155;
                --secondary: #1e293b;
                color: var(--light);
            }
            
            body.light-mode header,
            body.light-mode footer {
                background-color: var(--dark);
                color: var(--light);
            }
            
            body.light-mode nav ul li a,
            body.light-mode .footer-social a,
            body.light-mode .theme-toggle {
                color: var(--light);
            }
            
            body.light-mode .logo {
                color: var(--light);
            }
            
            body.light-mode .hero {
                background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
                color: var(--light);
            }
            
            body.light-mode .copyright {
                color: var(--gray);
            }
            
            body.light-mode .skill-tag {
                background-color: var(--secondary);
                color: white;
            }
            
            body.light-mode .theme-toggle i {
                color: var(--light);
            }
            
            @media (max-width: 768px) {
                body.light-mode nav {
                    background-color: var(--dark);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Toggle theme
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            
            if (document.body.classList.contains('light-mode')) {
                this.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'light');
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'dark');
            }
        });
        
        // Check saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    };
    
    addThemeToggle();
    
    // Project filtering capability
    const addProjectFilters = () => {
        const projectsSection = document.querySelector('#projects .container');
        const projectItems = document.querySelectorAll('.project-item');
        
        // Extract unique tags from projects
        const tags = new Set();
        projectItems.forEach(project => {
            // Assuming projects have skills/tags that can be extracted
            // For this example, we'll extract from the project description
            const description = project.querySelector('.project-description').textContent;
            const words = description.split(' ');
            words.forEach(word => {
                if (word.length > 5) {  // Just a simple filter for demo
                    tags.add(word.replace(/[.,]/g, ''));
                }
            });
        });
        
        // Create filter buttons
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.style.marginBottom = '2rem';
        filterContainer.style.display = 'flex';
        filterContainer.style.justifyContent = 'center';
        filterContainer.style.flexWrap = 'wrap';
        filterContainer.style.gap = '1rem';
        
        // Add "All" button
        const allButton = document.createElement('button');
        allButton.textContent = 'All';
        allButton.className = 'filter-btn active';
        filterContainer.appendChild(allButton);
        
        // Add tag buttons (limited to 5 for demo)
        let count = 0;
        tags.forEach(tag => {
            if (count < 5) {
                const button = document.createElement('button');
                button.textContent = tag;
                button.className = 'filter-btn';
                filterContainer.appendChild(button);
                count++;
            }
        });
        
        // Insert filters after h2
        projectsSection.querySelector('h2').insertAdjacentElement('afterend', filterContainer);
        
        // Add filter styles
        const style = document.createElement('style');
        style.textContent = `
            .filter-btn {
                background-color: var(--light);
                color: var(--dark);
                border: 1px solid var(--light-gray);
                padding: 0.5rem 1rem;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .filter-btn:hover, .filter-btn.active {
                background-color: var(--primary);
                color: white;
                border-color: var(--primary);
            }
            
            .project-item {
                transition: all 0.5s ease;
            }
            
            .project-item.hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        // Filter functionality (just for demonstration)
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Simple filter based on button text (for demo purposes)
                const filterValue = this.textContent.toLowerCase();
                
                projectItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (filterValue === 'all' || text.includes(filterValue)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    };
    
    addProjectFilters();
    
    // Simple page load animation
    document.body.style.opacity = 0;
    document.body.style.transition = 'opacity 1s ease';
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 100);
});