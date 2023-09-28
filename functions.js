new p5();

var animationTick = 0;

var noiseGrid = [];
var randomGrid = [];

noiseDetail(3, 0.6);
var setNoiseGrid = function() {
    noiseGrid = [];
    for (var i = 0; i < gridSize + 1; i++) {
        noiseGrid[i] = [];
        for (var j = 0; j < gridSize + 1; j++) {
            noiseGrid[i][j] = noise(j / 2, i / 2, 0);
        }
    }
};
var updateNoiseGrid = function(x, y) {
    return noise(x / 4, y / 4, animationTick / 10);
};
var setRandomGrid = function() {
    randomSeed(1);
    randomGrid = [];
    for (var i = 0; i < gridSize + 1; i++) {
        randomGrid[i] = [];
        for (var j = 0; j < gridSize + 1; j++) {
            randomGrid[i][j] = random();
        }
    }
};
var getRandom = function(x, y) {
    // randomSeed(gameTick / 1000003 + (y * gridSize + x) / 1000033);
    // random();
    // randomSeed(randomGrid[y][x] * 1000003);
    // randomSeed(gameTick * 1000003 + (y * gridSize + x) * 7772777)
    // randomGrid[y][x] = random();
    return random();
};