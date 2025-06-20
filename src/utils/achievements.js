/**
 * Achievement System Module
 * Tracks user progress, awards points, and manages badges
 * Theme: Mathematical/Statistical achievements
 */

export class AchievementSystem {
  constructor() {
    this.achievements = {
      // Badge tiers: Bronze (100pts), Silver (500pts), Gold (1000pts), Platinum (5000pts), Diamond (10000pts)
      badges: [
        {
          id: 'apprentice',
          name: 'Number Apprentice',
          tier: 'bronze',
          points: 100,
          icon: '🔢',
          description: 'Begin your journey with numbers',
        },
        {
          id: 'calculator',
          name: 'Mean Calculator',
          tier: 'silver',
          points: 500,
          icon: '🧮',
          description: 'Master of averages',
        },
        {
          id: 'statistician',
          name: 'Stats Wizard',
          tier: 'gold',
          points: 1000,
          icon: '📊',
          description: 'Statistical prowess achieved',
        },
        {
          id: 'mathematician',
          name: 'Math Maestro',
          tier: 'platinum',
          points: 5000,
          icon: '🎯',
          description: 'Precision and accuracy combined',
        },
        {
          id: 'grandmaster',
          name: 'Grand Mean Master',
          tier: 'diamond',
          points: 10000,
          icon: '💎',
          description: 'Ultimate mastery of mathematics',
        },
      ],

      // Specific achievements
      milestones: [
        {
          id: 'first_calc',
          name: 'First Steps',
          points: 10,
          icon: '👶',
          description: 'Complete your first calculation',
        },
        {
          id: 'night_owl',
          name: 'Night Owl',
          points: 20,
          icon: '🦉',
          description: 'Use dark mode',
        },
        {
          id: 'speed_demon',
          name: 'Speed Demon',
          points: 30,
          icon: '⚡',
          description: 'Calculate in under 2 seconds',
        },
        {
          id: 'perfectionist',
          name: 'Perfectionist',
          points: 50,
          icon: '✨',
          description: 'Enter exactly 10 numbers',
        },
        {
          id: 'mind_reader',
          name: 'Mind Reader',
          points: 100,
          icon: '🔮',
          description: 'Guess a value exactly correct',
        },
        {
          id: 'close_call',
          name: 'Close Call',
          points: 50,
          icon: '🎪',
          description: 'Guess within 10% of correct value',
        },
        {
          id: 'konami_master',
          name: 'Secret Keeper',
          points: 200,
          icon: '🎮',
          description: 'Discover the secret code',
        },
      ],
    };

    this.userProgress = this.loadProgress();
    this.pointRules = {
      customGeneration: {
        base: 10,
        perNumber: 2,
        maxBonus: 20,
      },
      randomGeneration: {
        base: 5,
        perNumber: 1,
        maxBonus: 10,
      },
      guessing: {
        exact: 100,
        within10Percent: 50,
        within20Percent: 25,
        attempt: 5,
      },
    };

    this.init();
  }

  init() {
    // Load saved progress
    this.checkBadgeProgress();

    // Initialize toast container
    this.createToastContainer();

    // Load tier themes
    this.loadTierThemes();

    // Apply current tier theme
    this.applyCurrentTierTheme();
  }

  loadTierThemes() {
    // Load tier themes CSS if not already loaded
    if (!document.getElementById('tier-themes-css')) {
      const link = document.createElement('link');
      link.id = 'tier-themes-css';
      link.rel = 'stylesheet';
      link.href = '/src/styles/tier-themes.css';
      document.head.appendChild(link);
    }
  }

  applyCurrentTierTheme() {
    // Remove all existing tier classes
    document.body.classList.remove(
      'tier-bronze',
      'tier-silver',
      'tier-gold',
      'tier-platinum',
      'tier-diamond'
    );

    // Apply current tier theme
    const currentTier = this.userProgress.currentBadgeTier;
    if (currentTier) {
      document.body.classList.add(`tier-${currentTier}`);
    }
    
    // Update tier display
    this.updateTierDisplay();
  }
  
  updateTierDisplay() {
    const tierDisplay = document.getElementById('tier-display');
    const tierIcon = document.getElementById('tier-icon');
    const tierName = document.getElementById('tier-name');
    
    if (!tierDisplay || !tierIcon || !tierName) return;
    
    const currentTier = this.userProgress.currentBadgeTier;
    
    if (currentTier) {
      // Get badge info for current tier
      const currentBadge = this.achievements.badges.find(badge => badge.tier === currentTier);
      
      if (currentBadge) {
        tierIcon.textContent = currentBadge.icon;
        tierName.textContent = currentTier;
        
        // Apply tier-specific styling to the display
        tierDisplay.className = `absolute top-6 left-6 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 tier-display-${currentTier}`;
        
        // Show the display
        tierDisplay.classList.remove('hidden');
      }
    } else {
      // Hide if no tier
      tierDisplay.classList.add('hidden');
    }
  }

  loadProgress() {
    const saved = localStorage.getItem('meanMachineAchievements');
    return saved
      ? JSON.parse(saved)
      : {
          totalPoints: 0,
          unlockedBadges: [],
          unlockedMilestones: [],
          statistics: {
            totalCalculations: 0,
            customCalculations: 0,
            randomCalculations: 0,
            perfectGuesses: 0,
            closeGuesses: 0,
            totalGuesses: 0,
          },
          currentBadgeTier: null,
        };
  }

  saveProgress() {
    localStorage.setItem(
      'meanMachineAchievements',
      JSON.stringify(this.userProgress)
    );
  }

  calculatePoints(type, options = {}) {
    let points = 0;

    switch (type) {
      case 'custom':
        points = this.pointRules.customGeneration.base;
        points += Math.min(
          options.numberCount * this.pointRules.customGeneration.perNumber,
          this.pointRules.customGeneration.maxBonus
        );
        break;

      case 'random':
        points = this.pointRules.randomGeneration.base;
        points += Math.min(
          options.numberCount * this.pointRules.randomGeneration.perNumber,
          this.pointRules.randomGeneration.maxBonus
        );
        break;

      case 'guess': {
        const { accuracy } = options;
        if (accuracy === 0) {
          points = this.pointRules.guessing.exact;
        } else if (accuracy <= 0.1) {
          points = this.pointRules.guessing.within10Percent;
        } else if (accuracy <= 0.2) {
          points = this.pointRules.guessing.within20Percent;
        } else {
          points = this.pointRules.guessing.attempt;
        }
        break;
      }
    }

    return points;
  }

  awardPoints(points, reason) {
    this.userProgress.totalPoints += points;
    this.saveProgress();

    // Show points notification
    this.showToast(`+${points} points`, reason, 'points');

    // Check for new badges
    this.checkBadgeProgress();
  }

  recordCalculation(type, numberCount, guessResults = null) {
    let totalPoints = 0;

    // Update statistics
    this.userProgress.statistics.totalCalculations++;

    if (type === 'custom') {
      this.userProgress.statistics.customCalculations++;
      totalPoints += this.calculatePoints('custom', { numberCount });
    } else {
      this.userProgress.statistics.randomCalculations++;
      totalPoints += this.calculatePoints('random', { numberCount });
    }

    // Check first calculation milestone
    if (this.userProgress.statistics.totalCalculations === 1) {
      this.unlockMilestone('first_calc');
    }

    // Check perfectionist milestone
    if (
      numberCount === 10 &&
      !this.userProgress.unlockedMilestones.includes('perfectionist')
    ) {
      this.unlockMilestone('perfectionist');
    }

    // Process guess results if provided
    if (guessResults) {
      this.userProgress.statistics.totalGuesses++;

      for (const result of guessResults) {
        const points = this.calculatePoints('guess', {
          accuracy: result.accuracy,
        });
        totalPoints += points;

        if (result.accuracy === 0) {
          this.userProgress.statistics.perfectGuesses++;
          if (!this.userProgress.unlockedMilestones.includes('mind_reader')) {
            this.unlockMilestone('mind_reader');
          }
        } else if (result.accuracy <= 0.1) {
          this.userProgress.statistics.closeGuesses++;
          if (!this.userProgress.unlockedMilestones.includes('close_call')) {
            this.unlockMilestone('close_call');
          }
        }
      }
    }

    // Award total points
    this.awardPoints(
      totalPoints,
      `${type} calculation${guessResults ? ' with guessing' : ''}`
    );

    this.saveProgress();
  }

  unlockMilestone(milestoneId) {
    const milestone = this.achievements.milestones.find(
      m => m.id === milestoneId
    );
    if (
      !milestone ||
      this.userProgress.unlockedMilestones.includes(milestoneId)
    )
      return;

    this.userProgress.unlockedMilestones.push(milestoneId);
    this.userProgress.totalPoints += milestone.points;
    this.saveProgress();

    // Show achievement notification
    this.showAchievementNotification(milestone);
  }

  checkBadgeProgress() {
    const currentPoints = this.userProgress.totalPoints;
    const badges = this.achievements.badges;
    const previousTier = this.userProgress.currentBadgeTier;

    for (let i = badges.length - 1; i >= 0; i--) {
      const badge = badges[i];
      if (
        currentPoints >= badge.points &&
        !this.userProgress.unlockedBadges.includes(badge.id)
      ) {
        this.unlockBadge(badge);
        break;
      }
    }

    // Update current tier
    let newTier = null;
    for (let i = badges.length - 1; i >= 0; i--) {
      if (currentPoints >= badges[i].points) {
        newTier = badges[i].tier;
        break;
      }
    }

    // Check for tier upgrade
    if (newTier && newTier !== previousTier) {
      this.userProgress.currentBadgeTier = newTier;
      this.applyTierUpgrade(newTier);
    }
  }

  applyTierUpgrade(newTier) {
    // Apply tier transition animation
    document.body.classList.add('tier-transition');

    // Remove old tier and apply new tier
    document.body.classList.remove(
      'tier-bronze',
      'tier-silver',
      'tier-gold',
      'tier-platinum',
      'tier-diamond'
    );
    document.body.classList.add(`tier-${newTier}`);
    
    // Update tier display
    this.updateTierDisplay();

    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('tier-transition');
    }, 1000);
  }

  unlockBadge(badge) {
    this.userProgress.unlockedBadges.push(badge.id);
    this.saveProgress();

    // Special celebration for max tier
    if (badge.tier === 'diamond') {
      this.showSpecialPrize();
    }

    this.showBadgeNotification(badge);
  }

  showSpecialPrize() {
    // Create special prize modal
    const modal = document.createElement('div');
    modal.className = 'special-prize-modal';
    modal.innerHTML = `
      <div class="prize-content">
        <h2>🎉 CONGRATULATIONS! 🎉</h2>
        <div class="prize-badge">💎</div>
        <h3>Grand Mean Master</h3>
        <p>You've achieved the highest honor!</p>
        <div class="prize-rewards">
          <h4>Your Rewards:</h4>
          <ul>
            <li>🌟 Exclusive "Grand Master" title</li>
            <li>🎨 Unlock rainbow theme mode</li>
            <li>📊 Advanced statistics panel</li>
            <li>🚀 Priority calculation mode</li>
            <li>🏆 Hall of Fame entry</li>
          </ul>
        </div>
        <button class="claim-prize">Claim Your Prize!</button>
      </div>
    `;

    // Add special styles
    const style = document.createElement('style');
    style.textContent = `
      .special-prize-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.5s ease-out;
      }
      
      .prize-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 48px;
        border-radius: 24px;
        text-align: center;
        color: white;
        max-width: 500px;
        animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .prize-badge {
        font-size: 100px;
        margin: 24px 0;
        animation: rotate 2s linear infinite;
      }
      
      .prize-rewards {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
      }
      
      .prize-rewards ul {
        list-style: none;
        padding: 0;
        text-align: left;
      }
      
      .prize-rewards li {
        margin: 8px 0;
        font-size: 16px;
      }
      
      .claim-prize {
        background: white;
        color: #764ba2;
        border: none;
        padding: 16px 48px;
        border-radius: 50px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .claim-prize:hover {
        transform: scale(1.05);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Confetti effect
    this.triggerConfetti();

    // Claim button
    modal.querySelector('.claim-prize').addEventListener('click', () => {
      this.enableSpecialFeatures();
      modal.remove();
      style.remove();
    });
  }

  enableSpecialFeatures() {
    // Add rainbow theme
    document.body.classList.add('rainbow-theme');

    // Store special features unlock
    localStorage.setItem('meanMachineSpecialFeatures', 'true');

    // Show confirmation
    this.showToast(
      'Special features unlocked!',
      'Enjoy your exclusive rewards',
      'special'
    );
  }

  createToastContainer() {
    if (!document.getElementById('achievement-toasts')) {
      const container = document.createElement('div');
      container.id = 'achievement-toasts';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
      `;
      document.body.appendChild(container);
    }
  }

  showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `achievement-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
    `;

    // Add styles if not already present
    if (!document.getElementById('achievement-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'achievement-toast-styles';
      style.textContent = `
        .achievement-toast {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 250px;
          animation: slideIn 0.3s ease-out, slideOut 0.3s ease-in 3s forwards;
        }
        
        .achievement-toast.toast-points {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        
        .achievement-toast.toast-achievement {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }
        
        .achievement-toast.toast-badge {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }
        
        .achievement-toast.toast-special {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }
        
        .toast-title {
          font-weight: bold;
          font-size: 16px;
        }
        
        .toast-message {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 4px;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const container = document.getElementById('achievement-toasts');
    container.appendChild(toast);

    // Remove after animation
    setTimeout(() => toast.remove(), 3500);
  }

  showAchievementNotification(achievement) {
    this.showToast(
      `${achievement.icon} ${achievement.name}`,
      achievement.description,
      'achievement'
    );
  }

  showBadgeNotification(badge) {
    this.showToast(
      `${badge.icon} New Badge: ${badge.name}`,
      `${badge.tier.toUpperCase()} tier unlocked!`,
      'badge'
    );
  }

  triggerConfetti() {
    // Create confetti particles
    const confettiCount = 100;
    const colors = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#ec4899',
    ];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-particle';
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: 1;
        transform: rotate(${Math.random() * 360}deg);
        animation: confettiFall ${2 + Math.random() * 2}s ease-out forwards;
      `;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 4000);
    }

    // Add animation if not present
    if (!document.getElementById('confetti-animation')) {
      const style = document.createElement('style');
      style.id = 'confetti-animation';
      style.textContent = `
        @keyframes confettiFall {
          to {
            top: 100vh;
            transform: rotate(${Math.random() * 720}deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  getProgress() {
    return this.userProgress;
  }

  getNextBadge() {
    const currentPoints = this.userProgress.totalPoints;
    for (const badge of this.achievements.badges) {
      if (currentPoints < badge.points) {
        return {
          badge,
          pointsNeeded: badge.points - currentPoints,
          progress: (currentPoints / badge.points) * 100,
        };
      }
    }
    return null;
  }
}

// Export singleton instance
export const achievementSystem = new AchievementSystem();

// Console command for achievements
window.achievements = () => {
  const progress = achievementSystem.getProgress();
  const nextBadge = achievementSystem.getNextBadge();

  console.log(
    '%c🏆 Achievement Progress',
    'color: #f59e0b; font-size: 16px; font-weight: bold;'
  );
  console.log(`Total Points: ${progress.totalPoints}`);
  console.log(`Current Tier: ${progress.currentBadgeTier || 'None'}`);
  console.log(`Calculations: ${progress.statistics.totalCalculations}`);
  console.log(`Perfect Guesses: ${progress.statistics.perfectGuesses}`);
  console.log('\n%c📊 Statistics', 'color: #3b82f6; font-weight: bold;');
  console.table(progress.statistics);

  if (nextBadge) {
    console.log('\n%c🎯 Next Badge', 'color: #10b981; font-weight: bold;');
    console.log(
      `${nextBadge.badge.icon} ${nextBadge.badge.name} (${nextBadge.badge.tier})`
    );
    console.log(
      `Progress: ${nextBadge.progress.toFixed(1)}% (${nextBadge.pointsNeeded} points needed)`
    );
  }

  console.log('\n%c🏅 Unlocked Badges', 'color: #8b5cf6; font-weight: bold;');
  progress.unlockedBadges.forEach(id => {
    const badge = achievementSystem.achievements.badges.find(b => b.id === id);
    console.log(`${badge.icon} ${badge.name}`);
  });
};
