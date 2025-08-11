(function() {
  "use strict";
  
  /**
   * Function to run after the DOM is ready
   */
  const onDOMContentLoaded = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    
    /**
     * Preloader
     */
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.remove();
      }, 100);
    }
    
    /**
     * Scroll top button
     */
    const scrollTop = document.querySelector('#scroll-top');
    if (scrollTop) {
      const togglescrollTop = function() {
        if (window.scrollY > 100) {
          scrollTop.classList.remove('invisible', 'opacity-0');
          scrollTop.classList.add('visible', 'opacity-100');
        } else {
          scrollTop.classList.remove('visible', 'opacity-100');
          scrollTop.classList.add('invisible', 'opacity-0');
        }
      }
      window.addEventListener('load', togglescrollTop, { passive: true });
      document.addEventListener('scroll', togglescrollTop, { passive: true });
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    }
    
    /**
     * Mobile Nav Toggle - Fixed and Improved
     */
    const initMobileNavigation = () => {
      const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
      const navMenu = document.getElementById('navmenu');
      const headerEl = document.getElementById('header');
      
      // Early return if required elements don't exist
      if (!mobileNavToggle || !navMenu) {
        console.warn('Mobile navigation elements not found');
        return;
      }

      // Debounce function to prevent rapid clicking
      let isAnimating = false;
      const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
      };

      // Store previous focus for accessibility
      let previousFocus = null;

      const openNav = () => {
        if (isAnimating) return;
        isAnimating = true;
        
        // Store current focus
        previousFocus = document.activeElement;
        
        // Update ARIA state
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        
        // Add body class
        document.body.classList.add('mobile-nav-active');
        
        // Show menu with proper classes
        navMenu.classList.add('is-open', 'translate-x-0', 'opacity-100', 'pointer-events-auto');
        navMenu.classList.remove('-translate-x-full', 'opacity-0', 'pointer-events-none');
        
        // Focus management - focus first focusable element in menu
        const firstFocusable = navMenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
          firstFocusable.focus();
        }
        
        // Reset animation flag after transition
        setTimeout(() => {
          isAnimating = false;
        }, 300);
      };

      const closeNav = () => {
        if (isAnimating) return;
        isAnimating = true;
        
        // Update ARIA state
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        
        // Remove body class
        document.body.classList.remove('mobile-nav-active');
        
        // Hide menu
        navMenu.classList.remove('is-open', 'translate-x-0', 'opacity-100', 'pointer-events-auto');
        navMenu.classList.add('-translate-x-full', 'opacity-0', 'pointer-events-none');
        
        // Restore focus to previous element
        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus();
        }
        
        // Reset animation flag after transition
        setTimeout(() => {
          isAnimating = false;
        }, 300);
      };

      const toggleNav = debounce((event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const isActive = document.body.classList.contains('mobile-nav-active');
        
        if (isActive) {
          closeNav();
        } else {
          openNav();
        }
      }, 100);

      // Event listeners
      mobileNavToggle.addEventListener('click', toggleNav);
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-active')) {
          closeNav();
        }
      });

      // Close on click outside
      document.addEventListener('click', (e) => {
        if (document.body.classList.contains('mobile-nav-active') && 
            !navMenu.contains(e.target) && 
            !mobileNavToggle.contains(e.target)) {
          closeNav();
        }
      });

      // Handle navigation link clicks
      const handleNavLinkClick = (e) => {
        const href = e.currentTarget.getAttribute('href');
        
        // Handle anchor links
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            
            // Get header height safely
            const headerHeight = headerEl ? headerEl.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
            
            // Smooth scroll with fallback
            if ('scrollBehavior' in document.documentElement.style) {
              window.scrollTo({ 
                top: targetTop, 
                behavior: prefersReducedMotion ? 'auto' : 'smooth' 
              });
            } else {
              window.scrollTo(0, targetTop);
            }
          }
        }
        
        // Close mobile menu if open
        if (document.body.classList.contains('mobile-nav-active')) {
          closeNav();
        }
      };

      // Add click handlers to navigation links
      const navLinks = navMenu.querySelectorAll('a[href^="#"]');
      navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
      });

      // Handle window resize
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          // Close mobile menu on large screens
          if (window.innerWidth >= 1280 && document.body.classList.contains('mobile-nav-active')) {
            closeNav();
          }
        }, 250);
      };

      window.addEventListener('resize', handleResize);
    };

    // Initialize mobile navigation
    initMobileNavigation();
    
    /**
     * Initiate GLightbox
     */
    GLightbox({ selector: '.glightbox' });
    
    /**
     * Init Testimonials Swiper Slider
     */
    if (document.querySelector('.testimonials .swiper')) {
      const autoplayConfig = (prefersReducedMotion || isMobile) ? false : {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      };
      new Swiper('.testimonials .swiper', {
        loop: !(prefersReducedMotion || isMobile),
        speed: prefersReducedMotion ? 0 : (isMobile ? 350 : 450),
        autoplay: autoplayConfig,
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 16 },
          1200: { slidesPerView: 2, spaceBetween: 20 }
        }
      });
    }
    
    /**
     * Initiate Pure Counter
     */
    new PureCounter({
      once: prefersReducedMotion || isMobile,
      pulse: prefersReducedMotion ? 0 : 2
    });
    
    /**
     * FAQ Accordion Logic
     */
    document.querySelectorAll('.faq-item .faq-toggle').forEach((faqToggle) => {
      faqToggle.addEventListener('click', () => {
        const faqItem = faqToggle.closest('.faq-item');
        faqItem.classList.toggle('faq-active');
        const content = faqItem.querySelector('.faq-content');
        
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });
    
    /**
     * Departments Tabbed Content
     */
    const tabLinks = document.querySelectorAll('.departments .nav-link');
    const tabPanes = document.querySelectorAll('.departments .tab-pane');
    
    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        tabLinks.forEach(l => l.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active', 'show'));
        
        link.classList.add('active');
        const targetPane = document.querySelector(link.getAttribute('href'));
        if (targetPane) {
          targetPane.classList.add('active', 'show');
        }
      });
    });
    
    /**
     * Init AOS (Animation on Scroll)
     */
    AOS.init({
      duration: prefersReducedMotion ? 0 : 600,
      easing: prefersReducedMotion ? 'linear' : 'ease-out',
      once: true,
      mirror: false,
      disable: prefersReducedMotion || isMobile
    });
  };
  
  // Run the initialization function when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
  } else {
    onDOMContentLoaded();
  }
  
})();
