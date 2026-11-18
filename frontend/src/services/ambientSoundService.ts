// Web Audio API Procedural Ambient Sound Engine
// Synthesizes natural, looping soundscapes (Forest Birds, Mountain Wind, Gentle Rain, Stream)
// 100% offline, zero external asset dependencies, zero CORS errors, and perfectly seamless.

export type SoundType = 'birds' | 'mountain' | 'rain' | 'stream' | 'none';

export interface SoundPreset {
  id: SoundType;
  name: string;
  icon: string;
  description: string;
}

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'birds',
    name: 'Forest Birds',
    icon: '🐦',
    description: 'Gentle morning birdsong and whispering forest trees',
  },
  {
    id: 'mountain',
    name: 'Mountain Wind',
    icon: '🏔️',
    description: 'Calm, meditative high-altitude mountain breeze',
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    icon: '🌧️',
    description: 'Soft raindrops falling on leaves and window glass',
  },
  {
    id: 'stream',
    name: 'Forest Stream',
    icon: '🌊',
    description: 'Peaceful flowing brook and bubbling spring water',
  },
  {
    id: 'none',
    name: 'Sound Off',
    icon: '🔇',
    description: 'Complete silence for pure quiet focus',
  },
];

class AmbientSoundService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSound: SoundType = 'birds';
  private isMuted: boolean = false;
  private volume: number = 0.5; // 0.0 to 1.0
  private isPlaying: boolean = false;

  // Active audio nodes to stop on switch
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private birdTimerId: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate pink/brown noise buffer for natural atmospheric sounds
  private createNoiseBuffer(seconds = 5): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise algorithm (Paul Kellet's filter)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentSound(): SoundType {
    return this.currentSound;
  }

  public startSound(type?: SoundType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (type) {
      this.currentSound = type;
    }

    if (this.currentSound === 'none') {
      this.stop();
      return;
    }

    this.stopActiveNodes();
    this.isPlaying = true;

    switch (this.currentSound) {
      case 'birds':
        this.playBirdsPreset();
        break;
      case 'mountain':
        this.playMountainPreset();
        break;
      case 'rain':
        this.playRainPreset();
        break;
      case 'stream':
        this.playStreamPreset();
        break;
      default:
        break;
    }
  }

  public stop() {
    this.isPlaying = false;
    this.stopActiveNodes();
  }

  private stopActiveNodes() {
    if (this.birdTimerId) {
      clearTimeout(this.birdTimerId);
      this.birdTimerId = null;
    }

    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  // --- 1. FOREST BIRDS PRESET ---
  private playBirdsPreset() {
    if (!this.ctx || !this.masterGain) return;

    // Soft forest wind background
    const noiseBuffer = this.createNoiseBuffer(5);
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start();

      this.activeNodes.push(noise, filter, gain);
    }

    // Schedule periodic procedural bird chirps
    const scheduleNextChirp = () => {
      if (!this.isPlaying || this.currentSound !== 'birds') return;

      this.triggerSingleBirdChirp();
      const nextDelay = 1500 + Math.random() * 3000; // 1.5s - 4.5s
      this.birdTimerId = setTimeout(scheduleNextChirp, nextDelay);
    };

    scheduleNextChirp();
  }

  private triggerSingleBirdChirp() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const baseFreq = 2200 + Math.random() * 1200; // Bright bird pitch

    // Double chirp or sweet trill
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // --- 2. MOUNTAIN WIND PRESET ---
  private playMountainPreset() {
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createNoiseBuffer(6);
    if (!noiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Resonant bandpass for mountain breeze whistling
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // LFO to slowly modulate wind intensity (rising and whispering)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // slow breathing sweep
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain, gain);
  }

  // --- 3. GENTLE RAIN PRESET ---
  private playRainPreset() {
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Highpass to eliminate harsh low rumble
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(600, this.ctx.currentTime);

    // Lowpass to give smooth rainfall pitter-patter
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3200, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.55, this.ctx.currentTime);

    noise.connect(hp);
    hp.connect(lp);
    lp.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, hp, lp, gain);
  }

  // --- 4. FOREST STREAM PRESET ---
  private playStreamPreset() {
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // Gentle water ripple modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(2.2, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(350, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain, gain);
  }

  // Play peaceful meditation chime when timer finishes
  public playCompletionBell() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now); // 528 Hz - Solfeggio "Miracle / Transformation" calm tone
    osc.frequency.exponentialRampToValueAtTime(524, now + 3.0);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 3.6);
  }
}

export const ambientSoundService = new AmbientSoundService();
