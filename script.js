/* ==========================================
   NICO STARTUP LAUNCHING SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Scroll Reveal Animation for Timeline Items
    const timelineItems = document.querySelectorAll('.timeline-item');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('visible');
            }
        });
    };

    // Run on load and scroll
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 3. Header Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');

    const highlightNavOnScroll = () => {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNavOnScroll);
});
