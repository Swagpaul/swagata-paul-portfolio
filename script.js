/**
 * Personal Portfolio JavaScript - Computer Science Engineering Student
 * Provides smooth navigation, mobile menu drawer, scroll animations,
 * project category filtering, email copying, and contact form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailLink = document.getElementById('email-link');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const currentYearSpan = document.getElementById('current-year');

    // 1. Set Dynamic Current Year in Footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mobile Navigation Drawer Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen);

            // Prevent background body scroll when mobile menu is active
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close mobile nav when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // 3. Navbar Glass Effect on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Nav Link Highlight based on scroll position
        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // 4. Scroll-Triggered Reveal Animations using IntersectionObserver
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const revealItems = document.querySelectorAll('.reveal-item');
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        }, observerOptions);

        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        // If user prefers reduced motion, make all items visible immediately
        document.querySelectorAll('.reveal-item').forEach(item => {
            item.classList.add('revealed');
        });
    }

    // 5. Project Filtering Functionality
    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state on filter buttons
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const filterValue = btn.getAttribute('data-filter');

                // Filter cards with smooth fade visibility
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                });
            });
        });
    }

    // 6. Copy Email Address to Clipboard Handler
    if (copyEmailBtn && emailLink) {
        copyEmailBtn.addEventListener('click', async () => {
            const emailText = emailLink.textContent.trim();
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(emailText);
                    showToast('Email copied to clipboard!');
                } else {
                    // Fallback for non-supported clipboard API
                    const tempInput = document.createElement('input');
                    tempInput.value = emailText;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    showToast('Email copied to clipboard!');
                }
            } catch (err) {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy email');
            }
        });
    }

    // Toast Notification Helper
    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 7. Contact Form Mailto Generation (Static Site Safe)
    if (contactForm && emailLink) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('sender-name').value.trim();
            const email = document.getElementById('sender-email').value.trim();
            const subject = document.getElementById('message-subject').value.trim();
            const message = document.getElementById('message-body').value.trim();

            const targetEmail = emailLink.textContent.trim();
            const fullSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
            const bodyContent = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

            const mailtoUrl = `mailto:${targetEmail}?subject=${fullSubject}&body=${bodyContent}`;

            // Open user's default email client
            window.location.href = mailtoUrl;

            showToast('Opening your default email app...');
        });
    }
});
