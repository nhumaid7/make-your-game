const MENU_MUSIC = "/Game/assets/sounds/menu.mp3";
const GAME_MUSIC = "/Game/assets/sounds/friends.mp3";

const AudioManager = {
  currentMusic: null,
  currentSrc: null,

  playMusic(src, loop = true) {
    if (this.currentMusic && this.currentSrc === src && !this.currentMusic.paused) {
      return;
    }

    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }

    this.currentMusic = new Audio(src);
    this.currentMusic.loop = loop;
    this.currentMusic.volume = 0.5;
    this.currentSrc = src;

    this.currentMusic.play().catch(err => {
      console.log("Audio error:", err);
    });
  },

  pauseMusic() {
    if (this.currentMusic) this.currentMusic.pause();
  },

  resumeMusic() {
    if (this.currentMusic) {
      this.currentMusic.play().catch(err => {
        console.log("Audio blocked:", err);
      });
    }
  },

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }
  this.currentMusic = null;
  this.currentSrc = null;
}
};