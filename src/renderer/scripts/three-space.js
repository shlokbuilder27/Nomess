import * as THREE from 'three';

// 3D Space Cosmos Engine powered by Three.js
// Procedural Planets, 3D Floating Astronaut, Parallax Starfield & Space Atmosphere

class ThreeSpaceEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stars = null;
    this.planetGroup = null;
    this.moon = null;
    this.astronaut = null;
    this.thrusterParticles = [];

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetCameraX = 0;
    this.targetCameraY = 0;

    this.fidelity = 'full'; // 'full' | 'minimal' | 'off'
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060911, 0.0006);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 1, 3000);
    this.camera.position.z = 850;

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    this.scene.add(ambientLight);

    // Distant Star Sun (Directional Light)
    const sunLight = new THREE.DirectionalLight(0xfff8eb, 2.5);
    sunLight.position.set(600, 400, 400);
    this.scene.add(sunLight);

    // Rim light (Starlight Cyan)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-500, -200, -200);
    this.scene.add(rimLight);

    // 4. Build 3D Entities
    this.createStarfield();
    this.createRingedPlanet();
    this.createMoon();
    this.createAstronaut();

    // 5. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // 6. Start Loop
    this.animate();
  }

  createStarfield() {
    const starCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0xf8fafc), // White
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0xf59e0b), // Solar Amber
      new THREE.Color(0x94a3b8), // Slate
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2400;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Star point material
    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  createRingedPlanet() {
    this.planetGroup = new THREE.Group();

    // Planet Sphere
    const sphereGeo = new THREE.SphereGeometry(120, 64, 64);

    // Procedural Planet Surface Texture using Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Gradient Gaseous Atmosphere Bands (Deep Space Blue to Solar Amber)
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.2, '#1e293b');
    grad.addColorStop(0.35, '#0284c7');
    grad.addColorStop(0.5, '#0369a1');
    grad.addColorStop(0.65, '#f59e0b');
    grad.addColorStop(0.8, '#0c4a6e');
    grad.addColorStop(1, '#082f49');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Add storm streaks
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.12)';
      ctx.fillRect(0, Math.random() * 512, 1024, Math.random() * 24 + 4);
    }

    const planetTex = new THREE.CanvasTexture(canvas);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: planetTex,
      roughness: 0.7,
      metalness: 0.1,
    });

    const planetMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this.planetGroup.add(planetMesh);

    // Planetary Rings
    const ringGeo = new THREE.RingGeometry(150, 260, 64);
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 512;
    ringCanvas.height = 64;
    const rCtx = ringCanvas.getContext('2d');
    const rGrad = rCtx.createLinearGradient(0, 0, 512, 0);
    rGrad.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
    rGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.7)');
    rGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.5)');
    rGrad.addColorStop(0.85, 'rgba(241, 245, 249, 0.6)');
    rGrad.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
    rCtx.fillStyle = rGrad;
    rCtx.fillRect(0, 0, 512, 64);

    const ringTex = new THREE.CanvasTexture(ringCanvas);
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    this.planetGroup.add(ringMesh);

    // Position Planet in top-right cosmic horizon
    this.planetGroup.position.set(420, 200, -350);
    this.planetGroup.rotation.z = -0.35;
    this.scene.add(this.planetGroup);
  }

  createMoon() {
    const moonGeo = new THREE.SphereGeometry(38, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.9,
      metalness: 0.05,
    });
    this.moon = new THREE.Mesh(moonGeo, moonMat);
    this.moon.position.set(-480, -220, -280);
    this.scene.add(this.moon);
  }

  createAstronaut() {
    this.astronaut = new THREE.Group();

    const suitMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.1,
    });

    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.1,
      metalness: 0.9,
    });

    const packMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
    });

    const cyanAccentMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // Helmet
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(14, 24, 24), suitMat);
    this.astronaut.add(helmet);

    // Visor
    const visor = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), visorMat);
    visor.scale.set(1.1, 0.7, 1);
    visor.position.set(0, 1, 6);
    this.astronaut.add(visor);

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(11, 9, 26, 16), suitMat);
    torso.position.set(0, -22, 0);
    this.astronaut.add(torso);

    // Life Support Backpack
    const pack = new THREE.Mesh(new THREE.BoxGeometry(18, 24, 12), packMat);
    pack.position.set(0, -20, -10);
    this.astronaut.add(pack);

    // Jetpack thruster nozzles
    const nozzleL = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 4, 6, 8), packMat);
    nozzleL.position.set(-6, -34, -10);
    const nozzleR = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 4, 6, 8), packMat);
    nozzleR.position.set(6, -34, -10);
    this.astronaut.add(nozzleL);
    this.astronaut.add(nozzleR);

    // Limbs (Arms floating in zero-g)
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3, 20, 8), suitMat);
    armL.position.set(-16, -18, 4);
    armL.rotation.z = 0.6;
    armL.rotation.x = -0.4;
    this.astronaut.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3, 20, 8), suitMat);
    armR.position.set(16, -18, 4);
    armR.rotation.z = -0.6;
    armR.rotation.x = 0.3;
    this.astronaut.add(armR);

    // Legs
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(4, 3.5, 24, 8), suitMat);
    legL.position.set(-6, -44, 2);
    legL.rotation.x = 0.2;
    this.astronaut.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(4, 3.5, 24, 8), suitMat);
    legR.position.set(6, -44, -2);
    legR.rotation.x = -0.3;
    this.astronaut.add(legR);

    // Position Astronaut in the 3D scene (floating towards bottom right foreground)
    this.astronaut.position.set(280, -140, 480);
    this.astronaut.rotation.y = -0.5;
    this.astronaut.rotation.x = 0.2;
    this.scene.add(this.astronaut);
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(e) {
    // Normalized Mouse Coordinates (-1 to 1)
    this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  setFidelity(level) {
    this.fidelity = level;
    if (level === 'off') {
      this.container.style.display = 'none';
    } else {
      this.container.style.display = 'block';
      if (level === 'minimal') {
        if (this.planetGroup) this.planetGroup.visible = false;
        if (this.moon) this.moon.visible = false;
        if (this.astronaut) this.astronaut.visible = false;
      } else {
        if (this.planetGroup) this.planetGroup.visible = true;
        if (this.moon) this.moon.visible = true;
        if (this.astronaut) this.astronaut.visible = true;
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.fidelity === 'off') return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Parallax Camera Motion
    this.targetCameraX = this.mouseX * 80;
    this.targetCameraY = this.mouseY * 60;
    this.camera.position.x += (this.targetCameraX - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetCameraY - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0, 0);

    // Rotate Starfield gently
    if (this.stars) {
      this.stars.rotation.y = elapsedTime * 0.015;
    }

    // Rotate & Drift Planet
    if (this.planetGroup && this.fidelity === 'full') {
      this.planetGroup.rotation.y = elapsedTime * 0.04;
      this.planetGroup.position.y = 200 + Math.sin(elapsedTime * 0.4) * 12;
    }

    // Moon slow orbit
    if (this.moon && this.fidelity === 'full') {
      this.moon.rotation.y = elapsedTime * 0.08;
      this.moon.position.y = -220 + Math.cos(elapsedTime * 0.3) * 8;
    }

    // Astronaut 3D Zero-Gravity Tumbling & Floating
    if (this.astronaut && this.fidelity === 'full') {
      this.astronaut.position.y = -140 + Math.sin(elapsedTime * 0.9) * 18;
      this.astronaut.position.x = 280 + Math.cos(elapsedTime * 0.6) * 14;
      this.astronaut.rotation.z = Math.sin(elapsedTime * 0.4) * 0.15;
      this.astronaut.rotation.x = 0.2 + Math.cos(elapsedTime * 0.5) * 0.1;
      this.astronaut.rotation.y = -0.5 + Math.sin(elapsedTime * 0.3) * 0.12;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.ThreeSpaceEngine = ThreeSpaceEngine;
