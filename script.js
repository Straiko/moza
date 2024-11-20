fetch(`config.json?t=${new Date().getTime()}`)
  .then(response => response.json())
  .then(config => {
    console.log('Конфигурация загружена:', config);

    if (!config.tracks || config.tracks.length === 0) {
      console.error('Нет доступных треков в конфигурации.');
      return;
    }

    const audio = document.getElementById('audio');
    const progressBar = document.querySelector('.progress-bar');
    const playPauseButton = document.querySelector('.play-pause');
    const startTimeDisplay = document.getElementById('start-time');
    const endTimeDisplay = document.getElementById('end-time');
    const volumeSlider = document.querySelector('.volume-slider');
    const trackTitle = document.getElementById('track-title');
    const coverArt = document.querySelector('.cover-art img');

    let currentTrackIndex = 0; 
    let isPlaying = false;

    function loadTrack(index) {
      const track = config.tracks[index];
      audio.src = `muzika/${track.audioSrc}`; 
      trackTitle.textContent = track.title;
      coverArt.src = `kartinki/${track.coverArt}`; 
      audio.volume = config.playerSettings.defaultVolume / 100;
      progressBar.max = track.duration; 
      endTimeDisplay.textContent = formatTime(track.duration);
      progressBar.value = 0; 
    }

    loadTrack(currentTrackIndex);

    audio.addEventListener('loadedmetadata', () => {
      console.log('Метаданные загружены:', audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      progressBar.value = audio.currentTime; 
      startTimeDisplay.textContent = formatTime(Math.round(audio.currentTime)); 
    });

    progressBar.addEventListener('input', () => {
      audio.currentTime = progressBar.value; 
    });

    volumeSlider.addEventListener('input', () => {
      audio.volume = volumeSlider.value / 100; 
    });

    playPauseButton.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        playPauseButton.textContent = 'Воспроизвести';
      } else {
        audio.play();
        playPauseButton.textContent = 'Пауза';
      }
      isPlaying = !isPlaying;
    });

    audio.addEventListener('ended', () => {
      currentTrackIndex = (currentTrackIndex + 1) % config.tracks.length; 
      loadTrack(currentTrackIndex);
      audio.play();
    });

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  });
