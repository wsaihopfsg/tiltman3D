const startBtn = document.getElementById('start-btn');
const statusText = document.getElementById('status');
const visuals = document.querySelectorAll('.visual-item');
const safVideo = document.getElementById('vis-wave');

// Generate a simple 4-digit room ID for your phone to connect to
const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
const peer = new Peer(`shortness-talk-${roomCode}`);

startBtn.style.display = 'none';
statusText.textContent = `Phone Code: ${roomCode} (Waiting for phone...)`;
statusText.style.color = '#2563eb';
statusText.style.fontWeight = 'bold';

// Listen for incoming connection from your S24 Ultra
peer.on('connection', (conn) => {
    statusText.textContent = `Connected to Phone (${roomCode})`;
    statusText.style.color = '#16a34a';

    conn.on('data', (data) => {
        console.log('Received from phone:', data);
        handleCue(data.action);
    });
});

// Execute visual cues on the laptop screen
function handleCue(action) {
    if (action === 'name') {
        showVisual('vis-name');
    } else if (action === 'aussie') {
        showVisual('vis-aussie');
    } else if (action === 'wave-static') {
        showVisual('vis-wave');
        if (safVideo) {
            safVideo.pause();
            safVideo.currentTime = 0;
        }
    } else if (action === 'wave-play') {
        if (safVideo && !safVideo.classList.contains('active')) {
            showVisual('vis-wave');
        }
        if (safVideo) {
            safVideo.currentTime = 0;
            safVideo.play().catch(err => console.error('Video play error:', err));
        }
    } else if (action === 'clear') {
        showVisual(null);
    }
}

function showVisual(targetId) {
    visuals.forEach(el => {
        if (el.id === targetId) {
            if (el.hasAttribute('data-src')) {
                el.src = el.getAttribute('data-src') + '?t=' + Date.now();
            }
            el.classList.add('active');
        } else {
            el.classList.remove('active');
            if (el.hasAttribute('data-src')) {
                el.removeAttribute('src');
            }
            if (el.tagName === 'VIDEO') {
                el.pause();
                el.currentTime = 0;
            }
        }
    });
}

if (safVideo) {
    safVideo.addEventListener('ended', () => {
        safVideo.currentTime = 0;
    });
}