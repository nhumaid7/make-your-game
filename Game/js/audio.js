const MENU_MUSIC = "/Game/assets/sounds/menu.mp3";
const GAME_MUSIC = "/Game/assets/sounds/friends.mp3";
const BUTTON_SFX = "/Game/assets/sounds/button.mp3";

const AudioManager = {
  audioContext: null, //main audio
  currentMusic: null, 
  currentSrc: null, //path
  sourceNode: null, //connects the audio to the system
  gainNode: null, //controls the volume
  biquadFilter: null, //applies filter
  distortion: null, //create glitch
  _menuResumeTime: parseFloat(localStorage.getItem('menuMusicTime')) || 0, //make the menu music resume where it left off when returning from tutorial or game

  initContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  createDistortion(amount = 50) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    const distortion = this.audioContext.createWaveShaper();
    distortion.curve = curve;
    distortion.oversample = "4x";
    return distortion;
  },

  connectNormalChain() {
    this.sourceNode.disconnect();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  },

  connectGlitchChain() {
    this.sourceNode.disconnect();
    this.sourceNode.connect(this.distortion);
    this.distortion.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  },

  playMusic(src, loop = true) {
    this.initContext();

    if (this.currentMusic && this.currentSrc === src && !this.currentMusic.paused) {
      return;
    }

    if (this.currentMusic) {
      this.stopMusic();
    }

    const audio = new Audio(src);
    audio.loop = loop;
    audio.crossOrigin = "anonymous";

    this.currentMusic = audio;
    this.currentSrc = src;

      // If resuming menu music, set the currentTime after it can play
    if (src === MENU_MUSIC && this._menuResumeTime > 0) {
      const t = this._menuResumeTime;
      this._menuResumeTime = 0;
      localStorage.removeItem('menuMusicTime');
      audio.addEventListener('canplay', () => { audio.currentTime = t; }, { once: true });
    }

    this.sourceNode = this.audioContext.createMediaElementSource(audio);
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.5;

    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.biquadFilter.type = "bandpass";
    this.biquadFilter.frequency.value = 900;
    this.biquadFilter.Q.value = 3;

    this.distortion = this.createDistortion(120);

    this.connectNormalChain();

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    audio.play().catch(err => console.log("Audio error:", err));
  },

  pauseMusic() {
    if (this.currentMusic) this.currentMusic.pause();
  },

  resumeMusic() {
    if (this.currentMusic) {
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      this.currentMusic.play().catch(err => console.log("Audio error:", err));
    }
  },

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      // Clear saved menu position when stopping music
      localStorage.removeItem('menuMusicTime');
    }

    if (this.sourceNode) this.sourceNode.disconnect();
    if (this.gainNode) this.gainNode.disconnect();
    if (this.biquadFilter) this.biquadFilter.disconnect();
    if (this.distortion) this.distortion.disconnect();

    this.currentMusic = null;
    this.currentSrc = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.biquadFilter = null;
    this.distortion = null;
  },
  // Save the current position of the menu music when navigating away from the menu
  saveMenuPosition() {
    if (this.currentMusic && this.currentSrc === MENU_MUSIC) {
      localStorage.setItem('menuMusicTime', this.currentMusic.currentTime);
    }
  },

  glitchMusic(duration = 300) {
    if (!this.currentMusic || !this.sourceNode) return;

    this.connectGlitchChain();

    setTimeout(() => {
      if (this.sourceNode) {
        this.connectNormalChain();
      }
    }, duration);
  },

  playButtonSfx() {
    try {
      this.initContext();
      const sfx = new Audio(BUTTON_SFX);
      sfx.volume = 0.7;
      sfx.play().catch(() => {});
    } catch (e) {}
  }
};

/* -----------------------------------------------
   Global button-click sound — covers every page.
   Fires on any <button> or .arrow-btn click.
----------------------------------------------- */
document.addEventListener('click', (e) => {
  const target = e.target.closest('button, .arrow-btn, .menu-btn, .control-btn, .back-btn, .back-to-menu-btn, .nav-arrow, .character-name-btn');
  if (target) {
    AudioManager.playButtonSfx();
  }
});