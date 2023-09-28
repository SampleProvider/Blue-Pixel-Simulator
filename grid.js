// objects are 

var idGrid = [];
var nextIdGrid = [];
var rotationGrid = [];
var nextRotationGrid = [];
var dataGrid = [];
var nextDataGrid = [];
var fireGrid = [];
var nextFireGrid = [];
var puzzleGrid = [];
var targetGrid = [];
var lastGrid = null;
var gameGrids = [];
var redrawGrid = [];
var redrawFireGrid = [];
var redrawX1 = 0;
var redrawX2 = 0;
var redrawY1 = 0;
var redrawY2 = 0;
var gridSize = 100;

var createGrid = function() {
    idGrid = [];
    nextIdGrid = [];
    rotationGrid = [];
    nextRotationGrid = [];
    dataGrid = [];
    nextDataGrid = [];
    fireGrid = [];
    nextFireGrid = [];
    puzzleGrid = [];
    targetGrid = [];
    redrawGrid = [];
    redrawFireGrid = [];
    for (var i = 0; i < gridSize; i++) {
        idGrid[i] = [];
        nextIdGrid[i] = [];
        rotationGrid[i] = [];
        nextRotationGrid[i] = [];
        dataGrid[i] = [];
        nextDataGrid[i] = [];
        fireGrid[i] = [];
        nextFireGrid[i] = [];
        puzzleGrid[i] = [];
        targetGrid[i] = [];
        redrawGrid[i] = [];
        redrawFireGrid[i] = [];
        for (var j = 0; j < gridSize; j++) {
            idGrid[i][j] = AIR;
            nextIdGrid[i][j] = null;
            rotationGrid[i][j] = 0;
            nextRotationGrid[i][j] = null;
            dataGrid[i][j] = 0;
            nextDataGrid[i][j] = null;
            fireGrid[i][j] = false;
            nextFireGrid[i][j] = null;
            puzzleGrid[i][j] = 0;
            targetGrid[i][j] = 0;
            redrawGrid[i][j] = false;
            redrawFireGrid[i][j] = false;
        }
    }
};
var resetGrid = function() {
    gameTick = 0;
    tickDisplay.innerHTML = `Tick: ${gameTick};`;
    setNoiseGrid();
    setRandomGrid();
    lastGrid = null;
    createCanvas();
    drawGrid();
    drawPuzzleGrid();
    drawTargets();
    drawCanvas();
    storeGrid();
    runState = 0;
    updateControlButtons();
};
var drawPixel = function(x, y, id, rotation, data, ctx) {
    if (pixels[id].drawNoise) {
        if (pixels[id].animationSpeed == 1) {
            ctx.fillStyle = colorTint(colors[id], updateNoiseGrid(x, y));
            ctx.fillRect(x * 6, y * 6, 6, 6);
        }
        else {
            ctx.fillStyle = colorTint(colors[id], noiseGrid[y][x]);
            ctx.fillRect(x * 6, y * 6, 6, 6);
        }
    }
    if (id == PIXELITE_CRYSTAL) {
        var frame = 0;
        if (data == 0) {
            frame = 0;
        }
        else if (data <= 2) {
            frame = 1;
        }
        else if (data <= 4) {
            frame = 2;
        }
        else if (data <= 9) {
            frame = 3;
        }
        else if (data <= 24) {
            frame = 4;
        }
        else if (data <= 49) {
            frame = 5;
        }
        else if (data <= 99) {
            frame = 6;
        }
        else if (data <= 199) {
            frame = 7;
        }
        else if (data <= 499) {
            frame = 8;
        }
        else {
            frame = 9;
        }
        ctx.drawImage(pixels[id].renderedCanvas[rotation][Math.floor(animationTick / pixels[id].animationSpeed) % pixels[id].animationFrames][frame], x * 6, y * 6, 6, 6);
    }
    else if (pixels[id].renderedCanvas) {
        if (pixels[id].animationSpeed > 0) {
            if (Array.isArray(data)) {
                ctx.drawImage(pixels[id].renderedCanvas[rotation][Math.floor(animationTick / pixels[id].animationSpeed) % pixels[id].animationFrames][data[0]], x * 6, y * 6, 6, 6);
            }
            else {
                ctx.drawImage(pixels[id].renderedCanvas[rotation][Math.floor(animationTick / pixels[id].animationSpeed) % pixels[id].animationFrames][data], x * 6, y * 6, 6, 6);
            }
        }
        else {
            if (Array.isArray(data)) {
                ctx.drawImage(pixels[id].renderedCanvas[rotation][0][data[0]], x * 6, y * 6, 6, 6);
            }
            else {
                ctx.drawImage(pixels[id].renderedCanvas[rotation][0][data], x * 6, y * 6, 6, 6);
            }
        }
    }
};
var drawDrawCalls = function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
    for (var i in drawCallX1) {
        if (pixels[i].drawBackground == 1) {
            ctx.fillStyle = colors[i][0];
            for (var j in drawCallX1[i]) {
                ctx.fillRect(drawCallX1[i][j] * 6, drawCallY[i][j] * 6, (drawCallX2[i][j] - drawCallX1[i][j]) * 6, 6);
            }
        }
        for (var j in drawCallX1[i]) {
            for (var k = drawCallX1[i][j]; k < drawCallX2[i][j]; k++) {
                drawPixel(k, drawCallY[i][j], i, drawCallRotation[i][j], drawCallData[i][j], ctx);
            }
        }
        if (pixels[i].draw) {
            pixels[i].draw(drawCallX1[i], drawCallX2[i], drawCallY[i], drawCallRotation[i], drawCallData[i], ctx);
        }
    }
};
var drawGrid = function() {
    offscreenAboveCtx.clearRect(0, 0, gridSize * 6, gridSize * 6);
    var drawCallX1 = {};
    var drawCallX2 = {};
    var drawCallY = {};
    var drawCallRotation = {};
    var drawCallData = {};
    var id = null;
    var rotation = 0;
    var data = 0;
    var pixelX = 0;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (id == null) {
                id = idGrid[i][j];
                rotation = rotationGrid[i][j];
                data = dataGrid[i][j];
                pixelX = j;
            }
            if (id != idGrid[i][j] || rotation != rotationGrid[i][j] || data != dataGrid[i][j]) {
                if (pixels[id].drawBackground == 2) {
                    if (pixels[id].drawNoise) {
                        if (pixels[id].animationSpeed == 1) {
                            for (var k = pixelX; k < j; k++) {
                                offscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k, i));
                                offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                            }
                        }
                        else {
                            for (var k = pixelX; k < j; k++) {
                                offscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i][k]);
                                offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                            }
                        }
                    }
                    else {
                        offscreenCtx.fillStyle = colors[id];
                        offscreenCtx.fillRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
                    }
                }
                else {
                    if (!drawCallX1[id]) {
                        drawCallX1[id] = [pixelX];
                        drawCallX2[id] = [j];
                        drawCallY[id] = [i];
                        drawCallRotation[id] = [rotation];
                        drawCallData[id] = [data];
                    }
                    else {
                        drawCallX1[id].push(pixelX);
                        drawCallX2[id].push(j);
                        drawCallY[id].push(i);
                        drawCallRotation[id].push(rotation);
                        drawCallData[id].push(data);
                    }
                }
                id = idGrid[i][j];
                rotation = rotationGrid[i][j];
                data = dataGrid[i][j];
                pixelX = j;
            }
        }
        if (pixels[id].drawBackground == 2) {
            if (pixels[id].drawNoise) {
                if (pixels[id].animationSpeed == 1) {
                    for (var k = pixelX; k < gridSize; k++) {
                        offscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k, i));
                        offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                    }
                }
                else {
                    for (var k = pixelX; k < gridSize; k++) {
                        offscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i][k]);
                        offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                    }
                }
            }
            else {
                offscreenCtx.fillStyle = colors[id];
                offscreenCtx.fillRect(pixelX * 6, i * 6, (gridSize - pixelX) * 6, 6);
            }
        }
        else {
            if (!drawCallX1[id]) {
                drawCallX1[id] = [pixelX];
                drawCallX2[id] = [gridSize];
                drawCallY[id] = [i];
                drawCallRotation[id] = [rotation];
                drawCallData[id] = [data];
            }
            else {
                drawCallX1[id].push(pixelX);
                drawCallX2[id].push(gridSize);
                drawCallY[id].push(i);
                drawCallRotation[id].push(rotation);
                drawCallData[id].push(data);
            }
        }
        id = null;
    }
    drawDrawCalls(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, offscreenCtx);
    var fire = null;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (fire == null) {
                fire = fireGrid[i][j];
                pixelX = j;
            }
            if (fire != fireGrid[i][j]) {
                offscreenFireCtx.clearRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
                if (fire) {
                    for (var k = pixelX; k < j; k++) {
                        pixels[FIRE].draw(k, i, offscreenFireCtx);
                    }
                }
                fire = fireGrid[i][j];
                pixelX = j;
            }
        }
        offscreenFireCtx.clearRect(pixelX * 6, i * 6, (gridSize - pixelX) * 6, 6);
        if (fire) {
            for (var k = pixelX; k < gridSize; k++) {
                pixels[FIRE].draw(k, i, offscreenFireCtx);
            }
        }
        fire = null;
    }
};
var drawRedrawGrid = function() {
    offscreenAboveCtx.clearRect(0, 0, gridSize * 6, gridSize * 6);
    var drawCallX1 = {};
    var drawCallX2 = {};
    var drawCallY = {};
    var drawCallRotation = {};
    var drawCallData = {};
    var id = null;
    var rotation = 0;
    var data = 0;
    var pixelX = 0;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            // if (redrawGrid[i][j] || (pixels[idGrid[i][j]].animationSpeed > 0 && (animationTick & (pixels[idGrid[i][j]].animationSpeed - 1) > 0))) {
            if (redrawGrid[i][j] || (pixels[idGrid[i][j]].animationSpeed > 0 && (pixels[idGrid[i][j]].animationSpeed == 1 || animationTick & (pixels[idGrid[i][j]].animationSpeed - 1) > 0))) {
                if (id == null) {
                    id = idGrid[i][j];
                    rotation = rotationGrid[i][j];
                    data = dataGrid[i][j];
                    pixelX = j;
                }
                if (id != idGrid[i][j] || rotation != rotationGrid[i][j] || data != dataGrid[i][j]) {
                    if (pixels[id].drawBackground == 2) {
                        if (pixels[id].drawNoise) {
                            if (pixels[id].animationSpeed == 1) {
                                for (var k = pixelX; k < j; k++) {
                                    offscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k, i));
                                    offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                                }
                            }
                            else {
                                for (var k = pixelX; k < j; k++) {
                                    offscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i][k]);
                                    offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                                }
                            }
                        }
                        else {
                            offscreenCtx.fillStyle = colors[id];
                            offscreenCtx.fillRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
                        }
                    }
                    else {
                        if (!drawCallX1[id]) {
                            drawCallX1[id] = [pixelX];
                            drawCallX2[id] = [j];
                            drawCallY[id] = [i];
                            drawCallRotation[id] = [rotation];
                            drawCallData[id] = [data];
                        }
                        else {
                            drawCallX1[id].push(pixelX);
                            drawCallX2[id].push(j);
                            drawCallY[id].push(i);
                            drawCallRotation[id].push(rotation);
                            drawCallData[id].push(data);
                        }
                    }
                    id = idGrid[i][j];
                    rotation = rotationGrid[i][j];
                    data = dataGrid[i][j];
                    pixelX = j;
                }
            }
            else if (id != null) {
                if (pixels[id].drawBackground == 2) {
                    if (pixels[id].drawNoise) {
                        if (pixels[id].animationSpeed == 1) {
                            for (var k = pixelX; k < j; k++) {
                                offscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k, i));
                                offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                            }
                        }
                        else {
                            for (var k = pixelX; k < j; k++) {
                                offscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i][k]);
                                offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                            }
                        }
                    }
                    else {
                        offscreenCtx.fillStyle = colors[id];
                        offscreenCtx.fillRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
                    }
                }
                else {
                    if (!drawCallX1[id]) {
                        drawCallX1[id] = [pixelX];
                        drawCallX2[id] = [j];
                        drawCallY[id] = [i];
                        drawCallRotation[id] = [rotation];
                        drawCallData[id] = [data];
                    }
                    else {
                        drawCallX1[id].push(pixelX);
                        drawCallX2[id].push(j);
                        drawCallY[id].push(i);
                        drawCallRotation[id].push(rotation);
                        drawCallData[id].push(data);
                    }
                }
                id = null;
            }
        }
        if (id != null) {
            if (pixels[id].drawBackground == 2) {
                if (pixels[id].drawNoise) {
                    if (pixels[id].animationSpeed == 1) {
                        for (var k = pixelX; k < gridSize; k++) {
                            offscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k, i));
                            offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                        }
                    }
                    else {
                        for (var k = pixelX; k < gridSize; k++) {
                            offscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i][k]);
                            offscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                        }
                    }
                }
                else {
                    offscreenCtx.fillStyle = colors[id];
                    offscreenCtx.fillRect(pixelX * 6, i * 6, (gridSize - pixelX) * 6, 6);
                }
            }
            else {
                if (!drawCallX1[id]) {
                    drawCallX1[id] = [pixelX];
                    drawCallX2[id] = [gridSize];
                    drawCallY[id] = [i];
                    drawCallRotation[id] = [rotation];
                    drawCallData[id] = [data];
                }
                else {
                    drawCallX1[id].push(pixelX);
                    drawCallX2[id].push(gridSize);
                    drawCallY[id].push(i);
                    drawCallRotation[id].push(rotation);
                    drawCallData[id].push(data);
                }
            }
            id = null;
        }
    }
    drawDrawCalls(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, offscreenCtx);
    var fire = null;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (redrawFireGrid[i][j]) {
                if (fire == null) {
                    fire = fireGrid[i][j];
                    pixelX = j;
                }
                if (fire != fireGrid[i][j]) {
                    offscreenFireCtx.clearRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
                    if (fire) {
                        for (var k = pixelX; k < j; k++) {
                            pixels[FIRE].draw(k, i, offscreenFireCtx);
                        }
                    }
                    fire = fireGrid[i][j];
                    pixelX = j;
                }
            }
            else if (fire != null) {
                offscreenFireCtx.clearRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
                if (fire) {
                    for (var k = pixelX; k < j; k++) {
                        pixels[FIRE].draw(k, i, offscreenFireCtx);
                    }
                }
                fire = null;
            }
        }
        if (fire != null) {
            offscreenFireCtx.clearRect(pixelX * 6, i * 6, (gridSize - pixelX) * 6, 6);
            if (fire) {
                for (var k = pixelX; k < gridSize; k++) {
                    pixels[FIRE].draw(k, i, offscreenFireCtx);
                }
            }
            fire = null;
        }
    }
};
var drawPuzzleGrid = function() {
    offscreenPuzzleCtx.clearRect(0, 0, gridSize * 6, gridSize * 6);
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (puzzleGrid[i][j] == 1) {
                drawPixel(j, i, RESTRICT_PLACEMENT, 0, 0, offscreenPuzzleCtx);
            }
        }
    }
    drawPuzzleCanvas();
};
var drawTargets = function() {
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (targetGrid[i][j] == 1) {
                drawPixel(j, i, TARGET, 0, 0, offscreenCtx);
                pixels[TARGET].draw([j], [j + 1], [i], [0], [0], offscreenCtx);
            }
        }
    }
};
var updateTick = function() {
    randomSeed(1000003 * gameTick);
    effects.oscillator.reset();
    var updated = [false, false, false, false, false, false, false, false, false, false, false, false];
    var monsters = 0;
    var filledTargets = 0;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (idGrid[i][j] == MONSTER) {
                monsters += 1;
            }
            if (idGrid[i][j] == GOAL && targetGrid[i][j] == 1) {
                filledTargets += 1;
            }
            if (fireGrid[i][j]) {
                pixels[FIRE].update(j, i);
            }
        }
    }
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (nextIdGrid[i][j] != null) {
                if (idGrid[i][j] != nextIdGrid[i][j]) {
                    redrawGrid[i][j] = true;
                    idGrid[i][j] = nextIdGrid[i][j];
                }
                nextIdGrid[i][j] = null;
            }
            if (nextRotationGrid[i][j] != null) {
                if (rotationGrid[i][j] != nextRotationGrid[i][j]) {
                    redrawGrid[i][j] = true;
                    rotationGrid[i][j] = nextRotationGrid[i][j];
                }
                nextRotationGrid[i][j] = null;
            }
            if (nextDataGrid[i][j] != null) {
                if (dataGrid[i][j] != nextDataGrid[i][j]) {
                    redrawGrid[i][j] = true;
                    dataGrid[i][j] = nextDataGrid[i][j];
                }
                nextDataGrid[i][j] = null;
            }
            if (nextFireGrid[i][j] != null) {
                fireGrid[i][j] = nextFireGrid[i][j];
                redrawFireGrid[i][j] = true;
                nextFireGrid[i][j] = null;
            }
        }
    }
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            var updateStage = pixels[idGrid[i][j]].updateStage;
            if (updateStage == 1) {
                pixels[idGrid[i][j]].update(j, i);
            }
        }
    }
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (nextIdGrid[i][j] != null) {
                if (idGrid[i][j] != nextIdGrid[i][j]) {
                    redrawGrid[i][j] = true;
                    idGrid[i][j] = nextIdGrid[i][j];
                }
                nextIdGrid[i][j] = null;
            }
            if (nextRotationGrid[i][j] != null) {
                if (rotationGrid[i][j] != nextRotationGrid[i][j]) {
                    redrawGrid[i][j] = true;
                    rotationGrid[i][j] = nextRotationGrid[i][j];
                }
                nextRotationGrid[i][j] = null;
            }
            if (nextDataGrid[i][j] != null) {
                if (dataGrid[i][j] != nextDataGrid[i][j]) {
                    redrawGrid[i][j] = true;
                    dataGrid[i][j] = nextDataGrid[i][j];
                }
                nextDataGrid[i][j] = null;
            }
            if (nextFireGrid[i][j] != null) {
                fireGrid[i][j] = nextFireGrid[i][j];
                redrawFireGrid[i][j] = true;
                nextFireGrid[i][j] = null;
            }
        }
    }
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            var updateStage = pixels[idGrid[i][j]].updateStage;
            if (updateStage >= 2) {
                updated[updateStage * 4 + rotationGrid[i][j] - 8] = true;
            }
        }
    }
    for (var updateStage = 2; updateStage <= 4; updateStage++) {
        for (var rotation = 0; rotation < 4; rotation++) {
            if (!updated[updateStage * 4 + rotation - 8]) {
                continue;
            }
            if (rotation == 0 || rotation == 3) {
                for (var i = gridSize - 1; i >= 0; i--) {
                    for (var j = gridSize - 1; j >= 0; j--) {
                        if (pixels[idGrid[i][j]].updateStage == updateStage && rotationGrid[i][j] == rotation) {
                            pixels[idGrid[i][j]].update(j, i);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < gridSize; i++) {
                    for (var j = 0; j < gridSize; j++) {
                        if (pixels[idGrid[i][j]].updateStage == updateStage && rotationGrid[i][j] == rotation) {
                            pixels[idGrid[i][j]].update(j, i);
                        }
                    }
                }
            }
            for (var i = 0; i < gridSize; i++) {
                for (var j = 0; j < gridSize; j++) {
                    if (nextIdGrid[i][j] != null) {
                        if (idGrid[i][j] != nextIdGrid[i][j]) {
                            redrawGrid[i][j] = true;
                            idGrid[i][j] = nextIdGrid[i][j];
                        }
                        nextIdGrid[i][j] = null;
                    }
                    if (nextRotationGrid[i][j] != null) {
                        if (rotationGrid[i][j] != nextRotationGrid[i][j]) {
                            redrawGrid[i][j] = true;
                            rotationGrid[i][j] = nextRotationGrid[i][j];
                        }
                        nextRotationGrid[i][j] = null;
                    }
                    if (nextDataGrid[i][j] != null) {
                        if (dataGrid[i][j] != nextDataGrid[i][j]) {
                            redrawGrid[i][j] = true;
                            dataGrid[i][j] = nextDataGrid[i][j];
                        }
                        nextDataGrid[i][j] = null;
                    }
                    if (nextFireGrid[i][j] != null) {
                        fireGrid[i][j] = nextFireGrid[i][j];
                        redrawFireGrid[i][j] = true;
                        nextFireGrid[i][j] = null;
                    }
                }
            }
        }
    }
    var startMonsters = monsters;
    var startFilledTargets = filledTargets;
    var totalTargets = 0;
    var totalGoals = 0;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (idGrid[i][j] == MONSTER) {
                monsters -= 1;
            }
            if (idGrid[i][j] == GOAL) {
                if (targetGrid[i][j] == 1) {
                    filledTargets -= 1;
                }
                totalGoals += 1;
            }
            if (targetGrid[i][j] == 1) {
                totalTargets += 1;
            }
        }
    }
    if (monsters != 0) {
        effects.monsterDeath.activated = true;
    }
    if (filledTargets != 0) {
        effects.goal.activated = true;
    }
    if (gameState == 2 && startMonsters - monsters == 0 && startFilledTargets - Math.min(totalGoals, totalTargets) == 0) {
        showWinScreen();
        if (runState == 2 && gameTick % 100 >= 10) {
            drawGrid();
            drawTargets();
            camera.moved = true;
            drawCanvas();
        }
    }
    gameTick += 1;
};
var updateGrid = function() {
    if (gameState == 4) {
        if (runState == 1) {
            gameTick += 1;
        }
        else if (runState == 2) {
            gameTick += 10;
        }
        else if (runState == 3 && animationTick % 6 == 0) {
            gameTick += 1;
        }
        if (gameTick >= gameGrids.length) {
            gameTick = gameGrids.length - 1;
        }
        frames.push(millis());
        camera.update();
        // grid = gameGrids[gameTick];
        drawGrid();
        drawCanvas();
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                redrawGrid[i][j] = false;
                redrawFireGrid[i][j] = false;
            }
        }
        return;
    }
    else {
        if (runState != 0 && !inTransition && !(runState == 3 && animationTick % 6 != 0)) {
            if (lastGrid == null) {
                lastGrid = {
                    idGrid: JSON.parse(JSON.stringify(idGrid)),
                    rotationGrid: JSON.parse(JSON.stringify(rotationGrid)),
                    dataGrid: JSON.parse(JSON.stringify(dataGrid)),
                    fireGrid: JSON.parse(JSON.stringify(fireGrid)),
                };
                updateControlButtons();
            }
            var updateTicks = (runState == 2 ? 10 : 1);
            for (var i = 0; i < updateTicks; i++) {
                updateTick();
                frames.push(millis());
            }
            effects.oscillator.update();
        }
        else {
            frames.push(millis());
        }
    }

    camera.update();
    brush.update();

    if (runState == 3) {
        drawRedrawGrid();
        drawTargets();
        drawCanvas();
    }
    else if ((runState == 2 && gameTick % 100 < 10)) {
        drawGrid();
        drawTargets();
        camera.moved = true;
        drawCanvas();
    }
    else if (runState == 1) {
        // redrawX2 = 0;
        // redrawX1 = gridSize;
        // redrawY2 = 0;
        // redrawY1 = gridSize;

        drawRedrawGrid();
        drawTargets();
        drawCanvas();
    }
    else if (runState == 0) {
        drawRedrawGrid();
        drawTargets();
        drawCanvas();
        effects.oscillator.update();
    }
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            redrawGrid[i][j] = false;
            redrawFireGrid[i][j] = false;
        }
    }
};
var loadGridString = function(string, startIndex, property, parseProperty, setProperty) {
    var x = 0;
    var y = 0;
    var endOfProperty = false;
    var incrementPosition = function() {
        x += 1;
        if (x == gridSize) {
            x = 0;
            y += 1;
        }
        if (y == gridSize) {
            endOfProperty = true;
            x = 0;
            y = 0;
        }
    };
    var placePixel = function() {
        if (gameState == 1) {
            setProperty(x, y, pixel);
        }
        else if (gameState == 2) {
            if (property == "id") {
                if (idGrid[y][x] != AIR) {
                    if (brush.inventory[idGrid[y][x]][rotationGrid[y][x]][dataGrid[y][x]] < 0) {
                        brush.inventory[idGrid[y][x]][rotationGrid[y][x]][dataGrid[y][x]] = 0;
                    }
                    brush.inventory[idGrid[y][x]][rotationGrid[y][x]][dataGrid[y][x]] += 1;
                    brush.modifiedInventory[idGrid[y][x]][rotationGrid[y][x]][dataGrid[y][x]] = true;
                }
                idGrid[y][x] = pixel;
            }
            else if (property == "rotation") {
                setProperty(x, y, pixel);
            }
            else if (property == "data") {
                if (brush.inventory[idGrid[y][x]][rotationGrid[y][x]][pixel] > 0) {
                    brush.inventory[idGrid[y][x]][rotationGrid[y][x]][pixel] -= 1;
                    brush.modifiedInventory[idGrid[y][x]][rotationGrid[y][x]][pixel] = true;
                    dataGrid[y][x] = pixel;
                }
                else {
                    idGrid[y][x] = AIR;
                    rotationGrid[y][x] = 0;
                }
            }
            else if (property == "fire") {
                if (fireGrid[y][x] != pixel) {
                    if (pixel) {
                        if (brush.inventory[FIRE][0][0] > 0) {
                            brush.inventory[FIRE][0][0] -= 1;
                            fireGrid[y][x] = pixel;
                        }
                    }
                    else {
                        if (brush.inventory[FIRE][0][0] < 0) {
                            brush.inventory[FIRE][0][0] = 0;
                        }
                        brush.inventory[FIRE][0][0] += 1;
                        fireGrid[y][x] = pixel;
                    }
                    brush.modifiedInventory[FIRE][0][0] = true;
                }
            }
        }
    };
    if (gameState == 2) {
        while (!endOfProperty && puzzleGrid[y][x] == 1) {
            incrementPosition();
        }
    }
    var index = startIndex;
    var pixel = -1;
    for (var i = startIndex; i < string.length; i++) {
        if (string[i] == ":") {
            if (pixel == -1) {
                pixel = parseProperty(string.substring(index, i));
                placePixel();
                incrementPosition();
                if (gameState == 2) {
                    while (!endOfProperty && puzzleGrid[y][x] == 1) {
                        incrementPosition();
                    }
                }
                pixel = -1;
                index = i + 1;
            }
            else {
                for (var j = 0; j < parseInt(string.substring(index, i), 36); j++) {
                    placePixel();
                    incrementPosition();
                    if (gameState == 2) {
                        while (!endOfProperty && puzzleGrid[y][x] == 1) {
                            incrementPosition();
                        }
                        if (endOfProperty) {
                            break;
                        }
                    }
                }
                pixel = -1;
                index = i + 1;
            }
        }
        if (string[i] == "-") {
            pixel = parseProperty(string.substring(index, i));
            index = i + 1;
        }
        if (endOfProperty) {
            return i + 1;
        }
    }
    return false;
};
var loadGrid = function(string) {
    var index = 0;
    var checkValid = function(error) {
        if (index == false) {
            if (gameState == 1) {
                promptNotification("An error occured while loading your last saved simulation.", `Error code: ${error}. Please report if this issue persists`);
                storeGrid();
                return false;
            }
            else if (gameState == 2) {
                promptNotification("An error occured while loading your last saved solution.", `Error code: ${error}. Please report if this issue persists`);
                loadPuzzleGrid(1);
                storeGrid();
                return false;
            }
        }
        return true;
    };
    var versionString = null;
    for (var i = 0; i < string.length; i++) {
        if (string[i] == ";") {
            if (versionString == null) {
                versionString = string.substring(index, i);
                if (isNaN(versionString) || versionString.length == 0) {
                    if (version != versionString) {
                        promptNotification("Warning: You are loading a old save code.", `Save code version: ${versionString}. Current version: ${version}.`);
                    }
                    index = i + 1;
                    continue;
                }
                else {
                    promptNotification("Warning: You are loading a old save code.", `Save code version: ${versionString}. Current version: ${version}.`);
                }
            }
            if (gameState == 1) {
                if (isNaN(string.substring(index, i))) {
                    index = i + 1;
                    continue;
                }
                gridSize = parseInt(string.substring(index, i), 10);
                createGrid();
                index = i + 1;
            }
            else if (gameState == 2) {
                if (string.substring(index, i) != `${currentGroup}-${currentPuzzle}`) {
                    return;
                }
                index = i + 1;
            }
            if (index == string.length) {
                return;
            }
            index = loadGridString(string, index, "id", function(id) {
                return eval(id);
            }, function(x, y, id) {
                idGrid[y][x] = id;
            });
            if (!checkValid("Error while loading pixel id grid")) {
                return;
            }
            index = loadGridString(string, index, "rotation", function(rotation) {
                return parseInt(rotation, 10);
            }, function(x, y, rotation) {
                rotationGrid[y][x] = rotation;
            });
            if (!checkValid("Error while loading pixel rotation grid")) {
                return;
            }
            index = loadGridString(string, index, "data", function(data) {
                return parseInt(data, 10);
            }, function(x, y, data) {
                dataGrid[y][x] = data;
            });
            if (!checkValid("Error while loading pixel data grid")) {
                return;
            }
            index = loadGridString(string, index, "fire", function(fire) {
                return fire == "1";
            }, function(x, y, fire) {
                fireGrid[y][x] = fire;
            });
            if (!checkValid("Error while loading fire grid")) {
                return;
            }
            if (gameState == 1) {
                index = loadGridString(string, index, 0, function(data) {
                    return parseInt(data, 10);
                }, function(x, y, data) {
                    puzzleGrid[y][x] = data;
                });
                if (!checkValid("Error while loading puzzle grid")) {
                    return;
                }
                index = loadGridString(string, index, 0, function(data) {
                    return parseInt(data, 10);
                }, function(x, y, data) {
                    targetGrid[y][x] = data;
                });
                if (!checkValid("Error while loading target grid")) {
                    return;
                }
            }
            else if (gameState == 2) {
                brush.updateInventory();
            }
        }
    }
};
var generateGridString = function(grid, getPropertyName) {
    var string = "";
    var pixel = -1;
    var number = 0;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (grid[i][j] != pixel && !(gameState == 2 && puzzleGrid[i][j] == 1)) {
                if (pixel != -1 && number != 0) {
                    if (number == 1) {
                        string += getPropertyName(pixel) + ":";
                    }
                    else {
                        string += getPropertyName(pixel) + "-" + number.toString(36) + ":";
                    }
                }
                pixel = grid[i][j];
                number = 0;
            }
            if (gameState == 1 || puzzleGrid[i][j] == 0) {
                number++;
            }
        }
    }
    if (pixel != -1 && number != 0) {
        if (number == 1) {
            string += getPropertyName(pixel) + ":";
        }
        else {
            string += getPropertyName(pixel) + "-" + number.toString(36) + ":";
        }
    }
    return string;
};
var generateGrid = function() {
    var string = version + ";";
    if (gameState == 1 || gameState == 3) {
        string += gridSize + ";";
    }
    else {
        string += currentGroup + "-" + currentPuzzle + ";";
    }
    if (lastGrid != null) {
        string += generateGridString(lastGrid.idGrid, function(id) {
            return pixelIds[id];
        });
        string += generateGridString(lastGrid.rotationGrid, function(rotation) {
            return rotation;
        });
        string += generateGridString(lastGrid.dataGrid, function(data) {
            return data;
        });
        string += generateGridString(lastGrid.fireGrid, function(fire) {
            return fire ? 1 : 0;
        });
    }
    else {
        string += generateGridString(idGrid, function(id) {
            return pixelIds[id];
        });
        string += generateGridString(rotationGrid, function(rotation) {
            return rotation;
        });
        string += generateGridString(dataGrid, function(data) {
            return data;
        });
        string += generateGridString(fireGrid, function(fire) {
            return fire ? 1 : 0;
        });
    }
    if (gameState == 1 || gameState == 3) {
        string += generateGridString(puzzleGrid, function(data) {
            return data;
        });
        string += generateGridString(targetGrid, function(data) {
            return data;
        });
    }
    return string;
};
var storeGrid = function() {
    if (gameState == 1) {
        localStorage.setItem("sandbox", generateGrid());
    }
    else if (gameState == 2) {
        localStorage.setItem(`${currentGroup}-${currentPuzzle}`, generateGrid());
    }
};
var fetchGrid = function() {
    if (gameState == 1) {
        if (localStorage.getItem("sandbox") != null) {
            loadGrid(localStorage.getItem("sandbox"));
            drawPuzzleGrid();
            drawTargets();
        }
        else {
            createGrid();
        }
    }
    else if (gameState == 2) {
        if (localStorage.getItem(`${currentGroup}-${currentPuzzle}`) != null) {
            loadGrid(localStorage.getItem(`${currentGroup}-${currentPuzzle}`));
        }
    }
};

createGrid();