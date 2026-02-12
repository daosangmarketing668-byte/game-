// ===== GAME STATE MANAGEMENT =====
class GameState {
    constructor() {
        this.currentScreen = 'welcome'; // welcome, game, gameOver
        this.playerName = '';
        this.currentLevel = 1;
        this.score = 0;
        this.gameTimer = 0;
        this.isPlaying = false;
        this.isWaiting = false;
        this.signalTime = null;
        this.reactionTimes = [];
        this.bestReactionTime = null;
        this.consecutiveSuccesses = 0;
        this.consecutiveFailures = 0;
        this.totalAttempts = 0;
        this.successfulAttempts = 0;
    }

    reset() {
        this.currentLevel = 1;
        this.score = 0;
        this.gameTimer = 0;
        this.isPlaying = false;
        this.isWaiting = false;
        this.signalTime = null;
        this.reactionTimes = [];
        this.bestReactionTime = null;
        this.consecutiveSuccesses = 0;
        this.consecutiveFailures = 0;
        this.totalAttempts = 0;
        this.successfulAttempts = 0;
    }

    addReactionTime(time) {
        this.reactionTimes.push(time);
        if (!this.bestReactionTime || time < this.bestReactionTime) {
            this.bestReactionTime = time;
        }
    }

    calculateAverageReactionTime() {
        if (this.reactionTimes.length === 0) return 0;
        const sum = this.reactionTimes.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.reactionTimes.length);
    }

    getReactionRating(time) {
        if (time < 200) return 'Siêu Nhân';
        if (time < 300) return 'Cao Thủ';
        if (time < 400) return 'Bình Thường';
        return 'Cần Luyện Thêm';
    }
}

// ===== LEVEL CONFIGURATION =====
const LevelConfig = {
    1: {
        name: 'Level 1',
        minWaitTime: 1000,
        maxWaitTime: 5000,
        targetCount: 1,
        fakeSignals: false,
        randomPositions: false,
        scoreMultiplier: 1,
        timeLimit: null
    },
    2: {
        name: 'Level 2',
        minWaitTime: 800,
        maxWaitTime: 3000,
        targetCount: 1,
        fakeSignals: false,
        randomPositions: false,
        scoreMultiplier: 1.5,
        timeLimit: null
    },
    3: {
        name: 'Level 3',
        minWaitTime: 600,
        maxWaitTime: 2500,
        targetCount: 1,
        fakeSignals: true,
        fakeSignalChance: 0.3,
        randomPositions: false,
        scoreMultiplier: 2,
        timeLimit: null
    },
    4: {
        name: 'Level 4',
        minWaitTime: 500,
        maxWaitTime: 2000,
        targetCount: 4,
        fakeSignals: true,
        fakeSignalChance: 0.2,
        randomPositions: false,
        scoreMultiplier: 3,
        timeLimit: null
    },
    5: {
        name: 'Level 5',
        minWaitTime: 300,
        maxWaitTime: 1500,
        targetCount: 6,
        fakeSignals: true,
        fakeSignalChance: 0.4,
        randomPositions: true,
        scoreMultiplier: 5,
        timeLimit: 10000 // 10 seconds per round
    }
};

// ===== MAIN GAME CLASS =====
class ReactionGame {
    constructor() {
        this.state = new GameState();
        this.timers = {};
        this.particles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupParticles();
        this.setupAudio();
        this.loadLeaderboard();
        this.showWelcomeScreen();
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Welcome screen
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        // Game controls
        document.getElementById('continueBtn').addEventListener('click', () => this.nextRound());
        document.getElementById('retryBtn').addEventListener('click', () => this.retryRound());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('homeBtn').addEventListener('click', () => this.goToHome());

        // Game card click
        document.getElementById('gameCard').addEventListener('click', () => this.handleGameClick());

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Leaderboard
        document.getElementById('resetLeaderboard').addEventListener('click', () => this.resetLeaderboard());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Prevent context menu on game area
        document.getElementById('gameCard').addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // ===== THEME MANAGEMENT =====
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // ===== PARTICLE SYSTEM =====
    setupParticles() {
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        this.animateParticles(ctx, canvas);
    }

    animateParticles(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 136, ${particle.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(() => this.animateParticles(ctx, canvas));
    }

    // ===== AUDIO SYSTEM =====
    setupAudio() {
        // Create audio context for sound generation
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Generate sounds programmatically
        this.sounds = {
            start: () => this.playTone(440, 0.1, 'sine'),
            signal: () => this.playTone(880, 0.2, 'square'),
            success: () => this.playTone(660, 0.15, 'sine'),
            fail: () => this.playTone(220, 0.2, 'sawtooth'),
            levelUp: () => this.playMelody([523, 659, 784], 0.1)
        };
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playMelody(frequencies, noteDuration) {
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, noteDuration, 'sine'), index * noteDuration * 1000);
        });
    }

    // ===== SCREEN MANAGEMENT =====
    showWelcomeScreen() {
        this.hideAllScreens();
        document.getElementById('welcomeScreen').classList.remove('hidden');
        this.state.currentScreen = 'welcome';
    }

    showGameScreen() {
        this.hideAllScreens();
        document.getElementById('gameScreen').classList.remove('hidden');
        document.getElementById('gameScreen').classList.add('active');
        this.state.currentScreen = 'game';
    }

    showGameOverModal() {
        document.getElementById('gameOverModal').classList.remove('hidden');
        this.updateGameOverStats();
    }

    hideAllScreens() {
        document.getElementById('welcomeScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('gameOverModal').classList.add('hidden');
    }

    // ===== GAME FLOW =====
    startGame() {
        const playerName = document.getElementById('playerName').value.trim();
        if (!playerName) {
            this.showError('Vui lòng nhập tên của bạn!');
            return;
        }

        this.state.playerName = playerName;
        this.state.reset();
        this.showGameScreen();
        this.updateUI();
        this.startGameTimer();
        this.nextRound();
        this.sounds.start();
    }

    nextRound() {
        this.clearTimers();
        this.showWaitingState();
        this.state.isWaiting = true;
        
        const config = LevelConfig[this.state.currentLevel];
        const waitTime = Math.random() * (config.maxWaitTime - config.minWaitTime) + config.minWaitTime;
        
        this.timers.signalTimer = setTimeout(() => {
            this.showSignalState();
            this.state.signalTime = Date.now();
            this.sounds.signal();
            
            // Auto-fail if time limit exists
            if (config.timeLimit) {
                this.timers.timeLimitTimer = setTimeout(() => {
                    this.handleTimeout();
                }, config.timeLimit);
            }
        }, waitTime);
    }

    retryRound() {
        this.state.consecutiveFailures++;
        this.nextRound();
    }

    handleGameClick() {
        if (!this.state.isWaiting && !this.state.signalTime) {
            return; // Click when not in game
        }

        if (this.state.isWaiting) {
            // Clicked too early
            this.handleTooSoon();
        } else if (this.state.signalTime) {
            // Valid click
            this.handleSuccess();
        }
    }

    handleTooSoon() {
        this.clearTimers();
        this.state.isWaiting = false;
        this.state.signalTime = null;
        this.state.consecutiveFailures++;
        this.showTooSoonState();
        this.sounds.fail();
        this.vibrate(200);
    }

    handleSuccess() {
        const reactionTime = Date.now() - this.state.signalTime;
        this.state.addReactionTime(reactionTime);
        this.state.consecutiveSuccesses++;
        this.state.successfulAttempts++;
        this.state.totalAttempts++;
        
        this.clearTimers();
        this.state.isWaiting = false;
        this.state.signalTime = null;
        
        this.updateScore(reactionTime);
        this.showResultState(reactionTime);
        this.sounds.success();
        this.vibrate(50);
        
        // Check for level up
        if (this.shouldLevelUp()) {
            this.levelUp();
        }
    }

    handleTimeout() {
        this.state.consecutiveFailures++;
        this.state.totalAttempts++;
        this.showTooSoonState();
        this.sounds.fail();
    }

    // ===== LEVEL SYSTEM =====
    shouldLevelUp() {
        const levelThresholds = {
            1: 3,  // 3 successes to level 2
            2: 5,  // 5 successes to level 3
            3: 7,  // 7 successes to level 4
            4: 10, // 10 successes to level 5
            5: Infinity // Max level
        };
        
        return this.state.consecutiveSuccesses >= levelThresholds[this.state.currentLevel];
    }

    levelUp() {
        if (this.state.currentLevel >= 5) return;
        
        this.state.currentLevel++;
        this.state.consecutiveSuccesses = 0;
        this.showLevelUpAnimation();
        this.sounds.levelUp();
        this.updateUI();
    }

    showLevelUpAnimation() {
        const animation = document.getElementById('levelUpAnimation');
        const newLevelSpan = document.getElementById('newLevel');
        
        newLevelSpan.textContent = this.state.currentLevel;
        animation.classList.remove('hidden');
        
        setTimeout(() => {
            animation.classList.add('hidden');
        }, 2000);
    }

    // ===== SCORING SYSTEM =====
    updateScore(reactionTime) {
        const config = LevelConfig[this.state.currentLevel];
        const baseScore = Math.max(100, 1000 - reactionTime);
        const levelMultiplier = config.scoreMultiplier;
        const roundScore = Math.round(baseScore * levelMultiplier);
        
        this.state.score += roundScore;
        this.updateUI();
        
        // Show score popup
        this.showScorePopup(roundScore);
    }

    showScorePopup(score) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${score}`;
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            font-weight: bold;
            color: #00ff88;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
            z-index: 1000;
            animation: scorePopup 1s ease-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1000);
    }

    // ===== UI STATE MANAGEMENT =====
    showWaitingState() {
        this.hideAllGameStates();
        document.getElementById('waitingState').classList.remove('hidden');
        document.getElementById('gameCard').style.cursor = 'pointer';
    }

    showSignalState() {
        this.hideAllGameStates();
        document.getElementById('signalState').classList.remove('hidden');
        this.startProgressBar();
    }

    showResultState(reactionTime) {
        this.hideAllGameStates();
        document.getElementById('resultState').classList.remove('hidden');
        
        const timeElement = document.getElementById('reactionTime');
        const ratingElement = document.getElementById('reactionRating');
        
        timeElement.textContent = `${reactionTime}ms`;
        ratingElement.textContent = this.state.getReactionRating(reactionTime);
        
        this.animateNumber(timeElement, 0, reactionTime, 500);
    }

    showTooSoonState() {
        this.hideAllGameStates();
        document.getElementById('tooSoonState').classList.remove('hidden');
    }

    hideAllGameStates() {
        document.getElementById('waitingState').classList.add('hidden');
        document.getElementById('signalState').classList.add('hidden');
        document.getElementById('resultState').classList.add('hidden');
        document.getElementById('tooSoonState').classList.add('hidden');
    }

    // ===== UI UPDATES =====
    updateUI() {
        document.getElementById('displayName').textContent = this.state.playerName;
        document.getElementById('currentLevel').textContent = this.state.currentLevel;
        document.getElementById('score').textContent = this.state.score;
        document.getElementById('timer').textContent = this.formatTime(this.state.gameTimer);
    }

    updateGameOverStats() {
        document.getElementById('finalScore').textContent = this.state.score;
        document.getElementById('finalLevel').textContent = this.state.currentLevel;
        document.getElementById('bestReaction').textContent = 
            this.state.bestReactionTime ? `${this.state.bestReactionTime}ms` : 'N/A';
    }

    // ===== TIMER SYSTEM =====
    startGameTimer() {
        this.timers.gameTimer = setInterval(() => {
            this.state.gameTimer++;
            this.updateUI();
        }, 1000);
    }

    startProgressBar() {
        const config = LevelConfig[this.state.currentLevel];
        const progressBar = document.getElementById('progressFill');
        
        if (config.timeLimit) {
            progressBar.style.transition = `width ${config.timeLimit}ms linear`;
            progressBar.style.width = '100%';
            
            this.timers.progressBar = setTimeout(() => {
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
            }, 100);
        }
    }

    clearTimers() {
        Object.values(this.timers).forEach(timer => clearTimeout(timer));
        this.timers = {};
    }

    // ===== LEADERBOARD =====
    loadLeaderboard() {
        const saved = localStorage.getItem('reactionGameLeaderboard');
        this.leaderboard = saved ? JSON.parse(saved) : [];
        this.updateLeaderboardDisplay();
    }

    saveLeaderboard() {
        localStorage.setItem('reactionGameLeaderboard', JSON.stringify(this.leaderboard));
    }

    addToLeaderboard() {
        const entry = {
            name: this.state.playerName,
            score: this.state.score,
            level: this.state.currentLevel,
            bestReaction: this.state.bestReactionTime,
            date: new Date().toISOString()
        };
        
        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 10); // Keep top 10
        this.saveLeaderboard();
        this.updateLeaderboardDisplay();
    }

    updateLeaderboardDisplay() {
        const listElement = document.getElementById('leaderboardList');
        listElement.innerHTML = '';
        
        if (this.leaderboard.length === 0) {
            listElement.innerHTML = '<div class="no-entries">Chưa có dữ liệu</div>';
            return;
        }
        
        this.leaderboard.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
            entryElement.innerHTML = `
                <span class="leaderboard-rank">#${index + 1}</span>
                <span class="leaderboard-name">${entry.name}</span>
                <div class="leaderboard-stats">
                    <span class="leaderboard-score">${entry.score}</span>
                    <span class="leaderboard-level">Level ${entry.level}</span>
                </div>
            `;
            listElement.appendChild(entryElement);
        });
    }

    resetLeaderboard() {
        if (confirm('Bạn có chắc muốn reset bảng xếp hạng?')) {
            this.leaderboard = [];
            this.saveLeaderboard();
            this.updateLeaderboardDisplay();
        }
    }

    // ===== UTILITY FUNCTIONS =====
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    animateNumber(element, start, end, duration) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            
            element.textContent = `${current}ms`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    vibrate(duration) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }

    showError(message) {
        // Create error toast
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4757;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 2000;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    handleKeyPress(e) {
        if (this.state.currentScreen === 'game') {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleGameClick();
            }
        }
    }

    // ===== GAME CONTROL =====
    restartGame() {
        document.getElementById('gameOverModal').classList.add('hidden');
        this.startGame();
    }

    goToHome() {
        this.clearTimers();
        this.addToLeaderboard();
        this.showWelcomeScreen();
        document.getElementById('playerName').value = '';
    }

    // ===== MULTI-TARGET SYSTEM (for advanced levels) =====
    createMultiTargets() {
        const container = document.getElementById('multiTargetContainer');
        const config = LevelConfig[this.state.currentLevel];
        
        if (config.targetCount <= 1) return;
        
        container.classList.remove('hidden');
        container.innerHTML = '';
        
        const correctIndex = Math.floor(Math.random() * config.targetCount);
        
        for (let i = 0; i < config.targetCount; i++) {
            const target = document.createElement('div');
            target.className = 'target-card';
            target.dataset.index = i;
            
            if (i === correctIndex) {
                target.dataset.correct = 'true';
                target.innerHTML = '<span style="font-size: 2rem;">🎯</span>';
            } else {
                target.dataset.correct = 'false';
                target.innerHTML = '<span style="font-size: 2rem;">❌</span>';
            }
            
            target.addEventListener('click', () => this.handleMultiTargetClick(target));
            container.appendChild(target);
        }
    }

    handleMultiTargetClick(target) {
        const isCorrect = target.dataset.correct === 'true';
        
        if (isCorrect) {
            target.classList.add('correct');
            this.handleSuccess();
        } else {
            target.classList.add('wrong');
            this.handleTooSoon();
        }
        
        // Disable all targets after click
        document.querySelectorAll('.target-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
    }
}

// ===== ADDITIONAL CSS ANIMATIONS =====
const additionalCSS = `
@keyframes scorePopup {
    0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -100%) scale(1);
        opacity: 0;
    }
}

@keyframes slideDown {
    from {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}

.error-toast {
    animation: slideDown 0.3s ease;
}

.no-entries {
    text-align: center;
    color: var(--text-secondary);
    padding: 20px;
    font-style: italic;
}
`;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Add additional CSS
    const style = document.createElement('style');
    style.textContent = additionalCSS;
    document.head.appendChild(style);
    
    // Initialize game
    window.game = new ReactionGame();
    
    // Add some polish
    console.log('%c🎮 SIÊU CÂU LỆNH PRO MAX - Ready to Play! 🎮', 'color: #00ff88; font-size: 20px; font-weight: bold;');
});

// ===== PERFORMANCE OPTIMIZATION =====
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload sounds or other assets during idle time
        console.log('Game assets preloaded');
    });
}

// ===== SERVICE WORKER FOR PWA (optional) =====
if ('serviceWorker' in navigator) {
    // Uncomment to enable PWA functionality
    // navigator.serviceWorker.register('/sw.js');
}
