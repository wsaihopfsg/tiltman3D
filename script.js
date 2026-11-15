const startBtn = document.getElementById('start-btn');
const statusText = document.getElementById('status');
const visuals = document.querySelectorAll('.visual-item');
const safVideo = document.getElementById('vis-wave');

// The ID that the phone will be broadcasting from
const FIXED_PHONE_ID = 'wsaihopfsg-shortness-talk-2026';

// Let PeerJS generate a random, unique ID for this specific laptop
const peer = new Peer(); 

startBtn.style.display = 'none';
statusText.textContent = 'Initializing...';
statusText.style.color = '#2563eb';

peer.on('error', (err) => {
    statusText.textContent = `Peer Error: ${err.type}`;
    statusText.style.color = '#dc2626';
    console.error('PeerJS error:', err);
});

// Once this laptop gets its random ID, dial the phone
peer.on('open', (id) => {
    statusText.textContent = 'Connecting to Presenter...';
    
    const conn = peer.connect(FIXED_PHONE_ID);

    conn.on('open', () => {
        statusText.textContent = 'Connected to Presenter!';
        statusText.style.color = '#16a34a';
    });

    conn.on('data', (data) => {
        console.log('Received from phone:', data);
        handleCue(data.action);
    });

    conn.on('close', () => {
        statusText.textContent = 'Presenter disconnected.';
        statusText.style.color = '#dc2626';
    });
});

// Execute visual cues on the laptop screen
function handleCue(action) {
    if (action === 'name') {
        showVisual('vis-name');
    } else if (action === 'aussie') {
        showVisual('vis-aussie');
    } else if (action === 'lkk') {
        showVisual('vis-lkk');
    } else if (action === 'ntuc') {
        showVisual('vis-ntuc');
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

window.addEventListener('beforeunload', () => {
    if (peer && !peer.destroyed) {
        peer.destroy();
    }
});
