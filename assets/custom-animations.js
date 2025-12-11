/**
 * BLESS JOBS - CUSTOM ANIMATIONS JAVASCRIPT
 * Premium scroll-triggered animations and interactive effects
 */

(function () {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        intersectionThreshold: 0.1,
        intersectionRootMargin: '0px 0px -100px 0px',
        enableParallax: true,
        enableSmoothScroll: true
    };

    // ========================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ========================================
    function initScrollAnimations() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('Intersection Observer not supported, animations will not trigger on scroll');
            return;
        }

        const observerOptions = {
            threshold: CONFIG.intersectionThreshold,
            rootMargin: CONFIG.intersectionRootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with scroll-animate class
        const animatedElements = document.querySelectorAll('.scroll-animate');
        animatedElements.forEach(el => observer.observe(el));

        // Observe stagger items
        const staggerItems = document.querySelectorAll('.stagger-item');
        staggerItems.forEach(el => observer.observe(el));
    }

    // ========================================
    // STAGGER ANIMATION SETUP
    // ========================================
    function setupStaggerAnimations() {
        // Add delay classes to feature items
        const featureItems = document.querySelectorAll('.features10 .item');
        featureItems.forEach((item, index) => {
            item.classList.add('stagger-item', `delay-${index + 1}`);
        });

        // Add stagger to team images
        const teamItems = document.querySelectorAll('.features03 .item');
        teamItems.forEach((item, index) => {
            item.classList.add('scroll-animate', `delay-${index + 1}`);
        });

        // Add stagger to feedback cards
        const feedbackItems = document.querySelectorAll('.people04 .item');
        feedbackItems.forEach((item, index) => {
            item.classList.add('stagger-item', `delay-${(index % 4) + 1}`);
        });
    }

    // ========================================
    // PARALLAX SCROLLING EFFECT
    // ========================================
    function initParallax() {
        if (!CONFIG.enableParallax) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // ========================================
    // BUTTON RIPPLE EFFECT
    // ========================================
    function initButtonRipples() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                // Remove any existing ripples
                const existingRipple = this.querySelector('.ripple');
                if (existingRipple) {
                    existingRipple.remove();
                }

                this.appendChild(ripple);

                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    function initSmoothScroll() {
        if (!CONFIG.enableSmoothScroll) return;

        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Skip if href is just "#"
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // NAVBAR SCROLL EFFECTS
    // ========================================
    function initNavbarEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;
        let ticking = false;

        function updateNavbar() {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.boxShadow = 'none';
            }

            // Hide navbar on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // ========================================
    // CAROUSEL AUTOPLAY ENHANCEMENT
    // ========================================
    function enhanceCarousel() {
        const carousel = document.querySelector('.embla');
        if (!carousel) return;

        // Add pause on hover
        carousel.addEventListener('mouseenter', () => {
            carousel.setAttribute('data-auto-play-interval', '0');
        });

        carousel.addEventListener('mouseleave', () => {
            carousel.setAttribute('data-auto-play-interval', '3');
        });
    }

    // ========================================
    // LAZY LOADING IMAGES
    // ========================================
    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback to Intersection Observer
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img.lazy');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ========================================
    // PERFORMANCE: REDUCE MOTION FOR USERS
    // ========================================
    function respectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-speed-fast', '0.01s');
            document.documentElement.style.setProperty('--animation-speed-normal', '0.01s');
            document.documentElement.style.setProperty('--animation-speed-slow', '0.01s');

            // Disable parallax for reduced motion users
            CONFIG.enableParallax = false;
        }
    }

    // ========================================
    // CURSOR TRAIL EFFECT (OPTIONAL)
    // ========================================
    function initCursorTrail() {
        // Only on desktop
        if (window.innerWidth < 768) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        // Create custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 2px solid #6366f1;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease;
      display: none;
    `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.display = 'block';
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            cursor.style.left = cursorX - 10 + 'px';
            cursor.style.top = cursorY - 10 + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Scale cursor on hover
        const interactiveElements = document.querySelectorAll('a, button, .btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = '#8b5cf6';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#6366f1';
            });
        });
    }

    // ========================================
    // INITIALIZE ALL ANIMATIONS
    // ========================================
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('🎨 Initializing Bless Jobs custom animations...');

        // Respect user preferences
        respectReducedMotion();

        // Initialize all features
        setupStaggerAnimations();
        initScrollAnimations();
        initParallax();
        initButtonRipples();
        initSmoothScroll();
        initNavbarEffects();
        enhanceCarousel();
        initLazyLoading();

        // Optional: Uncomment to enable cursor trail
        // initCursorTrail();

        console.log('✨ Animations initialized successfully!');
    }

    // Start initialization
    init();

})();
