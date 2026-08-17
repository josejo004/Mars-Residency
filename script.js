// JavaScript Document
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('is-hidden'), 400);
  });
  setTimeout(() => preloader.classList.add('is-hidden'), 2200); // fallback

  /* ---------- Hero word reveal ---------- */
  const hero = document.querySelector('.hero');
  setTimeout(() => hero.classList.add('is-ready'), 300);

  /* ---------- Hero slider ---------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('span');
  let current = 0;
  function goToSlide(i){
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = i;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }
  setInterval(() => goToSlide((current + 1) % slides.length), 5000);

  /* ---------- Floating particles ---------- */
  const particleWrap = document.getElementById('heroParticles');
  for (let i = 0; i < 22; i++){
    const p = document.createElement('span');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (10 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
    p.style.width = p.style.height = (3 + Math.random() * 4) + 'px';
    particleWrap.appendChild(p);
  }

  /* ---------- Navbar scroll state + active link ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    navbar.classList.toggle('is-scrolled', window.scrollY > 60);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);

    let currentSection = sections[0].id;
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) currentSection = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
    });
	 
  }
	
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-open');
    navLinksWrap.classList.toggle('is-open');
  });
  navLinksWrap.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('is-open');
      navLinksWrap.classList.remove('is-open');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.reveal-left, .reveal-right, .about .reveal-up, .rooms .reveal-up, .tourist-card, .blog-card, .facility'
  );
  revealTargets.forEach((el, i) => el.style.setProperty('--i', i % 8));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => io.observe(el));

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Room filter tabs ---------- */
  const roomTabs = document.querySelectorAll('.room-tab');
  const roomCards = document.querySelectorAll('.room-card');
  function applyFilter(filter){
    roomCards.forEach(card => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.classList.toggle('is-visible', show);
    });
  }
  applyFilter('ac');
  roomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roomTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      applyFilter(tab.dataset.filter);
    });
  });

  /* ---------- Form validation helper ---------- */
  function validateForm(form){
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const wrap = field.closest('.form-field');
      let fieldValid = field.value.trim() !== '';
      if (field.type === 'email' && fieldValid){
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      }
      if (field.type === 'tel' && fieldValid){
        fieldValid = /^[0-9+\-\s()]{7,}$/.test(field.value.trim());
      }
      if (wrap) wrap.classList.toggle('has-error', !fieldValid);
      if (!fieldValid) valid = false;
    });
    return valid;
  }

 /* ---------- Booking form + WhatsApp ---------- */

const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const checkin = document.getElementById('checkin');
const checkout = document.getElementById('checkout');

/* ===== WhatsApp Number ===== */
/* Replace this with Mars Residency WhatsApp number */
const whatsappNumber = '919443546125';

/* ===== Date setup ===== */
const today = new Date().toISOString().split('T')[0];

checkin.min = today;
checkout.min = today;

checkin.addEventListener('change', () => {
  checkout.min = checkin.value;
});


/* ===== Booking Form Submit ===== */

bookingForm.addEventListener('submit', (e) => {

  e.preventDefault();

  /* Validate required fields */
  if (!validateForm(bookingForm)) return;


  /* ===== Get booking details ===== */

  const guestName = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();

  const checkinDate = document.getElementById('checkin').value;
  const checkoutDate = document.getElementById('checkout').value;

  const adults = document.getElementById('adults').value;
  const children = document.getElementById('children').value;

  const roomType = document.getElementById('roomType').value;

  const specialRequest =
    document.getElementById('request').value.trim();


  /* ===== Check checkout date ===== */

  if (checkoutDate <= checkinDate) {

    alert('Check-out date must be after the check-in date.');

    return;
  }


  /* ===== Format date ===== */

  function formatDate(dateString) {

    const date = new Date(dateString + 'T00:00:00');

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  }


  /* ===== WhatsApp Message ===== */

  const message = `🏨 *MARS RESIDENCY*

*BOOKING REQUEST*

Hello Mars Residency,

I would like to make a booking.

━━━━━━━━━━━━━━━━━━

👤 *GUEST DETAILS*

Name: ${guestName}

Phone: ${phone}

Email: ${email}

━━━━━━━━━━━━━━━━━━

📅 *STAY DETAILS*

Check-In: ${formatDate(checkinDate)}

Check-Out: ${formatDate(checkoutDate)}

━━━━━━━━━━━━━━━━━━

👨‍👩‍👧 *GUESTS*

Adults: ${adults}

Children: ${children}

━━━━━━━━━━━━━━━━━━

🛏️ *ROOM TYPE*

${roomType}

━━━━━━━━━━━━━━━━━━

📝 *SPECIAL REQUEST*

${specialRequest || 'No special request'}

━━━━━━━━━━━━━━━━━━

Please check the availability and confirm my booking.

Thank you. 🙏`;


  /* ===== Open WhatsApp ===== */

  const whatsappURL =
    'https://wa.me/' +
    whatsappNumber +
    '?text=' +
    encodeURIComponent(message);


  window.open(whatsappURL, '_blank');


  /* ===== Reset form ===== */

  bookingForm.reset();

  checkin.min = today;
  checkout.min = today;

});
 /* ---------- Contact form → WhatsApp ---------- */

const contactForm = document.getElementById('contactForm');

/* ===== Mars Residency WhatsApp Number ===== */
/* Replace with your actual WhatsApp number */
const contactWhatsAppNumber = '919443546125';

contactForm.addEventListener('submit', (e) => {

  e.preventDefault();

  /* Existing validation */
  if (!validateForm(contactForm)) return;


  /* Get form values */
  const name =
    contactForm.querySelector('[name="name"]')?.value.trim() || '';

  const phone =
    contactForm.querySelector('[name="phone"]')?.value.trim() || '';

  const email =
    contactForm.querySelector('[name="email"]')?.value.trim() || '';

  const message =
    contactForm.querySelector('[name="message"]')?.value.trim() || '';


  /* WhatsApp message */
  const whatsappMessage = `🏨 *MARS RESIDENCY*

Hello Mars Residency,

I have a message / enquiry.

━━━━━━━━━━━━━━━━━━

👤 *Name*
${name}

📞 *Phone*
${phone}

📧 *Email*
${email}

💬 *Message*
${message}

━━━━━━━━━━━━━━━━━━

Please get back to me.

Thank you. 🙏`;


  /* Create WhatsApp URL */
  const whatsappURL =
    'https://wa.me/' +
    contactWhatsAppNumber +
    '?text=' +
    encodeURIComponent(whatsappMessage);


  /* Open WhatsApp */
  window.open(whatsappURL, '_blank');


  /* Reset form */
  contactForm.reset();

});

  /* ---------- Newsletter ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    input.placeholder = 'Subscribed ✓';
    newsletterForm.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});