// Performance optimization and animation control
const animateOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('animate', entry.target.dataset.animation || 'fadeIn');
            }
        });
    }, { threshold: 0.2, rootMargin: '50px' });

    document.querySelectorAll('[data-animation]').forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
};

// Enhanced lazy loading with error handling
const initLazyLoading = () => {
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;

                if(src) {
                    img.src = src;
                    img.onerror = () => {
                        img.src = 'assets/images/placeholder-image.jpg';
                        console.warn(`Failed to load image: ${src}`);
                    };
                    img.classList.remove('lazy');
                    lazyObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('.lazy').forEach(img => lazyObserver.observe(img));
};

// Improved performance optimizations
const optimizePerformance = () => {
    const resources = [
        { rel: 'preconnect', href: 'https://teachablemachine.withgoogle.com' },
        { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' },
        { rel: 'preload', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', as: 'style' }
    ];

    resources.forEach(resource => {
        const link = document.createElement('link');
        Object.assign(link, resource);
        document.head.appendChild(link);
    });
};

// Enhanced cookie management
const CookieManager = {
    set: (name, value, days = 365) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
    },

    get: (name) => {
        const cookies = document.cookie.split(';');
        const cookie = cookies.find(c => c.trim().startsWith(name + '='));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    },

    delete: (name) => {
        CookieManager.set(name, '', -1);
    }
};

// Improved cookie consent handling
const initializeCookies = () => {
    const savedConsent = CookieManager.get('cookieConsent');
    if(!savedConsent) {
        document.getElementById('cookieBanner')?.classList.add('active');
    } else {
        loadThirdPartyScripts(JSON.parse(savedConsent));
    }
};

// Enhanced back to top functionality
const initBackToTop = () => {
    const button = document.getElementById('backToTop');
    if(!button) return;

    const toggleButton = () => {
        button.classList.toggle('show', window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleButton, { passive: true });
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// Improved demo button animation
const initDemoButton = () => {
    const button = document.querySelector('.demo-cta');
    if(!button) return;

    let animationFrame;

    button.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationFrame);
        button.style.animation = 'pulse 1.5s infinite';
    });

    button.addEventListener('mouseleave', () => {
        button.style.animation = '';
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    try {
        animateOnScroll();
        initBackToTop();
        initDemoButton();
        initializeCookies();
    } catch(error) {
        console.error('Initialization error:', error);
    }
});

window.addEventListener('load', () => {
    try {
        initLazyLoading();
        optimizePerformance();
    } catch(error) {
        console.error('Load error:', error);
    }
});

// Load Third Party Scripts Conditionally
// Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

const loadThirdPartyScripts = (consent) => {
    if(consent.analytics) {
        // Inizializza Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    }

    // Carica iframe demo solo dopo il consenso
    const demoIframe = document.querySelector('.demo-iframe');
    if(demoIframe && consent.analytics) {
        demoIframe.src = demoIframe.dataset.src;
    }
}

// Timeline Animation
const timelineEvents = document.querySelectorAll('.timeline-event');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.3 });

timelineEvents.forEach(event => {
    timelineObserver.observe(event);
});


// Cookie Management (unchanged from original, but integrated with CookieManager)
const cookieBanner = document.getElementById('cookieBanner');
const cookieModal = document.getElementById('cookieModal');
const cookieConsent = {
    necessary: true,
    analytics: false
};

// Save Preferences
const saveCookiePreferences = (analytics = false) => {
    const preferences = {
        necessary: true,
        analytics: analytics
    };

    CookieManager.set('cookieConsent', JSON.stringify(preferences)); // Use CookieManager
    cookieBanner.classList.remove('active');
    cookieModal.style.display = 'none';
    loadThirdPartyScripts(preferences);
};

// Event Listeners
const acceptBtn = document.getElementById('acceptCookies');
const rejectBtn = document.getElementById('rejectCookies');
const manageBtn = document.getElementById('manageCookies');
const saveBtn = document.getElementById('savePreferences');

if (acceptBtn) acceptBtn.addEventListener('click', () => saveCookiePreferences(true));
if (rejectBtn) rejectBtn.addEventListener('click', () => saveCookiePreferences(false));
if (manageBtn) manageBtn.addEventListener('click', () => cookieModal.style.display = 'flex');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const analyticsCheckbox = document.getElementById('analyticsCookies');
        if (analyticsCheckbox) {
            cookieConsent.analytics = analyticsCheckbox.checked;
            saveCookiePreferences(cookieConsent.analytics);
        }
    });
}

// Chiudi modal cliccando fuori
window.onclick = function(event) {
    if(event.target == cookieModal) {
        cookieModal.style.display = "none";
    }
};