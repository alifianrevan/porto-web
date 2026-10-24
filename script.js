/**
 * ALIFIAN REVAN ARNANTA - PORTFOLIO INTERACTION ENGINE
 * Interactive scripts for navigation, animations, filtering, modals, and clipboard.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. TYPEWRITER EFFECT
  const roles = [
    "Asisten Laboratorium Komputer",
    "Mahasiswa Teknik Informatika",
    "Software Engineering Enthusiast",
    "Full-Stack Web Developer",
    "Spesialis Normalisasi Basis Data (3NF)",
    "Praktisi IoT & Analisis Spasial GIS"
  ];
  
  const typewriterElem = document.getElementById('typewriter-text');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function typeEffect() {
    if (!typewriterElem) return;
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at end of text
      isDeleting = true;
      typeSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // 2. EXPERIENCE TIMELINE FILTERING
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 3. NAVBAR SCROLLSPY & STICKY SHADOW
  const navbar = document.querySelector('.navbar-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const btnScrollTop = document.getElementById('btn-scroll-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header styling on scroll
    if (scrollY > 50) {
      navbar.style.background = 'rgba(7, 10, 19, 0.92)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(7, 10, 19, 0.75)';
      navbar.style.boxShadow = 'none';
    }

    // Scroll-to-top button visibility
    if (btnScrollTop) {
      if (scrollY > 400) {
        btnScrollTop.style.opacity = '1';
        btnScrollTop.style.visibility = 'visible';
      } else {
        btnScrollTop.style.opacity = '0';
        btnScrollTop.style.visibility = 'hidden';
      }
    }

    // Active Section ScrollSpy
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Scroll to top click
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. MOBILE MENU TOGGLE
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    });
  }

  // 5. MODAL CV ATS VIEWER
  const btnViewCv = document.getElementById('btn-view-cv');
  const cvModal = document.getElementById('cv-modal');
  const modalClose = document.getElementById('modal-close');
  const btnPrintCv = document.getElementById('btn-print-cv');

  function openCvModal() {
    if (cvModal) {
      cvModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCvModal() {
    if (cvModal) {
      cvModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnViewCv) btnViewCv.addEventListener('click', openCvModal);
  if (modalClose) modalClose.addEventListener('click', closeCvModal);

  // Close on backdrop click
  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        closeCvModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
      closeCvModal();
    }
  });

  // Print CV
  if (btnPrintCv) {
    btnPrintCv.addEventListener('click', () => {
      window.print();
    });
  }

  // 6. CLIPBOARD COPY & TOAST NOTIFICATION
  const toast = document.getElementById('toast');
  const copyButtons = document.querySelectorAll('.btn-copy-icon');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const textToCopy = button.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`✓ Berhasil disalin: ${textToCopy}`);
        }).catch(() => {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast(`✓ Berhasil disalin: ${textToCopy}`);
        });
      }
    });
  });

  // 7. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('⚠️ Harap isi semua kolom wajib!');
        return;
      }

      // Create mailto link as direct action
      const mailtoUrl = `mailto:revanarnanta@gmail.com?subject=${encodeURIComponent(subject || 'Pesan dari Portofolio Web')}&body=${encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`)}`;
      
      showToast(`Terima kasih ${name}, membuka email Anda untuk mengirim pesan...`);
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1000);

      contactForm.reset();
    });
  }

  // 8. 3D TILT EFFECT ON HERO AVATAR CARD
  const heroTiltCard = document.getElementById('hero-tilt-card');
  if (heroTiltCard && window.innerWidth > 992) {
    heroTiltCard.addEventListener('mousemove', (e) => {
      const rect = heroTiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = (-y / rect.height) * 14;
      const rotateY = (x / rect.width) * 14;
      
      heroTiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroTiltCard.addEventListener('mouseleave', () => {
      heroTiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
});
