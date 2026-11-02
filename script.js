const photo = document.getElementById('speaker-photo');
const placeholder = document.getElementById('photo-placeholder');
const audio = document.getElementById('bumper-audio');
const toggle = document.getElementById('audio-toggle');
const soundLabel = document.getElementById('sound-label');
const soundControl = document.querySelector('.sound-control');

photo.addEventListener('load', () => {
  photo.style.display = 'block';
  placeholder.style.display = 'none';
});
photo.addEventListener('error', () => {
  photo.style.display = 'none';
  placeholder.style.display = 'flex';
});

async function toggleAudio() {
  if (!audio.src || audio.readyState === 0) {
    soundLabel.textContent = 'UPLOAD SOUND';
    return;
  }
  try {
    if (audio.paused) {
      await audio.play();
      toggle.setAttribute('aria-label', 'Matikan suara');
      soundLabel.textContent = 'SOUND ON';
      soundControl.classList.add('playing');
    } else {
      audio.pause();
      toggle.setAttribute('aria-label', 'Aktifkan suara');
      soundLabel.textContent = 'SOUND OFF';
      soundControl.classList.remove('playing');
    }
  } catch (error) {
    soundLabel.textContent = 'KLIK UNTUK PLAY';
  }
}
toggle.addEventListener('click', toggleAudio);

// Browser blocks autoplay with sound until a visitor interacts.
// The visual bumper loops continuously; audio starts after the sound button is pressed.
