
var brush = {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    lastWidth: 0,
    lastHeight: 0,
    lastPixelX: 0,
    lastPixelY: 0,
    lastPixelWidth: 0,
    lastPixelHeight: 0,
    leftClicking: false,
    rightClicking: false,
    lineX: 0,
    lineY: 0,
    lineState: 0,
    startLine: function(button) {
        if (this.lineState == 0 && (this.selectionState == 0 || this.selectionState == 2)) {
            this.lineState = button;
            this.lineX = this.x;
            this.lineY = this.y;
            if (animationTick % pixels[brush.pixel.id].animationSpeed != 0) {
                brush.draw();
            }
            return true;
        }
        return false;
    },
    endLine: function(button) {
        if (this.lineState == button) {
            if (this.lineState == 1) {
                this.line(this.lineX, this.lineY, this.x, this.y);
            }
            else if (this.lineState == 2) {
                var pixel = {id: this.pixel.id, rotation: this.pixel.rotation, onFire: this.pixel.onFire, data: this.pixel.data};
                this.pixel.rotation = 0;
                this.pixel.onFire = false;
                this.pixel.data = 0;
                if (this.pixel.id == ALLOW_PLACEMENT) {
                    this.pixel.id = RESTRICT_PLACEMENT;
                }
                else if (this.pixel.id == RESTRICT_PLACEMENT) {
                    this.pixel.id = ALLOW_PLACEMENT;
                }
                else {
                    this.pixel.id = AIR;
                }
                this.line(this.lineX, this.lineY, this.x, this.y);
                this.pixel = pixel;
            }
            this.lineState = 0;
            return true;
        }
        return false;
    },
    resetLine: function(button) {
        if (this.lineState == button) {
            this.lineState = 0;
            if (animationTick % pixels[brush.pixel.id].animationSpeed != 0) {
                brush.draw();
            }
            return true;
        }
        return false;
    },
    pixel: { id: AIR, rotation: 0, onFire: false, data: 0 },
    resetPixel: function() {
        this.setPixel({ id: AIR, rotation: 0, onFire: false, data: 0 });
        this.size = 1;
        this.selectionState = 0;
    },
    setPixel: function(pixel) {
        document.getElementById(`picker-${this.pixel.id}-${this.pixel.rotation}`).classList.remove("pickerPixelSelected");
        document.getElementById(`picker-${pixel.id}-${pixel.rotation}`).classList.add("pickerPixelSelected");
        this.pixel = pixel;
        this.drawPixelOffscreenCanvas();
        if (animationTick % pixels[this.pixel.id].animationSpeed != 0) {
            this.draw();
        }
        this.setDescription(pixel);
    },
    setDescription: function(pixel) {
        if (pixel.id == AIR || gameState == 1) {
            document.getElementById("pixelDescriptionName").innerHTML = pixels[pixel.id].name;
        }
        else {
            document.getElementById("pixelDescriptionName").innerHTML = pixels[pixel.id].name + " x" + this.inventory[pixel.id];
        }
        document.getElementById("pixelDescriptionText").innerHTML = pixels[pixel.id].description;
        document.getElementById("pixelDescriptionStatistics").innerHTML = `Update Stage: ${pixels[pixel.id].updateStage}<br>Density: ${pixels[pixel.id].density}<br>Pushable: ${pixels[pixel.id].pushable}<br>Rotateable: ${pixels[pixel.id].rotateable != 1}<br>Cloneable: ${pixels[pixel.id].cloneable}<br>Flammability: ${pixels[pixel.id].flammability}/20<br>Blast Resistance: ${pixels[pixel.id].blastResistance}/20`;
    },
    inventory: [],
    modifiedInventory: [],
    setInventory: function(inventory) {
        for (var i in pickerPixels) {
            pickerPixels[i].style.display = "none";
        }
        for (var i in pickerLabels) {
            pickerLabels[i].style.display = "none";
        }
        for (var i = 0; i < this.inventory.length; i++) {
            if (pixels[i].pickable == false) {
                continue;
            }
            for (var j = 0; j < this.inventory[i].length; j++) {
                if (inventory[i]) {
                    this.inventory[i][j] = inventory[i][j] ?? -1;
                }
                else {
                    this.inventory[i][j] = -1;
                }
                if (i == AIR) {
                    document.getElementById(`picker-${i}-${j}`).style.display = "inline-block";
                    continue;
                }
                if (gameState == 2 && this.inventory[i][j] == -1) {
                    continue;
                }
                else if (gameState == 2 && this.inventory[i][j] == 0) {
                    document.getElementById(`picker-${i}-${j}`).classList.add("pickerPixelDisabled");
                    document.getElementById(`picker-${i}-${j}`).disabled = true;
                }
                else {
                    document.getElementById(`picker-${i}-${j}`).classList.remove("pickerPixelDisabled");
                    document.getElementById(`picker-${i}-${j}`).disabled = false;
                }
                document.getElementById(`picker-${i}-${j}`).style.display = "inline-block";
                if (pixels[i].type) {
                    document.getElementById(`pickerLabel-${pixels[i].type}`).style.display = "block";
                }
                if (gameState == 2) {
                    document.getElementById(`pickerAmount-${i}-${j}`).innerHTML = this.inventory[i];
                }
                else {
                    document.getElementById(`pickerAmount-${i}-${j}`).innerHTML = "";
                }
            }
        }
    },
    updateInventory: function() {
        for (var i = 0; i < this.modifiedInventory.length; i++) {
            if (pixels[i].pickable == false) {
                continue;
            }
            for (var j = 0; j < this.modifiedInventory[i].length; j++) {
                if (this.modifiedInventory[i][j]) {
                    if (gameState == 2 && this.inventory[i][j] == 0) {
                        document.getElementById(`picker-${i}-${j}`).classList.add("pickerPixelDisabled");
                        document.getElementById(`picker-${i}-${j}`).disabled = true;
                    }
                    else {
                        document.getElementById(`picker-${i}-${j}`).classList.remove("pickerPixelDisabled");
                        document.getElementById(`picker-${i}-${j}`).disabled = false;
                        document.getElementById(`picker-${i}-${j}`).style.display = "inline-block";
                    }
                    if (gameState == 2) {
                        document.getElementById(`pickerAmount-${i}-${j}`).innerHTML = this.inventory[i];
                    }
                    this.modifiedInventory[i][j] = false;
                }
            }
        }
    },
    placePixel: function(x, y, pixel) {
        if (gameState == 2) {
            if (levelGrid[y][x][0] == 1) {
                return false;
            }
            if (pixel.id != AIR && this.inventory[pixel.id][pixel.rotation] <= 0) {
                return false;
            }
            if (pixel.onFire && this.inventory[FIRE][0] <= 0) {
                return false;
            }
            if (pixel.id == FIRE && !grid[y][x].onFire) {
                this.inventory[FIRE][0] -= 1;
            }
            if (pixel.id != FIRE && grid[y][x].id != pixel.id) {
                if (grid[y][x].id != AIR) {
                    if (this.inventory[grid[y][x].id][grid[y][x].rotation] < 0) {
                        this.inventory[grid[y][x].id][grid[y][x].rotation] = 0;
                    }
                    this.inventory[grid[y][x].id][grid[y][x].rotation] += 1;
                    this.modifiedInventory[grid[y][x].id][grid[y][x].rotation] = true;
                }
                if (pixel.id != AIR) {
                    this.inventory[pixel.id][pixel.rotation] -= 1;
                    this.modifiedInventory[pixel.id][pixel.rotation] = true;
                }
            }
            if (grid[y][x].onFire != pixel.onFire) {
                if (grid[y][x].onFire && this.inventory[FIRE][0] < 0) {
                    this.inventory[FIRE][0] = 0;
                }
                this.inventory[FIRE][0] += grid[y][x].onFire ? 1 : -1;
                this.modifiedInventory[FIRE][0] = true;
            }
        }
        if (pixel.id == FIRE) {
            grid[y][x].onFire = true;
        }
        else {
            if (grid[y][x].id != pixel.id || grid[y][x].rotation != pixel.rotation || grid[y][x].onFire != pixel.onFire) {
                grid[y][x] = { id: pixel.id, rotation: pixel.rotation, onFire: pixel.onFire, data: pixel.data };
            }
        }
        return true;
    },
    size: 1,
    increaseSize: function() {
        this.size = Math.min(this.size + 1, gridSize / 2 + 1);
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        if (animationTick % pixels[this.pixel.id].animationSpeed != 0) {
            this.draw();
        }
    },
    decreaseSize: function() {
        this.size = Math.max(this.size - 1, 1);
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        if (animationTick % pixels[this.pixel.id].animationSpeed != 0) {
            this.draw();
        }
    },
    selectionX1: 0,
    selectionX2: 0,
    selectionY1: 0,
    selectionY2: 0,
    selectionState: 0,
    selectionGrid: [],
    startSelection: function() {
        if (this.selectionState != 0) {
            return false;
        }
        this.selectionX1 = Math.floor(this.x);
        this.selectionY1 = Math.floor(this.y);
        this.selectionState = 1;
        return true;
    },
    endSelection: function() {
        if (this.selectionState != 1) {
            return false;
        }
        if (Math.floor(this.x) < this.selectionX1) {
            this.selectionX2 = this.selectionX1;
            this.selectionX1 = Math.floor(this.x);
        }
        else {
            this.selectionX2 = Math.ceil(this.x);
        }
        if (Math.floor(this.y) < this.selectionY1) {
            this.selectionY2 = this.selectionY1;
            this.selectionY1 = Math.floor(this.y);
        }
        else {
            this.selectionY2 = Math.ceil(this.y);
        }
        this.selectionState = 2;
        return true;
    },
    copySelection: function() {
        if (this.selectionState != 2) {
            return false;
        }
        this.selectionGrid = [];
        var xIndex = 0;
        var yIndex = 0;
        for (var y = this.selectionY1; y < this.selectionY2; y++) {
            this.selectionGrid[yIndex] = [];
            for (var x = this.selectionX1; x < this.selectionX2; x++) {
                this.selectionGrid[yIndex][xIndex] = { id: grid[y][x].id, rotation: grid[y][x].rotation, onFire: grid[y][x].onFire, data: grid[y][x].data };
                xIndex++;
            }
            yIndex++;
            xIndex = 0;
        }
        return true;
    },
    cutSelection: function() {
        if (this.selectionState != 2) {
            return false;
        }
        this.copySelection();
        this.selectionState = 3;
        offscreenCtx.fillStyle = colors[AIR];
        var pixel = null;
        var pixelX = 0;
        for (var y = this.selectionY1; y < this.selectionY2; y++) {
            for (var x = this.selectionX1; x < this.selectionX2; x++) {
                if (this.placePixel(x, y, { id: AIR, rotation: 0, onFire: false, data: 0 })) {
                    if (pixel == null) {
                        pixel = true;
                        pixelX = x;
                    }
                }
                else if (pixel != null) {
                    offscreenCtx.fillRect(pixelX * 6, y * 6, (x - pixelX) * 6, 6);
                    offscreenFireCtx.clearRect(pixelX * 6, y * 6, (x - pixelX) * 6, 6);
                    pixel = null;
                }
            }
            if (pixel != null) {
                offscreenCtx.fillRect(pixelX * 6, y * 6, (x2 - pixelX + 1) * 6, 6);
                offscreenFireCtx.clearRect(pixelX * 6, y * 6, (x2 - pixelX + 1) * 6, 6);
                pixel = null;
            }
        }
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        this.draw();
        return true;
    },
    pasteSelection: function() {
        if (this.selectionState == 1 || this.selectionState == 3) {
            return false;
        }
        if (this.selectionGrid.length == 0) {
            return false;
        }
        if (this.selectionGrid[0].length == 0) {
            return false;
        }
        this.selectionState = 3;
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        this.draw();
        return true;
    },
    rotateSelection: function(degrees) {
        if (this.selectionState != 3) {
            return false;
        }
        var rotatedSelectionGrid = [];
        if (degrees == 1) {
            for (var i = 0; i < this.selectionGrid.length; i++) {
                for (var j = 0; j < this.selectionGrid[0].length; j++) {
                    if (i == 0) {
                        rotatedSelectionGrid[j] = [];
                    }
                    rotatedSelectionGrid[j][i] = this.selectionGrid[this.selectionGrid.length - i - 1][j];
                    if (pixels[rotatedSelectionGrid[j][i].id].rotateable > 1) {
                        rotatedSelectionGrid[j][i] = rotate(rotatedSelectionGrid[j][i], degrees);
                    }
                }
            }
        }
        else if (degrees == 3) {
            for (var i = 0; i < this.selectionGrid.length; i++) {
                for (var j = 0; j < this.selectionGrid[0].length; j++) {
                    if (i == 0) {
                        rotatedSelectionGrid[j] = [];
                    }
                    rotatedSelectionGrid[j][i] = this.selectionGrid[i][this.selectionGrid[0].length - j - 1];
                    if (pixels[rotatedSelectionGrid[j][i].id].rotateable > 1) {
                        rotatedSelectionGrid[j][i] = rotate(rotatedSelectionGrid[j][i], degrees);
                    }
                }
            }
        }
        this.selectionGrid = rotatedSelectionGrid;
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        this.draw();
        return true;
    },
    flipSelection: function(axis) {
        if (this.selectionState != 3) {
            return false;
        }
        var rotatedSelectionGrid = [];
        if (axis == 1) {
            for (var i = 0; i < this.selectionGrid.length; i++) {
                rotatedSelectionGrid[i] = [];
                for (var j = 0; j < this.selectionGrid[0].length; j++) {
                    rotatedSelectionGrid[i][j] = this.selectionGrid[i][this.selectionGrid[0].length - j - 1];
                    if (pixels[rotatedSelectionGrid[i][j].id].rotateable == 4 && rotatedSelectionGrid[i][j].rotation % 2 == 1) {
                        rotatedSelectionGrid[i][j] = rotate(rotatedSelectionGrid[i][j], 2);
                    }
                }
            }
        }
        else if (axis == 3) {
            for (var i = 0; i < this.selectionGrid.length; i++) {
                rotatedSelectionGrid[i] = [];
                for (var j = 0; j < this.selectionGrid[0].length; j++) {
                    rotatedSelectionGrid[i][j] = this.selectionGrid[this.selectionGrid.length - i - 1][j];
                    if (pixels[rotatedSelectionGrid[i][j].id].rotateable == 4 && rotatedSelectionGrid[i][j].rotation % 2 == 0) {
                        rotatedSelectionGrid[i][j] = rotate(rotatedSelectionGrid[i][j], 2);
                    }
                }
            }
        }
        this.selectionGrid = rotatedSelectionGrid;
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        this.draw();
        return true;
    },
    resetSelection: function() {
        if (this.selectionState == 0) {
            return false;
        }
        this.selectionState = 0;
        this.size = 1;
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        this.draw();
        return true;
    },
    canvas: document.getElementById("brushCanvas"),
    ctx: null,
    resizeCanvas: function() {
        this.canvas.width = 6 * gridSize;
        this.canvas.height = 6 * gridSize;
    },
    pixelOffscreenCanvas: new OffscreenCanvas(6, 6),
    pixelOffscreenCtx: null,
    createPixelOffscreenCanvas: function() {
        if (this.selectionState == 0 || this.selectionState == 2) {
            this.pixelOffscreenCanvas = new OffscreenCanvas((this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
        }
        else if (this.selectionState == 3) {
            this.pixelOffscreenCanvas = new OffscreenCanvas(this.selectionGrid[0].length * 6, this.selectionGrid.length * 6);
        }
        this.pixelOffscreenCtx = this.pixelOffscreenCanvas.getContext("2d");
    },
    drawPixelOffscreenCanvas: function() {
        if (this.selectionState == 0 || this.selectionState == 2) {
            if (this.pixel.id == FIRE) {
                this.pixelOffscreenCtx.clearRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
                for (var i = 0; i < this.size * 2 - 1; i++) {
                    for (var j = 0; j < this.size * 2 - 1; j++) {
                        pixels[FIRE].draw(j, i, this.pixelOffscreenCtx);
                    }
                }
            }
            else if (this.pixel.id != AIR) {
                if (pixels[this.pixel.id].drawBackground > 0) {
                    this.pixelOffscreenCtx.fillStyle = colors[this.pixel.id][0];
                    this.pixelOffscreenCtx.fillRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
                }

                for (var i = 0; i < this.size * 2 - 1; i++) {
                    for (var j = 0; j < this.size * 2 - 1; j++) {
                        drawPixel(j, i, this.pixel, this.pixelOffscreenCtx);
                    }
                }
                if (pixels[this.pixel.id].draw) {
                    var drawCalls = [];
                    for (var i = 0; i < this.size * 2 - 1; i++) {
                        drawCalls.push({ x1: 0, x2: this.size * 2 - 1, y: i, pixel: this.pixel });
                    }
                    pixels[this.pixel.id].draw(drawCalls, this.pixelOffscreenCtx);
                }
            }
            else {
                this.pixelOffscreenCtx.clearRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
            }
        }
        else if (this.selectionState == 3) {
            this.pixelOffscreenCtx.clearRect(0, 0, this.selectionGrid[0].length * 6, this.selectionGrid.length * 6);
            var drawCalls = {};
            var pixel = null;
            var pixelX = 0;
            for (var i = 0; i < this.selectionGrid.length; i++) {
                for (var j = 0; j < this.selectionGrid[0].length; j++) {
                    if (pixel == null) {
                        pixel = this.selectionGrid[i][j];
                        pixelX = j;
                    }
                    if (pixel.id != this.selectionGrid[i][j].id || pixel.rotation != this.selectionGrid[i][j].rotation || pixel.data != this.selectionGrid[i][j].data) {
                        if (pixels[pixel.id].drawBackground == 2) {
                            offscreenCtx.fillStyle = colors[pixel.id][0];
                            offscreenCtx.fillRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
                        }
                        else {
                            if (!drawCalls[pixel.id]) {
                                drawCalls[pixel.id] = [{ x1: pixelX, x2: j, y: i, pixel: pixel }];
                            }
                            else {
                                drawCalls[pixel.id].push({ x1: pixelX, x2: j, y: i, pixel: pixel });
                            }
                        }
                        pixel = this.selectionGrid[i][j];
                        pixelX = j;
                    }
                }
                if (pixels[pixel.id].drawBackground == 2) {
                    offscreenCtx.fillStyle = colors[pixel.id][0];
                    offscreenCtx.fillRect(pixelX * 6, i * 6, (this.selectionGrid[0].length - pixelX) * 6, 6);
                }
                else {
                    if (!drawCalls[pixel.id]) {
                        drawCalls[pixel.id] = [{ x1: pixelX, x2: this.selectionGrid[0].length, y: i, pixel: pixel }];
                    }
                    else {
                        drawCalls[pixel.id].push({ x1: pixelX, x2: this.selectionGrid[0].length, y: i, pixel: pixel });
                    }
                }
                pixel = null;
            }
            for (var i in drawCalls) {
                if (pixels[i].drawBackground == 1) {
                    this.pixelOffscreenCtx.fillStyle = colors[i][0];
                    for (var j in drawCalls[i]) {
                        this.pixelOffscreenCtx.fillRect(drawCalls[i][j].x1 * 6, drawCalls[i][j].y * 6, (drawCalls[i][j].x2 - drawCalls[i][j].x1) * 6, 6);
                    }
                }
                for (var j in drawCalls[i]) {
                    for (var k = drawCalls[i][j].x1; k < drawCalls[i][j].x2; k++) {
                        drawPixel(k, drawCalls[i][j].y, drawCalls[i][j].pixel, this.pixelOffscreenCtx);
                    }
                }
                if (pixels[i].draw) {
                    pixels[i].draw(drawCalls[i], this.pixelOffscreenCtx);
                }
            }
            for (var i = 0; i < this.selectionGrid.length; i++) {
                for (var j = 0; j < this.selectionGrid[0].length; j++) {
                    if (pixel == null) {
                        pixel = this.selectionGrid[i][j].onFire;
                        pixelX = j;
                    }
                    if (pixel != this.selectionGrid[i][j].onFire) {
                        if (pixel == true) {
                            for (var k = pixelX; k < j; k++) {
                                pixels[FIRE].draw(k, i, this.pixelOffscreenCtx);
                            }
                        }
                        pixel = this.selectionGrid[i][j].onFire;
                        pixelX = j;
                    }
                }
                if (pixel == true) {
                    for (var k = pixelX; k < this.selectionGrid[0].length; k++) {
                        pixels[FIRE].draw(k, i, this.pixelOffscreenCtx);
                    }
                }
                pixel = null;
            }
        }
    },
    draw: function() {
        this.ctx.clearRect(this.lastX, this.lastY, this.lastWidth, this.lastHeight);
        this.ctx.globalAlpha = 0.5;
        if (this.lineState != 0) {
            var currentX = startX;
            var currentY = startY;
            var angle = Math.atan2(endY - startY, endX - startX);
            var distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            var xDistance = Math.cos(angle);
            var yDistance = Math.sin(angle);
            for (var i = 0; i < distance; i++) {
                var x1 = Math.max(Math.floor(currentX) - this.size + 1, 0);
                var x2 = Math.min(Math.floor(currentX) + this.size - 1, gridSize - 1);
                var y1 = Math.max(Math.floor(currentY) - this.size + 1, 0);
                var y2 = Math.min(Math.floor(currentY) + this.size - 1, gridSize - 1);
                if (this.pixel.id != AIR) {
                    if (this.lineState == 1) {
                        this.ctx.drawImage(this.pixelOffscreenCanvas, 0, 0, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6, this.lastX, this.lastY, this.lastWidth, this.lastHeight);
                    }
                    else if (this.lineState == 2) {
                        this.ctx.fillStyle = "rgb(255, 0, 0)";
                        this.ctx.fillRect(this.lastX, this.lastY, this.lastWidth, this.lastHeight);
                    }
                }
                currentX += xDistance;
                currentY += yDistance;
            }
            return;
        }
        var x1 = Math.max(Math.floor(this.x) - this.size + 1, 0);
        var x2 = Math.min(Math.floor(this.x) + this.size - 1, gridSize - 1);
        var y1 = Math.max(Math.floor(this.y) - this.size + 1, 0);
        var y2 = Math.min(Math.floor(this.y) + this.size - 1, gridSize - 1);
        if (this.selectionState == 0) {
            this.ctx.setLineDash([]);
            this.lastX = (x1 * 6 - camera.x) * camera.zoom;
            this.lastY = (y1 * 6 - camera.y) * camera.zoom;
            this.lastWidth = (x2 - x1 + 1) * 6 * camera.zoom;
            this.lastHeight = (y2 - y1 + 1) * 6 * camera.zoom;
            if (this.pixel.id != AIR) {
                if (this.rightClicking) {
                    this.ctx.fillStyle = "rgb(255, 0, 0)";
                    this.ctx.fillRect(this.lastX, this.lastY, this.lastWidth, this.lastHeight);
                }
                else {
                    this.ctx.drawImage(this.pixelOffscreenCanvas, 0, 0, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6, this.lastX, this.lastY, this.lastWidth, this.lastHeight);
                }
            }
        }
        else if (this.selectionState == 1) {
            this.ctx.setLineDash([3, 3]);
            if (this.selectionX1 - Math.floor(this.x) <= 0) {
                this.lastX = (this.selectionX1 * 6 - camera.x) * camera.zoom;
                this.lastWidth = (Math.ceil(this.x) - this.selectionX1) * 6 * camera.zoom;
            }
            else {
                this.lastX = (Math.floor(this.x) * 6 - camera.x) * camera.zoom;
                this.lastWidth = (this.selectionX1 - Math.floor(this.x)) * 6 * camera.zoom;
            }
            if (this.selectionY1 - Math.floor(this.y) <= 0) {
                this.lastY = (this.selectionY1 * 6 - camera.y) * camera.zoom;
                this.lastHeight = (Math.ceil(this.y) - this.selectionY1) * 6 * camera.zoom;
            }
            else {
                this.lastY = (Math.floor(this.y) * 6 - camera.y) * camera.zoom;
                this.lastHeight = (this.selectionY1 - Math.floor(this.y)) * 6 * camera.zoom;
            }
        }
        else if (this.selectionState == 2) {
            this.ctx.setLineDash([3, 3]);
            this.lastX = (this.selectionX1 * 6 - camera.x) * camera.zoom;
            this.lastWidth = (this.selectionX2 - this.selectionX1) * 6 * camera.zoom;
            this.lastY = (this.selectionY1 * 6 - camera.y) * camera.zoom;
            this.lastHeight = (this.selectionY2 - this.selectionY1) * 6 * camera.zoom;
        }
        else if (this.selectionState == 3) {
            this.ctx.setLineDash([3, 3]);
            this.lastX = (Math.floor(this.x - this.selectionGrid[0].length / 2) * 6 - camera.x) * camera.zoom;
            this.lastWidth = this.selectionGrid[0].length * 6 * camera.zoom;
            this.lastY = (Math.floor(this.y - this.selectionGrid.length / 2) * 6 - camera.y) * camera.zoom;
            this.lastHeight = this.selectionGrid.length * 6 * camera.zoom;
            this.ctx.drawImage(this.pixelOffscreenCanvas, 0, 0, this.selectionGrid[0].length * 6, this.selectionGrid.length * 6, this.lastX, this.lastY, this.lastWidth, this.lastHeight);
        }
        this.ctx.globalAlpha = 1;
        this.ctx.strokeRect(Math.floor(this.lastX) - 0.5, Math.floor(this.lastY) - 0.5, Math.floor(this.lastWidth) + 1, Math.floor(this.lastHeight) + 1);
        this.lastX -= 1;
        this.lastY -= 1;
        this.lastWidth += 2;
        this.lastHeight += 2;
    },
    brushSquare: function(currentX, currentY) {
        var x1 = Math.max(Math.floor(currentX) - this.size + 1, 0);
        var x2 = Math.min(Math.floor(currentX) + this.size - 1, gridSize - 1);
        var y1 = Math.max(Math.floor(currentY) - this.size + 1, 0);
        var y2 = Math.min(Math.floor(currentY) + this.size - 1, gridSize - 1);
        var pixel = null;
        var pixelX = 0;
        if (this.pixel.id == FIRE) {
            offscreenFireCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
            for (var y = y1; y <= y2; y++) {
                for (var x = x1; x <= x2; x++) {
                    if (this.placePixel(x, y, this.pixel)) {
                        pixels[FIRE].draw(x, y, offscreenFireCtx);
                    }
                    else if (this.inventory[this.pixel.id][this.pixel.rotation] <= 0) {
                        return false;
                    }
                }
            }
        }
        else if (this.pixel.id == ALLOW_PLACEMENT) {
            if (gameState == 2) {
                return false;
            }
            offscreenLevelCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
            for (var y = y1; y <= y2; y++) {
                for (var x = x1; x <= x2; x++) {
                    levelGrid[y][x][0] = 0;
                }
            }
            drawLevelCanvas();
        }
        else if (this.pixel.id == RESTRICT_PLACEMENT) {
            if (gameState == 2) {
                return false;
            }
            offscreenLevelCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
            for (var y = y1; y <= y2; y++) {
                for (var x = x1; x <= x2; x++) {
                    levelGrid[y][x][0] = 1;
                    drawPixel(x, y, this.pixel, offscreenLevelCtx);
                }
            }
            drawLevelCanvas();
        }
        else {
            var drawCalls = [];
            var returnValue = true;
            for (var y = y1; y <= y2; y++) {
                for (var x = x1; x <= x2; x++) {
                    if (this.placePixel(x, y, this.pixel)) {
                        if (pixel == null) {
                            pixel = true;
                            pixelX = x;
                        }
                    }
                    else {
                        if (pixel != null) {
                            if (pixels[this.pixel.id].drawBackground == 2) {
                                offscreenCtx.fillStyle = colors[this.pixel.id][0];
                                offscreenCtx.fillRect(pixelX * 6, y * 6, (x - pixelX) * 6, 6);
                            }
                            else {
                                drawCalls.push({ x1: pixelX, x2: x, y: y, pixel: this.pixel });
                            }
                            pixel = null;
                        }
                        if (this.inventory[this.pixel.id][this.pixel.rotation] <= 0) {
                            returnValue = false;
                            break;
                        }
                    }
                }
                if (pixel != null) {
                    if (pixels[this.pixel.id].drawBackground == 2) {
                        offscreenCtx.fillStyle = colors[this.pixel.id][0];
                        offscreenCtx.fillRect(pixelX * 6, y * 6, (x2 - pixelX + 1) * 6, 6);
                    }
                    else {
                        drawCalls.push({ x1: pixelX, x2: x2 + 1, y: y, pixel: this.pixel });
                    }
                    pixel = null;
                }
                if (returnValue == false) {
                    break;
                }
            }
            if (pixels[this.pixel.id].drawBackground == 1) {
                offscreenCtx.fillStyle = colors[this.pixel.id][0];
                for (var i in drawCalls) {
                    offscreenCtx.fillRect(drawCalls[i].x1 * 6, drawCalls[i].y * 6, (drawCalls[i].x2 - drawCalls[i].x1) * 6, 6);
                }
            }
            if (pixels[this.pixel.id].drawBackground != 2) {
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        drawPixel(j, drawCalls[i].y, this.pixel, offscreenCtx);
                    }
                }
                if (pixels[this.pixel.id].draw) {
                    pixels[this.pixel.id].draw(drawCalls, offscreenCtx);
                }
            }
            for (var i in drawCalls) {
                offscreenFireCtx.clearRect(drawCalls[i].x1 * 6, drawCalls[i].y * 6, (drawCalls[i].x2 - drawCalls[i].x1) * 6, 6);
            }
            return returnValue;
        }
        return true;
    },
    line: function(startX, startY, endX, endY) {
        var currentX = startX;
        var currentY = startY;
        var angle = Math.atan2(endY - startY, endX - startX);
        var distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        var xDistance = Math.cos(angle);
        var yDistance = Math.sin(angle);
        for (var i = 0; i < distance; i++) {
            if (!this.brushSquare(currentX, currentY)) {
                break;
            }
            currentX += xDistance;
            currentY += yDistance;
        }
        this.updateInventory();
        storeGrid();
    },
    update: function() {
        if (animationTick % pixels[this.pixel.id].animationSpeed == 0) {
            this.drawPixelOffscreenCanvas();
            this.draw();
        }
        if (gameState == 2 && lastGrid != null) {
            return;
        }
        if (this.selectionState == 0 || this.selectionState == 2) {
            var x1 = Math.max(Math.floor(this.x) - this.size + 1, 0);
            var x2 = Math.min(Math.floor(this.x) + this.size - 1, gridSize - 1);
            var y1 = Math.max(Math.floor(this.y) - this.size + 1, 0);
            var y2 = Math.min(Math.floor(this.y) + this.size - 1, gridSize - 1);
            if (this.leftClicking) {
                this.brushSquare(this.x, this.y);
                // var pixel = null;
                // var pixelX = 0;
                // if (this.pixel.id == FIRE) {
                //     offscreenFireCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
                //     for (var y = y1; y <= y2; y++) {
                //         for (var x = x1; x <= x2; x++) {
                //             if (this.placePixel(x, y, this.pixel)) {
                //                 pixels[FIRE].draw(x, y, offscreenFireCtx);
                //                 // drawPixel(x, y, this.pixel, offscreenFireCtx);
                //             }
                //         }
                //     }
                // }
                // else if (this.pixel.id == ALLOW_PLACEMENT) {
                //     if (gameState == 2) {
                //         return;
                //     }
                //     offscreenLevelCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
                //     for (var y = y1; y <= y2; y++) {
                //         for (var x = x1; x <= x2; x++) {
                //             levelGrid[y][x][0] = 0;
                //         }
                //     }
                //     drawLevelCanvas();
                // }
                // else if (this.pixel.id == RESTRICT_PLACEMENT) {
                //     if (gameState == 2) {
                //         return;
                //     }
                //     offscreenLevelCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
                //     // offscreenLevelCtx.fillStyle = colors[RESTRICT_PLACEMENT][1];
                //     // offscreenLevelCtx.fillRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
                //     for (var y = y1; y <= y2; y++) {
                //         for (var x = x1; x <= x2; x++) {
                //             levelGrid[y][x][0] = 1;
                //             drawPixel(x, y, this.pixel, offscreenLevelCtx);
                //         }
                //     }
                //     drawLevelCanvas();
                // }
                // else {
                //     var drawCalls = [];
                //     for (var y = y1; y <= y2; y++) {
                //         for (var x = x1; x <= x2; x++) {
                //             if (this.placePixel(x, y, this.pixel)) {
                //                 if (pixel == null) {
                //                     pixel = true;
                //                     pixelX = x;
                //                 }
                //             }
                //             else if (pixel != null) {
                //                 drawCalls.push({ x1: pixelX, x2: x, y: y, pixel: this.pixel });
                //                 pixel = null;
                //             }
                //         }
                //         if (pixel != null) {
                //             drawCalls.push({ x1: pixelX, x2: x2 + 1, y: y, pixel: this.pixel });
                //             pixel = null;
                //         }
                //     }
                //     if (pixels[this.pixel.id].drawBackground) {
                //         offscreenCtx.fillStyle = colors[this.pixel.id][0];
                //         for (var i in drawCalls) {
                //             offscreenCtx.fillRect(drawCalls[i].x1 * 6, drawCalls[i].y * 6, (drawCalls[i].x2 - drawCalls[i].x1) * 6, 6);
                //         }
                //     }
                //     for (var i in drawCalls) {
                //         for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                //             drawPixel(j, drawCalls[i].y, this.pixel, offscreenCtx);
                //         }
                //     }
                //     if (pixels[this.pixel.id].draw) {
                //         pixels[this.pixel.id].draw(drawCalls, offscreenCtx);
                //     }
                //     for (var i in drawCalls) {
                //         offscreenFireCtx.clearRect(drawCalls[i].x1 * 6, drawCalls[i].y * 6, (drawCalls[i].x2 - drawCalls[i].x1) * 6, 6);
                //     }
                // }
                // this.updateInventory();
                // storeGrid();
            }
            if (this.rightClicking) {
                var pixel = {id: this.pixel.id, rotation: this.pixel.rotation, onFire: this.pixel.onFire, data: this.pixel.data};
                this.pixel.rotation = 0;
                this.pixel.onFire = false;
                this.pixel.data = 0;
                if (this.pixel.id == ALLOW_PLACEMENT) {
                    this.pixel.id = RESTRICT_PLACEMENT;
                }
                else if (this.pixel.id == RESTRICT_PLACEMENT) {
                    this.pixel.id = ALLOW_PLACEMENT;
                }
                else {
                    this.pixel.id = AIR;
                }
                this.brushSquare(this.x, this.y);
                this.pixel = pixel;
                // if (this.pixel.id == ALLOW_PLACEMENT) {
                //     if (gameState == 2) {
                //         return;
                //     }
                //     offscreenLevelCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
                //     // offscreenLevelCtx.fillStyle = colors[RESTRICT_PLACEMENT][1];
                //     // offscreenLevelCtx.fillRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
                //     for (var y = y1; y <= y2; y++) {
                //         for (var x = x1; x <= x2; x++) {
                //             levelGrid[y][x][0] = 0;
                //             drawPixel(x, y, { id: RESTRICT_PLACEMENT, rotation: 0, onFire: false, data: 0 }, offscreenLevelCtx);
                //         }
                //     }
                //     drawLevelCanvas();
                // }
                // else if (this.pixel.id == RESTRICT_PLACEMENT) {
                //     if (gameState == 2) {
                //         return;
                //     }
                //     offscreenLevelCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
                //     for (var y = y1; y <= y2; y++) {
                //         for (var x = x1; x <= x2; x++) {
                //             levelGrid[y][x][0] = 1;
                //         }
                //     }
                //     drawLevelCanvas();
                // }
                // else {
                //     var drawCalls = [];
                //     for (var y = y1; y <= y2; y++) {
                //         for (var x = x1; x <= x2; x++) {
                //             if (this.placePixel(x, y, { id: AIR, rotation: 0, onFire: false, data: 0 })) {
                //                 if (pixel == null) {
                //                     pixel = true;
                //                     pixelX = x;
                //                 }
                //             }
                //             else if (pixel != null) {
                //                 drawCalls.push({ x1: pixelX, x2: x, y: y });
                //                 pixel = null;
                //             }
                //         }
                //         if (pixel != null) {
                //             drawCalls.push({ x1: pixelX, x2: x2 + 1, y: y });
                //             pixel = null;
                //         }
                //     }
                //     offscreenCtx.fillStyle = colors[AIR];
                //     for (var i in drawCalls) {
                //         offscreenCtx.fillRect(drawCalls[i].x1 * 6, drawCalls[i].y * 6, (drawCalls[i].x2 - drawCalls[i].x1) * 6, 6);
                //         offscreenFireCtx.clearRect(drawCalls[i].x1 * 6, drawCalls[i].y * 6, (drawCalls[i].x2 - drawCalls[i].x1) * 6, 6);
                //     }
                // }
                // this.updateInventory();
                // storeGrid();
            }
            redrawX1 = x1;
            redrawX2 = x2;
            redrawY1 = y1;
            redrawY2 = y2;
            drawCanvas();
        }
        else if (this.selectionState == 3) {
            if (this.leftClicking) {
                var x = Math.floor(this.x - this.selectionGrid[0].length / 2);
                var y = Math.floor(this.y - this.selectionGrid.length / 2);
                var drawCalls = {};
                var pixel = null;
                var pixelX = 0;
                var firePixel = null;
                var firePixelX = 0;
                for (var i = Math.max(0, -y); i < Math.min(this.selectionGrid.length, gridSize - y); i++) {
                    for (var j = Math.max(0, -x); j < Math.min(this.selectionGrid[0].length, gridSize - x); j++) {
                        if (this.placePixel(j + x, i + y, this.selectionGrid[i][j])) {
                            if (pixel == null) {
                                pixel = this.selectionGrid[i][j];
                                pixelX = j;
                            }
                            if (firePixel == null) {
                                firePixel = this.selectionGrid[i][j].onFire;
                                firePixelX = j;
                            }
                            if (pixel.id != this.selectionGrid[i][j].id || pixel.rotation != this.selectionGrid[i][j].rotation || pixel.data != this.selectionGrid[i][j].data) {
                                if (!drawCalls[pixel.id]) {
                                    drawCalls[pixel.id] = [{ x1: pixelX + x, x2: j + x, y: i + y, pixel: pixel }];
                                }
                                else {
                                    drawCalls[pixel.id].push({ x1: pixelX + x, x2: j + x, y: i + y, pixel: pixel });
                                }
                                pixel = this.selectionGrid[i][j];
                                pixelX = j;
                            }
                            if (firePixel != this.selectionGrid[i][j].onFire) {
                                offscreenFireCtx.clearRect(firePixelX * 6 + x * 6, i * 6 + y * 6, (j - firePixelX) * 6, 6);
                                if (firePixel == true) {
                                    for (var k = firePixelX; k < j; k++) {
                                        pixels[FIRE].draw(k + x, i + y, offscreenFireCtx);
                                    }
                                }
                                firePixel = this.selectionGrid[i][j].onFire;
                                firePixelX = j;
                            }
                        }
                        else {
                            if (pixel != null) {
                                if (!drawCalls[pixel.id]) {
                                    drawCalls[pixel.id] = [{ x1: pixelX + x, x2: j + x, y: i + y, pixel: pixel }];
                                }
                                else {
                                    drawCalls[pixel.id].push({ x1: pixelX + x, x2: j + x, y: i + y, pixel: pixel });
                                }
                                pixel = null;
                            }
                            if (firePixel != null) {
                                offscreenFireCtx.clearRect(firePixelX * 6 + x * 6, i * 6 + y * 6, (j - firePixelX) * 6, 6);
                                if (firePixel == true) {
                                    for (var k = firePixelX; k < j; k++) {
                                        pixels[FIRE].draw(k + x, i + y, offscreenFireCtx);
                                    }
                                }
                                firePixel = null;
                            }
                        }
                    }
                    if (pixel != null) {
                        if (!drawCalls[pixel.id]) {
                            drawCalls[pixel.id] = [{ x1: pixelX + x, x2: Math.min(this.selectionGrid[0].length, gridSize - x) + x, y: i + y, pixel: pixel }];
                        }
                        else {
                            drawCalls[pixel.id].push({ x1: pixelX + x, x2: Math.min(this.selectionGrid[0].length, gridSize - x) + x, y: i + y, pixel: pixel });
                        }
                        pixel = null;
                    }
                    offscreenFireCtx.clearRect(firePixelX * 6 + x * 6, i * 6 + y * 6, (Math.min(this.selectionGrid[0].length, gridSize - x) - firePixelX) * 6, 6);
                    if (firePixel == true) {
                        for (var k = firePixelX; k < Math.min(this.selectionGrid[0].length, gridSize - x); k++) {
                            pixels[FIRE].draw(k + x, i + y, offscreenFireCtx);
                        }
                        firePixel = null;
                    }
                }
                for (var i in drawCalls) {
                    if (pixels[i].drawBackground) {
                        offscreenCtx.fillStyle = colors[i][0];
                        for (var j in drawCalls[i]) {
                            offscreenCtx.fillRect(drawCalls[i][j].x1 * 6, drawCalls[i][j].y * 6, (drawCalls[i][j].x2 - drawCalls[i][j].x1) * 6, 6);
                        }
                    }
                    for (var j in drawCalls[i]) {
                        for (var k = drawCalls[i][j].x1; k < drawCalls[i][j].x2; k++) {
                            drawPixel(k, drawCalls[i][j].y, drawCalls[i][j].pixel, offscreenCtx);
                        }
                    }
                    if (pixels[i].draw) {
                        pixels[i].draw(drawCalls[i], offscreenCtx);
                    }
                }
                redrawX1 = x;
                redrawX2 = x + this.selectionGrid[0].length;
                redrawY1 = y;
                redrawY2 = y + this.selectionGrid.length;
                drawCanvas();
                this.updateInventory();
                storeGrid();
            }
        }
    },
};

brush.ctx = brush.canvas.getContext("2d");
brush.pixelOffscreenCtx = brush.pixelOffscreenCanvas.getContext("2d");
brush.ctx.lineWidth = "1px";
brush.ctx.strokeStyle = "rgb(0, 0, 0)";