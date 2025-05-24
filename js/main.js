document.addEventListener('DOMContentLoaded', function() {
    // Initialize language from localStorage or default to English
    let currentLang = localStorage.getItem('userLanguage') || 'en';
    
    // Apply initial translations
    applyTranslations(currentLang);
    updateActiveLanguageButton(currentLang);
    
    // Set up language toggle buttons
    const langButtons = document.querySelectorAll('.language-toggle .lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Set up mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Set up dropdown functionality for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (window.innerWidth <= 768) {
            dropdown.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' && e.target.nextElementSibling) {
                    e.preventDefault();
                    this.classList.toggle('active');
                }
            });
        }
    });
    
    // Hero slider functionality
    initHeroSlider();
    
    // Initialize GSAP animations
    initAnimations();
});

// Function to change language
function changeLanguage(lang) {
    // Store language preference
    localStorage.setItem('userLanguage', lang);
    
    // Apply translations
    applyTranslations(lang);
    
    // Update active button
    updateActiveLanguageButton(lang);
}

// Function to apply translations based on language
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        
        // Navigate through nested keys
        let translation = translations[lang];
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                console.warn(`Translation key not found: ${key} for language ${lang}`);
                return;
            }
        }
        
        // Apply translation
        if (typeof translation === 'string') {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

// Function to update active language button
function updateActiveLanguageButton(lang) {
    const langButtons = document.querySelectorAll('.language-toggle .lang-btn');
    langButtons.forEach(button => {
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Function to initialize hero slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto-rotate slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// Function to initialize GSAP animations
function initAnimations() {
    if (typeof gsap !== 'undefined') {
        // Animate hero content
        gsap.from('.hero-content', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.5
        });
        
        // Animate section titles on scroll
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            });
        });
        
        // Animate cards on scroll
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%'
                },
                duration: 0.6,
                y: 30,
                opacity: 0,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
    }
}
