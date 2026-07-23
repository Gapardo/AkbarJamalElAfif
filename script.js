// ===== Navbar visibility on scroll =====
const navbar = document.getElementById('navbar');
const landing = document.getElementById('landing');

function handleNavbar() {
    const landingBottom = landing.getBoundingClientRect().bottom;
    if (landingBottom <= 0) {
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleNavbar);

// ===== Mobile menu toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== Scroll fade-in animation =====
function initFadeIn() {
    const sections = document.querySelectorAll('.section-container, .timeline-item, .capability-card, .contact-link');
    sections.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

initFadeIn();

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Active nav link highlight =====
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionElements = document.querySelectorAll('.section[id]');

function highlightNav() {
    let current = '';
    sectionElements.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${current}`) {
            a.style.color = 'var(--accent)';
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ===== Typing effect on landing (subtle) =====
const roleEl = document.querySelector('.landing-role');
if (roleEl) {
    const text = roleEl.textContent;
    roleEl.textContent = '';
    let i = 0;
    function typeRole() {
        if (i < text.length) {
            roleEl.textContent += text.charAt(i);
            i++;
            setTimeout(typeRole, 40);
        }
    }
    setTimeout(typeRole, 800);
}
