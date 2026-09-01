// ============================================
// FOOTER 年度 & YEARS EXP（動的）
// ============================================
const currentYear = new Date().getFullYear();
document.getElementById('footer-year').textContent = currentYear;

// 2022年8月1日基準でYEARS EXPを計算
const startDate = new Date(2022, 7, 1); // 月は0始まりなので7=8月
const now = new Date();
const diffMs = now - startDate;
const yearsExp = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
const yearsEl = document.getElementById('years-exp');
if (yearsEl) {
    yearsEl.innerHTML = yearsExp + '<span class="accent">+</span>';
}

// ============================================
// LOADING
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 2000);
});

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => {
        trail.style.left = e.clientX + 'px';
        trail.style.top  = e.clientY + 'px';
    }, 80);
});

// ============================================
// PARTICLE CANVAS — 星空
// ============================================
(function () {
    const canvas = document.getElementById('particle-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initStars(); });

    function rand(min, max) { return Math.random() * (max - min) + min; }

    // ---- 星レイヤー（小さくて多い・静的に瞬く） ----
    let stars = [];
    function initStars() {
        stars = [];
        const count = Math.floor((W * H) / 6000); // 画面サイズに応じた数
        for (let i = 0; i < count; i++) {
            stars.push({
                x:       rand(0, W),
                y:       rand(0, H),
                r:       rand(0.3, 1.2),
                alpha:   rand(0.2, 1.0),
                twinkleSpeed: rand(0.005, 0.02),
                twinkleDir:   Math.random() > 0.5 ? 1 : -1,
                minAlpha: rand(0.1, 0.4),
                maxAlpha: rand(0.6, 1.0),
            });
        }
    }
    initStars();

    // ---- 流れ星レイヤー（大きくてゆっくり動く） ----
    let drifters = [];
    function createDrifter() {
        return {
            x:      rand(0, W),
            y:      rand(0, H),
            r:      rand(2.0, 4.5),
            vx:     rand(-0.15, 0.15),
            vy:     rand(-0.08, 0.08),
            alpha:  0,
            maxAlpha: rand(0.15, 0.35),
            fade:   rand(0.003, 0.006),
            fading: false,
            // グロー用
            glowR:  rand(6, 14),
        };
    }
    for (let i = 0; i < 12; i++) {
        const d = createDrifter();
        d.alpha  = rand(0, d.maxAlpha);
        d.fading = Math.random() > 0.5;
        drifters.push(d);
    }

    function drawGlow(x, y, r, glowR, alpha, color) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        grad.addColorStop(0,   `rgba(${color}, ${alpha})`);
        grad.addColorStop(0.4, `rgba(${color}, ${alpha * 0.4})`);
        grad.addColorStop(1,   `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // 小さい星を描画（瞬き）
        stars.forEach(s => {
            s.alpha += s.twinkleSpeed * s.twinkleDir;
            if (s.alpha >= s.maxAlpha) { s.alpha = s.maxAlpha; s.twinkleDir = -1; }
            if (s.alpha <= s.minAlpha) { s.alpha = s.minAlpha; s.twinkleDir =  1; }

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 235, 255, ${s.alpha})`;
            ctx.fill();
        });

        // 大きいグロー粒を描画（ドリフト）
        drifters.forEach((d, i) => {
            drawGlow(d.x, d.y, d.r, d.glowR, d.alpha, '160, 200, 255');

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 220, 255, ${d.alpha})`;
            ctx.fill();

            d.x += d.vx;
            d.y += d.vy;

            // 画面外に出たら反対側から
            if (d.x < -20) d.x = W + 20;
            if (d.x > W + 20) d.x = -20;
            if (d.y < -20) d.y = H + 20;
            if (d.y > H + 20) d.y = -20;

            // フェードイン ↔ アウト
            if (d.fading) {
                d.alpha -= d.fade;
                if (d.alpha <= 0) { d.alpha = 0; d.fading = false; }
            } else {
                d.alpha += d.fade;
                if (d.alpha >= d.maxAlpha) { d.alpha = d.maxAlpha; d.fading = true; }
            }
        });

        requestAnimationFrame(draw);
    }
    draw();
})();

// ============================================
// TYPING ANIMATION
// ============================================
(function () {
    const el   = document.getElementById('typed-eyebrow');
    const text = 'Automation Engineer based in Tokyo';
    let i = 0;
    function rand(a, b) { return Math.random() * (b - a) + a; }
    function type() {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(type, rand(45, 95));
        }
    }
    setTimeout(type, 2200);
})();

// ============================================
// NAV
// ============================================
const nav      = document.getElementById('nav');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.6);
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

// ============================================
// SECTION フェードイン
// ============================================
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.05 });

document.querySelectorAll('.section').forEach(el => {
    // 読み込み時に既に画面内にある場合は即座に表示
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
        el.classList.add('visible');
    } else {
        sectionObserver.observe(el);
    }
});

// ============================================
// SKILL BAR
// ============================================
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ============================================
// ハンバーガーメニュー
// ============================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
}