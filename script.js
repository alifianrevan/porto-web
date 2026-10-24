/**
 * ALIFIAN REVAN ARNANTA — CELESTIAL CANVAS & INTERACTION ENGINE
 * Handcrafted starry cosmos, interactive constellations, shooting stars, and smooth navigation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. CELESTIAL STARFIELD & CONSTELLATION CANVAS
  // ==========================================================================
  const canvas = document.getElementById('celestial-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    });

    const starCount = Math.floor((width * height) / 8000); // Responsive density
    const stars = [];
    const mouse = { x: -1000, y: -1000, targetX: 0, targetY: 0 };
    let shootingStar = null;

    // Track mouse for interactive constellation and parallax
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = (e.clientX - width / 2) * 0.05;
      mouse.targetY = (e.clientY - height / 2) * 0.05;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.6 + 0.4;
        this.baseAlpha = Math.random() * 0.7 + 0.2;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleFactor = Math.random() * Math.PI * 2;
        this.parallaxSpeed = this.size * 0.35;
      }

      update() {
        this.twinkleFactor += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinkleFactor) * 0.25;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 0.95) this.alpha = 0.95;
      }

      draw(offsetX, offsetY) {
        ctx.beginPath();
        ctx.arc(
          this.x + offsetX * this.parallaxSpeed,
          this.y + offsetY * this.parallaxSpeed,
          this.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(226, 232, 240, ${this.alpha})`;
        ctx.fill();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * (width * 0.8);
        this.y = Math.random() * (height * 0.4);
        this.length = Math.random() * 70 + 40;
        this.speed = Math.random() * 10 + 12;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // approx 45 degrees
        this.opacity = 1;
        this.active = true;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.02;
        if (this.opacity <= 0 || this.x > width || this.y > height) {
          this.active = false;
        }
      }

      draw() {
        if (!this.active) return;
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    }
    initStars();

    let currentOffsetX = 0;
    let currentOffsetY = 0;
    let meteorTimer = 0;

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Smooth parallax interpolation
      currentOffsetX += (mouse.targetX - currentOffsetX) * 0.05;
      currentOffsetY += (mouse.targetY - currentOffsetY) * 0.05;

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.update();
        star.draw(currentOffsetX, currentOffsetY);

        // Constellation lines towards mouse
        const starRenderX = star.x + currentOffsetX * star.parallaxSpeed;
        const starRenderY = star.y + currentOffsetY * star.parallaxSpeed;
        const dist = Math.hypot(mouse.x - starRenderX, mouse.y - starRenderY);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(starRenderX, starRenderY);
          ctx.lineTo(mouse.x, mouse.y);
          const lineAlpha = (1 - dist / 110) * 0.35;
          ctx.strokeStyle = `rgba(226, 232, 240, ${lineAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Spontaneous shooting stars
      meteorTimer++;
      if (meteorTimer > 280 && Math.random() < 0.02 && (!shootingStar || !shootingStar.active)) {
        shootingStar = new ShootingStar();
        meteorTimer = 0;
      }

      if (shootingStar && shootingStar.active) {
        shootingStar.update();
        shootingStar.draw();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // ==========================================================================
  // 2. EXPERIENCE TIMELINE FILTERING
  // ==========================================================================
  const filterLinks = document.querySelectorAll('.filter-link');
  const timelineNodes = document.querySelectorAll('.timeline-node');

  filterLinks.forEach(link => {
    link.addEventListener('click', () => {
      filterLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const filter = link.getAttribute('data-filter');

      timelineNodes.forEach(node => {
        const cat = node.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          node.classList.remove('hidden');
          node.style.opacity = '0';
          node.style.transform = 'translateY(10px)';
          setTimeout(() => {
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
          }, 40);
        } else {
          node.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================================================
  // 3. HEADER SCROLL STATE & ACTIVE SCROLLSPY
  // ==========================================================================
  const header = document.getElementById('site-header');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');
  const btnBackTop = document.getElementById('btn-back-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // ScrollSpy
    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 150;
      const secId = sec.getAttribute('id');

      if (scrollY > secTop && scrollY <= secTop + secHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${secId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  if (btnBackTop) {
    btnBackTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 4. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerItems = document.querySelectorAll('.drawer-item');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
  }

  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  drawerItems.forEach(item => {
    item.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 5. ATS CV PREVIEW MODAL
  // ==========================================================================
  const btnOpenCv = document.getElementById('btn-open-cv');
  const cvModal = document.getElementById('cv-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnPrintCv = document.getElementById('btn-print-cv');

  function showModal() {
    if (cvModal) {
      cvModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function hideModal() {
    if (cvModal) {
      cvModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnOpenCv) btnOpenCv.addEventListener('click', showModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', hideModal);

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) hideModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
      hideModal();
    }
  });

  if (btnPrintCv) {
    btnPrintCv.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================================================
  // 6. CELESTIAL TOAST NOTIFICATION & CLIPBOARD COPY
  // ==========================================================================
  const toast = document.getElementById('toast');
  const copyButtons = document.querySelectorAll('.btn-copy-celestial');

  function triggerToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy');
      if (copyVal) {
        navigator.clipboard.writeText(copyVal).then(() => {
          triggerToast(`✓ Tersalin ke clipboard: ${copyVal}`);
        }).catch(() => {
          const temp = document.createElement('input');
          temp.value = copyVal;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          triggerToast(`✓ Tersalin ke clipboard: ${copyVal}`);
        });
      }
    });
  });

  // ==========================================================================
  // 7. DIRECT TRANSMISSION FORM
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        triggerToast('Harap lengkapi semua kolom transmisi.');
        return;
      }

      const mailto = `mailto:revanarnanta@gmail.com?subject=${encodeURIComponent(subject || 'Transmisi Portofolio')}&body=${encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`)}`;
      triggerToast(`Terima kasih ${name}, menyiapkan email pengiriman...`);
      setTimeout(() => {
        window.location.href = mailto;
      }, 900);

      contactForm.reset();
    });
  }
});
