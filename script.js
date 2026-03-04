/* =============================================
   DENTAL CLINIC - JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Header scroll effect ----------
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---------- Mobile Navigation ----------
    const btnMobileNav = document.getElementById('btn-mobile-nav');
    const mainNav = document.getElementById('main-nav');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');

    btnMobileNav.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        iconOpen.style.display = isOpen ? 'none' : 'block';
        iconClose.style.display = isOpen ? 'block' : 'none';
    });

    // Close nav on link click
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
        });
    });

    // ---------- Active nav links on scroll ----------
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.main-nav a');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observerNav.observe(s));

    // ---------- Stats Counter Animation ----------
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const start = performance.now();

        const update = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString('ar');
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString('ar');
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach(n => counterObserver.observe(n));

    // ---------- Floating Particles ----------
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: rgba(255,255,255,${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float-particle ${Math.random() * 4 + 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
      `;
            particlesContainer.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
      @keyframes float-particle {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
        33% { transform: translate(${Math.random() * 30 - 15}px, -20px) scale(1.2); opacity: 1; }
        66% { transform: translate(${Math.random() * 30 - 15}px, 10px) scale(0.8); opacity: 0.3; }
      }
    `;
        document.head.appendChild(style);
    }

    // ---------- Back to Top ----------
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- Contact Form ----------
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Animate button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>جاري الإرسال...</span>';

            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
            }, 1500);
        });
    }

    // ---------- Smooth scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---------- Animate on scroll (fade-in) ----------
    const animatedEls = document.querySelectorAll('[data-aos]');
    const aoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, parseInt(delay));
                aoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        aoObserver.observe(el);
    });

    // ---------- Gallery Lightbox ----------
    const galleryItems = Array.from(document.querySelectorAll('.gallery .gallery-item'));
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentGalleryIndex = 0;

    if (galleryItems.length && lightbox && lightboxImg) {
        const renderLightbox = (index) => {
            const item = galleryItems[index];
            if (!item) return;
            const image = item.querySelector('img');

            lightboxImg.src = image ? image.src : '';
            lightboxImg.alt = image ? image.alt : 'صورة المعرض';
        };

        const openLightbox = (index) => {
            currentGalleryIndex = index;
            renderLightbox(currentGalleryIndex);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const nextImage = () => {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
            renderLightbox(currentGalleryIndex);
        };

        const prevImage = () => {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
            renderLightbox(currentGalleryIndex);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', nextImage);
        lightboxPrev.addEventListener('click', prevImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') nextImage();
            if (e.key === 'ArrowRight') prevImage();
        });
    }

    // ---------- Set current year in footer ----------
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});
