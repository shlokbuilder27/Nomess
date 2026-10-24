// Web Audio API Synthesizer & Celestial Space Drone Engine
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.ambientDroneEnabled = false;

    // Ambient Drone Nodes
    this.droneGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneFilter = null;
    this.droneLfo = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ==========================================
  // AMBIENT SPACE VIBE CELESTIAL DRONE
  // Deep 432Hz / 108Hz harmonic cosmic resonance
  // ==========================================
  toggleAmbientDrone() {
    this.init();
    if (!this.ctx) return false;

    if (this.ambientDroneEnabled) {
      this.stopAmbientDrone();
      return false;
    } else {
      this.startAmbientDrone();
      return true;
    }
  }

  startAmbientDrone() {
    if (this.ambientDroneEnabled || !this.ctx) return;
    this.ambientDroneEnabled = true;

    const now = this.ctx.currentTime;

    // Master Drone Gain
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, now);
    this.droneGain.gain.exponentialRampToValueAtTime(0.18, now + 3); // Smooth 3-second fade in

    // Lowpass filter to keep sound warm and deep
    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(220, now);

    // Root Frequency (Sub-Harmonic 108Hz)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(108, now);

    // Harmonic Fifth (162Hz) with subtle detune for celestial shimmer
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(162, now);
    this.droneOsc2.detune.setValueAtTime(3, now);

    // Slow LFO for organic breathing filter modulation (0.08 Hz)
    this.droneLfo = this.ctx.createOscillator();
    this.droneLfo.frequency.setValueAtTime(0.08, now);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(45, now);
    this.droneLfo.connect(lfoGain);
    lfoGain.connect(this.droneFilter.frequency);

    // Connect Graph
    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
    this.droneLfo.start(now);
  }

  stopAmbientDrone() {
    if (!this.ambientDroneEnabled || !this.ctx || !this.droneGain) return;
    const now = this.ctx.currentTime;
    this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    setTimeout(() => {
      try {
        if (this.droneOsc1) this.droneOsc1.stop();
        if (this.droneOsc2) this.droneOsc2.stop();
        if (this.droneLfo) this.droneLfo.stop();
      } catch (e) {}
      this.ambientDroneEnabled = false;
      this.droneOsc1 = null;
      this.droneOsc2 = null;
    }, 1600);
  }

  // ==========================================
  // SOUND EFFECTS (SFX)
  // ==========================================

  // Warp Whoosh on Navigation
  playWarp() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Harmonic Timer Completion Chime (Starlight Cyan & Solar Amber Triad)
  playChime() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [587.33, 880, 1174.66]; // D5, A5, D6

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 2.2);
    });
  }

  // Triumphant Task Completion (Pulsar Beep)
  playSuccess() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Tactical NUKE Shockwave Blast
  playNukeExplosion() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 0.7);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.75);

    // Filtered noise explosion
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 0.8);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.8);
  }

  // Mechanical Tactile Click
  playClick() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.025);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  }
}

window.soundEngine = new AudioSynthesizer();
