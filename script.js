// ===== Particle Network + Planet Background =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let planets = [];
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

class Planet {
    constructor(centerX, centerY, orbitRadiusX, orbitRadiusY, speed, size, color, glowColor) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.orbitRadiusX = orbitRadiusX;
        this.orbitRadiusY = orbitRadiusY;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.size = size;
        this.color = color;
        this.glowColor = glowColor;
    }

    update() {
        this.angle += this.speed;
    }

    draw() {
        const x = this.centerX + Math.cos(this.angle) * this.orbitRadiusX;
        const y = this.centerY + Math.sin(this.angle) * this.orbitRadiusY;

        // Orbit path
        ctx.beginPath();
        ctx.ellipse(this.centerX, this.centerY, this.orbitRadiusX, this.orbitRadiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.04)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, this.size * 3);
        glow.addColorStop(0, this.glowColor);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Planet
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    const isMobile = canvas.width < 768;
    const count = isMobile
        ? Math.min(30, Math.floor((canvas.width * canvas.height) / 25000))
        : Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function initPlanets() {
    planets = [
        new Planet(
            canvas.width * 0.8, canvas.height * 0.25,
            120, 60, 0.003, 6,
            'rgba(74, 222, 128, 0.8)', 'rgba(74, 222, 128, 0.15)'
        ),
        new Planet(
            canvas.width * 0.15, canvas.height * 0.7,
            90, 45, -0.002, 4,
            'rgba(59, 130, 246, 0.7)', 'rgba(59, 130, 246, 0.12)'
        ),
        new Planet(
            canvas.width * 0.5, canvas.height * 0.5,
            200, 80, 0.001, 3,
            'rgba(168, 85, 247, 0.6)', 'rgba(168, 85, 247, 0.1)'
        ),
    ];
}

// Sagittarius constellation pattern
const constellationPattern = [
    // Teapot body (main asterism)
    { x: 0, y: 0.4 },      // 0 - Kaus Media
    { x: 0.12, y: 0.55 },  // 1 - Kaus Australis
    { x: 0.28, y: 0.5 },   // 2 - Ascella
    { x: 0.3, y: 0.35 },   // 3 - Phi Sgr
    { x: 0.18, y: 0.25 },  // 4 - Nunki
    { x: 0.05, y: 0.28 },  // 5 - Kaus Borealis
    // Arrow/bow
    { x: -0.1, y: 0.1 },   // 6 - Nash (tip)
    { x: 0.35, y: 0.2 },   // 7 - Tau Sgr
    // Handle
    { x: 0.4, y: 0.45 },   // 8 - Handle
];

const constellationConnections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], // Teapot body
    [5, 6], [0, 6], // Arrow lines
    [3, 7], [4, 7], // Upper connection
    [2, 8], [3, 8], // Handle
];

function drawConstellation() {
    const offsetX = canvas.width * 0.65;
    const offsetY = canvas.height * 0.15;
    const scale = Math.min(canvas.width, canvas.height) * 0.35;
    const time = Date.now() * 0.0003;
    const opacity = 0.3 + Math.sin(time) * 0.1;

    // Draw connections
    ctx.beginPath();
    constellationConnections.forEach(([a, b]) => {
        const ax = offsetX + constellationPattern[a].x * scale;
        const ay = offsetY + constellationPattern[a].y * scale;
        const bx = offsetX + constellationPattern[b].x * scale;
        const by = offsetY + constellationPattern[b].y * scale;
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
    });
    ctx.strokeStyle = `rgba(74, 222, 128, ${opacity * 0.3})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Draw stars
    constellationPattern.forEach((star, i) => {
        const x = offsetX + star.x * scale;
        const y = offsetY + star.y * scale;
        const starSize = (i < 6) ? 2.5 : 1.8;
        const twinkle = Math.sin(time + i * 0.7) * 0.15;

        // Glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, starSize * 4);
        glow.addColorStop(0, `rgba(74, 222, 128, ${(opacity + twinkle) * 0.4})`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, starSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Star point
        ctx.beginPath();
        ctx.arc(x, y, starSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity + twinkle})`;
        ctx.fill();
    });
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
    drawConstellation();
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    planets.forEach(p => { p.update(); p.draw(); });
    animationId = requestAnimationFrame(animate);
}

initParticles();
initPlanets();
animate();
window.addEventListener('resize', () => { initParticles(); initPlanets(); });

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
