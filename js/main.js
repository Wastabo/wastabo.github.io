document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const parallaxSections = document.querySelectorAll('.parallax-section');
    const reveals = document.querySelectorAll('.reveal');
    const buttons = document.querySelectorAll('.btn');

    const updateNavbar = () => {
        if (window.scrollY > 24) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + 140;

        sections.forEach((section) => {
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (!link) return;

            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollPosition >= top && scrollPosition < bottom) {
                document.querySelectorAll('.nav-links a').forEach((item) => item.classList.remove('active'));
                link.classList.add('active');
            }
        });
    };

    const applyParallax = () => {
        const viewportCenter = window.innerHeight / 2;

        parallaxSections.forEach((section) => {
            const speed = parseFloat(section.dataset.speed || '0.15');
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distanceFromCenter = sectionCenter - viewportCenter;
            const rawOffset = distanceFromCenter * speed * -0.28;
            const maxOffset = 34;
            const offset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));

            section.style.setProperty('--parallax-offset', `${offset}px`);
        });
    };

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.9;

        reveals.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('is-visible');
            }
        });
    };

    let ticking = false;

    const onScroll = () => {
        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(() => {
            updateNavbar();
            updateActiveLink();
            applyParallax();
            revealOnScroll();
            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('load', () => {
        updateNavbar();
        updateActiveLink();
        applyParallax();
        revealOnScroll();
    });


    const initDesktopCursor = () => {
        const isFinePointer = window.matchMedia('(pointer:fine)').matches;

        if (!isFinePointer) return;

        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.append(glow);
        document.body.classList.add('has-custom-cursor');

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        const renderCursor = () => {
            currentX += (targetX - currentX) * 0.18;
            currentY += (targetY - currentY) * 0.18;

            glow.style.transform = `translate(${currentX - 20}px, ${currentY - 20}px)`;
            window.requestAnimationFrame(renderCursor);
        };

        renderCursor();

        window.addEventListener('pointermove', (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
            document.body.classList.add('cursor-visible');
        }, { passive: true });

        window.addEventListener('pointerdown', () => {
            document.body.classList.add('cursor-click');
        });

        window.addEventListener('pointerup', () => {
            document.body.classList.remove('cursor-click');
        });

        window.addEventListener('mouseout', (event) => {
            if (!event.relatedTarget) {
                document.body.classList.remove('cursor-visible');
            }
        });

        buttons.forEach((button) => {
            button.classList.add('magnet-target');

            button.addEventListener('mousemove', (event) => {
                const rect = button.getBoundingClientRect();
                const strength = 10;
                const offsetX = event.clientX - (rect.left + rect.width / 2);
                const offsetY = event.clientY - (rect.top + rect.height / 2);
                const moveX = (offsetX / rect.width) * strength;
                const moveY = (offsetY / rect.height) * strength;

                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    };

    const initMobileFeedback = () => {
        const hasTouch = window.matchMedia('(pointer:coarse)').matches || navigator.maxTouchPoints > 0;

        if (!hasTouch) return;

        const touchTargets = '.btn, .nav-links a';

        window.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            if (!touch) return;

            const glow = document.createElement('span');
            glow.className = 'tap-glow';
            glow.style.left = `${touch.clientX}px`;
            glow.style.top = `${touch.clientY}px`;
            document.body.appendChild(glow);
            glow.addEventListener('animationend', () => glow.remove());

            const target = event.target.closest(touchTargets);
            if (!target) return;

            target.classList.add('touch-active');
            window.setTimeout(() => target.classList.remove('touch-active'), 220);
        }, { passive: true });
    };

    initDesktopCursor();
    initMobileFeedback();
});