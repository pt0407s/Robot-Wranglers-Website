// Hostinger Database Poll System
// Uses PHP backend to store votes in MySQL database

class HostingerPoll {
    constructor() {
        this.pollOptions = document.querySelectorAll('.poll-option');
        this.pollStatus = document.getElementById('pollStatus');
        this.apiUrl = 'https://robotwranglers.org/poll-api.php'; // Full URL for server
        this.pollName = 'charley-vs-garry';
        this.userVoteKey = 'userVotedCharleyVsGarry';
        this.init();
    }

    init() {
        if (this.pollOptions.length === 0) return;

        // Check if user has already voted
        const hasVoted = localStorage.getItem(this.userVoteKey);
        
        if (hasVoted) {
            this.disableVoting();
            this.pollStatus.textContent = `You voted for ${hasVoted === 'charley' ? 'Charley' : 'Garry'}! Thanks for participating!`;
            this.pollStatus.classList.add('voted');
        } else {
            // Enable voting
            this.pollOptions.forEach(option => {
                option.addEventListener('click', () => this.vote(option));
            });
        }

        // Load current vote counts
        this.loadVotes();
        
        // Refresh votes every 5 seconds
        setInterval(() => this.loadVotes(), 5000);
    }

    async vote(option) {
        const vote = option.dataset.vote;
        
        // Check if already voted
        if (localStorage.getItem(this.userVoteKey)) {
            this.pollStatus.textContent = 'You have already voted!';
            return;
        }

        // Animate selection
        option.classList.add('selected');
        
        try {
            // Send vote to server
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    poll: this.pollName,
                    option: vote
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit vote');
            }

            const data = await response.json();
            
            if (data.success) {
                // Save that user has voted
                localStorage.setItem(this.userVoteKey, vote);
                
                // Update display with new counts
                this.updateDisplay(data.votes);
                
                // Update status
                this.pollStatus.textContent = `You voted for ${vote === 'charley' ? 'Charley' : 'Garry'}! Thanks for participating!`;
                this.pollStatus.classList.add('voted');
                
                // Disable further voting
                this.disableVoting();
            }
        } catch (error) {
            console.error('Error voting:', error);
            this.pollStatus.textContent = 'Error submitting vote. Check console for details.';
            this.pollStatus.style.background = '#f44336';
            this.pollStatus.style.color = 'white';
            option.classList.remove('selected');
            
            // Log detailed error
            console.log('API URL:', this.apiUrl);
            console.log('Error details:', error);
        }
    }

    async loadVotes() {
        try {
            const response = await fetch(`${this.apiUrl}?poll=${this.pollName}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error('Failed to load votes: ' + response.status);
            }

            const votes = await response.json();
            console.log('Loaded votes:', votes);
            this.updateDisplay(votes);
        } catch (error) {
            console.error('Error loading votes:', error);
            console.log('API URL:', this.apiUrl);
            // Still try to show UI even if votes don't load
            this.updateDisplay({charley: 0, garry: 0});
        }
    }

    updateDisplay(votes) {
        const total = (votes.charley || 0) + (votes.garry || 0);

        this.pollOptions.forEach(option => {
            const vote = option.dataset.vote;
            const count = votes[vote] || 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            const fillBar = option.querySelector('.poll-fill');
            const percentageSpan = option.querySelector('.poll-percentage');
            const votesSpan = option.querySelector('.poll-votes');

            // Animate the bar
            fillBar.style.width = percentage + '%';
            fillBar.dataset.percent = percentage;

            percentageSpan.textContent = percentage + '%';
            votesSpan.textContent = count + (count === 1 ? ' vote' : ' votes');
            option.classList.add('voted');
        });

        // Update status if no votes yet
        if (total === 0 && !localStorage.getItem(this.userVoteKey)) {
            this.pollStatus.textContent = 'Be the first to vote!';
        }
    }

    disableVoting() {
        this.pollOptions.forEach(option => {
            option.style.cursor = 'default';
            option.onclick = null;
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HostingerPoll();
    });
} else {
    new HostingerPoll();
}
