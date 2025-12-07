/**
 * ECHO FORTUNY - Mystical Card Collection Game
 * =============================================
 * A unique, engaging game based on randomness with:
 * - Character progression and story
 * - Near-win mechanics for engagement
 * - Transparent probability system
 * - Lead generation capabilities
 */

// =============================================
// GAME CONFIGURATION
// =============================================

const CONFIG = {
    // Energy system
    startingEnergy: 5,
    maxEnergy: 10,
    energyRegenTime: 300000, // 5 minutes in ms
    
    // Rarity probabilities (transparent!)
    rarityChances: {
        common: 0.60,      // 60%
        rare: 0.25,        // 25%
        epic: 0.12,        // 12%
        legendary: 0.03    // 3%
    },
    
    // Lucky charm bonus
    luckyCharmBonus: 0.10, // +10% to rare+ chances
    
    // XP per card rarity
    xpRewards: {
        common: 10,
        rare: 30,
        epic: 75,
        legendary: 200
    },
    
    // Souls per card rarity
    soulRewards: {
        common: 5,
        rare: 25,
        epic: 100,
        legendary: 500
    },
    
    // Level thresholds
    levelThresholds: [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6600, 8200, 10000],
    
    // Character titles by level
    characterTitles: [
        "Początkujący Zbieracz",
        "Uczeń Mistrzów",
        "Poszukiwacz Artefaktów",
        "Strażnik Tajemnic",
        "Mistrz Kart",
        "Władca Fortuny",
        "Arcymistrz",
        "Legendarny Zbieracz",
        "Strażnik Przeznaczenia",
        "Echo Wieczności",
        "Boski Kolekcjoner",
        "Władca Losu",
        "Transcendentny"
    ],
    
    // Character avatars by level
    characterAvatars: ["🧙", "🧙‍♂️", "🧝", "🧝‍♂️", "🦹", "🦹‍♂️", "👑", "⚔️", "🏆", "💎", "🌟", "✨", "🔮"]
};

// =============================================
// CARD DATABASE
// =============================================

const CARDS = {
    common: [
        { id: 'c1', name: 'Kamienny Amulet', icon: '🪨', description: 'Prosty amulet z polnego kamienia.', power: 5 },
        { id: 'c2', name: 'Drewniana Różdżka', icon: '🪵', description: 'Podstawowe narzędzie każdego maga.', power: 8 },
        { id: 'c3', name: 'Stara Moneta', icon: '🪙', description: 'Znaleziona na starym szlaku.', power: 3 },
        { id: 'c4', name: 'Piórko Wrony', icon: '🪶', description: 'Przynosi drobne szczęście.', power: 6 },
        { id: 'c5', name: 'Mały Kryształ', icon: '💎', description: 'Migocze delikatnym światłem.', power: 7 },
        { id: 'c6', name: 'Srebrny Pierścień', icon: '💍', description: 'Zwykła biżuteria, ale elegancka.', power: 4 },
        { id: 'c7', name: 'Zaczarowana Herbata', icon: '🍵', description: 'Regeneruje niewielką ilość energii.', power: 5 },
        { id: 'c8', name: 'Stara Księga', icon: '📖', description: 'Zawiera podstawowe zaklęcia.', power: 9 },
        { id: 'c9', name: 'Świeca Ducha', icon: '🕯️', description: 'Płonie bez wosku.', power: 6 },
        { id: 'c10', name: 'Mapa Skarbów', icon: '🗺️', description: 'Prowadzi do zwykłego miejsca.', power: 4 }
    ],
    rare: [
        { id: 'r1', name: 'Miecz Przeznaczenia', icon: '⚔️', description: 'Wykuty w ogniu przeznaczenia.', power: 25 },
        { id: 'r2', name: 'Tarcza Strażnika', icon: '🛡️', description: 'Chroni przed złymi mocami.', power: 30 },
        { id: 'r3', name: 'Magiczny Grimuar', icon: '📕', description: 'Zawiera zaawansowane zaklęcia.', power: 35 },
        { id: 'r4', name: 'Kryształowa Kula', icon: '🔮', description: 'Pokazuje przyszłość.', power: 40 },
        { id: 'r5', name: 'Elficki Łuk', icon: '🏹', description: 'Nigdy nie chybia celu.', power: 28 },
        { id: 'r6', name: 'Amulet Mocy', icon: '📿', description: 'Zwiększa magiczną moc.', power: 32 },
        { id: 'r7', name: 'Płaszcz Niewidzialności', icon: '🧥', description: 'Ukrywa przed wrogami.', power: 38 },
        { id: 'r8', name: 'Magiczny Kompas', icon: '🧭', description: 'Prowadzi do skarbów.', power: 22 }
    ],
    epic: [
        { id: 'e1', name: 'Smocza Zbroja', icon: '🐉', description: 'Wykuta z łusek starożytnego smoka.', power: 80 },
        { id: 'e2', name: 'Korona Królów', icon: '👑', description: 'Noszona przez legendy.', power: 90 },
        { id: 'e3', name: 'Różdżka Arcymaga', icon: '🪄', description: 'Kanalizuje najsilniejszą magię.', power: 85 },
        { id: 'e4', name: 'Serce Feniksa', icon: '❤️‍🔥', description: 'Daje drugie życie.', power: 95 },
        { id: 'e5', name: 'Oko Widma', icon: '👁️', description: 'Widzi przez wszystkie iluzje.', power: 75 },
        { id: 'e6', name: 'Klepsydra Czasu', icon: '⏳', description: 'Spowalnia czas.', power: 88 }
    ],
    legendary: [
        { id: 'l1', name: 'Excalibur', icon: '🗡️', description: 'Legendarny miecz króla Artura. Tylko wybrany może go dzierżyć.', power: 200 },
        { id: 'l2', name: 'Święty Graal', icon: '🏆', description: 'Daje nieśmiertelność temu, kto go posiada.', power: 250 },
        { id: 'l3', name: 'Kamień Filozoficzny', icon: '💠', description: 'Zamienia wszystko w złoto i daje wieczne życie.', power: 230 },
        { id: 'l4', name: 'Berło Bogów', icon: '⚡', description: 'Władza nad żywiołami. Dar od samych bogów.', power: 280 },
        { id: 'l5', name: 'Księga Losu', icon: '📜', description: 'Zawiera przeznaczenie wszystkich istot. Kto ją czyta, widzi przyszłość.', power: 300 }
    ]
};

// =============================================
// GAME STATE
// =============================================

let gameState = {
    // Player info
    playerName: 'Wędrowiec',
    playerEmail: '',
    
    // Resources
    souls: 0,
    energy: CONFIG.startingEnergy,
    maxEnergy: CONFIG.startingEnergy,
    
    // Progression
    level: 1,
    xp: 0,
    xpToNextLevel: CONFIG.levelThresholds[1],
    
    // Collection
    collection: [],
    totalCardsDrawn: 0,
    
    // Stats
    commonCount: 0,
    rareCount: 0,
    epicCount: 0,
    legendaryCount: 0,
    
    // Bonuses
    streak: 0,
    lastPlayDate: null,
    luckyCharmActive: false,
    luckyCharmEndTime: null,
    guaranteedLegendary: false,
    
    // Timers
    lastEnergyRegen: Date.now(),
    
    // Near-win tracking
    nearWinCount: 0,
    lastNearWin: null,
    
    // Achievements & Goals
    achievements: {
        firstCard: false,
        tenCards: false,
        allCommon: false,
        allRare: false,
        firstLegendary: false,
        allLegendary: false,  // MAIN WIN CONDITION
        masterCollector: false,
        level5: false,
        level10: false,
        maxLevel: false
    },
    gameCompleted: false
};

// =============================================
// WIN CONDITIONS & ACHIEVEMENTS
// =============================================

const ACHIEVEMENTS = {
    firstCard: {
        id: 'firstCard',
        name: 'Pierwszy Krok',
        description: 'Wylosuj swoją pierwszą kartę',
        icon: '🃏',
        reward: { souls: 50 },
        check: (state) => state.totalCardsDrawn >= 1
    },
    tenCards: {
        id: 'tenCards',
        name: 'Kolekcjoner',
        description: 'Wylosuj 10 kart',
        icon: '📚',
        reward: { souls: 200, energy: 3 },
        check: (state) => state.totalCardsDrawn >= 10
    },
    allCommon: {
        id: 'allCommon',
        name: 'Komplet Podstawowy',
        description: 'Zdobądź wszystkie 10 powszechnych kart',
        icon: '⬜',
        reward: { souls: 500 },
        check: (state) => {
            const commonIds = CARDS.common.map(c => c.id);
            const ownedCommon = state.collection.filter(c => c.rarity === 'common').map(c => c.id);
            return commonIds.every(id => ownedCommon.includes(id));
        }
    },
    allRare: {
        id: 'allRare',
        name: 'Łowca Rzadkości',
        description: 'Zdobądź wszystkie 8 rzadkich kart',
        icon: '🔵',
        reward: { souls: 1000, energy: 5 },
        check: (state) => {
            const rareIds = CARDS.rare.map(c => c.id);
            const ownedRare = state.collection.filter(c => c.rarity === 'rare').map(c => c.id);
            return rareIds.every(id => ownedRare.includes(id));
        }
    },
    firstLegendary: {
        id: 'firstLegendary',
        name: 'Dotknięcie Legendy',
        description: 'Zdobądź swoją pierwszą legendarną kartę',
        icon: '⭐',
        reward: { souls: 500 },
        check: (state) => state.legendaryCount >= 1
    },
    allLegendary: {
        id: 'allLegendary',
        name: '🏆 MISTRZ FORTUNY 🏆',
        description: 'Zdobądź wszystkie 5 legendarnych kart - WYGRANA!',
        icon: '👑',
        reward: { souls: 10000 },
        isWinCondition: true,
        check: (state) => {
            const legendaryIds = CARDS.legendary.map(c => c.id);
            const ownedLegendary = state.collection.filter(c => c.rarity === 'legendary').map(c => c.id);
            return legendaryIds.every(id => ownedLegendary.includes(id));
        }
    },
    masterCollector: {
        id: 'masterCollector',
        name: 'Arcykolekcjoner',
        description: 'Zdobądź wszystkie 29 kart w grze',
        icon: '🎖️',
        reward: { souls: 5000 },
        check: (state) => {
            const totalCards = CARDS.common.length + CARDS.rare.length + CARDS.epic.length + CARDS.legendary.length;
            const uniqueOwned = new Set(state.collection.map(c => c.id)).size;
            return uniqueOwned >= totalCards;
        }
    },
    level5: {
        id: 'level5',
        name: 'Adept',
        description: 'Osiągnij poziom 5',
        icon: '📈',
        reward: { souls: 300, energy: 2 },
        check: (state) => state.level >= 5
    },
    level10: {
        id: 'level10',
        name: 'Mistrz',
        description: 'Osiągnij poziom 10',
        icon: '🎓',
        reward: { souls: 1000, energy: 5 },
        check: (state) => state.level >= 10
    },
    maxLevel: {
        id: 'maxLevel',
        name: 'Transcendencja',
        description: 'Osiągnij maksymalny poziom 13',
        icon: '🌟',
        reward: { souls: 3000 },
        check: (state) => state.level >= 13
    }
};

function checkAchievements() {
    let newAchievements = [];
    
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (!gameState.achievements[key] && achievement.check(gameState)) {
            gameState.achievements[key] = true;
            newAchievements.push(achievement);
            
            // Apply rewards
            if (achievement.reward.souls) {
                gameState.souls += achievement.reward.souls;
            }
            if (achievement.reward.energy) {
                gameState.energy = Math.min(gameState.energy + achievement.reward.energy, gameState.maxEnergy + 10);
            }
            
            // Check for win condition
            if (achievement.isWinCondition) {
                gameState.gameCompleted = true;
            }
        }
    }
    
    if (newAchievements.length > 0) {
        saveGame();
        updateUI();
        
        // Show achievement notification(s)
        newAchievements.forEach((achievement, index) => {
            setTimeout(() => {
                showAchievementUnlock(achievement);
            }, index * 1500);
        });
    }
}

function showAchievementUnlock(achievement) {
    if (achievement.isWinCondition) {
        showVictoryScreen();
    } else {
        showToast(`🏆 ${achievement.name}: ${achievement.description}`, 'success');
    }
}

function showVictoryScreen() {
    // Create victory modal
    const victoryHTML = `
        <div class="modal-overlay active" id="victory-modal" style="z-index: 9999;">
            <div class="modal victory-modal">
                <div class="victory-particles"></div>
                <div class="modal-icon">👑</div>
                <h2>🎉 ZWYCIĘSTWO! 🎉</h2>
                <p class="victory-text">
                    Zebrałeś wszystkie 5 legendarnych kart!<br>
                    Jesteś prawdziwym <strong>MISTRZEM FORTUNY</strong>!
                </p>
                <div class="victory-stats">
                    <div class="victory-stat">
                        <span class="stat-number">${gameState.totalCardsDrawn}</span>
                        <span class="stat-label">Losowań</span>
                    </div>
                    <div class="victory-stat">
                        <span class="stat-number">${gameState.collection.length}</span>
                        <span class="stat-label">Kart</span>
                    </div>
                    <div class="victory-stat">
                        <span class="stat-number">${gameState.level}</span>
                        <span class="stat-label">Poziom</span>
                    </div>
                </div>
                <p class="victory-reward">Nagroda: +10,000 🔮</p>
                <button class="modal-btn primary" onclick="closeVictoryModal()">Kontynuuj Grę</button>
                <button class="modal-btn secondary" onclick="shareVictory()">Podziel się!</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', victoryHTML);
    
    // Add confetti effect
    createVictoryParticles();
}

function closeVictoryModal() {
    const modal = document.getElementById('victory-modal');
    if (modal) modal.remove();
}

function shareVictory() {
    const text = `🏆 Zostałem MISTRZEM FORTUNY w Echo Fortuny! Zebrałem wszystkie legendarne karty po ${gameState.totalCardsDrawn} losowaniach! Spróbuj pobić mój wynik!`;
    
    if (navigator.share) {
        navigator.share({ title: 'Echo Fortuny - Zwycięstwo!', text: text });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        showToast('Skopiowano do schowka!', 'success');
    }
}

function createVictoryParticles() {
    const container = document.querySelector('.victory-particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'victory-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.background = ['#ffd700', '#ff6b35', '#a855f7', '#3b82f6'][Math.floor(Math.random() * 4)];
        container.appendChild(particle);
    }
}

function getProgress() {
    const legendaryIds = CARDS.legendary.map(c => c.id);
    const ownedLegendary = gameState.collection.filter(c => c.rarity === 'legendary').map(c => c.id);
    const collected = legendaryIds.filter(id => ownedLegendary.includes(id)).length;
    return {
        collected,
        total: legendaryIds.length,
        percent: Math.round((collected / legendaryIds.length) * 100),
        remaining: legendaryIds.filter(id => !ownedLegendary.includes(id))
    };
}

// =============================================
// DOM ELEMENTS
// =============================================

const DOM = {
    // Screens
    loadingScreen: document.getElementById('loading-screen'),
    gameContainer: document.getElementById('game-container'),
    
    // Stats
    soulsValue: document.getElementById('souls-value'),
    levelValue: document.getElementById('level-value'),
    energyValue: document.getElementById('energy-value'),
    
    // Character
    characterAvatar: document.getElementById('character-avatar'),
    avatarLevel: document.getElementById('avatar-level'),
    characterName: document.getElementById('character-name'),
    characterTitle: document.getElementById('character-title'),
    xpFill: document.getElementById('xp-fill'),
    xpText: document.getElementById('xp-text'),
    
    // Draw
    drawBtn: document.getElementById('draw-btn'),
    draw3Btn: document.getElementById('draw-3-btn'),
    draw10Btn: document.getElementById('draw-10-btn'),
    cardDeck: document.getElementById('card-deck'),
    
    // Card reveal
    cardRevealOverlay: document.getElementById('card-reveal-overlay'),
    cardWrapper: document.getElementById('card-wrapper'),
    revealedCard: document.getElementById('revealed-card'),
    cardFront: document.querySelector('.card-front'),
    cardImage: document.getElementById('card-image'),
    cardName: document.getElementById('card-name'),
    cardRarity: document.getElementById('card-rarity'),
    cardDescription: document.getElementById('card-description'),
    cardPower: document.getElementById('card-power'),
    cardSouls: document.getElementById('card-souls'),
    nearWinIndicator: document.getElementById('near-win-indicator'),
    continueBtn: document.getElementById('continue-btn'),
    
    // Collection
    commonCount: document.getElementById('common-count'),
    rareCount: document.getElementById('rare-count'),
    epicCount: document.getElementById('epic-count'),
    legendaryCount: document.getElementById('legendary-count'),
    viewCollectionBtn: document.getElementById('view-collection-btn'),
    collectionGrid: document.getElementById('collection-grid'),
    collectionEmpty: document.getElementById('collection-empty'),
    
    // Modals
    welcomeModal: document.getElementById('welcome-modal'),
    dailyModal: document.getElementById('daily-modal'),
    collectionModal: document.getElementById('collection-modal'),
    rankingModal: document.getElementById('ranking-modal'),
    shopModal: document.getElementById('shop-modal'),
    levelupModal: document.getElementById('levelup-modal'),
    noEnergyModal: document.getElementById('no-energy-modal'),
    
    // Modal elements
    playerNameInput: document.getElementById('player-name-input'),
    playerEmailInput: document.getElementById('player-email-input'),
    startBtn: document.getElementById('start-btn'),
    streakValue: document.getElementById('streak-value'),
    claimDailyBtn: document.getElementById('claim-daily-btn'),
    rankingList: document.getElementById('ranking-list'),
    energyTimer: document.getElementById('energy-timer'),
    newLevel: document.getElementById('new-level'),
    newTitle: document.getElementById('new-title'),
    
    // Footer
    shopBtn: document.getElementById('shop-btn'),
    dailyBtn: document.getElementById('daily-btn'),
    rankingBtn: document.getElementById('ranking-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    dailyNotification: document.getElementById('daily-notification')
};

// =============================================
// FAKE LEADERBOARD DATA
// =============================================

const leaderboardData = {
    souls: [
        { name: 'MistrzFortunny', value: 15420 },
        { name: 'KolekcjonerX', value: 12300 },
        { name: 'CzarnoksiężnikPL', value: 9850 },
        { name: 'MagicznyWędrowiec', value: 7620 },
        { name: 'ŁowcaLegend', value: 6100 },
        { name: 'ArtefaktMaster', value: 4890 },
        { name: 'SzczęściarzeWieków', value: 3200 },
        { name: 'StarożytnyMag', value: 2100 }
    ],
    legendary: [
        { name: 'ŁowcaLegend', value: 8 },
        { name: 'KolekcjonerX', value: 6 },
        { name: 'MistrzFortunny', value: 5 },
        { name: 'CzarnoksiężnikPL', value: 4 },
        { name: 'MagicznyWędrowiec', value: 3 },
        { name: 'ArtefaktMaster', value: 2 },
        { name: 'SzczęściarzeWieków', value: 1 },
        { name: 'StarożytnyMag', value: 1 }
    ],
    collection: [
        { name: 'KolekcjonerX', value: 28 },
        { name: 'MistrzFortunny', value: 25 },
        { name: 'ŁowcaLegend', value: 22 },
        { name: 'CzarnoksiężnikPL', value: 19 },
        { name: 'MagicznyWędrowiec', value: 16 },
        { name: 'ArtefaktMaster', value: 14 },
        { name: 'SzczęściarzeWieków', value: 11 },
        { name: 'StarożytnyMag', value: 8 }
    ]
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

function saveGame() {
    localStorage.setItem('echoFortunySave', JSON.stringify(gameState));
}

function loadGame() {
    try {
        const saved = localStorage.getItem('echoFortunySave');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validate critical fields
            if (typeof parsed.energy !== 'number' || typeof parsed.level !== 'number') {
                console.warn('Invalid save data, starting fresh');
                return false;
            }
            gameState = { ...gameState, ...parsed };
            return true;
        }
        return false;
    } catch (e) {
        console.error('Failed to load save:', e);
        localStorage.removeItem('echoFortunySave');
        return false;
    }
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =============================================
// CARD DRAW SYSTEM
// =============================================

function determineRarity() {
    // Check for guaranteed legendary
    if (gameState.guaranteedLegendary) {
        gameState.guaranteedLegendary = false;
        saveGame();
        return 'legendary';
    }
    
    let chances = { ...CONFIG.rarityChances };
    
    // Apply lucky charm bonus
    if (gameState.luckyCharmActive && gameState.luckyCharmEndTime > Date.now()) {
        chances.rare += CONFIG.luckyCharmBonus / 3;
        chances.epic += CONFIG.luckyCharmBonus / 3;
        chances.legendary += CONFIG.luckyCharmBonus / 3;
        chances.common -= CONFIG.luckyCharmBonus;
    } else if (gameState.luckyCharmActive) {
        gameState.luckyCharmActive = false;
    }
    
    const roll = Math.random();
    let cumulative = 0;
    
    // Check legendary first (rarest)
    cumulative += chances.legendary;
    if (roll < cumulative) return 'legendary';
    
    // Check epic
    cumulative += chances.epic;
    if (roll < cumulative) return 'epic';
    
    // Check rare
    cumulative += chances.rare;
    if (roll < cumulative) return 'rare';
    
    // Default to common
    return 'common';
}

function getRandomCard(rarity) {
    const cards = CARDS[rarity];
    const randomIndex = Math.floor(Math.random() * cards.length);
    return { ...cards[randomIndex], rarity };
}

function checkNearWin(rarity) {
    // Near-win occurs when:
    // 1. Got common but was close to rare (roll was near threshold)
    // 2. Got rare but was close to epic
    // 3. Got epic but was close to legendary
    
    if (rarity === 'legendary') return { isNearWin: false };
    
    const roll = Math.random();
    
    // 15% chance to show near-win for engagement
    if (roll < 0.15) {
        const nearWinRarity = rarity === 'common' ? 'rare' : 
                             rarity === 'rare' ? 'epic' : 'legendary';
        
        gameState.nearWinCount++;
        gameState.lastNearWin = Date.now();
        saveGame();
        
        return { isNearWin: true, missedRarity: nearWinRarity };
    }
    
    return { isNearWin: false };
}

let isDrawing = false; // Prevent double-click

function drawCard() {
    if (isDrawing) return; // Prevent double-click
    if (gameState.energy <= 0) {
        showNoEnergyModal();
        return;
    }
    
    isDrawing = true;
    gameState.energy--;
    gameState.totalCardsDrawn++;
    updateUI();
    
    const rarity = determineRarity();
    const card = getRandomCard(rarity);
    const nearWin = checkNearWin(rarity);
    
    // Add to collection
    const existingCard = gameState.collection.find(c => c.id === card.id);
    if (!existingCard) {
        gameState.collection.push({ ...card, count: 1 });
    } else {
        existingCard.count++;
    }
    
    // Update stats
    gameState[`${rarity}Count`]++;
    gameState.souls += CONFIG.soulRewards[rarity];
    addXP(CONFIG.xpRewards[rarity]);
    
    saveGame();
    
    // Show card reveal
    revealCard(card, nearWin);
    
    // Check for achievements after a delay (after card reveal)
    setTimeout(() => checkAchievements(), 2500);
}

function drawMultiple(count) {
    if (gameState.energy < count) {
        showNoEnergyModal();
        return;
    }
    
    // For 10-draw, guarantee at least one rare
    let guaranteedRare = count === 10;
    let drawnCards = [];
    
    for (let i = 0; i < count; i++) {
        gameState.energy--;
        gameState.totalCardsDrawn++;
        
        let rarity;
        if (guaranteedRare && i === count - 1) {
            // Last card guaranteed rare or better
            const roll = Math.random();
            if (roll < 0.1) rarity = 'legendary';
            else if (roll < 0.4) rarity = 'epic';
            else rarity = 'rare';
            guaranteedRare = false;
        } else {
            rarity = determineRarity();
            if (rarity !== 'common') guaranteedRare = false;
        }
        
        const card = getRandomCard(rarity);
        drawnCards.push(card);
        
        // Add to collection
        const existingCard = gameState.collection.find(c => c.id === card.id);
        if (!existingCard) {
            gameState.collection.push({ ...card, count: 1 });
        } else {
            existingCard.count++;
        }
        
        // Update stats
        gameState[`${rarity}Count`]++;
        gameState.souls += CONFIG.soulRewards[rarity];
        addXP(CONFIG.xpRewards[rarity]);
    }
    
    saveGame();
    updateUI();
    
    // Show best card from the draw
    const bestCard = drawnCards.reduce((best, card) => {
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
        return rarityOrder[card.rarity] > rarityOrder[best.rarity] ? card : best;
    });
    
    const nearWin = checkNearWin(bestCard.rarity);
    revealCard(bestCard, nearWin, drawnCards.length);
    
    // Check for achievements after a delay (after card reveal)
    setTimeout(() => checkAchievements(), 2500);
}

// =============================================
// CARD REVEAL ANIMATION
// =============================================

function revealCard(card, nearWin, totalCards = 1) {
    const overlay = DOM.cardRevealOverlay;
    const cardEl = DOM.revealedCard;
    const cardFront = cardEl.querySelector('.card-front');
    
    // Reset card state
    cardEl.classList.remove('flipped');
    DOM.continueBtn.classList.remove('show');
    DOM.nearWinIndicator.classList.remove('show');
    
    // Set card data
    DOM.cardImage.textContent = card.icon;
    DOM.cardName.textContent = card.name;
    DOM.cardRarity.textContent = card.rarity.toUpperCase();
    DOM.cardDescription.textContent = card.description;
    DOM.cardPower.textContent = `+${card.power} Mocy`;
    DOM.cardSouls.textContent = `+${CONFIG.soulRewards[card.rarity]} Dusz`;
    
    // Set rarity class
    cardFront.className = 'card-front ' + card.rarity;
    
    // Show overlay
    overlay.classList.add('active');
    
    // Deck animation
    DOM.cardDeck.style.transform = 'scale(0.95)';
    setTimeout(() => {
        DOM.cardDeck.style.transform = '';
    }, 200);
    
    // Card flip animation with anticipation
    setTimeout(() => {
        // Add anticipation shake for higher rarities
        if (card.rarity === 'legendary') {
            cardEl.style.animation = 'legendaryShake 0.8s ease-in-out';
        } else if (card.rarity === 'epic') {
            cardEl.style.animation = 'epicShake 0.5s ease-in-out';
        }
        
        setTimeout(() => {
            cardEl.style.animation = '';
            cardEl.classList.add('flipped');
            
            // Play sound effect based on rarity (visual feedback)
            if (card.rarity === 'legendary') {
                createLegendaryParticles();
            } else if (card.rarity === 'epic') {
                createEpicParticles();
            }
            
            // Show near-win indicator
            if (nearWin.isNearWin) {
                setTimeout(() => {
                    DOM.nearWinIndicator.classList.add('show');
                    DOM.nearWinIndicator.querySelector('.near-win-text').textContent = 
                        `Prawie ${nearWin.missedRarity === 'legendary' ? 'Legendarna' : 
                                 nearWin.missedRarity === 'epic' ? 'Epicka' : 'Rzadka'}!`;
                }, 600);
            }
            
            // Show continue button
            setTimeout(() => {
                DOM.continueBtn.classList.add('show');
                if (totalCards > 1) {
                    DOM.continueBtn.textContent = `Wylosowano ${totalCards} kart!`;
                } else {
                    DOM.continueBtn.textContent = 'Kontynuuj';
                }
            }, 800);
            
        }, card.rarity === 'legendary' ? 800 : card.rarity === 'epic' ? 500 : 200);
        
    }, 500);
}

function createLegendaryParticles() {
    const container = DOM.cardRevealOverlay;
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'sparkle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 1 + 's';
        particle.style.background = `radial-gradient(circle, ${
            ['#ff6b35', '#ffd700', '#fff'][Math.floor(Math.random() * 3)]
        } 0%, transparent 70%)`;
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

function createEpicParticles() {
    const container = DOM.cardRevealOverlay;
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'sparkle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        particle.style.background = `radial-gradient(circle, ${
            ['#a855f7', '#c084fc', '#fff'][Math.floor(Math.random() * 3)]
        } 0%, transparent 70%)`;
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }
}

function closeCardReveal() {
    DOM.cardRevealOverlay.classList.remove('active');
    isDrawing = false; // Reset double-click prevention
    updateUI();
}

// =============================================
// PROGRESSION SYSTEM
// =============================================

function addXP(amount) {
    gameState.xp += amount;
    
    while (gameState.xp >= gameState.xpToNextLevel && gameState.level < CONFIG.levelThresholds.length) {
        levelUp();
    }
    
    saveGame();
}

function levelUp() {
    gameState.level++;
    gameState.xp -= gameState.xpToNextLevel;
    gameState.xpToNextLevel = CONFIG.levelThresholds[gameState.level] || gameState.xpToNextLevel * 1.5;
    
    // Increase max energy
    gameState.maxEnergy = CONFIG.startingEnergy + Math.floor(gameState.level / 2);
    gameState.energy = gameState.maxEnergy;
    
    // Bonus souls for level up
    const soulBonus = gameState.level * 50;
    gameState.souls += soulBonus;
    
    saveGame();
    
    // Show level up modal
    showLevelUpModal();
}

function showLevelUpModal() {
    DOM.newLevel.textContent = gameState.level;
    DOM.newTitle.textContent = CONFIG.characterTitles[gameState.level - 1] || CONFIG.characterTitles[CONFIG.characterTitles.length - 1];
    DOM.levelupModal.classList.add('active');
}

// =============================================
// UI UPDATE FUNCTIONS
// =============================================

function updateUI() {
    // Stats
    DOM.soulsValue.textContent = formatNumber(gameState.souls);
    DOM.levelValue.textContent = gameState.level;
    DOM.energyValue.textContent = gameState.energy;
    
    // Character
    DOM.avatarLevel.textContent = gameState.level;
    DOM.characterName.textContent = escapeHtml(gameState.playerName);
    DOM.characterTitle.textContent = CONFIG.characterTitles[gameState.level - 1] || CONFIG.characterTitles[CONFIG.characterTitles.length - 1];
    
    // Update avatar icon based on level
    const avatarIcon = DOM.characterAvatar.querySelector('.avatar-icon');
    avatarIcon.textContent = CONFIG.characterAvatars[Math.min(gameState.level - 1, CONFIG.characterAvatars.length - 1)];
    
    // XP bar
    const xpPercent = (gameState.xp / gameState.xpToNextLevel) * 100;
    DOM.xpFill.style.width = xpPercent + '%';
    DOM.xpText.textContent = `${gameState.xp} / ${gameState.xpToNextLevel} XP`;
    
    // Collection counts
    DOM.commonCount.textContent = gameState.commonCount;
    DOM.rareCount.textContent = gameState.rareCount;
    DOM.epicCount.textContent = gameState.epicCount;
    DOM.legendaryCount.textContent = gameState.legendaryCount;
    
    // Disable draw buttons if no energy
    DOM.drawBtn.disabled = gameState.energy < 1;
    DOM.draw3Btn.disabled = gameState.energy < 3;
    DOM.draw10Btn.disabled = gameState.energy < 10;
    
    // Update win progress display
    updateWinProgress();
}

function updateWinProgress() {
    const legendaryCards = CARDS.legendary;
    const ownedLegendaryIds = gameState.collection
        .filter(c => c.rarity === 'legendary')
        .map(c => c.id);
    
    // Update slots
    legendaryCards.forEach((card, index) => {
        const slot = document.getElementById(`leg-slot-${index + 1}`);
        if (slot) {
            const slotIcon = slot.querySelector('.slot-icon');
            if (ownedLegendaryIds.includes(card.id)) {
                slot.classList.add('collected');
                slotIcon.textContent = card.icon;
                slotIcon.classList.remove('empty');
            } else {
                slot.classList.remove('collected');
                slotIcon.textContent = '?';
                slotIcon.classList.add('empty');
            }
        }
    });
    
    // Update progress bar
    const collected = ownedLegendaryIds.length;
    const total = legendaryCards.length;
    const percent = (collected / total) * 100;
    
    const progressBar = document.getElementById('legendary-progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) progressBar.style.width = percent + '%';
    if (progressText) progressText.textContent = `${collected} / ${total} legendarnych kart`;
    
    // Add completed class to container if game is won
    if (gameState.gameCompleted) {
        document.getElementById('game-container')?.classList.add('game-completed');
    }
}

function updateCollection(filter = 'all') {
    const grid = DOM.collectionGrid;
    grid.innerHTML = '';
    
    // Create a copy to avoid mutating original array
    let filteredCards = [...gameState.collection];
    if (filter !== 'all') {
        filteredCards = filteredCards.filter(card => card.rarity === filter);
    }
    
    if (filteredCards.length === 0) {
        DOM.collectionEmpty.classList.add('show');
        return;
    }
    
    DOM.collectionEmpty.classList.remove('show');
    
    // Sort by rarity (legendary first)
    const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
    filteredCards.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
    
    filteredCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = `collection-card ${card.rarity}`;
        cardEl.innerHTML = `
            <span class="card-icon">${card.icon}</span>
            <span class="card-title">${escapeHtml(card.name)}</span>
            ${card.count > 1 ? `<span class="card-count">x${card.count}</span>` : ''}
        `;
        cardEl.addEventListener('click', () => showCardDetail(card));
        grid.appendChild(cardEl);
    });
}

function showCardDetail(card) {
    // Could show a detailed view of the card
    alert(`${card.name}\n\nRzadkość: ${card.rarity.toUpperCase()}\nMoc: ${card.power}\n\n${card.description}`);
}

function updateRanking(type = 'souls') {
    const list = DOM.rankingList;
    let data = [...leaderboardData[type]];
    
    // Add current player
    let playerValue;
    if (type === 'souls') playerValue = gameState.souls;
    else if (type === 'legendary') playerValue = gameState.legendaryCount;
    else playerValue = gameState.collection.length;
    
    data.push({
        name: gameState.playerName,
        value: playerValue,
        isCurrentUser: true
    });
    
    // Sort by value
    data.sort((a, b) => b.value - a.value);
    data = data.slice(0, 10);
    
    list.innerHTML = data.map((entry, index) => `
        <div class="ranking-item ${entry.isCurrentUser ? 'current-user' : ''}">
            <span class="ranking-position ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">#${index + 1}</span>
            <span class="ranking-name">${escapeHtml(entry.name)}${entry.isCurrentUser ? ' (Ty)' : ''}</span>
            <span class="ranking-value">${formatNumber(entry.value)}</span>
        </div>
    `).join('');
}

// =============================================
// DAILY BONUS SYSTEM
// =============================================

function checkDailyBonus() {
    const today = new Date().toDateString();
    
    if (gameState.lastPlayDate !== today) {
        // Calculate streak
        if (gameState.lastPlayDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (gameState.lastPlayDate === yesterday.toDateString()) {
                gameState.streak++;
            } else {
                gameState.streak = 1;
            }
        } else {
            gameState.streak = 1;
        }
        
        gameState.lastPlayDate = today;
        saveGame();
        
        DOM.dailyNotification.classList.remove('hidden');
        return true;
    }
    
    DOM.dailyNotification.classList.add('hidden');
    return false;
}

function claimDailyBonus() {
    const baseEnergy = 5;
    const baseSouls = 100;
    const streakMultiplier = Math.min(gameState.streak, 7);
    
    const energyReward = baseEnergy + Math.floor(streakMultiplier / 2);
    const soulsReward = baseSouls * streakMultiplier;
    
    gameState.energy = Math.min(gameState.energy + energyReward, gameState.maxEnergy + 5);
    gameState.souls += soulsReward;
    
    DOM.dailyNotification.classList.add('hidden');
    
    saveGame();
    updateUI();
    
    DOM.dailyModal.classList.remove('active');
}

function showDailyModal() {
    DOM.streakValue.textContent = gameState.streak;
    
    const streakMultiplier = Math.min(gameState.streak, 7);
    const energyReward = 5 + Math.floor(streakMultiplier / 2);
    const soulsReward = 100 * streakMultiplier;
    
    document.querySelector('#reward-energy .reward-value').textContent = `+${energyReward}`;
    document.querySelector('#reward-souls .reward-value').textContent = `+${soulsReward}`;
    
    DOM.dailyModal.classList.add('active');
}

// =============================================
// ENERGY REGENERATION
// =============================================

function startEnergyRegeneration() {
    setInterval(() => {
        if (gameState.energy < gameState.maxEnergy) {
            const now = Date.now();
            const timePassed = now - gameState.lastEnergyRegen;
            
            if (timePassed >= CONFIG.energyRegenTime) {
                gameState.energy = Math.min(gameState.energy + 1, gameState.maxEnergy);
                gameState.lastEnergyRegen = now;
                saveGame();
                updateUI();
            }
        }
    }, 10000); // Check every 10 seconds
}

function updateEnergyTimer() {
    if (gameState.energy >= gameState.maxEnergy) {
        DOM.energyTimer.textContent = 'Pełna!';
        return;
    }
    
    const timeLeft = Math.max(0, CONFIG.energyRegenTime - (Date.now() - gameState.lastEnergyRegen));
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    DOM.energyTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// =============================================
// SHOP SYSTEM
// =============================================

function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function handleShopPurchase(item, price) {
    if (gameState.souls < price) {
        showToast('Nie masz wystarczającej ilości dusz!', 'error');
        return;
    }
    
    gameState.souls -= price;
    
    let itemName = '';
    switch(item) {
        case 'energy-small':
            gameState.energy = Math.min(gameState.energy + 5, gameState.maxEnergy + 10);
            itemName = '5 Energii';
            break;
        case 'energy-large':
            gameState.energy = Math.min(gameState.energy + 20, gameState.maxEnergy + 20);
            itemName = '20 Energii';
            break;
        case 'lucky-charm':
            gameState.luckyCharmActive = true;
            gameState.luckyCharmEndTime = Date.now() + 3600000; // 1 hour
            itemName = 'Talizman Szczęścia';
            break;
        case 'guaranteed-legendary':
            gameState.guaranteedLegendary = true;
            itemName = 'Gwarantowana Legendarna';
            break;
    }
    
    saveGame();
    updateUI();
    
    showToast(`Zakupiono: ${itemName}!`, 'success');
}

// =============================================
// MODAL FUNCTIONS
// =============================================

function showNoEnergyModal() {
    updateEnergyTimer();
    DOM.noEnergyModal.classList.add('active');
    
    // Update timer every second while modal is open
    const timerInterval = setInterval(() => {
        if (!DOM.noEnergyModal.classList.contains('active')) {
            clearInterval(timerInterval);
            return;
        }
        updateEnergyTimer();
    }, 1000);
}

// =============================================
// LEAD GENERATION
// =============================================

function saveLead() {
    const lead = {
        name: gameState.playerName,
        email: gameState.playerEmail,
        timestamp: new Date().toISOString(),
        level: gameState.level,
        souls: gameState.souls,
        cardsCollected: gameState.collection.length
    };
    
    localStorage.setItem('echoFortunyLead', JSON.stringify(lead));
    
    // In production, send to backend
    console.log('Lead saved:', lead);
}

// =============================================
// INITIALIZATION
// =============================================

function initGame() {
    const loadMessages = [
        'Budzenie starożytnych duchów...',
        'Tasowanie kart losu...',
        'Otwieranie portali...',
        'Przygotowywanie magii...',
        'Gotowe!'
    ];
    
    let progress = 0;
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    
    const loadInterval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            
            loadingBar.style.width = '100%';
            loadingText.textContent = loadMessages[4];
            
            setTimeout(() => {
                DOM.loadingScreen.classList.add('fade-out');
                DOM.gameContainer.classList.remove('hidden');
                
                // Check if returning player
                if (loadGame()) {
                    updateUI();
                    
                    // Check daily bonus
                    if (checkDailyBonus()) {
                        setTimeout(() => showDailyModal(), 500);
                    }
                } else {
                    // New player - show welcome modal
                    setTimeout(() => {
                        DOM.welcomeModal.classList.add('active');
                    }, 300);
                }
            }, 500);
        } else {
            loadingBar.style.width = progress + '%';
            loadingText.textContent = loadMessages[Math.floor(progress / 25)];
        }
    }, 150);
}

// =============================================
// EVENT LISTENERS
// =============================================

// Start button
DOM.startBtn.addEventListener('click', () => {
    const name = DOM.playerNameInput.value.trim();
    const email = DOM.playerEmailInput.value.trim();
    
    if (name) {
        gameState.playerName = name;
    }
    
    if (email && isValidEmail(email)) {
        gameState.playerEmail = email;
        // Bonus energy for email registration
        gameState.energy += 5;
        saveLead();
    }
    
    saveGame();
    updateUI();
    
    DOM.welcomeModal.classList.remove('active');
    
    // Check daily bonus for new players
    if (checkDailyBonus()) {
        setTimeout(() => showDailyModal(), 500);
    }
});

// Draw buttons
DOM.drawBtn.addEventListener('click', () => drawCard());
DOM.draw3Btn.addEventListener('click', () => drawMultiple(3));
DOM.draw10Btn.addEventListener('click', () => drawMultiple(10));
DOM.cardDeck.addEventListener('click', () => {
    if (gameState.energy > 0) drawCard();
});

// Continue button
DOM.continueBtn.addEventListener('click', closeCardReveal);

// Collection
DOM.viewCollectionBtn.addEventListener('click', () => {
    updateCollection('all');
    DOM.collectionModal.classList.add('active');
});

document.getElementById('close-collection').addEventListener('click', () => {
    DOM.collectionModal.classList.remove('active');
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateCollection(btn.dataset.filter);
    });
});

// Daily bonus
DOM.dailyBtn.addEventListener('click', () => {
    if (checkDailyBonus()) {
        showDailyModal();
    } else {
        showToast(`Bonus już odebrany! Seria: ${gameState.streak} dni`, 'error');
    }
});

DOM.claimDailyBtn.addEventListener('click', claimDailyBonus);

// Ranking
DOM.rankingBtn.addEventListener('click', () => {
    updateRanking('souls');
    DOM.rankingModal.classList.add('active');
});

document.getElementById('close-ranking').addEventListener('click', () => {
    DOM.rankingModal.classList.remove('active');
});

document.querySelectorAll('.ranking-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateRanking(tab.dataset.tab);
    });
});

// Shop
DOM.shopBtn.addEventListener('click', () => {
    DOM.shopModal.classList.add('active');
});

document.getElementById('close-shop').addEventListener('click', () => {
    DOM.shopModal.classList.remove('active');
});

document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const shopItem = btn.closest('.shop-item');
        const item = shopItem.dataset.item;
        const price = parseInt(btn.dataset.price);
        handleShopPurchase(item, price);
    });
});

// No energy modal
document.getElementById('wait-energy').addEventListener('click', () => {
    DOM.noEnergyModal.classList.remove('active');
});

document.getElementById('buy-energy').addEventListener('click', () => {
    DOM.noEnergyModal.classList.remove('active');
    DOM.shopModal.classList.add('active');
});

// Level up modal
document.getElementById('levelup-continue').addEventListener('click', () => {
    DOM.levelupModal.classList.remove('active');
});

// Settings
DOM.settingsBtn.addEventListener('click', () => {
    showSettingsModal();
});

function showSettingsModal() {
    const settingsHTML = `
        <div class="modal-overlay active" id="settings-modal">
            <div class="modal settings-modal">
                <button class="modal-close" onclick="closeSettingsModal()">&times;</button>
                <div class="modal-icon">⚙️</div>
                <h2>Ustawienia</h2>
                
                <div class="settings-section">
                    <h3>📊 Statystyki</h3>
                    <div class="stats-grid">
                        <div class="stat-box">
                            <span class="stat-label">Łączne losowania</span>
                            <span class="stat-value">${gameState.totalCardsDrawn}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Unikalne karty</span>
                            <span class="stat-value">${gameState.collection.length} / 29</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Seria dni</span>
                            <span class="stat-value">${gameState.streak}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Near-winy</span>
                            <span class="stat-value">${gameState.nearWinCount}</span>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>🎮 Gra</h3>
                    <button class="settings-btn danger" onclick="confirmResetGame()">
                        🗑️ Zacznij od nowa
                    </button>
                    <p class="settings-warning">Uwaga: To usunie cały postęp!</p>
                </div>
                
                <div class="settings-section">
                    <h3>ℹ️ Informacje</h3>
                    <p class="settings-info">
                        Echo Fortuny v1.0.0<br>
                        Stworzono na HackNation 2025
                    </p>
                </div>
                
                <button class="modal-btn secondary" onclick="closeSettingsModal()">Zamknij</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', settingsHTML);
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.remove();
}

function confirmResetGame() {
    const confirmHTML = `
        <div class="modal-overlay active" id="confirm-reset-modal" style="z-index: 7000;">
            <div class="modal confirm-modal">
                <div class="modal-icon">⚠️</div>
                <h2>Na pewno?</h2>
                <p>
                    Czy na pewno chcesz <strong>usunąć cały postęp</strong> i zacząć od nowa?
                </p>
                <div class="reset-summary">
                    <p>Stracisz:</p>
                    <ul>
                        <li>🔮 ${formatNumber(gameState.souls)} dusz</li>
                        <li>🃏 ${gameState.collection.length} kart</li>
                        <li>⭐ Poziom ${gameState.level}</li>
                        <li>🏆 Wszystkie osiągnięcia</li>
                    </ul>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn secondary" onclick="cancelReset()">Anuluj</button>
                    <button class="modal-btn danger" onclick="executeResetGame()">Tak, usuń wszystko</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmHTML);
}

function cancelReset() {
    const modal = document.getElementById('confirm-reset-modal');
    if (modal) modal.remove();
}

function executeResetGame() {
    // Clear localStorage
    localStorage.removeItem('echoFortunySave');
    localStorage.removeItem('echoFortunyLead');
    
    // Reset game state to defaults
    gameState = {
        playerName: 'Wędrowiec',
        playerEmail: '',
        souls: 0,
        energy: CONFIG.startingEnergy,
        maxEnergy: CONFIG.startingEnergy,
        level: 1,
        xp: 0,
        xpToNextLevel: CONFIG.levelThresholds[1],
        collection: [],
        totalCardsDrawn: 0,
        commonCount: 0,
        rareCount: 0,
        epicCount: 0,
        legendaryCount: 0,
        streak: 0,
        lastPlayDate: null,
        luckyCharmActive: false,
        luckyCharmEndTime: null,
        guaranteedLegendary: false,
        lastEnergyRegen: Date.now(),
        nearWinCount: 0,
        lastNearWin: null,
        achievements: {
            firstCard: false,
            tenCards: false,
            allCommon: false,
            allRare: false,
            firstLegendary: false,
            allLegendary: false,
            masterCollector: false,
            level5: false,
            level10: false,
            maxLevel: false
        },
        gameCompleted: false
    };
    
    // Close modals
    cancelReset();
    closeSettingsModal();
    
    // Remove game completed class
    document.getElementById('game-container')?.classList.remove('game-completed');
    
    // Update UI
    updateUI();
    
    // Show welcome modal again
    setTimeout(() => {
        DOM.welcomeModal.classList.add('active');
    }, 300);
    
    showToast('Gra zresetowana! Zacznij nową przygodę!', 'success');
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay && !overlay.id.includes('welcome') && !overlay.id.includes('levelup')) {
            overlay.classList.remove('active');
        }
    });
});

// Note: Shake animations moved to styles.css for better organization

// Start energy regeneration
startEnergyRegeneration();

// Initialize game on page load
document.addEventListener('DOMContentLoaded', initGame);

