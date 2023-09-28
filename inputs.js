var resize = function() {
    canvasScale = Math.min(window.innerWidth, window.innerHeight);
    // document.getElementById("canvas").style.width = "600px";
    // document.getElementById("canvas").style.height = "600px";
    document.getElementById("canvas").style.width = canvasScale - 20 + "px";
    document.getElementById("canvas").style.height = canvasScale - 20 + "px";
    document.getElementById("puzzleCanvas").style.width = canvasScale - 20 + "px";
    document.getElementById("puzzleCanvas").style.height = canvasScale - 20 + "px";
    document.getElementById("brushCanvas").style.width = canvasScale - 20 + "px";
    document.getElementById("brushCanvas").style.height = canvasScale - 20 + "px";
    if (window.innerWidth - canvasScale < 300) {
        document.getElementById("sidebar").style.top = Math.min(window.innerWidth, window.innerHeight) + "px";
        var pickerWidth = (Math.round((window.innerWidth - 20) / 62) - 1) * 62;
        pickerWidth = Math.round(window.innerWidth - 20);
        document.getElementById("pixelPicker").style.width = pickerWidth + "px";
        document.getElementById("pixelDescription").style.width = pickerWidth + "px";
        document.getElementById("puzzleDescription").style.width = pickerWidth + "px";
        document.getElementById("pixelTable").style.width = (pickerWidth + 10) + "px";
    }
    else {
        document.getElementById("sidebar").style.top = "0px";
        var pickerWidth = (Math.round((window.innerWidth - canvasScale - 20) / 62) - 1) * 62;
        pickerWidth = Math.round(window.innerWidth - canvasScale - 20);
        document.getElementById("pixelPicker").style.width = (pickerWidth + 4) + "px";
        document.getElementById("pixelDescription").style.width = pickerWidth + "px";
        document.getElementById("puzzleDescription").style.width = pickerWidth + "px";
        document.getElementById("pixelTable").style.width = (pickerWidth + 10) + "px";
    }
    document.getElementById("menuTitle").style.left = (window.innerWidth - (0.315 + 0.50) * window.innerHeight) / 2 + "px";
    if (gameState != 0) {
        setPickerGroupHeights();
    }
}
window.onresize = function() {
    resize();
};
resize();

document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() == "a") {
        camera.a = true;
    }
    if (event.key.toLowerCase() == "d") {
        camera.d = true;
    }
    if (event.key.toLowerCase() == "w") {
        camera.w = true;
    }
    if (event.key.toLowerCase() == "s") {
        camera.s = true;
    }
    if (event.key.toLowerCase() == "c" && event.ctrlKey) {
        if (brush.copySelection()) {
            event.preventDefault();
        }
    }
    if (event.key.toLowerCase() == "x" && event.ctrlKey) {
        if (brush.cutSelection()) {
            event.preventDefault();
        }
    }
    if (event.key.toLowerCase() == "v" && event.ctrlKey) {
        brush.pasteSelection();
        event.preventDefault();
    }
    if (event.key.toLowerCase() == "e") {
        if (brush.rotateSelection(1)) {
            event.preventDefault();
        }
    }
    if (event.key.toLowerCase() == "q") {
        if (brush.rotateSelection(3)) {
            event.preventDefault();
        }
    }
    if (event.key.toLowerCase() == "f") {
        if (brush.flipSelection(1)) {
            event.preventDefault();
        }
    }
    if (event.key.toLowerCase() == "g") {
        if (brush.flipSelection(2)) {
            event.preventDefault();
        }
    }
    if (event.key == "ArrowUp") {
        brush.increaseSize();
    }
    if (event.key == "ArrowDown") {
        brush.decreaseSize();
    }
});
document.addEventListener("keyup", function(event) {
    if (event.key.toLowerCase() == "a") {
        camera.a = false;
    }
    if (event.key.toLowerCase() == "d") {
        camera.d = false;
    }
    if (event.key.toLowerCase() == "w") {
        camera.w = false;
    }
    if (event.key.toLowerCase() == "s") {
        camera.s = false;
    }
    if (event.key.toLowerCase() == " ") {
        runState = runState == 1 ? 0 : 1;
        updateControlButtons();
        event.preventDefault();
    }
    if (event.key.toLowerCase() == "Enter") {
        runState = 1;
        updateGrid();
        runState = 0;
        updateControlButtons();
        event.preventDefault();
    }
    if (event.key == "[") {
        camera.changeZoom(Math.max(camera.zoom / 2, 1));
    }
    if (event.key == "]") {
        camera.changeZoom(Math.min(camera.zoom * 2, camera.maxZoom));
    }
});
document.addEventListener("mousemove", function(event) {
    brush.x = (event.clientX - 10) / (canvasScale - 20) * gridSize / camera.zoom + camera.x / 6;
    brush.y = (event.clientY - 10) / (canvasScale - 20) * gridSize / camera.zoom + camera.y / 6;
    if (brush.x < 0) {
        brush.x = 0;
    }
    if (brush.x >= gridSize) {
        brush.x = gridSize - 1;
    }
    if (brush.y < 0) {
        brush.y = 0;
    }
    if (brush.y >= gridSize) {
        brush.y = gridSize - 1;
    }
    if (animationTick % pixels[brush.pixelId].animationSpeed != 0) {
        brush.draw();
    }
});
canvas.addEventListener("mousedown", function(event) {
    if (event.button == 0) {
        if (event.shiftKey) {
            if (brush.startSelection()) {
                return;
            }
        }
        if (brush.resetLine(2)) {
            return;
        }
        if (event.altKey) {
            if (brush.startLine(1)) {
                event.preventDefault();
                return;
            }
        }
        brush.leftClicking = true;
    }
    else if (event.button == 2) {
        if (brush.resetSelection()) {
            return;
        }
        if (brush.resetLine(1)) {
            return;
        }
        if (event.altKey) {
            if (brush.startLine(2)) {
                event.preventDefault();
                return;
            }
        }
        if (brush.rightClicking == false) {
            brush.rightClicking = true;
            if (animationTick % pixels[brush.pixelId].animationSpeed != 0) {
                brush.draw();
            }
        }
    }
    else if (event.button == 1) {
        var id = idGrid[Math.floor(brush.y)][Math.floor(brush.x)];
        if (id == OSCILLATOR || id == DRUM) {
            if (Array.isArray(dataGrid[Math.floor(brush.y)][Math.floor(brush.x)])) {
                brush.setPixel(id, 0, dataGrid[Math.floor(brush.y)][Math.floor(brush.x)][0]);
            }
            else {
                brush.setPixel(id, 0, dataGrid[Math.floor(brush.y)][Math.floor(brush.x)]);
            }
        }
        else {
            if (pixels[id].rotateable == 1) {
                brush.setPixel(id, 0, 0);
            }
            else {
                brush.setPixel(id, rotationGrid[Math.floor(brush.y)][Math.floor(brush.x)] % pixels[id].rotateable, 0);
            }
        }
        event.preventDefault();
    }
});
document.addEventListener("mouseup", function(event) {
    if (event.button == 0) {
        brush.leftClicking = false;
        if (brush.endSelection()) {
            return;
        }
        if (brush.endLine(1)) {
            event.preventDefault();
            return;
        }
    }
    else if (event.button == 2) {
        if (brush.endLine(2)) {
            brush.rightClicking = false;
            event.preventDefault();
            return;
        }
        if (brush.rightClicking == true) {
            brush.rightClicking = false;
            if (animationTick % pixels[brush.pixelId].animationSpeed != 0) {
                brush.draw();
            }
        }
    }
});

canvas.addEventListener("wheel", function(event) {
    if (event.ctrlKey) {
        if (event.deltaY > 0) {
            camera.changeZoom(Math.max(camera.zoom / 2, 1));
        }
        else {
            camera.changeZoom(Math.min(camera.zoom * 2, camera.maxZoom));
        }
    }
    else {
        if (event.deltaY > 0) {
            brush.decreaseSize();
        }
        else {
            brush.increaseSize();
        }
    }
    event.preventDefault();
});

window.addEventListener("beforeunload", function(event) {
    storeGrid();
    // return "Are you sure? This will delete your current simulation.";
});

document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});