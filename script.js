// ===== Particle Network Background =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    const maxDist = 150;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
                const opacity = (1 - dist / maxDist) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(74, 222, 128, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animate);
}

initParticles();
animate();
window.addEventListener('resize', initParticles);

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

// ===== PDF Modal =====
const pdfModal = document.getElementById('pdfModal');
const pdfViewer = document.getElementById('pdfViewer');
const pdfModalClose = document.getElementById('pdfModalClose');
const pdfOverlay = document.querySelector('.pdf-modal-overlay');

document.querySelectorAll('.certificate-link[data-pdf]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const pdfUrl = this.getAttribute('data-pdf');
        pdfViewer.src = pdfUrl + '#toolbar=0&navpanes=0';
        pdfModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closePdfModal() {
    pdfModal.classList.remove('active');
    pdfViewer.src = '';
    document.body.style.overflow = '';
}

pdfModalClose.addEventListener('click', closePdfModal);
pdfOverlay.addEventListener('click', closePdfModal);
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
        closePdfModal();
    }
});
