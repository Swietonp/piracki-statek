// Game State
const gameState = {
    playerName: '',
    playerEmail: '',
    rescueShipEnabled: false,  // Whether user has enabled rescue ship (provided email)
    currentLevel: 1,
    points: 2,  // Start with 2 points
    gridRows: 4,
    gridCols: 5,
    shipsCount: 10,
    ships: [],
    rescueShipPosition: null,  // Position of rescue ship on board
    hasUsedRescue: false,      // Whether rescue was used in current level
    gameActive: false
};

// Level Configuration - Larger grids with exact percentages
const levelConfig = {
    1: { gridRows: 4, gridCols: 5, shipsCount: 10, points: 4 },          // 50% (10/20)
    2: { gridRows: 5, gridCols: 5, shipsCount: 10, points: 10 },         // 40% (10/25)
    3: { gridRows: 6, gridCols: 5, shipsCount: 9, points: 33.33 },       // 30% (9/30)
    4: { gridRows: 6, gridCols: 6, shipsCount: 9, points: 133.33 },      // 25% (9/36)
    5: { gridRows: 7, gridCols: 5, shipsCount: 7, points: 666.67 },      // 20% (7/35)
    6: { gridRows: 8, gridCols: 5, shipsCount: 6, points: 4444.44 },     // 15% (6/40)
    7: { gridRows: 8, gridCols: 5, shipsCount: 4, points: 44444.44 },    // 10% (4/40)
    8: { gridRows: 10, gridCols: 6, shipsCount: 3, points: 888888.89 }   // 5% (3/60)
};

// Hardcoded Leaderboard Data
const leaderboardData = [
    { name: 'Anna K.', level: 8, points: 888888.89 },
    { name: 'Piotr M.', level: 7, points: 44444.44 },
    { name: 'Katarzyna W.', level: 6, points: 4444.44 },
    { name: 'Michał B.', level: 5, points: 666.67 },
    { name: 'Zofia L.', level: 4, points: 133.33 },
    { name: 'Jan S.', level: 3, points: 33.33 },
    { name: 'Ewa P.', level: 2, points: 10 },
    { name: 'Tomasz R.', level: 1, points: 4 }
];

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeLeadForm();
    initializeLeaderboard();
    initializeRescueActivation();
    
    // Start game immediately
    startLevel(1);
});

// Initialize rescue activation button
function initializeRescueActivation() {
    const rescueCard = document.getElementById('rescueInfoCard');
    
    rescueCard.addEventListener('click', function() {
        if (!gameState.rescueShipEnabled) {
            // Show lead modal to activate rescue ship
            document.getElementById('leadModal').style.display = 'flex';
        }
    });
    
    // Make it look clickable when not active
    rescueCard.style.cursor = 'pointer';
}

// Lead Generation Form
function initializeLeadForm() {
    const leadForm = document.getElementById('leadForm');
    const leadModal = document.getElementById('leadModal');
    
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('playerName').value;
        const email = document.getElementById('playerEmail').value;
        const consent = document.getElementById('consent').checked;
        
        if (!consent) {
            alert('Musisz zaakceptować przetwarzanie danych osobowych.');
            return;
        }
        
        // Save player data
        gameState.playerName = name;
        gameState.playerEmail = email;
        gameState.rescueShipEnabled = true;
        
        // Store in localStorage (simulating lead generation)
        saveLead(name, email);
        
        // Hide modal
        leadModal.style.display = 'none';
        
        // Update display
        document.getElementById('displayName').textContent = name;
        document.getElementById('rescueStatus').textContent = 'AKTYWNY';
        document.getElementById('rescueInfoCard').classList.add('active');
        document.getElementById('rescueInfoCard').style.cursor = 'default';
        
        // Regenerate current level to add rescue ship
        startLevel(gameState.currentLevel);
        
        showMessage('🛟 Statek ratunkowy został aktywowany! Od teraz pojawia się na planszy.', 'success');
    });
}

function saveLead(name, email) {
    try {
        const leads = JSON.parse(localStorage.getItem('pirackiStatekLeads') || '[]');
        leads.push({
            name: name,
            email: email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('pirackiStatekLeads', JSON.stringify(leads));
        console.log('Lead saved:', { name, email });
    } catch (error) {
        console.error('Error saving lead:', error);
        // Gracefully handle localStorage errors (e.g., quota exceeded, private browsing)
    }
}

// Initialize Leaderboard
function initializeLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    leaderboardData.forEach((entry, index) => {
        const tr = document.createElement('tr');
        const pointsText = entry.points >= 1000 
            ? entry.points.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : entry.points.toFixed(2);
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>Poziom ${entry.level}</td>
            <td>${pointsText} pkt</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateLeaderboard(name, level, points) {
    // Use "Gracz" if no name provided
    const playerName = name || 'Gracz';
    
    // Check if player already exists in leaderboard (avoid duplicates)
    const existingIndex = leaderboardData.findIndex(
        entry => entry.name === playerName && entry.level === level && entry.points === points
    );
    
    if (existingIndex === -1) {
        // Add current player to leaderboard only if not already there
        leaderboardData.push({ name: playerName, level, points });
    }
    
    leaderboardData.sort((a, b) => b.points - a.points);
    
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    leaderboardData.slice(0, 10).forEach((entry, index) => {
        const tr = document.createElement('tr');
        if (entry.name === playerName && entry.points === points && entry.level === level) {
            tr.classList.add('highlight');
        }
        
        const pointsText = entry.points >= 1000 
            ? entry.points.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : entry.points.toFixed(2);
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>Poziom ${entry.level}</td>
            <td>${pointsText} pkt</td>
        `;
        tbody.appendChild(tr);
    });
}

// Start Level
function startLevel(level) {
    // Validate level
    if (!levelConfig[level]) {
        console.error('Invalid level:', level);
        return;
    }
    
    gameState.currentLevel = level;
    gameState.gameActive = true;
    
    const config = levelConfig[level];
    gameState.gridRows = config.gridRows;
    gameState.gridCols = config.gridCols;
    gameState.shipsCount = config.shipsCount;
    
    // Restart sparkle effect for new level
    startSparkleEffect();
    
    // Update UI
    document.getElementById('currentLevel').textContent = level;
    document.getElementById('gridSize').textContent = `${config.gridRows}x${config.gridCols}`;
    document.getElementById('shipsCount').textContent = config.shipsCount;
    
    // Calculate win chance
    const totalTiles = config.gridRows * config.gridCols;
    const winChance = ((config.shipsCount / totalTiles) * 100).toFixed(2);
    document.getElementById('winChance').textContent = `${winChance}%`;
    
    // Generate ships
    generateShips();
    
    // Create board
    createBoard();
    
    // Show message
    showMessage('Wybierz kafelek, aby znaleźć piracki statek!', 'info');
}

// Generate random ship positions
function generateShips() {
    gameState.ships = [];
    gameState.rescueShipPosition = null;
    gameState.hasUsedRescue = false;
    
    const totalTiles = gameState.gridRows * gameState.gridCols;
    const positions = new Set();
    
    while (positions.size < gameState.shipsCount) {
        const pos = Math.floor(Math.random() * totalTiles);
        positions.add(pos);
    }
    
    gameState.ships = Array.from(positions);
    
    // Only spawn rescue ship if it's enabled
    if (gameState.rescueShipEnabled) {
        let rescuePos;
        do {
            rescuePos = Math.floor(Math.random() * totalTiles);
        } while (positions.has(rescuePos)); // Don't place on pirate ship
        
        gameState.rescueShipPosition = rescuePos;
    }
}

// Create game board
function createBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${gameState.gridCols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gameState.gridRows}, 1fr)`;
    
    const totalTiles = gameState.gridRows * gameState.gridCols;
    
    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('button');
        tile.className = 'tile';
        tile.dataset.index = i;
        tile.addEventListener('click', () => handleTileClick(i));
        board.appendChild(tile);
    }
}

// Handle tile click
function handleTileClick(index) {
    if (!gameState.gameActive) return;
    
    const tiles = document.querySelectorAll('.tile');
    const clickedTile = tiles[index];
    
    if (clickedTile.classList.contains('revealed')) return;
    
    // Prevent double-click
    if (clickedTile.dataset.clicking === 'true') return;
    clickedTile.dataset.clicking = 'true';
    
    // Check if clicked on rescue ship (only if enabled)
    const isRescueShip = gameState.rescueShipEnabled && (index === gameState.rescueShipPosition);
    
    // Check if hit pirate ship
    const isHit = gameState.ships.includes(index);
    
    // If clicked rescue ship and haven't used it yet
    if (isRescueShip && !gameState.hasUsedRescue) {
        // Rescue ship is enabled - activate it
        gameState.hasUsedRescue = true;
        clickedTile.classList.add('revealed', 'rescue');
        clickedTile.textContent = '🛟';
        
        showMessage('🛟 Znalazłeś statek ratunkowy! Masz dodatkową próbę!', 'success');
        
        // Don't disable game - player can click again
        return;
    }
    
    // Disable all tiles
    gameState.gameActive = false;
    
    // Reveal all ships (near-win experience)
    setTimeout(() => {
        revealAllShips(index, isHit);
    }, 500);
}

// Reveal all ships for near-win experience
function revealAllShips(clickedIndex, isHit) {
    stopSparkleEffect(); // Stop sparkle when revealing
    
    const tiles = document.querySelectorAll('.tile');
    
    tiles.forEach((tile, idx) => {
        // Skip if already revealed (rescue ship)
        if (tile.classList.contains('revealed')) return;
        
        tile.classList.add('revealed');
        
        if (gameState.ships.includes(idx)) {
            tile.classList.add('ship');
            tile.textContent = '🏴‍☠️';
            
            if (idx === clickedIndex && isHit) {
                tile.classList.add('hit');
                setTimeout(() => {
                    tile.textContent = '💥';
                }, 300);
            }
        } else if (gameState.rescueShipEnabled && idx === gameState.rescueShipPosition) {
            tile.classList.add('rescue');
            tile.textContent = '🛟';
        } else {
            tile.classList.add('miss');
            tile.textContent = '🌊';
        }
    });
    
    // Show result after animation
    setTimeout(() => {
        if (isHit) {
            handleHit();
        } else {
            handleMiss();
        }
    }, 1500);
}

// Handle hit
function handleHit() {
    const config = levelConfig[gameState.currentLevel];
    gameState.points = config.points;  // Replace points with new amount
    
    const pointsText = config.points >= 1000 
        ? config.points.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : config.points.toFixed(2);
    
    document.getElementById('currentPoints').textContent = pointsText;
    
    showMessage(`🎉 Trafiony! Teraz masz ${pointsText} pkt!`, 'success');
    
    // Check if final level
    if (gameState.currentLevel === 8) {
        setTimeout(() => {
            updateLeaderboard(gameState.playerName, 8, gameState.points);
            showGameOver(true);
        }, 1000);
    } else {
        setTimeout(() => {
            showDecisionModal();
        }, 1000);
    }
}

// Handle miss
function handleMiss() {
    showMessage('💔 Pudło! Nie trafiłeś w żaden statek.', 'error');
    
    // Game over immediately on miss
    setTimeout(() => {
        // Keep previous level points (0 if lost on level 1)
        const prevLevel = gameState.currentLevel - 1;
        const prevPoints = prevLevel >= 1 ? levelConfig[prevLevel].points : 0;
        gameState.points = prevPoints;
        
        // Don't add to leaderboard if level 0 (lost on first level)
        const leaderboardLevel = Math.max(prevLevel, 0);
        if (prevPoints > 0 || prevLevel > 0) {
            updateLeaderboard(gameState.playerName, leaderboardLevel, gameState.points);
        }
        
        showGameOver(false);
    }, 2000);
}

// Show decision modal (continue or cash out)
function showDecisionModal() {
    const modal = document.getElementById('decisionModal');
    
    const pointsText = gameState.points >= 1000 
        ? gameState.points.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : gameState.points.toFixed(2);
    
    document.getElementById('decisionPoints').textContent = pointsText;
    
    modal.style.display = 'flex';
    
    // Cash out button
    document.getElementById('cashoutBtn').onclick = function() {
        modal.style.display = 'none';
        updateLeaderboard(gameState.playerName, gameState.currentLevel, gameState.points);
        showGameOver(true);
    };
    
    // Continue button
    document.getElementById('continueBtn').onclick = function() {
        modal.style.display = 'none';
        startLevel(gameState.currentLevel + 1);
    };
}


// Show game over modal
function showGameOver(isWin) {
    const modal = document.getElementById('gameOverModal');
    const title = document.getElementById('gameOverTitle');
    const message = document.getElementById('gameOverMessage');
    const finalPoints = document.getElementById('finalPoints');
    
    if (isWin && gameState.currentLevel === 8) {
        title.textContent = '🏆 WIELKA WYGRANA!';
        message.textContent = 'Gratulacje! Ukończyłeś wszystkie poziomy!';
    } else if (isWin) {
        title.textContent = '🎉 Gratulacje!';
        message.textContent = 'Zakończyłeś grę z sukcesem!';
    } else {
        title.textContent = '💔 Koniec gry';
        message.textContent = 'Tym razem się nie udało, ale spróbuj ponownie!';
    }
    
    const pointsText = gameState.points >= 1000 
        ? gameState.points.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : gameState.points.toFixed(2);
    
    finalPoints.textContent = pointsText;
    
    modal.style.display = 'flex';
    
    // Play again button
    document.getElementById('playAgainBtn').onclick = function() {
        modal.style.display = 'none';
        resetGame();
        startLevel(1);
    };
}

// Reset game
function resetGame() {
    gameState.currentLevel = 1;
    gameState.points = 2;  // Start points
    gameState.gameActive = false;
    gameState.hasUsedRescue = false;
    
    // Reset UI
    document.getElementById('currentPoints').textContent = '2.00';
    
    // Restart sparkle effect
    startSparkleEffect();
}

// Show message
function showMessage(text, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = text;
    messageBox.className = `message-box ${type}`;
}

// Visual effects
let sparkleInterval = null;

function startSparkleEffect() {
    stopSparkleEffect(); // Clear any existing interval
    sparkleInterval = setInterval(() => {
        if (!gameState.gameActive) return; // Don't sparkle when game is not active
        const tiles = document.querySelectorAll('.tile:not(.revealed)');
        if (tiles.length > 0) {
            const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
            randomTile.style.transform = 'scale(1.05)';
            setTimeout(() => {
                if (randomTile) randomTile.style.transform = '';
            }, 300);
        }
    }, 3000);
}

function stopSparkleEffect() {
    if (sparkleInterval) {
        clearInterval(sparkleInterval);
        sparkleInterval = null;
    }
}

window.addEventListener('load', startSparkleEffect);

