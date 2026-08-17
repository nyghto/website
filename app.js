/**
 * NYGHTO.DESIGN — Rock-Solid Kinetic Scroll & Dual-Theme Engine
 * Theme 1: #01249D (Studio Cobalt) // Theme 2: #FFEF03 (Onam Festive Gold Edition 🌸)
 * Mobile & Desktop Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initMobileNavigation();
  initLenisSmoothScroll();
  initVerticalScrollSlider();
  initGlitchFreeScrollPhysics();
  initInteractiveEyeTracking();
  initPaperCard3DTilt();
  initCalScheduler();
  initConversationalBrief();
  initServiceInquireLinks();
  initCrosshairIntersectionTracker();
  initFaqAccordion();
});

/* ==========================================================================
   0. Mobile Navigation Drawer Handler
   ========================================================================== */
function initMobileNavigation() {
  const openBtn = document.getElementById('openMobileMenu');
  const closeBtn = document.getElementById('closeMobileMenu');
  const drawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer) return;

  function openMenu() {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   0. Dual-Theme Engine (Cobalt // Onam #FFEF03 Gold Edition)
   ========================================================================== */
function initThemeEngine() {
  const themeBtns = document.querySelectorAll('.theme-icon-btn, .theme-toggle-btn');
  const savedTheme = localStorage.getItem('nyghto-theme') || 'cobalt';

  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('theme-yellow') ? 'yellow' : 'cobalt';
      const nextTheme = currentTheme === 'cobalt' ? 'yellow' : 'cobalt';
      applyTheme(nextTheme);
      playSynthTone(nextTheme === 'yellow' ? 880 : 440);
      if (nextTheme === 'yellow') {
        triggerFestiveConfetti();
      }
    });
  });
}

function applyTheme(theme) {
  const isYellow = theme === 'yellow';

  if (isYellow) {
    document.body.classList.add('theme-yellow');
    localStorage.setItem('nyghto-theme', 'yellow');
  } else {
    document.body.classList.remove('theme-yellow');
    localStorage.setItem('nyghto-theme', 'cobalt');
  }

  // Update SVG Tube Gradients for Dual Theme
  const baseStops = document.querySelectorAll('#tubeBaseGrad stop');
  const coreStops = document.querySelectorAll('#tubeCoreGlow stop');

  if (baseStops.length >= 4) {
    if (isYellow) {
      baseStops[0].setAttribute('stop-color', '#F59E0B');
      baseStops[1].setAttribute('stop-color', '#D97706');
      baseStops[2].setAttribute('stop-color', '#92400E');
      baseStops[3].setAttribute('stop-color', '#1C1917');
    } else {
      baseStops[0].setAttribute('stop-color', '#3B82F6');
      baseStops[1].setAttribute('stop-color', '#1D4ED8');
      baseStops[2].setAttribute('stop-color', '#0E2D8E');
      baseStops[3].setAttribute('stop-color', '#030C2C');
    }
  }

  if (coreStops.length >= 3) {
    if (isYellow) {
      coreStops[0].setAttribute('stop-color', '#FEF08A');
      coreStops[1].setAttribute('stop-color', '#FBBF24');
      coreStops[2].setAttribute('stop-color', '#B45309');
    } else {
      coreStops[0].setAttribute('stop-color', '#93C5FD');
      coreStops[1].setAttribute('stop-color', '#3B82F6');
      coreStops[2].setAttribute('stop-color', '#1E40AF');
    }
  }
}

// Interactive tactile balloon bounce audio on click
document.addEventListener('DOMContentLoaded', () => {
  const sculpture = document.getElementById('helloSculpture');
  if (sculpture) {
    sculpture.addEventListener('click', () => {
      playSynthTone(523.25);
      setTimeout(() => playSynthTone(659.25), 80);
      setTimeout(() => playSynthTone(783.99), 160);
    });
  }
});

/* ==========================================================================
   Festive Confetti Burst on Click
   ========================================================================== */
window.triggerFestiveConfetti = function() {
  playSynthTone(784);
  setTimeout(() => playSynthTone(1046.5), 100);

  const container = document.getElementById('onamPetals');
  if (!container) return;

  for (let i = 0; i < 16; i++) {
    const burstPetal = document.createElement('div');
    burstPetal.className = 'marigold-petal';
    burstPetal.style.left = `${20 + Math.random() * 60}%`;
    burstPetal.style.top = `20px`;
    burstPetal.style.animationDuration = `${3.5 + Math.random() * 3.5}s`;
    burstPetal.style.transform = `scale(${0.6 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
    container.appendChild(burstPetal);

    setTimeout(() => {
      burstPetal.remove();
    }, 7000);
  }
};

/* ==========================================================================
   1. Rock-Solid Lenis Smooth Scroll Engine (Synced with GSAP)
   ========================================================================== */
let lenis;

function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  const isMobile = window.innerWidth <= 768;

  lenis = new Lenis({
    duration: isMobile ? 1.0 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    infinite: false
  });

  const sliderThumb = document.getElementById('sliderThumb');
  const sliderTrack = document.getElementById('sliderTrack');

  lenis.on('scroll', (e) => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
    if (sliderThumb && sliderTrack) {
      const trackHeight = sliderTrack.offsetHeight;
      const thumbHeight = sliderThumb.offsetHeight;
      const maxTravel = trackHeight - thumbHeight;
      const travel = Math.min(maxTravel, Math.max(0, e.progress * maxTravel));
      sliderThumb.style.transform = `translateY(${travel}px)`;
    }
  });

  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target && lenis) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.2 });
      }
    });
  });
}

/* ==========================================================================
   Bespoke Right Vertical Scroll Slider Interaction (Click & Drag & Touch)
   ========================================================================== */
function initVerticalScrollSlider() {
  const track = document.getElementById('sliderTrack');
  const thumb = document.getElementById('sliderThumb');
  if (!track || !thumb) return;

  let isDragging = false;

  function scrubTo(clientY) {
    const rect = track.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const progress = Math.min(1, Math.max(0, offsetY / rect.height));

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = progress * maxScroll;

    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.4 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    scrubTo(e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    scrubTo(e.clientY);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support
  track.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      scrubTo(e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length === 0) return;
    scrubTo(e.touches[0].clientY);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   2. Glitch-Free Leaf-Node Parallax & Pinned Physics
   ========================================================================== */
function initGlitchFreeScrollPhysics() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth <= 768;

  // 1. Grid Background Parallax Drift
  gsap.to('.crosshair-grid-bg', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5
    },
    y: -50,
    ease: 'none'
  });

  // 2. Hero Centerpiece Parallax & Stickers
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-stage',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5
    }
  });

  heroTl
    .to('#helloSculptureWrap', { y: isMobile ? -30 : -85, scale: 0.92, opacity: 0.35, ease: 'none' }, 0)
    .to('.sticker-heart', { y: isMobile ? -40 : -160, rotate: 20, ease: 'none' }, 0)
    .to('.sticker-onam-pookkalam', { y: isMobile ? -40 : -140, rotate: 180, ease: 'none' }, 0)
    .to('.sticker-kathakali', { y: isMobile ? -40 : -180, rotate: -15, ease: 'none' }, 0)
    .to('.sticker-olakkuda', { y: isMobile ? -30 : -150, rotate: 20, ease: 'none' }, 0)
    .to('.sticker-vallam', { y: isMobile ? -30 : -100, x: isMobile ? 15 : 40, ease: 'none' }, 0)
    .to('.sticker-eyes', { y: isMobile ? -30 : -120, x: isMobile ? -15 : -40, ease: 'none' }, 0)
    .to('.sticker-cursor', { y: isMobile ? -35 : -140, x: isMobile ? 20 : 50, rotate: 18, ease: 'none' }, 0)
    .to('.hero-info-grid', { y: -25, opacity: 0.4, ease: 'none' }, 0)
    .to('.word-split-hero:nth-child(1)', { x: isMobile ? 0 : -30, ease: 'none' }, 0)
    .to('.word-split-hero:nth-child(2)', { x: isMobile ? 0 : 30, ease: 'none' }, 0)
    .to('.word-split-hero:nth-child(3)', { x: isMobile ? 0 : -20, ease: 'none' }, 0);

  // 2b. Initial Hero Entrance Animation
  gsap.from('.word-split-hero', {
    y: 60,
    opacity: 0,
    stagger: 0.12,
    duration: 1.0,
    ease: 'power3.out',
    delay: 0.1
  });

  gsap.from('#helloSculptureWrap', {
    scale: 0.85,
    y: 35,
    opacity: 0,
    duration: 1.2,
    ease: 'elastic.out(1, 0.75)',
    delay: 0.2
  });

  gsap.from('.mouse-magnetic-sticker', {
    scale: 0,
    opacity: 0,
    stagger: 0.08,
    duration: 0.8,
    ease: 'back.out(1.7)',
    delay: 0.4
  });

  // 3. Physical Paper Card Scrub Entrance
  const paperCard = document.getElementById('paperCard');
  if (paperCard) {
    gsap.fromTo(paperCard,
      {
        y: isMobile ? 60 : 180,
        rotate: -12,
        scale: 0.9,
        opacity: 0
      },
      {
        y: 0,
        rotate: -3.5,
        scale: 1,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.statement-section',
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.6
        }
      }
    );
  }

  // 4. Statement Copy Entrance
  gsap.fromTo('.statement-lead',
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: '.statement-section',
        start: 'top 75%',
        end: 'top 40%',
        scrub: 0.6
      }
    }
  );

  gsap.fromTo('.statement-sub-wrap',
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: '.statement-section',
        start: 'top 68%',
        end: 'top 35%',
        scrub: 0.6
      }
    }
  );

  // 5. Bespoke Editorial Sticky Pinned Statement
  const pinnedTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#pinned-statement',
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 0.6
    }
  });

  pinnedTl
    .fromTo('#pinned-text', 
      { scale: 0.85, opacity: 0.2 }, 
      { scale: isMobile ? 1.0 : 1.12, opacity: 1, ease: 'power1.out' }, 0
    )
    .fromTo('.pinned-row-1', 
      { x: isMobile ? -15 : -60 }, 
      { x: isMobile ? 10 : 35, ease: 'none' }, 0
    )
    .fromTo('.pinned-row-2', 
      { scale: 0.9 }, 
      { scale: 1.05, ease: 'none' }, 0
    )
    .fromTo('.pinned-row-3', 
      { x: isMobile ? 15 : 60 }, 
      { x: isMobile ? -10 : -35, ease: 'none' }, 0
    )
    .fromTo('.pinned-reticle', 
      { opacity: 0.2 }, 
      { opacity: 0.8, ease: 'none' }, 0
    );

  // Click chime on pinned statement
  const pinnedHeadline = document.getElementById('pinned-text');
  if (pinnedHeadline) {
    pinnedHeadline.addEventListener('click', () => {
      playSynthTone(440);
      setTimeout(() => playSynthTone(554.37), 100);
      setTimeout(() => playSynthTone(659.25), 200);
    });
  }

  // 6. React Bits <ScrollStack /> Stacking Engine
  const stackCards = gsap.utils.toArray('.scroll-stack-card');
  const stackEnd = document.querySelector('.scroll-stack-end');

  if (stackCards.length && stackEnd) {
    stackCards.forEach((card, i) => {
      const isLast = i === stackCards.length - 1;
      const stackOffset = i * (isMobile ? 18 : 28);
      const targetScale = 0.90 + i * 0.025;

      // Pinning each card at top with staggered offset
      ScrollTrigger.create({
        trigger: card,
        start: () => `top top+=${isMobile ? 80 : 120 + stackOffset}`,
        endTrigger: stackEnd,
        end: 'top top+=65%',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1
      });

      // Scaling down and blurring as subsequent cards stack over
      if (!isLast) {
        gsap.to(card, {
          scale: targetScale,
          filter: isMobile ? 'none' : 'blur(2px)',
          opacity: 0.88,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: stackCards[i + 1],
            start: () => `top top+=${isMobile ? 80 : 120 + stackOffset + 60}`,
            end: () => `top top+=${isMobile ? 80 : 120 + stackOffset}`,
            scrub: 0.5
          }
        });
      }
    });
  }

  // 7. FAQ Items Stagger Scroll In
  gsap.utils.toArray('.faq-item').forEach((item, index) => {
    gsap.fromTo(item,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: index * 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 92%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // 8. Contact Section Entrance
  gsap.fromTo('.conversational-brief-card',
    { y: 35, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.creative-contact-section',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // 9. Footer Letters Reveal
  gsap.fromTo('.footer-letter-reveal',
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.monumental-footer',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

/* ==========================================================================
   3. Interactive Peeking Eyes Cursor Tracking
   ========================================================================== */
function initInteractiveEyeTracking() {
  const pupilLeft = document.getElementById('pupilLeft');
  const pupilRight = document.getElementById('pupilRight');
  const eyesSvg = document.getElementById('peekingEyesSvg');
  if (!pupilLeft || !pupilRight || !eyesSvg) return;

  function trackPos(clientX, clientY) {
    const rect = eyesSvg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(5, Math.sqrt(dx * dx + dy * dy) / 30);

    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;

    pupilLeft.setAttribute('cx', 28 + px);
    pupilLeft.setAttribute('cy', 35 + py);
    pupilRight.setAttribute('cx', 72 + px);
    pupilRight.setAttribute('cy', 35 + py);
  }

  window.addEventListener('mousemove', (e) => trackPos(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      trackPos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

/* ==========================================================================
   4. Interactive 3D Cursor Tilt on Paper Photo Card
   ========================================================================== */
function initPaperCard3DTilt() {
  const card = document.getElementById('paperCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 14;
    const rotY = (x / rect.width) * 14;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(-1deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `rotate(-3.5deg) scale(1)`;
  });
}

/* ==========================================================================
   5. Interactive Crosshair Grid Marker Highlighting
   ========================================================================== */
function initCrosshairIntersectionTracker() {
  const markers = document.querySelectorAll('.plus-marker');
  if (!markers.length) return;

  window.addEventListener('mousemove', (e) => {
    markers.forEach(marker => {
      const rect = marker.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        marker.style.opacity = '1';
      } else {
        marker.style.opacity = '';
      }
    });
  });
}

/* ==========================================================================
   6. Service Inquire Link Wiring
   ========================================================================== */
function initServiceInquireLinks() {
  document.querySelectorAll('.stack-inquire-btn, .service-inquire-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || '';
      const contactSection = document.getElementById('contact');

      if (contactSection && lenis) {
        lenis.scrollTo(contactSection, { offset: 0, duration: 1.2 });
      }

      const select = document.getElementById('briefType');
      if (select) {
        Array.from(select.options).forEach(opt => {
          if (serviceName.toLowerCase().includes(opt.value.toLowerCase().slice(0, 4))) {
            select.value = opt.value;
          }
        });
      }

      const nameInput = document.getElementById('briefName');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 600);
      }
    });
  });
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1536735455633211535/GlxsOfAJPAUx-lnfZVuMLk2r7w3K5tXR5gcfQ7NIEEpWPtZI10elGf21j9udxA8xpdn3';

/* ==========================================================================
   7. Cal-Style Visual Calendar Scheduler
   ========================================================================== */
function initCalScheduler() {
  const datesStrip = document.getElementById('calDatesStrip');
  const slotsGrid = document.getElementById('calSlotsGrid');
  const confirmBtn = document.getElementById('calConfirmBtn');
  const nameInput = document.getElementById('calClientName');
  const contactInput = document.getElementById('calClientContact');
  const statusText = document.getElementById('calStatusText');

  if (!datesStrip || !confirmBtn) return;

  let selectedDateStr = '';
  let selectedTimeSlot = '11:00 AM';

  // Generate next 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  datesStrip.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const dayName = days[d.getDay()];
    const monthName = months[d.getMonth()];
    const dateNum = d.getDate();
    const dateFormatted = `${dayName}, ${monthName} ${dateNum}`;

    if (i === 0) selectedDateStr = dateFormatted;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `date-card ${i === 0 ? 'active' : ''} font-mono`;
    btn.setAttribute('data-date', dateFormatted);
    btn.innerHTML = `
      <span class="d-sub">${i === 0 ? 'TODAY' : (i === 1 ? 'TOMORROW' : dayName)}</span>
      <span class="d-num">${dateNum}</span>
      <span class="d-mon">${monthName}</span>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.date-card').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      selectedDateStr = dateFormatted;
      if (typeof playSynthTone === 'function') playSynthTone(587.33);
    });

    datesStrip.appendChild(btn);
  }

  // Time slot selection
  const slotPills = document.querySelectorAll('.slot-pill');
  slotPills.forEach(pill => {
    pill.addEventListener('click', () => {
      slotPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedTimeSlot = pill.getAttribute('data-time') || '11:00 AM';
      if (typeof playSynthTone === 'function') playSynthTone(659.25);
    });
  });

  // Confirm Booking Button
  confirmBtn.addEventListener('click', async () => {
    const name = nameInput ? nameInput.value.trim() : '';
    const contact = contactInput ? contactInput.value.trim() : '';

    if (!name) {
      if (nameInput) {
        nameInput.focus();
        nameInput.style.borderColor = '#F43F5E';
      }
      if (statusText) statusText.innerHTML = `<span style="color:#F43F5E;">Please enter your name.</span>`;
      return;
    }

    if (!contact) {
      if (contactInput) {
        contactInput.focus();
        contactInput.style.borderColor = '#F43F5E';
      }
      if (statusText) statusText.innerHTML = `<span style="color:#F43F5E;">Please enter your Email or WhatsApp number.</span>`;
      return;
    }

    if (nameInput) nameInput.style.borderColor = '';
    if (contactInput) contactInput.style.borderColor = '';

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span>CONFIRMING SLOT...</span>';
    if (statusText) statusText.innerHTML = `<span style="color:var(--c-text-muted);">Confirming 30-min strategy call with founders...</span>`;

    const payload = {
      username: "Nyghto Strategy Desk",
      avatar_url: "https://nyghto.in/favicon.png",
      embeds: [
        {
          title: "🗓️ 30-Min Discovery Strategy Call Booked",
          description: `A new client has scheduled a consultation call on **[nyghto.in](https://nyghto.in/#contact)**.`,
          color: 3462009, // Emerald
          fields: [
            { name: "👤 Client Name", value: name, inline: true },
            { name: "📞 Contact (Email/Phone)", value: contact, inline: true },
            { name: "📅 Scheduled Day", value: selectedDateStr, inline: true },
            { name: "⏰ Scheduled Time", value: `${selectedTimeSlot} (IST)`, inline: true },
            { name: "📹 Platform", value: "Google Meet", inline: true }
          ],
          footer: {
            text: "Nyghto Direct Strategy Scheduling",
            icon_url: "https://nyghto.in/favicon.png"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      const res = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 204) {
        // Switch to success state
        const bookingFlow = document.getElementById('calBookingFlow');
        const successState = document.getElementById('calSuccessState');
        const ticketTimeVal = document.getElementById('ticketTimeVal');
        const successDetails = document.getElementById('successBookingDetails');
        const gcalLink = document.getElementById('successGcalLink');

        if (bookingFlow && successState) {
          bookingFlow.style.display = 'none';
          successState.style.display = 'block';

          if (ticketTimeVal) {
            ticketTimeVal.textContent = `${selectedDateStr} @ ${selectedTimeSlot} IST`;
          }

          if (successDetails) {
            successDetails.innerHTML = `Your 30-minute discovery consultation with Nyghto founders is confirmed for <strong>${selectedDateStr} at ${selectedTimeSlot} IST</strong>. Confirmation sent to <strong>${contact}</strong>.`;
          }

          if (gcalLink) {
            const title = encodeURIComponent("Nyghto Studio • 1-on-1 Strategy Call");
            const details = encodeURIComponent(`Discovery consultation with Nyghto engineering founders.\nClient: ${name}\nContact: ${contact}\nPlatform: Google Meet\nWebsite: https://nyghto.in`);
            gcalLink.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
          }
        }

        if (typeof playSynthTone === 'function') {
          playSynthTone(523.25);
          setTimeout(() => playSynthTone(659.25), 120);
          setTimeout(() => playSynthTone(783.99), 240);
        }
      } else {
        throw new Error('Webhook error');
      }
    } catch (err) {
      console.warn('Meeting fallback to email:', err);
      confirmBtn.innerHTML = '<span>OPENING EMAIL...</span>';
      const subject = `[Strategy Call] ${name} — ${selectedDateStr} at ${selectedTimeSlot}`;
      const body = `Hello Nyghto Team,\n\nI would like to confirm a 30-min strategy call.\n\nName: ${name}\nContact: ${contact}\nPreferred Date: ${selectedDateStr}\nTime: ${selectedTimeSlot} IST\n\nSent from nyghto.in`;
      window.location.href = `mailto:hello@nyghto.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } finally {
      setTimeout(() => {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<span>CONFIRM 30-MIN DISCOVERY CALL ↗</span>';
      }, 4000);
    }
  });
}

window.resetCalScheduler = function() {
  const bookingFlow = document.getElementById('calBookingFlow');
  const successState = document.getElementById('calSuccessState');
  if (bookingFlow && successState) {
    bookingFlow.style.display = 'block';
    successState.style.display = 'none';
  }
};

/* ==========================================================================
   8. Conversational Brief Generator & Actions (Direct Discord Webhook Connection)
   ========================================================================== */
function initConversationalBrief() {
  const sendBtn = document.getElementById('sendBriefBtn');
  const copyBtn = document.getElementById('copyEmailBtn');
  const statusText = document.getElementById('briefStatusText');
  const nameInput = document.getElementById('briefName');
  const emailInput = document.getElementById('briefEmail');
  const budgetInput = document.getElementById('briefBudget');
  const typeSelect = document.getElementById('briefType');
  const otherWrap = document.getElementById('briefOtherWrap');
  const otherInput = document.getElementById('briefOtherType');

  if (typeSelect && otherWrap) {
    typeSelect.addEventListener('change', () => {
      if (typeSelect.value === 'Other') {
        otherWrap.style.display = 'inline-flex';
        if (otherInput) otherInput.focus();
      } else {
        otherWrap.style.display = 'none';
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      const company = document.getElementById('briefCompany').value.trim() || 'Undisclosed';
      let type = typeSelect ? typeSelect.value : 'Custom Project';
      if (type === 'Other') {
        const customDetail = (otherInput ? otherInput.value.trim() : '') || 'Custom Software Project';
        type = `Other (${customDetail})`;
      }
      const budget = (budgetInput ? budgetInput.value.trim() : '') || 'Flexible';
      const email = emailInput.value.trim();

      if (!name) {
        nameInput.focus();
        nameInput.style.borderBottomColor = '#F43F5E';
        if (statusText) statusText.innerHTML = `<span style="color:#F43F5E;">Please enter your name.</span>`;
        return;
      }

      if (!email || !email.includes('@')) {
        emailInput.focus();
        emailInput.style.borderBottomColor = '#F43F5E';
        if (statusText) statusText.innerHTML = `<span style="color:#F43F5E;">Please enter a valid email address.</span>`;
        return;
      }

      nameInput.style.borderBottomColor = '';
      emailInput.style.borderBottomColor = '';

      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span>TRANSMITTING TO TEAM...</span>';
      if (statusText) statusText.innerHTML = `<span style="color:var(--c-text-muted);">Transmitting brief directly to Nyghto command center...</span>`;

      const payload = {
        username: "Nyghto Studio Brief Bot",
        avatar_url: "https://nyghto.in/favicon.png",
        embeds: [
          {
            title: "🚀 New Project Brief Received",
            description: `A new client has submitted a project brief on **[nyghto.in](https://nyghto.in/#contact)**.`,
            color: 74909, // #01249D Nyghto Cobalt
            fields: [
              { name: "👤 Client Name", value: name, inline: true },
              { name: "🏢 Company / Venture", value: company, inline: true },
              { name: "🛠️ Project Type", value: type, inline: true },
              { name: "💰 Estimated Budget", value: budget, inline: true },
              { name: "✉️ Direct Contact Email", value: email, inline: true },
              { name: "⏰ Submitted Time", value: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " IST", inline: true }
            ],
            footer: {
              text: "Nyghto Digital Product Studio • Brief Ingestion",
              icon_url: "https://nyghto.in/favicon.png"
            },
            timestamp: new Date().toISOString()
          }
        ]
      };

      try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 204) {
          sendBtn.innerHTML = '<span>BRIEF TRANSMITTED ✓</span>';
          sendBtn.style.background = '#34D399';
          sendBtn.style.color = '#064E3B';

          if (statusText) {
            statusText.innerHTML = `✓ Transmitted directly to Nyghto team! We'll follow up at <strong>${email}</strong>.`;
          }

          playSynthTone(523.25);
          setTimeout(() => playSynthTone(659.25), 120);
          setTimeout(() => playSynthTone(783.99), 240);
        } else {
          throw new Error('Discord response not ok');
        }
      } catch (err) {
        console.warn('Webhook dispatch failed, falling back to mailto:', err);
        sendBtn.innerHTML = '<span>OPENING EMAIL...</span>';

        const subject = `[Project Brief] ${name} (${company}) — ${type}`;
        const bodyText = `Hello Nyghto Team,\n\nI am ${name} from ${company}.\nWe would like to engineer a ${type} with an estimated budget of ${budget}.\n\nReach me at: ${email}\n\nSent from nyghto.in brief generator.`;

        if (statusText) {
          statusText.innerHTML = `✓ Preparing direct email to <strong>hello@nyghto.in</strong>...`;
        }

        window.location.href = `mailto:hello@nyghto.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      } finally {
        setTimeout(() => {
          sendBtn.disabled = false;
        }, 4000);
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('hello@nyghto.in').then(() => {
        copyBtn.innerHTML = '<span>COPIED TO CLIPBOARD ✓</span>';
        copyBtn.style.borderColor = '#34D399';
        copyBtn.style.color = '#34D399';

        setTimeout(() => {
          copyBtn.innerHTML = '<span>COPY EMAIL (hello@nyghto.in)</span>';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2500);

        playSynthTone(659.25);
      }).catch(() => {
        window.location.href = 'mailto:hello@nyghto.in';
      });
    });
  }
}

/* ==========================================================================
   8. Web Audio Synthesizer Tone
   ========================================================================== */
let audioCtx;

function getAudioContext() {
  if (!audioCtx && typeof window.AudioContext !== 'undefined') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSynthTone(freq) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

/* ==========================================================================
   9. Interactive FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        playSynthTone(587.33);
      }
    });
  });
}



