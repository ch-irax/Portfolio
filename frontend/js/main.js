(function () {
  'use strict';

  // ——— Navbar scroll opacity ———
  const navbar = document.getElementById('navbar');
  const onScrollNav = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('bg-deep/80', 'backdrop-blur-md', 'border-b', 'border-accent/10');
      navbar.classList.remove('bg-deep/0', 'backdrop-blur-none');
    } else {
      navbar.classList.remove('bg-deep/80', 'backdrop-blur-md', 'border-b', 'border-accent/10');
      navbar.classList.add('bg-deep/0', 'backdrop-blur-none');
    }
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // ——— Mobile menu ———
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBars = menuBtn.querySelectorAll('.menu-bar');
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    menuBtn.setAttribute('aria-expanded', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    if (menuOpen) {
      menuBars[0].style.transform = 'translateY(5px) rotate(45deg)';
      menuBars[1].style.opacity = '0';
      menuBars[2].style.width = '1.5rem';
      menuBars[2].style.transform = 'translateY(-5px) rotate(-45deg)';
    } else {
      menuBars[0].style.transform = '';
      menuBars[1].style.opacity = '';
      menuBars[2].style.width = '';
      menuBars[2].style.transform = '';
    }
  };

  menuBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (menuOpen) toggleMenu();
    });
  });

  // ——— Smooth scroll for anchor links ———
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ——— Intersection Observer: scroll reveals ———
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Hero reveals on load
  window.addEventListener('load', () => {
    document.querySelectorAll('#hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), 150 + i * 120);
    });
  });

  // ——— Hero logo: scale to fit viewport (prevents clipping) ———
  const heroLogoFit = document.querySelector('.hero-logo-fit');
  const heroLogoSlice = document.querySelector('.hero-logo-slice');

  const fitHeroLogo = () => {
    if (!heroLogoFit || !heroLogoSlice) return;

    heroLogoSlice.style.transform = 'scale(1)';

    const pad = 12;
    const availW = heroLogoFit.clientWidth - pad;
    const availH = heroLogoFit.clientHeight - pad;
    const naturalW = heroLogoSlice.scrollWidth;
    const naturalH = heroLogoSlice.scrollHeight;

    if (!naturalW || !naturalH || !availW || !availH) return;

    const scale = Math.min(1, availW / naturalW, availH / naturalH);
    heroLogoSlice.style.transform = `scale(${scale})`;
  };

  fitHeroLogo();
  window.addEventListener('resize', fitHeroLogo, { passive: true });
  window.addEventListener('load', fitHeroLogo);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitHeroLogo);
  }
  if (heroLogoFit && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(fitHeroLogo).observe(heroLogoFit);
  }

  // ——— Hero parallax ———
  const heroContent = document.getElementById('hero-content');
  const heroBg = document.getElementById('hero-bg');

  const onScrollParallax = () => {
    const scrollY = window.scrollY;
    const heroHeight = document.getElementById('hero').offsetHeight;
    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
      heroContent.style.opacity = 1 - progress * 0.35;
      heroBg.style.transform = `translateY(${scrollY * 0.15}px) scale(${1 + progress * 0.05})`;
    }
  };
  window.addEventListener('scroll', onScrollParallax, { passive: true });

  // ——— Active nav section highlight ———
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('text-white');
              link.classList.remove('text-muted');
            } else {
              link.classList.remove('text-white');
              link.classList.add('text-muted');
            }
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-80px 0px -50% 0px' }
  );
  sections.forEach((sec) => sectionObserver.observe(sec));

  // ——— Contact form (demo) ———
  // ====================== CONTACT FORM (Real Backend) ======================
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    if (!formData.name || !formData.email || !formData.message) {
      formStatus.textContent = 'Please fill all fields';
      formStatus.classList.remove('hidden');
      return;
    }

    // Show loading 
    const submitBtn = form.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    formStatus.classList.add('hidden');

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        formStatus.textContent = data.message || 'Thank you! Message received.';
        formStatus.classList.remove('hidden');
        formStatus.style.color = '#22c55e'; // green
        form.reset();
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      formStatus.textContent = error.message || 'Something went wrong. Please try again.';
      formStatus.classList.remove('hidden');
      formStatus.style.color = '#ef4444'; // red
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

  // ——— Project cards: keyboard accessible click ———
  document.querySelectorAll('.project-card').forEach((card) => {
    const link = card.querySelector('a[href]');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      link.click();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') link.click();
    });
  });
})();
