// todo: copier fix, use frontid and backid

window.onerror = function(message, url, lineNumber, columnNumber, error) {
    promptError("An error has occured.", error.stack);
};

var version = "0.1.0";

var gameTick = 0;

var runState = 0;

var frames = [];

var canvasScale = Math.min(window.innerWidth, window.innerHeight);

var canvas = document.getElementById("canvas");
canvas.width = gridSize * 6;
canvas.height = gridSize * 6;
var ctx = canvas.getContext("2d");
ctx.fillStyle = colors[AIR];
ctx.fillRect(0, 0, gridSize * 6, gridSize * 6);
var puzzleCanvas = document.getElementById("puzzleCanvas");
puzzleCanvas.width = gridSize * 6;
puzzleCanvas.height = gridSize * 6;
var puzzleCtx = puzzleCanvas.getContext("2d");
brush.resizeCanvas();
var resizeCanvas = function() {
    canvas = document.getElementById("canvas");
    canvas.width = gridSize * 6;
    canvas.height = gridSize * 6;
    ctx.fillStyle = colors[AIR];
    ctx.fillRect(0, 0, gridSize * 6, gridSize * 6 * 2);
    puzzleCanvas = document.getElementById("puzzleCanvas");
    puzzleCanvas.width = gridSize * 6;
    puzzleCanvas.height = gridSize * 6;
    brush.resizeCanvas();
    brush.draw();
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    puzzleCtx.imageSmoothingEnabled = false;
    puzzleCtx.webkitImageSmoothingEnabled = false;
    brush.ctx.imageSmoothingEnabled = false;
    brush.ctx.webkitImageSmoothingEnabled = false;
    brush.lineOffscreenCtx.imageSmoothingEnabled = false;
    brush.lineOffscreenCtx.webkitImageSmoothingEnabled = false;
};

var offscreenCanvas = new OffscreenCanvas(gridSize * 6, gridSize * 6);
var offscreenCtx = offscreenCanvas.getContext("2d");
offscreenCtx.fillStyle = colors[AIR];
offscreenCtx.fillRect(0, 0, gridSize * 6, gridSize * 6);
var offscreenFireCanvas = new OffscreenCanvas(gridSize * 6, gridSize * 6);
var offscreenFireCtx = offscreenFireCanvas.getContext("2d");
var offscreenAboveCanvas = new OffscreenCanvas(gridSize * 6, gridSize * 6);
var offscreenAboveCtx = offscreenAboveCanvas.getContext("2d");
var offscreenPuzzleCanvas = new OffscreenCanvas(gridSize * 6, gridSize * 6);
var offscreenPuzzleCtx = offscreenPuzzleCanvas.getContext("2d");
var createCanvas = function() {
    offscreenCanvas = new OffscreenCanvas(gridSize * 6, gridSize * 6);
    offscreenCtx = offscreenCanvas.getContext("2d");
    offscreenCtx.fillStyle = colors[AIR];
    offscreenCtx.fillRect(0, 0, gridSize * 6, gridSize * 6);
    offscreenFireCanvas = new OffscreenCanvas(gridSize * 6, gridSize * 6);
    offscreenFireCtx = offscreenFireCanvas.getContext("2d");
    offscreenAboveCanvas = new OffscreenCanvas(gridSize * 6, gridSize * 6);
    offscreenAboveCtx = offscreenAboveCanvas.getContext("2d");
    offscreenPuzzleCanvas = new OffscreenCanvas(gridSize * 6, gridSize * 6);
    offscreenPuzzleCtx = offscreenPuzzleCanvas.getContext("2d");
};
var drawCanvas = function() {
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.drawImage(offscreenCanvas, camera.x, camera.y, gridSize * 6 / camera.zoom, gridSize * 6 / camera.zoom, 0, 0, gridSize * 6, gridSize * 6);
    ctx.drawImage(offscreenFireCanvas, camera.x, camera.y, gridSize * 6 / camera.zoom, gridSize * 6 / camera.zoom, 0, 0, gridSize * 6, gridSize * 6);
    ctx.drawImage(offscreenAboveCanvas, camera.x, camera.y, gridSize * 6 / camera.zoom, gridSize * 6 / camera.zoom, 0, 0, gridSize * 6, gridSize * 6);
    if (camera.moved) {
        drawPuzzleCanvas();
        camera.moved = false;
    }
    // else {
    //     redrawX1 = Math.max(redrawX1 * 6, camera.x);
    //     redrawX2 = Math.min(redrawX2 * 6, camera.x + gridSize * 6 / camera.zoom);
    //     redrawY1 = Math.max(redrawY1 * 6, camera.y);
    //     redrawY2 = Math.min(redrawY2 * 6, camera.y + gridSize * 6 / camera.zoom);
    //     // redrawX1 = camera.x;
    //     // redrawX2 = camera.x + gridSize * 6 / camera.zoom;
    //     // redrawY1 = camera.y;
    //     // redrawY2 = camera.y + gridSize * 6 / camera.zoom;
    //     ctx.drawImage(offscreenCanvas, redrawX1, redrawY1, redrawX2 - redrawX1 + 6, redrawY2 - redrawY1 + 6, redrawX1 - camera.x, redrawY1 - camera.y, redrawX2 - redrawX1 + 6, redrawY2 - redrawY1 + 6);
    //     ctx.drawImage(offscreenFireCanvas, redrawX1, redrawY1, redrawX2 - redrawX1 + 6, redrawY2 - redrawY1 + 6, redrawX1 - camera.x, redrawY1 - camera.y, redrawX2 - redrawX1 + 6, redrawY2 - redrawY1 + 6);
    //     ctx.drawImage(offscreenAboveCanvas, camera.x, camera.y, gridSize * 6 / camera.zoom, gridSize * 6 / camera.zoom, 0, 0, gridSize * 6 / camera.zoom, gridSize * 6 / camera.zoom);
    //     // ctx.drawImage(offscreenAboveCanvas, redrawX1, redrawY1, redrawX2 - redrawX1 + 6, redrawY2 - redrawY1 + 6, redrawX1 - camera.x, redrawY1 - camera.y, redrawX2 - redrawX1 + 6, redrawY2 - redrawY1 + 6);
    // }
};
var drawPuzzleCanvas = function() {
    puzzleCtx.clearRect(0, 0, gridSize * 6, gridSize * 6);
    puzzleCtx.drawImage(offscreenPuzzleCanvas, camera.x, camera.y, gridSize * 6 / camera.zoom, gridSize * 6 / camera.zoom, 0, 0, gridSize * 6, gridSize * 6);
};

var gameState = 0;

var renderPixels = function() {
    for (var i = 0; i < pixels.length; i++) {
        if (pixels[i].render) {
            pixels[i].renderedCanvas = [];
            for (var j = 0; j < pixels[i].rotateable; j++) {
                pixels[i].renderedCanvas[j] = [];
                for (var k = 0; k < pixels[i].animationFrames; k++) {
                    pixels[i].renderedCanvas[j][k] = [];
                    animationTick = pixels[i].animationSpeed * k;
                    setLerpColor();
                    for (var l = 0; l < pixels[i].dataFrames; l++) {
                        pixels[i].renderedCanvas[j][k][l] = new OffscreenCanvas(6, 6);
                        var renderedCtx = pixels[i].renderedCanvas[j][k][l].getContext("2d");
                        pixels[i].render(j, l, renderedCtx);
                    }
                }
            }
        }
    }
};
renderPixels();

var fpsDisplay = document.getElementById("fpsDisplay");
var tickDisplay = document.getElementById("tickDisplay");

var update = function() {
    updateGrid();
    updateEffects();

    while (frames[0] + 1000 < millis()) {
        frames.shift(1);
    }
    fpsDisplay.innerHTML = `FPS: ${frames.length};`;
    tickDisplay.innerHTML = `Tick: ${gameTick};`;

    if (gameState != 0) {
        animationTick += 1;
        setLerpColor();
    }

    window.requestAnimationFrame(update);
};
window.requestAnimationFrame(update);