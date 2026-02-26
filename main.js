/* ============================================================
   ARISE CREATIVES — JavaScript
   Three.js Hero Canvas + Scroll Animations + Cursor + Interactions
   ============================================================ */

// ---- THEME TOGGLE ----
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
let isDark = true;

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.querySelector('.theme-icon').textContent = isDark ? '◐' : '◑';
});

// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .service-card, .work-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
        follower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.opacity = '0.6';
    });
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- MOBILE MENU ----
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
navBurger.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
});
mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { mobileMenu.style.display = 'none'; });
});

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, delay * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
    el.dataset.delay = i % 5;
    revealObserver.observe(el);
});

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current);
    }, 16);
}

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-num').forEach(animateCounter);
            statObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statObserver.observe(statsEl);

// ---- THREE.JS HERO CANVAS ----
(function initThreeHero() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    // Inline Three.js via CDN dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
    script.onload = () => buildScene();
    document.head.appendChild(script);

    function buildScene() {
        const W = window.innerWidth, H = window.innerHeight;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
        camera.position.z = 5;

        // Ambient + point lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const pl1 = new THREE.PointLight(0xa78bfa, 4, 20);
        pl1.position.set(3, 3, 3);
        scene.add(pl1);
        const pl2 = new THREE.PointLight(0x38bdf8, 3, 20);
        pl2.position.set(-3, -2, 2);
        scene.add(pl2);
        const pl3 = new THREE.PointLight(0xf472b6, 2, 15);
        pl3.position.set(0, 4, -2);
        scene.add(pl3);

        // Floating torus knots
        const objects = [];
        const geoms = [
            new THREE.TorusKnotGeometry(0.7, 0.22, 128, 16),
            new THREE.OctahedronGeometry(0.6),
            new THREE.IcosahedronGeometry(0.5),
            new THREE.TorusGeometry(0.5, 0.18, 32, 64),
        ];

        geoms.forEach((geo, i) => {
            const mat = new THREE.MeshStandardMaterial({
                color: [0xa78bfa, 0x38bdf8, 0xf472b6, 0x818cf8][i],
                wireframe: i % 2 === 1,
                transparent: true,
                opacity: i % 2 === 1 ? 0.25 : 0.55,
                roughness: 0.3,
                metalness: 0.8,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 2
            );
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            scene.add(mesh);
            objects.push({ mesh, speed: 0.003 + Math.random() * 0.004, phase: Math.random() * Math.PI * 2 });
        });

        // Particle field
        const particleCount = 300;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 14;
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.04, transparent: true, opacity: 0.5 });
        scene.add(new THREE.Points(particleGeo, particleMat));

        // Mouse parallax
        let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
        window.addEventListener('mousemove', e => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 1.2;
            targetY = -(e.clientY / window.innerHeight - 0.5) * 0.8;
        });

        let t = 0;
        function animate() {
            requestAnimationFrame(animate);
            t += 0.01;

            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;
            camera.position.x = currentX;
            camera.position.y = currentY;
            camera.lookAt(scene.position);

            objects.forEach(({ mesh, speed, phase }) => {
                mesh.rotation.x += speed;
                mesh.rotation.y += speed * 0.7;
                mesh.position.y += Math.sin(t + phase) * 0.004;
            });

            pl1.position.x = Math.sin(t * 0.5) * 3;
            pl1.position.y = Math.cos(t * 0.4) * 2;
            pl2.position.x = Math.cos(t * 0.6) * 3;
            pl2.position.y = Math.sin(t * 0.3) * 2;

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            const w = window.innerWidth, h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }
})();

// ---- PARALLAX on SCROLL ----
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
        heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
    }
});

// ---- WORK CARD TILT EFFECT ----
document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = (-y / rect.height) * 8;
        const rotY = (x / rect.width) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ---- SERVICE CARD 3D TILT ----
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = (-y / rect.height) * 5;
        const rotY = (x / rect.width) * 5;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-6px)';
        setTimeout(() => { card.style.transform = ''; }, 300);
    });
});

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ---- HERO REVEALS ON LOAD ----
window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('revealed');
        }, 200 + i * 150);
    });
});
