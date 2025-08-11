(function() {
  "use strict";
  
  /**
   * Function to run after the DOM is ready
   */
  const onDOMContentLoaded = () => {
    
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
      window.addEventListener('load', togglescrollTop);
      document.addEventListener('scroll', togglescrollTop);
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    /**
     * Mobile Nav Toggle
     */
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
      // Initialize ARIA expanded state
      mobileNavToggle.setAttribute('aria-expanded', 'false');

      mobileNavToggle.addEventListener('click', function(event) {
        event.preventDefault();
        const isActive = document.body.classList.toggle('mobile-nav-active');
        mobileNavToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      });
      
      document.querySelectorAll('#navmenu a').forEach(navlink => {
        navlink.addEventListener('click', () => {
          if (document.body.classList.contains('mobile-nav-active')) {
            document.body.classList.remove('mobile-nav-active');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
    
    /**
     * Initiate GLightbox
     */
    GLightbox({
      selector: '.glightbox'
    });
    
    /**
     * Init Testimonials Swiper Slider
     */
    if (document.querySelector('.testimonials .swiper')) {
      new Swiper('.testimonials .swiper', {
        loop: true,
        speed: 600,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          1200: {
            slidesPerView: 2,
            spaceBetween: 20
          }
        }
      });
    }
    
    /**
     * Initiate Pure Counter
     */
    new PureCounter();
    
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
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  };
  
  // Run the initialization function when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
  } else {
    onDOMContentLoaded();
  }
  
})();
