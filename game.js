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

// Polish cities for leaderboard
const polishCities = [
    'Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 
    'Szczecin', 'Łódź', 'Katowice', 'Lublin', 'Białystok',
    'Gdynia', 'Sopot', 'Toruń', 'Zakopane', 'Kielce'
];

function randomCity() {
    return polishCities[Math.floor(Math.random() * polishCities.length)];
}

// Hardcoded Leaderboard Data
const leaderboardData = [
    { name: 'Anna K.', city: 'Warszawa', level: 8, points: 888888.89 },
    { name: 'Piotr M.', city: 'Kraków', level: 7, points: 44444.44 },
    { name: 'Katarzyna W.', city: 'Gdańsk', level: 6, points: 4444.44 },
    { name: 'Michał B.', city: 'Wrocław', level: 5, points: 666.67 },
    { name: 'Zofia L.', city: 'Poznań', level: 4, points: 133.33 },
    { name: 'Jan S.', city: 'Szczecin', level: 3, points: 33.33 },
    { name: 'Ewa P.', city: 'Łódź', level: 2, points: 10 },
    { name: 'Tomasz R.', city: 'Katowice', level: 1, points: 4 }
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
    const leadModal = document.getElementById('leadModal');
    const closeLeadModal = document.getElementById('closeLeadModal');
    
    rescueCard.addEventListener('click', function() {
        if (!gameState.rescueShipEnabled) {
            // Show lead modal to activate rescue ship
            leadModal.style.display = 'block';
        }
    });
    
    // Close modal on X click
    if (closeLeadModal) {
        closeLeadModal.addEventListener('click', function() {
            leadModal.style.display = 'none';
        });
    }
    
    // Close modal on outside click
    leadModal.addEventListener('click', function(e) {
        if (e.target === leadModal) {
            leadModal.style.display = 'none';
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
        const surname = document.getElementById('playerSurname').value;
        const email = document.getElementById('playerEmail').value;
        const consent = document.getElementById('consent').checked;
        
        if (!consent) {
            alert('Musisz wyrazić zgodę na przetwarzanie danych osobowych.');
            return;
        }
        
        // Save player data
        const fullName = `${name} ${surname.charAt(0)}.`;
        gameState.playerName = fullName;
        gameState.playerEmail = email;
        gameState.rescueShipEnabled = true;
        
        // Store in localStorage (simulating lead generation)
        saveLead(fullName, email);
        
        // Hide modal
        leadModal.style.display = 'none';
        
        // Update display
        document.getElementById('displayName').textContent = fullName;
        document.getElementById('rescueStatus').textContent = 'AKTYWNY';
        document.getElementById('rescueInfoCard').classList.add('active');
        document.getElementById('rescueInfoCard').style.cursor = 'default';
        
        // Regenerate current level to add rescue ship
        startLevel(gameState.currentLevel);
        
        showMessage('🛟 Statek ratunkowy został aktywowany! Od teraz pojawia się na planszy.', 'success');
    });
}

function saveLead(fullName, email) {
    try {
        const leads = JSON.parse(localStorage.getItem('pirackiStatekLeads') || '[]');
        leads.push({
            name: fullName,
            email: email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('pirackiStatekLeads', JSON.stringify(leads));
        console.log('Lead saved:', { name: fullName, email });
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
        const pointsText = Math.floor(entry.points).toLocaleString('pl-PL');
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.city || 'N/A'}</td>
            <td>${entry.level}</td>
            <td>${pointsText}</td>
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
        leaderboardData.push({ 
            name: playerName, 
            city: randomCity(),
            level, 
            points 
        });
    }
    
    leaderboardData.sort((a, b) => b.points - a.points);
    
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    leaderboardData.slice(0, 10).forEach((entry, index) => {
        const tr = document.createElement('tr');
        if (entry.name === playerName && entry.points === points && entry.level === level) {
            tr.classList.add('highlight');
        }
        
        const pointsText = Math.floor(entry.points).toLocaleString('pl-PL');
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.city || 'N/A'}</td>
            <td>${entry.level}</td>
            <td>${pointsText}</td>
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
    
    showMessage(`🎉 Trafiony! Teraz masz ${pointsText} kredytów!`, 'success');
    
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
        // If lost on level 1, points are 0
        if (gameState.currentLevel === 1) {
            gameState.points = 0;
        } else {
            // Keep previous level points
            const prevLevel = gameState.currentLevel - 1;
            gameState.points = levelConfig[prevLevel].points;
        }
        
        // Add to leaderboard (even if 0 points)
        const displayLevel = gameState.currentLevel === 1 ? 0 : gameState.currentLevel - 1;
        updateLeaderboard(gameState.playerName, displayLevel, gameState.points);

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
    
    modal.style.display = 'block';
    
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
    
    modal.style.display = 'block';
    
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

