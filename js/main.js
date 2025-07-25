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
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
                mainNav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Set up dropdown functionality for mobile and touch devices
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        
        // Handle mobile and touch devices
        if (isMobileOrTouch()) {
            dropdownLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (isMobileOrTouch()) {
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });
    
    // Hero slider functionality
    initHeroSlider();
    
    // Initialize GSAP animations
    initAnimations();
});

// Function to detect mobile or touch devices
function isMobileOrTouch() {
    return window.innerWidth <= 768 || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// Handle window resize
window.addEventListener('resize', function() {
    const mainNav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Reset mobile menu state on resize
    if (window.innerWidth > 768) {
        if (mainNav) mainNav.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
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

// statistics
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".stat-value");

  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const isPercent = counter.textContent.includes("%");
    const isPlus = counter.textContent.includes("+");

    let count = 0;
    const speed = 20; // smaller is faster

    const updateCount = () => {
      const increment = Math.ceil(target / 50);
      if (count < target) {
        count += increment;
        counter.textContent = isPercent ? `${count}%` : isPlus ? `${count}+` : count;
        setTimeout(updateCount, speed);
      } else {
        counter.textContent = isPercent ? `${target}%` : isPlus ? `${target}+` : target;
      }
    };

    updateCount();
  });
});

// statistics text animation 
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector('.fade-in-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.3
  });

  if (section) observer.observe(section);
});

            const elements = document.querySelectorAll('.fade-in');
            const windowHeight = window.innerHeight;
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
                    // Interactive Card Effects
        function addCardInteractions() {
            const cards = document.querySelectorAll('.interactive-element');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
        