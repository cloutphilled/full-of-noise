const albums = [
    {
        id: 'abyss',
        name: 'Abyss',
        artist: 'Regarding Ambiguity',
        year: '2023',
        cover: 'images/albumCovers/abyss.jpg',
        tracks: [
            { id: 1, name: 'Burned Out', path: 'songs/abyss/01-burned-out.mp3' },
            { id: 2, name: 'Wither Away', path: 'songs/abyss/02-wither-away.mp3' },
            { id: 3, name: 'Abyss I: Void', path: 'songs/abyss/03-abyss-i-void.mp3' },
            { id: 4, name: 'Abyss II: Hollow', path: 'songs/abyss/04-abyss-ii-hollow.mp3' },
            { id: 5, name: 'Abyss III: Chaos', path: 'songs/abyss/05-abyss-iii-chaos.mp3' },
            { id: 6, name: 'Dawn', path: 'songs/abyss/06-dawn.mp3' },
            { id: 7, name: 'Dusk', path: 'songs/abyss/07-dusk.mp3' },
            { id: 8, name: 'Swim in Peace', path: 'songs/abyss/08-swim-in-peace.mp3' },
            { id: 9, name: 'Shell', path: 'songs/abyss/09-shell.mp3' }
        ]
    },
    {
        id: 'flayed',
        name: 'Flayed',
        artist: 'Regarding Ambiguity',
        year: '2019',
        cover: 'images/albumCovers/flayed.png',
        tracks: [
            { id: 1, name: 'Movie Kiss', path: 'songs/flayed/01-movie-kiss.mp3' },
            { id: 2, name: 'The Novelty of Modesty', path: 'songs/flayed/02-the-novelty-of-modesty.mp3' },
            { id: 3, name: 'Arrows', path: 'songs/flayed/03-arrows.mp3' },
            { id: 4, name: 'Paranoia Haiku', path: 'songs/flayed/04-paranoia-haiku.mp3' },
            { id: 5, name: 'Bloodlines', path: 'songs/flayed/05-bloodlines.mp3' },
            { id: 6, name: 'It Puts Motion to the Sin', path: 'songs/flayed/06-it-puts-motion-to-the-sin.mp3' }
        ]
    },
    {
        id: 'delude',
        name: 'Delude',
        artist: 'TELOS',
        year: '2023',
        cover: 'images/albumCovers/delude.png',
        tracks: [
            { id: 1, name: 'Within Reach', path: 'songs/delude/01-within-reach.mp3' },
            { id: 2, name: 'Bastion', path: 'songs/delude/02-bastion.mp3' },
            { id: 3, name: 'Never Me', path: 'songs/delude/03-never-me.mp3' },
            { id: 4, name: 'I Accept I Receive', path: 'songs/delude/04-i-accept-i-receive.mp3' },
            { id: 5, name: "I've Been Gone For So Long", path: 'songs/delude/05-ive-been-gone-for-so-long.mp3' },
            { id: 6, name: 'Lapse', path: 'songs/delude/06-lapse.mp3' },
            { id: 7, name: 'As Atlas Stumbled', path: 'songs/delude/07-as-atlas-stumbled.mp3' },
            { id: 8, name: 'Throne', path: 'songs/delude/08-throne.mp3' }
        ]
    }
];

// State
let currentAlbum = null;
let currentTrackIndex = 0;
let isPlaying = false;

// Elements
const audio = document.getElementById('audio');
const albumsSection = document.getElementById('albums');
const tracklistSection = document.getElementById('tracklist');
const albumHeader = document.getElementById('albumHeader');
const tracksContainer = document.getElementById('tracks');
const backBtn = document.getElementById('backBtn');

const playerCover = document.getElementById('playerCover');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');

// Initialize
function init() {
    renderAlbums();
    setupEventListeners();
    audio.volume = 1;
}

// Render albums grid
function renderAlbums() {
    albumsSection.innerHTML = albums.map(album => `
        <div class="album-card" data-album-id="${album.id}">
            <img src="${album.cover}" alt="${album.name}">
            <div class="album-card-info">
                <div class="album-card-title">${album.name}</div>
                <div class="album-card-artist">${album.artist}</div>
                <div class="album-card-year">${album.year}</div>
            </div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', () => {
            const albumId = card.dataset.albumId;
            showAlbum(albumId);
        });
    });
}

// Show album tracklist
function showAlbum(albumId) {
    currentAlbum = albums.find(a => a.id === albumId);
    if (!currentAlbum) return;

    albumsSection.style.display = 'none';
    tracklistSection.style.display = 'block';

    albumHeader.innerHTML = `
        <img src="${currentAlbum.cover}" alt="${currentAlbum.name}">
        <div class="album-header-info">
            <h2>${currentAlbum.name}</h2>
            <div class="artist">${currentAlbum.artist}</div>
            <div class="year">${currentAlbum.year}</div>
        </div>
    `;

    renderTracks();
}

// Render tracks
function renderTracks() {
    tracksContainer.innerHTML = currentAlbum.tracks.map((track, index) => `
        <div class="track" data-track-index="${index}">
            <span class="track-number">${index + 1}</span>
            <span class="track-name">${track.name}</span>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.track').forEach(track => {
        track.addEventListener('click', () => {
            const index = parseInt(track.dataset.trackIndex);
            playTrack(index);
        });
    });

    updateActiveTrack();
}

// Play track
function playTrack(index) {
    currentTrackIndex = index;
    const track = currentAlbum.tracks[index];
    
    audio.preload = 'auto';
    audio.src = track.path;
    audio.load();
    audio.play();
    isPlaying = true;

    updatePlayerInfo();
    updateActiveTrack();
    updatePlayButton();
}

// Update player info
function updatePlayerInfo() {
    const track = currentAlbum.tracks[currentTrackIndex];
    playerCover.src = currentAlbum.cover;
    playerCover.style.display = 'block';
    playerTitle.textContent = track.name;
    playerArtist.textContent = currentAlbum.artist;
}

// Update active track styling
function updateActiveTrack() {
    document.querySelectorAll('.track').forEach((track, index) => {
        track.classList.toggle('active', index === currentTrackIndex);
    });
}

// Update play/pause button
function updatePlayButton() {
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Setup event listeners
function setupEventListeners() {
    let isSeeking = false;
    
    // Back button
    backBtn.addEventListener('click', () => {
        albumsSection.style.display = 'grid';
        tracklistSection.style.display = 'none';
    });

    // Play/Pause
    playBtn.addEventListener('click', () => {
        if (!currentAlbum) return;
        
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            if (!audio.src) {
                playTrack(0);
            } else {
                audio.play();
                isPlaying = true;
            }
        }
        updatePlayButton();
    });

    // Previous
    prevBtn.addEventListener('click', () => {
        if (!currentAlbum) return;
        currentTrackIndex = (currentTrackIndex - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length;
        playTrack(currentTrackIndex);
    });

    // Next
    nextBtn.addEventListener('click', () => {
        if (!currentAlbum) return;
        currentTrackIndex = (currentTrackIndex + 1) % currentAlbum.tracks.length;
        playTrack(currentTrackIndex);
    });

    // Progress bar update
    audio.addEventListener('timeupdate', () => {
        if (audio.duration && !isSeeking) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    // Seeking - click anywhere on progress bar
    progressBar.addEventListener('input', (e) => {
        isSeeking = true;
    });
    
    progressBar.addEventListener('change', (e) => {
        if (audio.src && audio.duration) {
            const seekTime = (parseFloat(e.target.value) / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
        isSeeking = false;
    });
    
    // Handle direct click on progress bar
    progressBar.addEventListener('click', (e) => {
        if (audio.src && audio.duration) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const seekTime = percent * audio.duration;
            audio.currentTime = seekTime;
            progressBar.value = percent * 100;
        }
    });

    // Volume
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value / 100;
    });

    // Track ended
    audio.addEventListener('ended', () => {
        if (currentTrackIndex < currentAlbum.tracks.length - 1) {
            currentTrackIndex++;
            playTrack(currentTrackIndex);
        } else {
            isPlaying = false;
            updatePlayButton();
        }
    });
}

// Start
init();
