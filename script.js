/* ==
   FIT24 OCEANS WEBSITE SCRIPT
   ---------------------------------------------------------
   This JavaScript file handles:
   1) mobile navigation toggle
   2) contact form validation and demo storage
   3) section reveal animations
   4) active navigation link highlighting
   5) automatic reviews carousel movement every 2 seconds
   == */

// DOM lookups
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
const form = document.getElementById('enquiryForm');
const formMessage = document.getElementById('formMessage');
const currentYear = document.getElementById('currentYear');
const animatedItems = document.querySelectorAll('.fade-up');
const sections = document.querySelectorAll('main section[id]');
const reviewsTrack = document.getElementById('reviewsTrack');

// Footer year automation
if (currentYear) currentYear.textContent = new Date().getFullYear();

// Mobile menu behavior
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Contact form validation + demo localStorage persistence
if (form && formMessage) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();

    if (!name || !email || !message) {
      formMessage.textContent = 'Please complete your name, email, and fitness goal before submitting.';
      formMessage.className = 'form-message error';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.textContent = 'Please enter a valid email address.';
      formMessage.className = 'form-message error';
      return;
    }

    const enquiry = { name, email, phone, message, submittedAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem('fit24OceansEnquiries') || '[]');
      existing.push(enquiry);
      localStorage.setItem('fit24OceansEnquiries', JSON.stringify(existing));
    } catch (error) {
      console.warn('Local storage is unavailable in this environment:', error);
    }

    form.reset();
    formMessage.textContent = 'Thanks! Your enquiry has been captured in this browser demo. Connect the form to Formspree, EmailJS, Netlify Forms, or your own backend to receive real submissions.';
    formMessage.className = 'form-message success';
  });
}

// Scroll reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
animatedItems.forEach((item) => revealObserver.observe(item));

// Active navigation highlighting
const setActiveNav = () => {
  let currentId = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) currentId = section.id;
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${currentId}`) link.classList.add('active');
    else link.classList.remove('active');
  });
};
window.addEventListener('scroll', setActiveNav);
window.addEventListener('load', setActiveNav);

// Automatic reviews carousel: moves right to left every 2 seconds
if (reviewsTrack) {
  const originalSlides = Array.from(reviewsTrack.children);
  const firstClone = originalSlides[0].cloneNode(true);
  reviewsTrack.appendChild(firstClone);
  let index = 0;
  const totalSlides = originalSlides.length;

  const moveToSlide = (slideIndex) => {
    reviewsTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
  };

  setInterval(() => {
    index += 1;
    moveToSlide(index);
    if (index === totalSlides) {
      setTimeout(() => {
        reviewsTrack.style.transition = 'none';
        index = 0;
        moveToSlide(index);
        void reviewsTrack.offsetWidth;
        reviewsTrack.style.transition = 'transform 0.8s ease';
      }, 820);
    }
  }, 2000);
}
