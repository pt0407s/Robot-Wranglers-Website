// Robot Wranglers - Main JavaScript File

// Theme Management - Simple Toggle between Carolina Blue and Navy
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'carolina';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupToggleButton();
    }

    applyTheme(theme) {
        if (theme === 'carolina') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', 'navy');
        }
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    setupToggleButton() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                // Toggle between carolina and navy
                this.currentTheme = this.currentTheme === 'carolina' ? 'navy' : 'carolina';
                this.applyTheme(this.currentTheme);
            });
        }
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navLinks && this.navLinks.classList.contains('active')) {
                if (!e.target.closest('.nav-container')) {
                    this.closeMenu();
                }
            }
        });

        // Close menu when clicking a link
        if (this.navLinks) {
            const links = this.navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }
    }

    toggleMenu() {
        if (this.navLinks) {
            this.navLinks.classList.toggle('active');
            const isExpanded = this.navLinks.classList.contains('active');
            this.toggle.setAttribute('aria-expanded', isExpanded);
        }
    }

    closeMenu() {
        if (this.navLinks) {
            this.navLinks.classList.remove('active');
            this.toggle.setAttribute('aria-expanded', 'false');
        }
    }
}

// Archive Page Tabs
class ArchiveTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.contents = document.querySelectorAll('.archive-content');
        this.init();
    }

    init() {
        if (this.tabs.length === 0) return;

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(targetTab) {
        // Update tab buttons
        this.tabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === targetTab) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Update content visibility
        this.contents.forEach(content => {
            if (content.id === targetTab) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.messageDiv = document.getElementById('formMessage');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Simulate form submission (replace with actual backend call)
        this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
        this.form.reset();

        // In production, you would send this to a backend:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(data => this.showMessage(data.message, 'success'))
        // .catch(error => this.showMessage('Error sending message. Please try again.', 'error'));
    }

    showMessage(message, type) {
        if (!this.messageDiv) return;

        this.messageDiv.textContent = message;
        this.messageDiv.className = `form-message ${type}`;
        this.messageDiv.style.display = 'block';
        this.messageDiv.style.padding = '1rem';
        this.messageDiv.style.marginTop = '1rem';
        this.messageDiv.style.borderRadius = '5px';

        if (type === 'success') {
            this.messageDiv.style.backgroundColor = '#d4edda';
            this.messageDiv.style.color = '#155724';
            this.messageDiv.style.border = '1px solid #c3e6cb';
        } else {
            this.messageDiv.style.backgroundColor = '#f8d7da';
            this.messageDiv.style.color = '#721c24';
            this.messageDiv.style.border = '1px solid #f5c6cb';
        }

        setTimeout(() => {
            this.messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Snake Game (Hidden Easter Egg)
class SnakeGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.score = 0;
        this.gameLoop = null;
        this.isPlaying = false;
        this.setupTrigger();
    }

    setupTrigger() {
        // Secret key combination: Press 'S' 'N' 'A' 'K' 'E' in sequence
        let sequence = '';
        const target = 'snake';
        
        document.addEventListener('keydown', (e) => {
            sequence += e.key.toLowerCase();
            if (sequence.length > target.length) {
                sequence = sequence.slice(-target.length);
            }
            if (sequence === target) {
                this.start();
                sequence = '';
            }
        });

        // Also trigger from easter egg div
        const easterEgg = document.getElementById('snake-trigger');
        if (easterEgg) {
            easterEgg.addEventListener('click', () => this.start());
        }
    }

    start() {
        if (this.isPlaying) return;

        // Create game container
        const gameContainer = document.createElement('div');
        gameContainer.id = 'snake-game-container';
        gameContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 42, 78, 0.95);
            padding: 2rem;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        `;

        const title = document.createElement('h2');
        title.textContent = 'LRHS Snake Game';
        title.style.cssText = 'color: #95c8e3; text-align: center; margin-bottom: 1rem;';

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'snake-score';
        scoreDisplay.textContent = 'Score: 0';
        scoreDisplay.style.cssText = 'color: white; text-align: center; margin-bottom: 1rem; font-size: 1.2rem;';

        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.canvas.style.cssText = 'border: 2px solid #95c8e3; display: block;';
        this.ctx = this.canvas.getContext('2d');

        const instructions = document.createElement('p');
        instructions.textContent = 'Use Arrow Keys to move. Press ESC to quit.';
        instructions.style.cssText = 'color: #95c8e3; text-align: center; margin-top: 1rem; font-size: 0.9rem;';

        gameContainer.appendChild(title);
        gameContainer.appendChild(scoreDisplay);
        gameContainer.appendChild(this.canvas);
        gameContainer.appendChild(instructions);
        document.body.appendChild(gameContainer);

        this.reset();
        this.isPlaying = true;
        this.setupControls();
        this.gameLoop = setInterval(() => this.update(), 100);
    }

    setupControls() {
        this.keyHandler = (e) => {
            if (e.key === 'Escape') {
                this.stop();
                return;
            }
            
            // Restart game with Space
            if (e.key === ' ' && this.isGameOver) {
                this.stop();
                setTimeout(() => new SnakeGame().start(), 100);
                return;
            }

            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
                    break;
                case 'ArrowDown':
                    if (this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
                    break;
                case 'ArrowLeft':
                    if (this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
                    break;
                case 'ArrowRight':
                    if (this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
                    break;
            }
            e.preventDefault();
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    reset() {
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.score = 0;
        this.placeFood();
    }

    update() {
        this.direction = this.nextDirection;

        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        // Check wall collision
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snake-score').textContent = `Score: ${this.score}`;
            this.placeFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    placeFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * 20),
                y: Math.floor(Math.random() * 20)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a2a4e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#95c8e3';
        this.snake.forEach((segment, index) => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 40);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press SPACE to play again', this.canvas.width / 2, this.canvas.height / 2 + 40);
        
        this.isGameOver = true;
    }

    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        document.removeEventListener('keydown', this.keyHandler);
        const container = document.getElementById('snake-game-container');
        if (container) {
            container.remove();
        }
        this.isPlaying = false;
    }
}

// Smooth Scroll for Anchor Links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections
    const animatedElements = document.querySelectorAll('.link-card, .subteam-card, .win-card, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

// Smooth Page Transitions with Overlay
function initPageTransitions() {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = `
        <div class="transition-content">
            <img src="visuals/LR Robotics Logo.png" alt="Loading" class="transition-logo">
            <div class="transition-spinner"></div>
            <p class="transition-text">Robot Wranglers</p>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Get all internal links (including nav links)
    const links = document.querySelectorAll('a[href^="index.html"], a[href^="pages/"], a[href^="../index.html"], nav a[href*=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only apply transition to internal navigation links
            if (href && !link.hasAttribute('target') && !href.startsWith('#') && href.includes('.html')) {
                e.preventDefault();
                
                // Show overlay immediately
                overlay.classList.add('active');
                
                // Navigate quickly
                setTimeout(() => {
                    window.location.href = href;
                }, 150);
            }
        });
    });
    
    // Hide overlay on page load (handles back/forward button)
    window.addEventListener('pageshow', () => {
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 50);
    });
}

// Robot Modal Popup
class RobotModal {
    constructor() {
        this.modal = document.getElementById('robotModal');
        if (!this.modal) return;
        
        this.robotData = {
            charley: {
                name: 'Charley',
                subtitle: '2023 - Low G Game',
                image: '../visuals/robotpics/charley.jpg',
                achievements: [
                    'Rookie State Qualifier - Capital BEST 2024',
                    'Hub Competition Participant'
                ]
            },
            garry: {
                name: 'Garry',
                subtitle: '2024 - Factoids Game',
                image: '../visuals/robotpics/garry.png',
                achievements: [
                    'Currently Competing',
                    'Season in Progress'
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        // Add click handlers to robot cards
        document.querySelectorAll('.robot-card').forEach(card => {
            card.addEventListener('click', () => {
                const robotId = card.getAttribute('data-robot');
                this.openModal(robotId);
            });
        });
        
        // Close button
        const closeBtn = this.modal.querySelector('.robot-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal(robotId) {
        const robot = this.robotData[robotId];
        if (!robot) return;
        
        // Update modal content
        document.getElementById('modalRobotImage').src = robot.image;
        document.getElementById('modalRobotImage').alt = robot.name;
        document.getElementById('modalRobotName').textContent = robot.name;
        document.getElementById('modalRobotSubtitle').textContent = robot.subtitle;
        
        // Update achievements list
        const achievementsList = document.getElementById('modalAchievements');
        achievementsList.innerHTML = '';
        robot.achievements.forEach(achievement => {
            const li = document.createElement('li');
            li.textContent = achievement;
            achievementsList.appendChild(li);
        });
        
        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Poll System
class PollSystem {
    constructor() {
        this.pollOptions = document.querySelectorAll('.poll-option');
        this.pollStatus = document.getElementById('pollStatus');
        this.storageKey = 'robotPollVote';
        this.init();
    }

    init() {
        if (this.pollOptions.length === 0) return;

        // Load existing votes from localStorage
        this.loadVotes();
        
        // Check if user has already voted
        const userVote = localStorage.getItem(this.storageKey);
        if (userVote) {
            this.showResults();
            this.pollStatus.textContent = `You voted for ${userVote === 'charley' ? 'Charley' : 'Garry'}! Thanks for participating!`;
            this.pollStatus.classList.add('voted');
        } else {
            // Add click handlers
            this.pollOptions.forEach(option => {
                option.addEventListener('click', () => this.vote(option));
            });
        }
    }

    vote(option) {
        const vote = option.dataset.vote;
        
        // Check if already voted
        if (localStorage.getItem(this.storageKey)) {
            this.pollStatus.textContent = 'You have already voted!';
            return;
        }

        // Save vote
        localStorage.setItem(this.storageKey, vote);
        
        // Update vote count
        let votes = JSON.parse(localStorage.getItem('pollVotes') || '{"charley": 0, "garry": 0}');
        votes[vote]++;
        localStorage.setItem('pollVotes', JSON.stringify(votes));

        // Animate selection
        option.classList.add('selected');
        
        // Show results after animation
        setTimeout(() => {
            this.showResults();
            this.pollStatus.textContent = `You voted for ${vote === 'charley' ? 'Charley' : 'Garry'}! Thanks for participating!`;
            this.pollStatus.classList.add('voted');
        }, 500);

        // Remove click handlers
        this.pollOptions.forEach(opt => {
            opt.style.cursor = 'default';
            opt.onclick = null;
        });
    }

    loadVotes() {
        const votes = JSON.parse(localStorage.getItem('pollVotes') || '{"charley": 0, "garry": 0}');
        return votes;
    }

    showResults() {
        const votes = this.loadVotes();
        const total = votes.charley + votes.garry;

        this.pollOptions.forEach(option => {
            const vote = option.dataset.vote;
            const count = votes[vote];
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            const fillBar = option.querySelector('.poll-fill');
            const percentageSpan = option.querySelector('.poll-percentage');
            const votesSpan = option.querySelector('.poll-votes');

            // Animate the bar
            setTimeout(() => {
                fillBar.style.width = percentage + '%';
                fillBar.dataset.percent = percentage;
            }, 100);

            percentageSpan.textContent = percentage + '%';
            votesSpan.textContent = count + (count === 1 ? ' vote' : ' votes');
            option.classList.add('voted');
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new MobileNav();
    new ArchiveTabs();
    new ContactForm();
    new SnakeGame();
    new RobotModal();
    new PollSystem();
    initPageTransitions();
});

// Add keyboard shortcut hints
console.log('%c🤖 Robot Wranglers Website', 'font-size: 20px; color: #95c8e3; font-weight: bold;');
console.log('%cTry typing "snake" to play a hidden game!', 'font-size: 14px; color: #0a2a4e;');
