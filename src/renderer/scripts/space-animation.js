// Cosmic Starfield & Relativistic Gravitational Canvas
class SpaceAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: -1000, y: -1000 };
    this.running = true;

    this.palette = ['#FEFAE0', '#D4A373', '#E9EDC9', '#CCD5AE', '#FFFFFF'];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Populate Stars
    const starCount = Math.floor((this.width * this.height) / 3800);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        originX: 0,
        originY: 0,
        radius: Math.random() * 1.6 + 0.4,
        color: this.palette[Math.floor(Math.random() * this.palette.length)],
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        driftX: (Math.random() - 0.5) * 0.12,
        driftY: (Math.random() - 0.5) * 0.12,
      });
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  addShootingStar() {
    if (Math.random() < 0.015 && this.shootingStars.length < 3) {
      this.shootingStars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.5),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1,
      });
    }
  }

  animate() {
    if (!this.running) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render Stars with Gravitational Deflection around mouse
    for (const star of this.stars) {
      // Twinkle
      star.alpha += star.twinkleSpeed * star.twinkleDir;
      if (star.alpha >= 1) {
        star.alpha = 1;
        star.twinkleDir = -1;
      } else if (star.alpha <= 0.15) {
        star.alpha = 0.15;
        star.twinkleDir = 1;
      }

      // Drift
      star.x += star.driftX;
      star.y += star.driftY;
      if (star.x < 0) star.x = this.width;
      if (star.x > this.width) star.x = 0;
      if (star.y < 0) star.y = this.height;
      if (star.y > this.height) star.y = 0;

      // Subtle Gravitational Lensing effect
      let renderX = star.x;
      let renderY = star.y;
      const dx = this.mouse.x - star.x;
      const dy = this.mouse.y - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 140 && dist > 1) {
        const force = (1 - dist / 140) * 8;
        renderX -= (dx / dist) * force;
        renderY -= (dy / dist) * force;
      }

      this.ctx.beginPath();
      this.ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.globalAlpha = star.alpha;
      this.ctx.fill();
    }

    // Render Shooting Stars
    this.addShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      const endX = s.x - Math.cos(s.angle) * s.length;
      const endY = s.y - Math.sin(s.angle) * s.length;

      const grad = this.ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, '#FEFAE0');
      grad.addColorStop(0.5, '#D4A373');
      grad.addColorStop(1, 'transparent');

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.globalAlpha = s.opacity;
      this.ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.02;

      if (s.opacity <= 0 || s.x > this.width || s.y > this.height) {
        this.shootingStars.splice(i, 1);
      }
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

// Particle Confetti Burst Engine
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.palette = ['#D4A373', '#FEFAE0', '#E9EDC9', '#CCD5AE', '#BC4749', '#FFFFFF'];

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 70) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 6 + 3,
        color: this.palette[Math.floor(Math.random() * this.palette.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        alpha: 1,
        gravity: 0.28,
        friction: 0.98,
      });
    }

    if (!this.running) {
      this.running = true;
      this.animate();
    }
  }

  animate() {
    if (this.particles.length === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.running = false;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.rotation += p.rotSpeed;
      p.alpha -= 0.016;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.SpaceAnimation = SpaceAnimation;
window.ConfettiEngine = ConfettiEngine;
