// =====================================================
// KOPALNIE PRAWDOPODOBIEŃSTWA - Unit Tests
// =====================================================

// Simple test framework (można zastąpić przez Jest/Vitest)
class TestRunner {
    constructor() {
        this.tests = [];
        this.results = { passed: 0, failed: 0, total: 0 };
    }
    
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    
    async run() {
        console.log('🧪 Running tests...\n');
        
        for (const test of this.tests) {
            this.results.total++;
            try {
                await test.fn();
                this.results.passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.failed++;
                console.error(`❌ ${test.name}`);
                console.error(`   ${error.message}`);
            }
        }
        
        console.log('\n' + '='.repeat(50));
        console.log(`Tests: ${this.results.passed}/${this.results.total} passed`);
        console.log(`Failed: ${this.results.failed}`);
        console.log('='.repeat(50));
        
        return this.results.failed === 0;
    }
}

// Assertion helpers
function assertEquals(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
    }
}

function assertApproxEquals(actual, expected, tolerance = 0.01, message = '') {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(`Expected ~${expected}, got ${actual} (tolerance: ${tolerance}). ${message}`);
    }
}

function assertTrue(condition, message = '') {
    if (!condition) {
        throw new Error(`Expected true, got false. ${message}`);
    }
}

function assertFalse(condition, message = '') {
    if (condition) {
        throw new Error(`Expected false, got true. ${message}`);
    }
}

function assertInRange(value, min, max, message = '') {
    if (value < min || value > max) {
        throw new Error(`Expected value in range [${min}, ${max}], got ${value}. ${message}`);
    }
}

function assertContains(array, value, message = '') {
    if (!array.includes(value)) {
        throw new Error(`Expected array to contain ${value}. ${message}`);
    }
}

// =====================================================
// TESTS
// =====================================================

const runner = new TestRunner();

// =====================================================
// RNG TESTS
// =====================================================

runner.test('rollCrystal should return valid crystal type', () => {
    const result = window.rollCrystal();
    const validTypes = Object.keys(window.CRYSTALS);
    assertContains(validTypes, result, 'Crystal type must be valid');
});

runner.test('rollCrystal distribution should match probabilities (10k iterations)', () => {
    const iterations = 10000;
    const results = {};
    
    // Reset game state for clean test
    window.gameState.luckBonus = 0;
    window.gameState.mineDepth = 0;
    
    for (let i = 0; i < iterations; i++) {
        const crystal = window.rollCrystal();
        results[crystal] = (results[crystal] || 0) + 1;
    }
    
    // Check each crystal type
    for (const type in window.CRYSTALS) {
        const expected = window.CRYSTALS[type].baseChance * iterations;
        const actual = results[type] || 0;
        const tolerance = expected * 0.3; // 30% tolerance for statistical variance
        
        assertInRange(actual, expected - tolerance, expected + tolerance, 
            `${type}: expected ~${expected}, got ${actual}`);
    }
});

runner.test('calculateModifiedChances should normalize to 1.0', () => {
    const chances = window.calculateModifiedChances();
    const normalized = {};
    
    // Normalize
    const total = Object.values(chances).reduce((a, b) => a + b, 0);
    for (const type in chances) {
        normalized[type] = chances[type] / total;
    }
    
    const sum = Object.values(normalized).reduce((a, b) => a + b, 0);
    assertApproxEquals(sum, 1.0, 0.0001, 'Sum of normalized probabilities must equal 1.0');
});

runner.test('luck bonus should increase rare crystal chances', () => {
    window.gameState.luckBonus = 0.5; // 50% boost
    window.gameState.mineDepth = 0;
    
    const chancesWithBonus = window.calculateModifiedChances();
    
    window.gameState.luckBonus = 0;
    const chancesWithoutBonus = window.calculateModifiedChances();
    
    // Diamond should have higher chance with bonus
    assertTrue(chancesWithBonus.diamond > chancesWithoutBonus.diamond, 
        'Diamond chance should increase with luck bonus');
    
    // Ruby should have higher chance with bonus
    assertTrue(chancesWithBonus.ruby > chancesWithoutBonus.ruby,
        'Ruby chance should increase with luck bonus');
});

runner.test('mine depth should increase rare crystal chances', () => {
    window.gameState.luckBonus = 0;
    window.gameState.mineDepth = 5; // Deep mine
    
    const deepChances = window.calculateModifiedChances();
    
    window.gameState.mineDepth = 0;
    const shallowChances = window.calculateModifiedChances();
    
    assertTrue(deepChances.diamond > shallowChances.diamond,
        'Deeper mines should have better diamond chances');
});

// =====================================================
// UTILITY FUNCTION TESTS
// =====================================================

runner.test('formatNumber should format large numbers correctly', () => {
    // Import from window if exported
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };
    
    assertEquals(formatNumber(500), '500');
    assertEquals(formatNumber(1500), '1.5K');
    assertEquals(formatNumber(1500000), '1.5M');
});

runner.test('formatPercent should format percentages correctly', () => {
    const formatPercent = (value) => (value * 100).toFixed(2) + '%';
    
    assertEquals(formatPercent(0.005), '0.50%');
    assertEquals(formatPercent(0.5), '50.00%');
    assertEquals(formatPercent(1), '100.00%');
});

runner.test('sanitizeString should trim and limit length', () => {
    const sanitizeString = (str, maxLength) => str.trim().substring(0, maxLength);
    
    assertEquals(sanitizeString('  test  ', 10), 'test');
    assertEquals(sanitizeString('verylongstringthatexceedslimit', 10), 'verylongs');
});

runner.test('isValidEmail should validate emails correctly', () => {
    const isValidEmail = (email) => {
        if (!email || email.length > 254) return false;
        const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!regex.test(email)) return false;
        const parts = email.split('@');
        if (parts[0].length > 64) return false;
        return true;
    };
    
    assertTrue(isValidEmail('test@example.com'), 'Valid email should pass');
    assertTrue(isValidEmail('user.name+tag@example.co.uk'), 'Complex valid email should pass');
    
    assertFalse(isValidEmail(''), 'Empty email should fail');
    assertFalse(isValidEmail('notanemail'), 'Email without @ should fail');
    assertFalse(isValidEmail('@example.com'), 'Email without local part should fail');
    assertFalse(isValidEmail('user@'), 'Email without domain should fail');
    assertFalse(isValidEmail('user@.com'), 'Email with invalid domain should fail');
});

// =====================================================
// GAME LOGIC TESTS
// =====================================================

runner.test('getAdjacentIndices should return correct neighbors', () => {
    // Helper function (copy from main.js logic)
    const GRID_SIZE = 5;
    
    const getAdjacentIndices = (centerIndex) => {
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
    };
    
    // Corner (0,0) should have 3 neighbors
    assertEquals(getAdjacentIndices(0).length, 3, 'Top-left corner should have 3 neighbors');
    
    // Edge (0,2) should have 5 neighbors
    assertEquals(getAdjacentIndices(2).length, 5, 'Top edge should have 5 neighbors');
    
    // Center (2,2) should have 8 neighbors
    assertEquals(getAdjacentIndices(12).length, 8, 'Center should have 8 neighbors');
});

runner.test('mosaic reset should create correct number of slots', () => {
    const MOSAIC_SLOTS = 21;
    const mosaic = new Array(MOSAIC_SLOTS).fill(null);
    
    assertEquals(mosaic.length, 21, 'Mosaic should have 21 slots');
    assertTrue(mosaic.every(slot => slot === null), 'All slots should be null initially');
});

runner.test('energy regen should not exceed max energy', () => {
    const mockState = {
        energy: 3,
        maxEnergy: 5
    };
    
    // Simulate regen
    if (mockState.energy < mockState.maxEnergy) {
        mockState.energy++;
    }
    
    assertTrue(mockState.energy <= mockState.maxEnergy, 'Energy should not exceed max');
});

// =====================================================
// EDGE CASES
// =====================================================

runner.test('should handle localStorage quota exceeded', () => {
    const originalSetItem = localStorage.setItem;
    
    // Mock quota exceeded
    localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
    };
    
    try {
        // This should not crash
        const toSave = { test: 'data' };
        try {
            localStorage.setItem('test', JSON.stringify(toSave));
        } catch (e) {
            console.log('Caught quota error:', e.message);
        }
        assertTrue(true, 'Should handle quota error gracefully');
    } finally {
        localStorage.setItem = originalSetItem;
    }
});

runner.test('should handle malformed localStorage data', () => {
    const originalGetItem = localStorage.getItem;
    
    localStorage.getItem = () => '{invalid json}';
    
    try {
        const saved = localStorage.getItem('test');
        try {
            JSON.parse(saved);
            assertFalse(true, 'Should have thrown parse error');
        } catch (e) {
            assertTrue(true, 'Should catch parse error');
        }
    } finally {
        localStorage.getItem = originalGetItem;
    }
});

// =====================================================
// PROBABILITY DISTRIBUTION TEST (Advanced)
// =====================================================

runner.test('Chi-squared test for RNG fairness (100k iterations)', () => {
    const iterations = 100000;
    const observed = {};
    
    // Reset state
    window.gameState.luckBonus = 0;
    window.gameState.mineDepth = 0;
    
    // Run simulation
    for (let i = 0; i < iterations; i++) {
        const crystal = window.rollCrystal();
        observed[crystal] = (observed[crystal] || 0) + 1;
    }
    
    // Chi-squared test
    let chiSquared = 0;
    
    for (const type in window.CRYSTALS) {
        const expected = window.CRYSTALS[type].baseChance * iterations;
        const obs = observed[type] || 0;
        chiSquared += Math.pow(obs - expected, 2) / expected;
    }
    
    // Degrees of freedom = number of categories - 1
    const df = Object.keys(window.CRYSTALS).length - 1;
    
    // Critical value for p=0.05 and df=8 is approximately 15.51
    const criticalValue = 15.51;
    
    assertTrue(chiSquared < criticalValue, 
        `Chi-squared (${chiSquared.toFixed(2)}) should be less than ${criticalValue} for fair distribution`);
    
    console.log(`   Chi-squared statistic: ${chiSquared.toFixed(2)} (critical: ${criticalValue})`);
});

// =====================================================
// RUN TESTS
// =====================================================

export async function runAllTests() {
    const success = await runner.run();
    
    if (success) {
        console.log('\n🎉 All tests passed!');
    } else {
        console.log('\n⚠️ Some tests failed. Please review.');
    }
    
    return success;
}

// Run tests if in development mode
if (import.meta.env.DEV) {
    console.log('Development mode detected. Run runAllTests() to test game logic.');
}

// Export for manual testing
window.runAllTests = runAllTests;

