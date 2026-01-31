// Optimized Animations for Maximum Performance

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for Scroll Reveal (More Efficient)
function initScrollReveal() {
    const elements = document.querySelectorAll('.content-section, .robot-card, .roster-member, .gallery-item');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-reveal', 'revealed');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });
        
        elements.forEach(el => observer.observe(el));
    } else {
        // Fallback: just show everything
        elements.forEach(el => el.classList.add('revealed'));
    }
}

// Navbar Scroll Effect (Throttled)
function initNavbarScroll() {
    const navbar = document.querySelector('.topbar');
    if (!navbar) return;
    
    const handleScroll = throttle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// Stagger Animation (Lightweight)
function initStaggerAnimation() {
    const lists = document.querySelectorAll('.team-roster, .gallery-grid');
    lists.forEach(list => {
        Array.from(list.children).forEach((item, index) => {
            item.classList.add('stagger-item');
            item.style.animationDelay = `${index * 0.05}s`;
        });
    });
}

// Add Float to Logo Only
function initFloatAnimation() {
    const logo = document.querySelector('.nav-logo');
    if (logo && window.innerWidth > 768) { // Only on desktop
        logo.classList.add('float-animation');
    }
}

// Lazy Load Images with Fade
function initLazyLoadFade() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '0';
                img.style.animation = 'fadeIn 0.3s ease-out forwards';
            }, { once: true });
        });
    }
}

// Add Glow to Cards
function initCardGlow() {
    if (window.innerWidth > 768) { // Only on desktop
        const cards = document.querySelectorAll('.robot-card, .platform-card');
        cards.forEach(card => card.classList.add('glow-on-hover'));
    }
}

// Page Transition (Lightweight)
function initPageTransitions() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    }, { once: true });
}

// Initialize all (Optimized)
function initAllAnimations() {
    // Critical animations first
    initPageTransitions();
    initNavbarScroll();
    initSmoothScroll();
    
    // Defer non-critical animations
    requestIdleCallback(() => {
        initScrollReveal();
        initStaggerAnimation();
        initFloatAnimation();
        initLazyLoadFade();
        initCardGlow();
    }, { timeout: 2000 });
    
    console.log('⚡ Optimized animations loaded!');
}

// Use requestIdleCallback for better performance
const requestIdleCallback = window.requestIdleCallback || function(cb) {
    return setTimeout(cb, 1);
};

// Run efficiently
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
    initAllAnimations();
}
