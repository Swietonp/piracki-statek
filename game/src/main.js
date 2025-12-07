// =====================================================
// KOPALNIE PRAWDOPODOBIEŃSTWA - Main Game Logic
// Wydobywaj kryształy i buduj swoją mozaikę szczęścia!
// =====================================================

// =====================================================
// CONSTANTS
// =====================================================

const GRID_SIZE = 5;
const GRID_TOTAL = GRID_SIZE * GRID_SIZE;
const MOSAIC_SLOTS = 21;
const ENERGY_REGEN_INTERVAL = 30000; // 30 seconds
const SAVE_DEBOUNCE_TIME = 1000; // 1 second
const MAX_PLAYER_NAME_LENGTH = 20;
const MAX_EMAIL_LENGTH = 254;

// Crystal types with their properties
const CRYSTALS = {
    diamond: { 
        emoji: '💎', 
        name: 'Diament', 
        points: 1000, 
        rarity: 'legendary',
        color: '#b9f2ff',
        baseChance: 0.005 // 0.5%
    },
    ruby: { 
        emoji: '❤️', 
        name: 'Rubin', 
        points: 500, 
        rarity: 'epic',
        color: '#e74c3c',
        baseChance: 0.02 // 2%
    },
    emerald: { 
        emoji: '💚', 
        name: 'Szmaragd', 
        points: 300, 
        rarity: 'epic',
        color: '#2ecc71',
        baseChance: 0.05 // 5%
    },
    sapphire: { 
        emoji: '💙', 
        name: 'Szafir', 
        points: 200, 
        rarity: 'rare',
        color: '#3498db',
        baseChance: 0.08 // 8%
    },
    gold: { 
        emoji: '⭐', 
        name: 'Złoto', 
        points: 100, 
        rarity: 'rare',
        color: '#f1c40f',
        baseChance: 0.10 // 10%
    },
    amethyst: { 
        emoji: '💜', 
        name: 'Ametyst', 
        points: 50, 
        rarity: 'uncommon',
        color: '#9b59b6',
        baseChance: 0.15 // 15%
    },
    quartz: { 
        emoji: '🤍', 
        name: 'Kwarc', 
        points: 20, 
        rarity: 'common',
        color: '#ecf0f1',
        baseChance: 0.25 // 25%
    },
    rock: { 
        emoji: '🪨', 
        name: 'Skała', 
        points: 5, 
        rarity: 'common',
        color: '#7f8c8d',
        baseChance: 0.295 // 29.5%
    },
    empty: { 
        emoji: '🕳️', 
        name: 'Pusta Komora', 
        points: 0, 
        rarity: 'common',
        color: '#2c3e50',
        baseChance: 0.05 // 5%
    }
};

// Crystal order for probability calculation (best to worst)
const CRYSTAL_ORDER = ['diamond', 'ruby', 'emerald', 'sapphire', 'gold', 'amethyst', 'quartz', 'rock', 'empty'];

// Rare crystals for luck bonuses
const RARE_CRYSTALS = ['diamond', 'ruby', 'emerald', 'sapphire', 'gold'];

// Mine depth names
const MINE_DEPTHS = [
    { name: 'Płytka Kopalnia', requiredMosaic: 0, luckBonus: 0 },
    { name: 'Kamieniołom', requiredMosaic: 1, luckBonus: 0.05 },
    { name: 'Głęboki Szyb', requiredMosaic: 2, luckBonus: 0.10 },
    { name: 'Jaskinia Kryształów', requiredMosaic: 3, luckBonus: 0.15 },
    { name: 'Kopalnia Starożytnych', requiredMosaic: 4, luckBonus: 0.20 },
    { name: 'Serce Góry', requiredMosaic: 5, luckBonus: 0.25 },
    { name: 'Legendarna Kopalnia', requiredMosaic: 7, luckBonus: 0.35 }
];

// i18n messages
const MESSAGES = {
    loading: {
        preparing: 'Przygotowywanie kopalni...',
        sharpening: 'Ostrzenie kilofów...',
        mapping: 'Mapowanie złóż kryształów...',
        calibrating: 'Kalibrowanie szczęścia...',
        ready: 'Gotowe do kopania!'
    },
    errors: {
        invalidSave: 'Zapisany stan gry jest uszkodzony. Rozpocząć nową grę?',
        loadFailed: 'Nie udało się wczytać gry',
        saveFailed: 'Nie udało się zapisać postępu'
    },
    shop: {
        energyPurchased: 'Zakupiono +5 energii!',
        luckPurchased: 'Talizman Szczęścia aktywny przez 10 kopań!',
        dynamitePurchased: 'Zakupiono dynamit!',
        insufficientFunds: 'Nie masz wystarczająco diamentów!'
    }
};

// =====================================================
// GAME STATE
// =====================================================

const gameState = {
    playerName: 'Górnik',
    playerEmail: '',
    
    // Resources
    totalCrystals: 0,
    diamonds: 0,
    energy: 5,
    maxEnergy: 5,
    
    // Progression
    level: 1,
    mineDepth: 0,
    mosaicsCompleted: 0,
    
    // Current mosaic (21 slots, 3 rows x 7 columns)
    mosaic: [],
    
    // Grid state (5x5 = 25 tiles)
    grid: [],
    revealedTiles: 0,
    isGridRegenerating: false,
    
    // Power-ups
    luckBonus: 0,
    luckTurnsLeft: 0,
    dynamite: 0,
    
    // Stats
    totalDigs: 0,
    raresFound: 0,
    nearWins: 0,
    
    // Streaks
    lastPlayDate: null,
    streak: 0,
    
    // Lead generation
    emailCollected: false
};

// Fake leaderboard data
const leaderboardData = {
    daily: [
        { name: 'KrysztalowySzef', crystals: 8420, mosaics: 2 },
        { name: 'GórnikMax', crystals: 6300, mosaics: 1 },
        { name: 'DiamentowaDama', crystals: 5100, mosaics: 1 },
        { name: 'SzafirowyKról', crystals: 3820, mosaics: 0 },
        { name: 'SzmaragdowyEkspert', crystals: 2900, mosaics: 0 },
    ],
    weekly: [
        { name: 'LegenarnykGórnik', crystals: 45200, mosaics: 8 },
        { name: 'KrysztalowySzef', crystals: 32100, mosaics: 5 },
        { name: 'DiamentowaDama', crystals: 28700, mosaics: 4 },
        { name: 'GórnikMax', crystals: 21500, mosaics: 3 },
        { name: 'SzafirowyKról', crystals: 15400, mosaics: 2 },
    ],
    alltime: [
        { name: 'MistrzKopalni', crystals: 524000, mosaics: 89 },
        { name: 'LegenarnykGórnik', crystals: 312500, mosaics: 52 },
        { name: 'DiamentowaDama', crystals: 198400, mosaics: 34 },
        { name: 'KrysztalowySzef', crystals: 145200, mosaics: 25 },
        { name: 'GórnikMax', crystals: 98700, mosaics: 18 },
    ]
};

// =====================================================
// DOM ELEMENTS CACHE
// =====================================================

const elements = {};

// =====================================================
// GLOBAL STATE (technical)
// =====================================================

let energyRegenInterval = null;
let saveTimeout = null;
let pendingSave = false;
let lastFocusedElement = null;

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    loadGameState();
    initParticles();
    initEventListeners();
    simulateLoading();
});

function cacheElements() {
    Object.assign(elements, {
        loadingScreen: document.getElementById('loading-screen'),
        loaderBar: document.getElementById('loader-bar'),
        loaderText: document.getElementById('loader-text'),
        
        totalCrystals: document.getElementById('total-crystals'),
        playerLevel: document.getElementById('player-level'),
        
        depthFill: document.getElementById('depth-fill'),
        currentDepth: document.getElementById('current-depth'),
        depthLabel: document.querySelector('.depth-label'),
        
        mineGrid: document.getElementById('mine-grid'),
        drillBtn: document.getElementById('drill-btn'),
        energyBar: document.getElementById('energy-bar'),
        energyText: document.getElementById('energy-text'),
        
        mosaicGrid: document.getElementById('mosaic-grid'),
        mosaicCount: document.getElementById('mosaic-count'),
        
        resultPopup: document.getElementById('result-popup'),
        resultCrystal: document.getElementById('result-crystal'),
        resultName: document.getElementById('result-name'),
        resultPoints: document.getElementById('result-points'),
        resultNearwin: document.getElementById('result-nearwin'),
        
        probPanel: document.getElementById('probability-panel'),
        probToggleBtn: document.getElementById('prob-toggle-btn'),
        
        // Modals
        welcomeModal: document.getElementById('welcome-modal'),
        nearwinModal: document.getElementById('nearwin-modal'),
        dailyModal: document.getElementById('daily-modal'),
        leaderboardModal: document.getElementById('leaderboard-modal'),
        shopModal: document.getElementById('shop-modal'),
        helpModal: document.getElementById('help-modal'),
        mosaicCompleteModal: document.getElementById('mosaic-complete-modal'),
        
        // Inputs
        playerNameInput: document.getElementById('player-name'),
        playerEmailInput: document.getElementById('player-email'),
        
        // Leaderboard
        leaderboardList: document.getElementById('leaderboard-list'),
        
        // Streak
        streakCount: document.getElementById('streak-count'),
        dailyRewardCrystals: document.getElementById('daily-reward-crystals'),
        dailyRewardText: document.getElementById('daily-reward-text'),
        
        // Toast container (will be created)
        toastContainer: null
    });
    
    // Create toast container
    elements.toastContainer = document.createElement('div');
    elements.toastContainer.id = 'toast-container';
    elements.toastContainer.className = 'toast-container';
    document.body.appendChild(elements.toastContainer);
}

function initParticles() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const container = document.getElementById('cave-particles');
    const particleCount = navigator.hardwareConcurrency > 4 ? 20 : 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

function simulateLoading() {
    const loadMessages = Object.values(MESSAGES.loading);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 18 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            elements.loaderBar.style.width = '100%';
            elements.loaderText.textContent = loadMessages[4];
            
            setTimeout(() => {
                elements.loadingScreen.classList.add('hidden');
                showWelcomeModal();
            }, 500);
        } else {
            elements.loaderBar.style.width = progress + '%';
            const messageIndex = Math.min(Math.floor(progress / 25), loadMessages.length - 1);
            elements.loaderText.textContent = loadMessages[messageIndex];
        }
    }, 200);
}

// =====================================================
// GAME STATE MANAGEMENT
// =====================================================

function loadGameState() {
    const saved = localStorage.getItem('kopalnie_gamestate');
    if (!saved) {
        resetMosaic();
        startEnergyRegen();
        return;
    }
    
    try {
        const data = JSON.parse(saved);
        
        if (!isValidGameState(data)) {
            throw new Error('Invalid game state format');
        }
        
        Object.assign(gameState, data);
        
        // Initialize mosaic if empty
        if (gameState.mosaic.length === 0) {
            resetMosaic();
        }
        
    } catch (e) {
        console.error('Failed to load game state:', e);
        
        if (confirm(MESSAGES.errors.invalidSave)) {
            localStorage.removeItem('kopalnie_gamestate');
            localStorage.removeItem('kopalnie_lead');
            resetGameState();
        }
    }
    
    startEnergyRegen();
}

function isValidGameState(data) {
    const requiredFields = ['totalCrystals', 'energy', 'level', 'mosaic', 'mineDepth'];
    
    for (const field of requiredFields) {
        if (!(field in data)) return false;
    }
    
    // Type checks
    if (typeof data.totalCrystals !== 'number') return false;
    if (typeof data.energy !== 'number') return false;
    if (!Array.isArray(data.mosaic)) return false;
    if (data.mosaic.length > MOSAIC_SLOTS) return false;
    
    return true;
}

function resetGameState() {
    gameState.totalCrystals = 0;
    gameState.diamonds = 0;
    gameState.energy = 5;
    gameState.maxEnergy = 5;
    gameState.level = 1;
    gameState.mineDepth = 0;
    gameState.mosaicsCompleted = 0;
    gameState.revealedTiles = 0;
    gameState.totalDigs = 0;
    gameState.raresFound = 0;
    gameState.nearWins = 0;
    resetMosaic();
}

function saveGameState() {
    const toSave = {
        playerName: gameState.playerName,
        playerEmail: gameState.playerEmail,
        totalCrystals: gameState.totalCrystals,
        diamonds: gameState.diamonds,
        energy: gameState.energy,
        maxEnergy: gameState.maxEnergy,
        level: gameState.level,
        mineDepth: gameState.mineDepth,
        mosaicsCompleted: gameState.mosaicsCompleted,
        mosaic: gameState.mosaic,
        totalDigs: gameState.totalDigs,
        raresFound: gameState.raresFound,
        nearWins: gameState.nearWins,
        lastPlayDate: gameState.lastPlayDate,
        streak: gameState.streak,
        emailCollected: gameState.emailCollected,
        luckBonus: gameState.luckBonus,
        luckTurnsLeft: gameState.luckTurnsLeft,
        dynamite: gameState.dynamite
    };
    
    try {
        localStorage.setItem('kopalnie_gamestate', JSON.stringify(toSave));
    } catch (e) {
        console.error('Failed to save game state:', e);
        showToast(MESSAGES.errors.saveFailed, 'error');
    }
}

function saveGameStateDebounced(immediate = false) {
    if (immediate) {
        saveGameState();
        pendingSave = false;
        return;
    }
    
    pendingSave = true;
    
    if (saveTimeout) clearTimeout(saveTimeout);
    
    saveTimeout = setTimeout(() => {
        if (pendingSave) {
            saveGameState();
            pendingSave = false;
        }
    }, SAVE_DEBOUNCE_TIME);
}

function startEnergyRegen() {
    // Cleanup previous interval
    if (energyRegenInterval) {
        clearInterval(energyRegenInterval);
    }
    
    energyRegenInterval = setInterval(() => {
        if (gameState.energy < gameState.maxEnergy) {
            gameState.energy++;
            updateUI();
            saveGameStateDebounced();
        }
    }, ENERGY_REGEN_INTERVAL);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (energyRegenInterval) {
        clearInterval(energyRegenInterval);
    }
    saveGameStateDebounced(true); // Force immediate save
});

// =====================================================
// GRID & MINING MECHANICS
// =====================================================

function generateGrid() {
    gameState.grid = [];
    gameState.revealedTiles = 0;
    gameState.isGridRegenerating = false;
    
    for (let i = 0; i < GRID_TOTAL; i++) {
        gameState.grid.push({
            type: null,
            revealed: false,
            index: i
        });
    }
    
    renderGrid();
}

function renderGrid() {
    // Clear grid completely to avoid memory leaks
    const newGrid = document.createElement('div');
    newGrid.id = 'mine-grid';
    elements.mineGrid.replaceWith(newGrid);
    elements.mineGrid = newGrid;
    
    gameState.grid.forEach((tile, index) => {
        const tileEl = document.createElement('div');
        tileEl.className = 'mine-tile';
        tileEl.dataset.index = index;
        
        if (tile.revealed) {
            tileEl.classList.add('revealed');
            if (tile.type) {
                tileEl.classList.add(`crystal-${tile.type}`);
                tileEl.innerHTML = `<span class="tile-icon">${CRYSTALS[tile.type].emoji}</span>`;
            }
        } else {
            tileEl.innerHTML = '<span class="tile-icon">⛏️</span>';
        }
        
        elements.mineGrid.appendChild(tileEl);
    });
}

function handleTileClick(index) {
    if (!canClickTile(index)) return;
    
    consumeEnergy();
    
    const tileEl = elements.mineGrid.children[index];
    tileEl.classList.add('loading');
    
    setTimeout(() => {
        tileEl.classList.remove('loading');
        revealTile(index);
    }, 400);
}

function canClickTile(index) {
    if (gameState.isGridRegenerating) return false;
    
    if (gameState.grid[index].revealed) {
        // Shake animation for already revealed tiles
        const tileEl = elements.mineGrid.children[index];
        tileEl.classList.add('shake');
        setTimeout(() => tileEl.classList.remove('shake'), 300);
        return false;
    }
    
    if (gameState.energy <= 0) {
        showNoEnergyMessage();
        return false;
    }
    
    return true;
}

function consumeEnergy() {
    gameState.energy--;
    gameState.totalDigs++;
    updateUI();
}

function revealTile(index) {
    const crystalType = rollCrystal();
    gameState.grid[index].type = crystalType;
    gameState.grid[index].revealed = true;
    gameState.revealedTiles++;
    
    const tileEl = elements.mineGrid.children[index];
    tileEl.classList.add('revealed');
    tileEl.classList.add(`crystal-${crystalType}`);
    tileEl.innerHTML = `<span class="tile-icon">${CRYSTALS[crystalType].emoji}</span>`;
    
    awardPoints(crystalType);
    checkForBonuses(crystalType, index);
    checkGridComplete();
    
    updateUI();
    saveGameStateDebounced();
}

function awardPoints(crystalType) {
    const points = CRYSTALS[crystalType].points;
    gameState.totalCrystals += points;
    
    if (RARE_CRYSTALS.slice(0, 3).includes(crystalType)) {
        gameState.raresFound++;
    }
    
    if (crystalType !== 'empty' && crystalType !== 'rock') {
        addToMosaic(crystalType);
    }
    
    showResult(crystalType, points);
}

function checkForBonuses(crystalType, index) {
    // Use luck bonus if active
    if (gameState.luckTurnsLeft > 0) {
        gameState.luckTurnsLeft--;
        if (gameState.luckTurnsLeft === 0) {
            gameState.luckBonus = 0;
        }
    }
    
    // Check for near-win
    checkNearWin(crystalType, index);
}

function checkGridComplete() {
    if (gameState.revealedTiles >= GRID_TOTAL) {
        gameState.isGridRegenerating = true;
        
        setTimeout(() => {
            generateGrid();
        }, 1500);
    }
}

// =====================================================
// RNG SYSTEM (FIXED)
// =====================================================

function rollCrystal() {
    const modifiedChances = calculateModifiedChances();
    const normalizedChances = normalizeChances(modifiedChances);
    
    return selectCrystalByChance(normalizedChances);
}

function calculateModifiedChances() {
    const depthBonus = MINE_DEPTHS[gameState.mineDepth]?.luckBonus || 0;
    const totalLuckBonus = gameState.luckBonus + depthBonus;
    
    const modifiedChances = {};
    
    for (const type of CRYSTAL_ORDER) {
        let chance = CRYSTALS[type].baseChance;
        
        // Apply luck bonus to rare crystals
        if (RARE_CRYSTALS.includes(type)) {
            chance *= (1 + totalLuckBonus);
        }
        
        // Ensure minimum chance
        modifiedChances[type] = Math.max(0.001, chance);
    }
    
    return modifiedChances;
}

function normalizeChances(chances) {
    const total = Object.values(chances).reduce((sum, chance) => sum + chance, 0);
    const normalized = {};
    
    for (const type in chances) {
        normalized[type] = chances[type] / total;
    }
    
    return normalized;
}

function selectCrystalByChance(normalizedChances) {
    const random = Math.random();
    let cumulative = 0;
    
    for (const type of CRYSTAL_ORDER) {
        cumulative += normalizedChances[type];
        if (random <= cumulative) {
            return type;
        }
    }
    
    // Fallback (should never be reached with normalized chances)
    console.warn('RNG fallback triggered - using last crystal type');
    return CRYSTAL_ORDER[CRYSTAL_ORDER.length - 1];
}

// =====================================================
// NEAR-WIN SYSTEM (FIXED)
// =====================================================

function checkNearWin(foundType, index) {
    // Only check for truly poor results
    if (!['rock', 'empty'].includes(foundType)) return;
    
    const adjacentIndices = getAdjacentIndices(index);
    const revealedAdjacent = adjacentIndices.filter(i => gameState.grid[i].revealed);
    
    // Check if any adjacent revealed tile has a rare crystal
    for (const adjIndex of revealedAdjacent) {
        const adjType = gameState.grid[adjIndex].type;
        if (RARE_CRYSTALS.slice(0, 3).includes(adjType)) {
            gameState.nearWins++;
            highlightNearWin(index);
            
            setTimeout(() => {
                showNearWinModal(adjType);
            }, 2000);
            
            return;
        }
    }
}

function getAdjacentIndices(centerIndex) {
    const row = Math.floor(centerIndex / GRID_SIZE);
    const col = centerIndex % GRID_SIZE;
    
    const adjacentOffsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    const indices = [];
    
    for (const [dr, dc] of adjacentOffsets) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
            indices.push(newRow * GRID_SIZE + newCol);
        }
    }
    
    return indices;
}

function highlightNearWin(centerIndex) {
    const adjacentIndices = getAdjacentIndices(centerIndex);
    
    adjacentIndices.forEach(adjIndex => {
        const tileEl = elements.mineGrid.children[adjIndex];
        if (tileEl && !gameState.grid[adjIndex].revealed) {
            tileEl.classList.add('near-win-highlight');
            setTimeout(() => {
                tileEl.classList.remove('near-win-highlight');
            }, 3000);
        }
    });
}

// =====================================================
// MOSAIC SYSTEM (IMPROVED)
// =====================================================

function resetMosaic() {
    gameState.mosaic = new Array(MOSAIC_SLOTS).fill(null);
}

function addToMosaic(crystalType) {
    const emptyIndex = gameState.mosaic.findIndex(slot => slot === null);
    
    if (emptyIndex === -1) return;
    
    gameState.mosaic[emptyIndex] = crystalType;
    
    // Incremental update instead of full re-render
    updateMosaicSlot(emptyIndex, crystalType);
    
    const filledSlots = gameState.mosaic.filter(s => s !== null).length;
    elements.mosaicCount.textContent = filledSlots;
    
    if (filledSlots >= MOSAIC_SLOTS) {
        setTimeout(() => {
            completeMosaic();
        }, 1000);
    }
}

function updateMosaicSlot(index, crystalType) {
    const slotEl = elements.mosaicGrid.children[index];
    if (!slotEl) return;
    
    slotEl.classList.add('filled', crystalType);
    slotEl.textContent = CRYSTALS[crystalType].emoji;
}

function renderMosaic() {
    elements.mosaicGrid.innerHTML = '';
    
    gameState.mosaic.forEach((slot, index) => {
        const slotEl = document.createElement('div');
        slotEl.className = 'mosaic-slot';
        
        if (slot) {
            slotEl.classList.add('filled', slot);
            slotEl.textContent = CRYSTALS[slot].emoji;
        }
        
        elements.mosaicGrid.appendChild(slotEl);
    });
    
    const filledCount = gameState.mosaic.filter(s => s !== null).length;
    elements.mosaicCount.textContent = filledCount;
}

function completeMosaic() {
    gameState.mosaicsCompleted++;
    gameState.diamonds += 3;
    
    unlockNextDepth();
    
    gameState.level++;
    gameState.maxEnergy = Math.min(5 + Math.floor(gameState.level / 2), 10);
    gameState.energy = gameState.maxEnergy;
    
    resetMosaic();
    renderMosaic();
    
    elements.mosaicCompleteModal.classList.add('active');
    
    updateUI();
    saveGameStateDebounced();
}

function unlockNextDepth() {
    const currentDepth = gameState.mineDepth;
    
    for (let i = MINE_DEPTHS.length - 1; i >= 0; i--) {
        if (gameState.mosaicsCompleted >= MINE_DEPTHS[i].requiredMosaic) {
            gameState.mineDepth = i;
            
            if (i > currentDepth) {
                setTimeout(() => {
                    showToast(`Odblokowano: ${MINE_DEPTHS[i].name}!`, 'success');
                }, 1500);
            }
            break;
        }
    }
}

// =====================================================
// UI UPDATES
// =====================================================

function updateUI() {
    elements.totalCrystals.textContent = formatNumber(gameState.totalCrystals);
    elements.playerLevel.textContent = gameState.level;
    
    updateDepthDisplay();
    updateEnergyDisplay();
    updateProbabilityDisplay();
    
    elements.drillBtn.disabled = gameState.energy <= 0;
}

function updateDepthDisplay() {
    const depth = MINE_DEPTHS[gameState.mineDepth];
    const progressPercent = Math.min(5 + (gameState.mineDepth * 15) + (gameState.mosaicsCompleted * 3), 100);
    
    elements.depthFill.style.width = progressPercent + '%';
    elements.currentDepth.textContent = gameState.mineDepth + 1;
    
    if (elements.depthLabel && depth) {
        elements.depthLabel.textContent = `Poziom ${gameState.mineDepth + 1} - ${depth.name}`;
    }
}

function updateEnergyDisplay() {
    elements.energyBar.innerHTML = '';
    
    for (let i = 0; i < gameState.maxEnergy; i++) {
        const pip = document.createElement('div');
        pip.className = 'energy-pip';
        if (i < gameState.energy) {
            pip.classList.add('active');
        }
        elements.energyBar.appendChild(pip);
    }
    
    elements.energyText.textContent = `${gameState.energy}/${gameState.maxEnergy}`;
}

function updateProbabilityDisplay() {
    const modifiedChances = calculateModifiedChances();
    const normalizedChances = normalizeChances(modifiedChances);
    
    document.getElementById('prob-diamond').textContent = formatPercent(normalizedChances.diamond);
    document.getElementById('prob-ruby').textContent = formatPercent(normalizedChances.ruby);
    document.getElementById('prob-emerald').textContent = formatPercent(normalizedChances.emerald);
    document.getElementById('prob-sapphire').textContent = formatPercent(normalizedChances.sapphire);
    document.getElementById('prob-gold').textContent = formatPercent(normalizedChances.gold);
    document.getElementById('prob-amethyst').textContent = formatPercent(normalizedChances.amethyst);
    document.getElementById('prob-quartz').textContent = formatPercent(normalizedChances.quartz);
    document.getElementById('prob-rock').textContent = formatPercent(normalizedChances.rock);
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function formatPercent(value) {
    return (value * 100).toFixed(2) + '%';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sanitizeString(str, maxLength) {
    return str.trim().substring(0, maxLength);
}

function isValidEmail(email) {
    if (!email || email.length > MAX_EMAIL_LENGTH) return false;
    
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!regex.test(email)) return false;
    
    const parts = email.split('@');
    if (parts[0].length > 64) return false;
    
    return true;
}

// =====================================================
// TOAST SYSTEM
// =====================================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    const icon = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }[type] || 'ℹ';
    
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${escapeHtml(message)}</span>`;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =====================================================
// RESULT DISPLAY
// =====================================================

function showResult(crystalType, points) {
    const crystal = CRYSTALS[crystalType];
    
    elements.resultCrystal.textContent = crystal.emoji;
    elements.resultName.textContent = crystal.name + '!';
    elements.resultName.style.color = crystal.color;
    elements.resultPoints.textContent = points > 0 ? `+${points} punktów` : 'Nic nie znaleziono';
    elements.resultNearwin.style.display = 'none';
    
    elements.resultPopup.classList.add('show');
    elements.resultPopup.setAttribute('role', 'alert');
    elements.resultPopup.setAttribute('aria-live', 'polite');
    
    if (RARE_CRYSTALS.slice(0, 3).includes(crystalType)) {
        createSparkles();
    }
    
    setTimeout(() => {
        elements.resultPopup.classList.remove('show');
    }, 2000);
}

function createSparkles() {
    const popup = elements.resultPopup;
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = (Math.random() * 100) + '%';
        sparkle.style.top = (Math.random() * 100) + '%';
        sparkle.setAttribute('aria-hidden', 'true');
        popup.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 600);
    }
}

function showNoEnergyMessage() {
    elements.resultCrystal.textContent = '⚡';
    elements.resultName.textContent = 'Brak Energii!';
    elements.resultName.style.color = '#e74c3c';
    elements.resultPoints.textContent = 'Poczekaj lub kup w sklepie';
    elements.resultNearwin.style.display = 'none';
    
    elements.resultPopup.classList.add('show');
    elements.resultPopup.setAttribute('role', 'alert');
    
    setTimeout(() => {
        elements.resultPopup.classList.remove('show');
    }, 1500);
}

// =====================================================
// MODALS
// =====================================================

function showWelcomeModal() {
    showModal(elements.welcomeModal);
}

function showNearWinModal(nearMissCrystal) {
    const crystal = CRYSTALS[nearMissCrystal];
    const nearwinText = document.getElementById('nearwin-text');
    nearwinText.textContent = `Twój kilof prawie trafił na ${crystal.name}! Tylko centymetry dzieliły Cię od wielkiego odkrycia!`;
    
    showModal(elements.nearwinModal);
}

function showModal(modalElement) {
    lastFocusedElement = document.activeElement;
    
    modalElement.classList.add('active');
    
    const focusable = modalElement.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusable.length) {
        focusable[0].focus();
    }
    
    modalElement.addEventListener('keydown', trapFocus);
}

function hideModal(modalElement) {
    modalElement.classList.remove('active');
    modalElement.removeEventListener('keydown', trapFocus);
    
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

function trapFocus(e) {
    if (e.key !== 'Tab') return;
    
    const focusable = this.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    
    if (e.shiftKey && document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
    }
}

function checkDailyBonus() {
    const today = new Date().toDateString();
    
    if (gameState.lastPlayDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (gameState.lastPlayDate === yesterday.toDateString()) {
            gameState.streak++;
        } else if (gameState.lastPlayDate !== null) {
            gameState.streak = 1;
        } else {
            gameState.streak = 1;
        }
        
        gameState.lastPlayDate = today;
        
        const baseReward = 3;
        const streakBonus = Math.min(gameState.streak - 1, 5);
        const totalReward = baseReward + streakBonus;
        
        elements.dailyRewardCrystals.textContent = '⚡'.repeat(Math.min(totalReward, 8));
        elements.dailyRewardText.textContent = `+${totalReward} Energia`;
        elements.streakCount.textContent = gameState.streak;
        
        window.pendingDailyReward = totalReward;
        
        saveGameStateDebounced();
        return true;
    }
    return false;
}

function updateLeaderboard(tab) {
    const data = leaderboardData[tab];
    let playerData = [...data];
    
    if (gameState.totalCrystals > 0) {
        playerData.push({
            name: gameState.playerName,
            crystals: gameState.totalCrystals,
            mosaics: gameState.mosaicsCompleted,
            isCurrentUser: true
        });
    }
    
    playerData.sort((a, b) => b.crystals - a.crystals);
    playerData = playerData.slice(0, 10);
    
    elements.leaderboardList.innerHTML = playerData.map((entry, index) => `
        <div class="leaderboard-entry ${entry.isCurrentUser ? 'current-user' : ''}">
            <span class="rank rank-${index + 1}">#${index + 1}</span>
            <span class="player-name">${escapeHtml(entry.name)}${entry.isCurrentUser ? ' (Ty)' : ''}</span>
            <span class="player-crystals">
                <span aria-label="${entry.crystals} kryształów">💎 ${formatNumber(entry.crystals)}</span>
            </span>
        </div>
    `).join('');
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function initEventListeners() {
    // Grid clicks (event delegation)
    elements.mineGrid.addEventListener('click', (e) => {
        const tileEl = e.target.closest('.mine-tile');
        if (!tileEl) return;
        
        const index = parseInt(tileEl.dataset.index);
        if (!isNaN(index)) {
            handleTileClick(index);
        }
    });
    
    // Drill button
    elements.drillBtn.addEventListener('click', () => {
        const unrevealedIndices = gameState.grid
            .map((tile, index) => tile.revealed ? -1 : index)
            .filter(index => index !== -1);
        
        if (unrevealedIndices.length > 0 && gameState.energy > 0) {
            const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            handleTileClick(randomIndex);
        }
    });
    
    // Start game
    document.getElementById('start-game-btn').addEventListener('click', handleGameStart);
    
    // Near-win modal
    document.getElementById('retry-btn').addEventListener('click', () => hideModal(elements.nearwinModal));
    document.getElementById('share-btn').addEventListener('click', handleShare);
    
    // Daily bonus
    document.getElementById('claim-daily').addEventListener('click', handleClaimDaily);
    
    // Mosaic complete
    document.getElementById('claim-mosaic').addEventListener('click', () => {
        hideModal(elements.mosaicCompleteModal);
        renderMosaic();
        updateUI();
    });
    
    // Probability panel
    elements.probToggleBtn.addEventListener('click', () => {
        elements.probPanel.classList.toggle('visible');
    });
    
    document.getElementById('prob-close').addEventListener('click', () => {
        elements.probPanel.classList.remove('visible');
    });
    
    // Leaderboard
    document.getElementById('btn-leaderboard').addEventListener('click', () => {
        updateLeaderboard('daily');
        showModal(elements.leaderboardModal);
    });
    
    document.getElementById('close-leaderboard').addEventListener('click', () => {
        hideModal(elements.leaderboardModal);
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateLeaderboard(btn.dataset.tab);
        });
    });
    
    // Shop
    document.getElementById('btn-shop').addEventListener('click', () => showModal(elements.shopModal));
    document.getElementById('close-shop').addEventListener('click', () => hideModal(elements.shopModal));
    document.getElementById('buy-energy').addEventListener('click', () => handlePurchase('energy', 5, 5));
    document.getElementById('buy-luck').addEventListener('click', () => handlePurchase('luck', 15, 0));
    document.getElementById('buy-dynamite').addEventListener('click', () => handlePurchase('dynamite', 10, 0));
    
    // Help
    document.getElementById('btn-help').addEventListener('click', () => showModal(elements.helpModal));
    document.getElementById('close-help').addEventListener('click', () => hideModal(elements.helpModal));
    
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && !overlay.id.includes('welcome')) {
                hideModal(overlay);
            }
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
    
    // Offline/online detection
    window.addEventListener('online', () => showToast('Połączono z internetem', 'success'));
    window.addEventListener('offline', () => showToast('Tryb offline - postęp zapisywany lokalnie', 'warning'));
}

function handleGameStart() {
    const nameInput = sanitizeString(elements.playerNameInput.value, MAX_PLAYER_NAME_LENGTH);
    const emailInput = elements.playerEmailInput.value.trim();
    
    if (nameInput) {
        gameState.playerName = nameInput;
    }
    
    if (emailInput && isValidEmail(emailInput)) {
        gameState.playerEmail = emailInput;
        gameState.emailCollected = true;
        gameState.energy += 3;
        gameState.maxEnergy = Math.max(gameState.maxEnergy, gameState.energy);
        
        localStorage.setItem('kopalnie_lead', JSON.stringify({
            name: gameState.playerName,
            emailHash: btoa(emailInput), // Basic obfuscation
            timestamp: new Date().toISOString()
        }));
        
        showToast('Otrzymano +3 bonusowej energii!', 'success');
    }
    
    hideModal(elements.welcomeModal);
    
    generateGrid();
    renderMosaic();
    updateUI();
    saveGameStateDebounced();
    
    elements.drillBtn.disabled = false;
    
    if (checkDailyBonus()) {
        setTimeout(() => {
            showModal(elements.dailyModal);
        }, 500);
    }
}

async function handleShare() {
    const text = `Gram w Kopalnie Prawdopodobieństwa! 💎⛏️ Zebrałem ${gameState.totalCrystals} punktów krystalicznych. Spróbuj mnie pobić!`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Kopalnie Prawdopodobieństwa',
                text: text,
                url: window.location.href
            });
            showToast('Udostępniono!', 'success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.log('Share failed:', err);
            }
        }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text + ' ' + window.location.href);
            showToast('Link skopiowany do schowka!', 'success');
        } catch (err) {
            showToast('Nie udało się skopiować', 'error');
        }
    }
    
    hideModal(elements.nearwinModal);
}

function handleClaimDaily() {
    if (window.pendingDailyReward) {
        gameState.energy = Math.min(gameState.energy + window.pendingDailyReward, gameState.maxEnergy + 3);
        window.pendingDailyReward = null;
        updateUI();
        saveGameStateDebounced();
    }
    hideModal(elements.dailyModal);
}

function handlePurchase(type, cost, energyBonus) {
    if (gameState.diamonds < cost) {
        showToast(MESSAGES.shop.insufficientFunds, 'error');
        return;
    }
    
    gameState.diamonds -= cost;
    
    switch(type) {
        case 'energy':
            gameState.energy = Math.min(gameState.energy + energyBonus, gameState.maxEnergy + 5);
            showToast(MESSAGES.shop.energyPurchased, 'success');
            break;
        case 'luck':
            gameState.luckBonus = 0.10;
            gameState.luckTurnsLeft = 10;
            showToast(MESSAGES.shop.luckPurchased, 'success');
            break;
        case 'dynamite':
            gameState.dynamite++;
            showToast(MESSAGES.shop.dynamitePurchased, 'success');
            break;
    }
    
    updateUI();
    saveGameStateDebounced();
}

function handleKeyboard(e) {
    if (e.code === 'Space' && gameState.energy > 0 && !e.target.matches('input, textarea, button')) {
        e.preventDefault();
        elements.drillBtn.click();
    }
    
    if (e.code === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            if (!modal.id.includes('welcome')) {
                hideModal(modal);
            }
        });
        elements.probPanel.classList.remove('visible');
    }
}

// =====================================================
// EXPORTS FOR DEBUGGING
// =====================================================

window.gameState = gameState;
window.CRYSTALS = CRYSTALS;
window.rollCrystal = rollCrystal;
window.calculateModifiedChances = calculateModifiedChances;
