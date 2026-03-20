let timerInterval = null;
let secondsRemaining = 25 * 60; // default 25 mins
let isRunning = false;
let currentMode = 'work'; // 'work' or 'break'

// Audio Controller
const workMusicTracks = [
    '/music)1.mp3',
    '/music)2.mp3',
    '/music)3.mp3',
    '/music)4.mp3',
    '/music)5.mp3'
];
const breakMusicTrack = '/BreakMusic.mp3';
let currentAudio = null;

const playMusic = (mode) => {
    if (currentAudio) {
        currentAudio.pause();
    }

    if (mode === 'work') {
        const randomTrack = workMusicTracks[Math.floor(Math.random() * workMusicTracks.length)];
        currentAudio = new Audio(randomTrack);
    } else {
        currentAudio = new Audio(breakMusicTrack);
    }

    currentAudio.loop = true;
    currentAudio.play().catch(err => console.log("Audio playback failed:", err));
};

const pauseMusic = () => {
    if (currentAudio) {
        currentAudio.pause();
    }
};

const stopMusic = () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
};

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

export const initTimer = () => {
    const timeDisplay = document.getElementById('time-display');
    const statusText = document.getElementById('status-text');

    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    const workModeBtn = document.getElementById('work-mode');
    const breakModeBtn = document.getElementById('break-mode');

    const updateDisplay = () => {
        timeDisplay.textContent = formatTime(secondsRemaining);
        document.title = `${formatTime(secondsRemaining)} - ${currentMode === 'work' ? 'Work' : 'Break'} | Karan's Zone`;
    };

    const setMode = (mode) => {
        if (isRunning) pauseTimer();
        stopMusic();

        currentMode = mode;
        if (mode === 'work') {
            secondsRemaining = 25 * 60;
            statusText.textContent = 'Work Session';
            workModeBtn.classList.add('active-mode');
            breakModeBtn.classList.remove('active-mode');
        } else {
            secondsRemaining = 5 * 60;
            statusText.textContent = 'Break Time';
            breakModeBtn.classList.add('active-mode');
            workModeBtn.classList.remove('active-mode');
        }
        updateDisplay();
    };

    const startTimer = () => {
        if (isRunning) return;

        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        playMusic(currentMode);

        timerInterval = setInterval(() => {
            if (secondsRemaining > 0) {
                secondsRemaining--;
                updateDisplay();
            } else {
                // Time's up
                pauseTimer();
                stopMusic();
                alert(`Time's up for ${currentMode === 'work' ? 'work' : 'break'}!`);
                // Auto switch mode visually
                setMode(currentMode === 'work' ? 'break' : 'work');
            }
        }, 1000);
    };

    const pauseTimer = () => {
        if (!isRunning) return;

        isRunning = false;
        clearInterval(timerInterval);
        timerInterval = null;

        pauseMusic();

        startBtn.disabled = false;
        pauseBtn.disabled = true;
    };

    const resetTimer = () => {
        pauseTimer();
        stopMusic();
        setMode(currentMode); // Reset to full duration of current mode
    };

    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    workModeBtn.addEventListener('click', () => setMode('work'));
    breakModeBtn.addEventListener('click', () => setMode('break'));

    // Initialize
    updateDisplay();
};
