
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
        if (this.lineState == 0 && this.selectionState == 0) {
            this.lineState = button;
            this.lineX = this.x;
            this.lineY = this.y;
            if (animationTick % pixels[this.pixelId].animationSpeed != 0) {
                this.draw();
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
                var pixelId = this.pixelId;
                var pixelRotation = this.pixelRotation;
                var pixelData = this.pixelData;
                if (this.pixelId == ALLOW_PLACEMENT) {
                    this.pixelId = RESTRICT_PLACEMENT;
                }
                else if (this.pixelId == RESTRICT_PLACEMENT) {
                    this.pixelId = ALLOW_PLACEMENT;
                }
                else if (this.pixelId == TARGET) {
                }
                else {
                    this.pixelId = AIR;
                }
                this.pixelRotation = 0;
                this.pixelData = 0;
                this.line(this.lineX, this.lineY, this.x, this.y);
                this.pixelId = pixelId;
                this.pixelRotation = pixelRotation;
                this.pixelData = pixelData;
                this.updateInventory();
            }
            this.lineState = 0;
            return true;
        }
        return false;
    },
    resetLine: function(button) {
        if (this.lineState == button) {
            this.lineState = 0;
            if (animationTick % pixels[this.pixelId].animationSpeed != 0) {
                this.draw();
            }
            return true;
        }
        return false;
    },
    pixelId: AIR,
    pixelRotation: 0,
    pixelData: 0,
    resetPixel: function() {
        this.setPixel(AIR, 0, 0);
        this.size = 1;
        this.selectionState = 0;
    },
    setPixel: function(id, rotation, data) {
        if (this.pixelId == PIXELITE_CRYSTAL) {
            var frame = 0;
            if (this.pixelData == 0) {
                frame = 0;
            }
            else if (this.pixelData <= 2) {
                frame = 1;
            }
            else if (this.pixelData <= 4) {
                frame = 2;
            }
            else if (this.pixelData <= 9) {
                frame = 3;
            }
            else if (this.pixelData <= 24) {
                frame = 4;
            }
            else if (this.pixelData <= 49) {
                frame = 5;
            }
            else if (this.pixelData <= 99) {
                frame = 6;
            }
            else if (this.pixelData <= 199) {
                frame = 7;
            }
            else if (this.pixelData <= 499) {
                frame = 8;
            }
            else {
                frame = 9;
            }
            this.pixelData = frame;
        }
        document.getElementById(`picker-${this.pixelId}-${this.pixelRotation}-${this.pixelData}`).classList.remove("pickerPixelSelected");
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
            document.getElementById(`picker-${id}-${rotation}-${frame}`).classList.add("pickerPixelSelected");
        }
        else {
            document.getElementById(`picker-${id}-${rotation}-${data}`).classList.add("pickerPixelSelected");
        }
        this.pixelId = id;
        this.pixelRotation = rotation;
        this.pixelData = data;
        this.drawPixelOffscreenCanvas();
        if (animationTick % pixels[this.pixelId].animationSpeed != 0) {
            this.draw();
        }
        this.setDescription(id, rotation, data);
    },
    setDescription: function(id, rotation, data) {
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
            document.getElementById("pixelDescriptionName").innerHTML = pixels[id].name[rotation][frame];
            document.getElementById("pixelDescriptionText").innerHTML = pixels[id].description[rotation][frame];
        }
        else {
            if (Array.isArray(pixels[id].name)) {
                if (Array.isArray(pixels[id].name[rotation])) {
                    document.getElementById("pixelDescriptionName").innerHTML = pixels[id].name[rotation][data];
                }
                else {
                    document.getElementById("pixelDescriptionName").innerHTML = pixels[id].name[rotation];
                }
            }
            else {
                document.getElementById("pixelDescriptionName").innerHTML = pixels[id].name;
            }
            if (Array.isArray(pixels[id].description)) {
                if (Array.isArray(pixels[id].description[rotation])) {
                    document.getElementById("pixelDescriptionText").innerHTML = pixels[id].description[rotation][data];
                }
                else {
                    document.getElementById("pixelDescriptionText").innerHTML = pixels[id].description[rotation];
                }
            }
            else {
                document.getElementById("pixelDescriptionText").innerHTML = pixels[id].description;
            }
        }
        document.getElementById("pixelDescriptionStatistics").innerHTML = `Update Stage: ${pixels[id].updateStage}<br>Density: ${pixels[id].density}<br>Pushable: ${pixels[id].pushable}<br>Rotateable: ${pixels[id].rotateable != 1}<br>Cloneable: ${pixels[id].cloneable}<br>Flammability: ${pixels[id].flammability}/20<br>Blast Resistance: ${pixels[id].blastResistance}/20`;
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
        for (var i in pickerGroups) {
            pickerGroups[i].style.display = "none";
        }
        for (var i = 0; i < this.inventory.length; i++) {
            if (pixels[i].pickable == false) {
                continue;
            }
            for (var j = 0; j < this.inventory[i].length; j++) {
                for (var k = 0; k < this.inventory[i][j].length; k++) {
                    if (inventory[i]) {
                        if (inventory[i][j]) {
                            this.inventory[i][j][k] = inventory[i][j][k] ?? -1;
                        }
                        else {
                            this.inventory[i][j][k] = -1;
                        }
                    }
                    else {
                        this.inventory[i][j][k] = -1;
                    }
                    var pixel = document.getElementById(`picker-${i}-${j}-${k}`);
                    if (i == AIR) {
                        pixel.style.display = "inline-block";
                        continue;
                    }
                    if (gameState == 2 && this.inventory[i][j][k] == -1) {
                        pixel.style.display = "none";
                        continue;
                    }
                    else if (gameState == 2 && this.inventory[i][j][k] == 0) {
                        pixel.classList.add("pickerPixelDisabled");
                        pixel.disabled = true;
                    }
                    else {
                        pixel.classList.remove("pickerPixelDisabled");
                        pixel.disabled = false;
                    }
                    pixel.style.display = "inline-block";
                    pickerLabels[pixels[i].type].style.display = "block";
                    pickerGroups[pixels[i].type].style.display = "block";
                    if (gameState == 2) {
                        document.getElementById(`pickerAmount-${i}-${j}-${k}`).innerHTML = this.inventory[i][j][k];
                    }
                    else {
                        document.getElementById(`pickerAmount-${i}-${j}-${k}`).innerHTML = "";
                    }
                }
            }
        }
        setPickerGroupHeights();
    },
    updateInventory: function() {
        for (var i = 0; i < this.modifiedInventory.length; i++) {
            if (pixels[i].pickable == false) {
                continue;
            }
            for (var j = 0; j < this.modifiedInventory[i].length; j++) {
                for (var k = 0; k < this.modifiedInventory[i][j].length; k++) {
                    if (this.modifiedInventory[i][j][k]) {
                        var pixel = document.getElementById(`picker-${i}-${j}-${k}`);
                        if (gameState == 2 && this.inventory[i][j][k] == 0) {
                            pixel.classList.add("pickerPixelDisabled");
                            pixel.disabled = true;
                        }
                        else {
                            pixel.classList.remove("pickerPixelDisabled");
                            pixel.disabled = false;
                            pixel.style.display = "inline-block";
                        }
                        if (gameState == 2) {
                            document.getElementById(`pickerAmount-${i}-${j}-${k}`).innerHTML = this.inventory[i][j][k];
                        }
                        this.modifiedInventory[i][j][k] = false;
                    }
                }
            }
        }
    },
    placePixel: function(x, y, id, rotation, data) {
        if (gameState == 2) {
            if (puzzleGrid[y][x] == 1) {
                return false;
            }
            if (id != AIR && this.inventory[id][rotation][data] <= 0) {
                return false;
            }
            if (idGrid[y][x] != id || rotationGrid[y][x] != rotation || dataGrid[y][x] != data) {
                if (idGrid[y][x] != AIR) {
                    if (this.inventory[idGrid[y][x]][rotationGrid[y][x]][dataGrid[y][x]] < 0) {
                        this.inventory[idGrid[y][x]][rotationGrid[y][x]][dataGrid[y][x]] = 0;
                    }
                    this.inventory[idGrid[y][x]][rotationGrid[y][x]][dataGrid[y][x]] += 1;
                    this.modifiedInventory[idGrid[y][x]][rotationGrid[y][x]][dataGrid[y][x]] = true;
                }
                if (id != AIR) {
                    this.inventory[id][rotation][data] -= 1;
                    this.modifiedInventory[id][rotation][data] = true;
                }
            }
        }
        if (idGrid[y][x] == OSCILLATOR && Array.isArray(dataGrid[y][x]) && dataGrid[y][x][1] == 1) {
            effects.oscillator.decrease(Math.floor(dataGrid[y][x][0] / 37), dataGrid[y][x][0] % 37);
        }
        if (idGrid[y][x] != id || rotationGrid[y][x] != rotation || fireGrid[y][x] == true || id == OSCILLATOR || id == DRUM || id == PIXELITE_CRYSTAL) {
            idGrid[y][x] = id;
            rotationGrid[y][x] = rotation;
            dataGrid[y][x] = data;
            fireGrid[y][x] = false;
        }
        return true;
    },
    placeFire: function(x, y, fire) {
        if (gameState == 2) {
            if (puzzleGrid[y][x] == 1) {
                return false;
            }
            if (fireGrid[y][x] != fire) {
                if (fireGrid[y][x] && this.inventory[FIRE][0][0] < 0) {
                    this.inventory[FIRE][0][0] = 0;
                }
                if (fire && this.inventory[FIRE][0][0] <= 0) {
                    return false;
                }
                this.inventory[FIRE][0][0] += fireGrid[y][x] ? 1 : -1;
                this.modifiedInventory[FIRE][0][0] = true;
            }
        }
        fireGrid[y][x] = fire;
        return true;
    },
    size: 1,
    increaseSize: function() {
        this.size = Math.min(this.size + 1, gridSize / 2 + 1);
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        if (animationTick % pixels[this.pixelId].animationSpeed != 0) {
            this.draw();
        }
    },
    decreaseSize: function() {
        this.size = Math.max(this.size - 1, 1);
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        if (animationTick % pixels[this.pixelId].animationSpeed != 0) {
            this.draw();
        }
    },
    selectionX1: 0,
    selectionX2: 0,
    selectionY1: 0,
    selectionY2: 0,
    selectionState: 0,
    selectionIdGrid: [],
    selectionRotationGrid: [],
    selectionDataGrid: [],
    selectionFireGrid: [],
    generateSelectionGridString: function(grid, getPropertyName) {
        var string = "";
        var pixel = -1;
        var number = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[0].length; j++) {
                if (grid[i][j] != pixel) {
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
                number++;
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
    },
    generateSelectionGrid: function() {
        var string = "S:" + version + ";";
        string += `${this.selectionIdGrid[0].length};${this.selectionIdGrid.length};`;
        string += this.generateSelectionGridString(this.selectionIdGrid, function(id) {
            return pixelIds[id];
        });
        string += this.generateSelectionGridString(this.selectionRotationGrid, function(rotation) {
            return rotation;
        });
        string += this.generateSelectionGridString(this.selectionDataGrid, function(data) {
            return data;
        });
        string += this.generateSelectionGridString(this.selectionFireGrid, function(fire) {
            return fire ? 1 : 0;
        });
        return string;
    },
    loadSelectionGridString: function(string, startIndex, property, parseProperty, setProperty) {
        var x = 0;
        var y = 0;
        var endOfProperty = false;
        var incrementPosition = function() {
            x += 1;
            if (x == brush.selectionIdGrid[0].length) {
                x = 0;
                y += 1;
            }
            if (y == brush.selectionIdGrid.length) {
                endOfProperty = true;
                x = 0;
                y = 0;
            }
        };
        var index = startIndex;
        var pixel = -1;
        for (var i = startIndex; i < string.length; i++) {
            if (string[i] == ":") {
                if (pixel == -1) {
                    pixel = parseProperty(string.substring(index, i));
                    setProperty(x, y, pixel);
                    incrementPosition();
                    pixel = -1;
                    index = i + 1;
                }
                else {
                    for (var j = 0; j < parseInt(string.substring(index, i), 36); j++) {
                        setProperty(x, y, pixel);
                        incrementPosition();
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
    },
    loadSelectionGrid: function(string) {
        var index = 0;
        var checkValid = function(error) {
            if (index == false) {
                promptNotification("An error occured while loading your selection.", `Error code: ${error}. Please report if this issue persists`);
                this.selectionIdGrid = [];
                return false;
            }
            return true;
        };
        var versionString = null;
        var width = null;
        var height = null;
        for (var i = 0; i < string.length; i++) {
            if (string[i] == ";") {
                if (versionString == null) {
                    versionString = string.substring(index, i);
                    if (versionString[0] != "S") {
                        return;
                    }
                    if (version != versionString.substring(2)) {
                        promptNotification("Warning: You are loading a old save code.", `Save code version: ${versionString.substring(2)}. Current version: ${version}.`);
                    }
                    index = i + 1;
                    continue;
                }
                if (width == null) {
                    width = parseInt(string.substring(index, i), 10);
                    index = i + 1;
                    continue;
                }
                else if (height == null) {
                    height = parseInt(string.substring(index, i), 10);
                    index = i + 1;
                    this.selectionIdGrid = [];
                    this.selectionRotationGrid = [];
                    this.selectionDataGrid = [];
                    this.selectionFireGrid = [];
                    for (var j = 0; j < height; j++) {
                        this.selectionIdGrid[j] = [];
                        this.selectionRotationGrid[j] = [];
                        this.selectionDataGrid[j] = [];
                        this.selectionFireGrid[j] = [];
                        for (var k = 0; k < width; k++) {
                            this.selectionIdGrid[j][k] = AIR;
                            this.selectionRotationGrid[j][k] = 0;
                            this.selectionDataGrid[j][k] = 0;
                            this.selectionFireGrid[j][k] = false;
                        }
                    }
                }
                if (index == string.length) {
                    return false;
                }
                index = this.loadSelectionGridString(string, index, "id", function(id) {
                    return eval(id);
                }, function(x, y, id) {
                    brush.selectionIdGrid[y][x] = id;
                });
                if (!checkValid("Error while loading selection id grid")) {
                    return false;
                }
                index = this.loadSelectionGridString(string, index, "rotation", function(rotation) {
                    return parseInt(rotation, 10);
                }, function(x, y, rotation) {
                    brush.selectionRotationGrid[y][x] = rotation;
                });
                if (!checkValid("Error while loading selection rotation grid")) {
                    return false;
                }
                index = this.loadSelectionGridString(string, index, "data", function(data) {
                    return parseInt(data, 10);
                }, function(x, y, data) {
                    brush.selectionDataGrid[y][x] = data;
                });
                if (!checkValid("Error while loading selection data grid")) {
                    return false;
                }
                index = this.loadSelectionGridString(string, index, "fire", function(fire) {
                    return fire == "1";
                }, function(x, y, fire) {
                    brush.selectionFireGrid[y][x] = fire;
                });
                if (!checkValid("Error while loading selection fire grid")) {
                    return false;
                }
                return true;
            }
        }
    },
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
        this.selectionIdGrid = [];
        this.selectionRotationGrid = [];
        this.selectionDataGrid = [];
        this.selectionFireGrid = [];
        var xIndex = 0;
        var yIndex = 0;
        for (var y = this.selectionY1; y < this.selectionY2; y++) {
            this.selectionIdGrid[yIndex] = [];
            this.selectionRotationGrid[yIndex] = [];
            this.selectionDataGrid[yIndex] = [];
            this.selectionFireGrid[yIndex] = [];
            for (var x = this.selectionX1; x < this.selectionX2; x++) {
                this.selectionIdGrid[yIndex][xIndex] = idGrid[y][x];
                this.selectionRotationGrid[yIndex][xIndex] = rotationGrid[y][x];
                this.selectionDataGrid[yIndex][xIndex] = dataGrid[y][x];
                this.selectionFireGrid[yIndex][xIndex] = fireGrid[y][x];
                xIndex++;
            }
            yIndex++;
            xIndex = 0;
        }
        navigator.clipboard.writeText(this.generateSelectionGrid());
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
                if (this.placePixel(x, y, AIR, 0, 0)) {
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
                offscreenCtx.fillRect(pixelX * 6, y * 6, (this.selectionX2 - pixelX) * 6, 6);
                offscreenFireCtx.clearRect(pixelX * 6, y * 6, (this.selectionX2 - pixelX) * 6, 6);
                pixel = null;
            }
        }
        this.updateInventory();
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        this.draw();
        navigator.clipboard.writeText(this.generateSelectionGrid());
        return true;
    },
    pasteSelection: async function() {
        if (this.selectionState == 1 || this.selectionState == 3) {
            return false;
        }
        var selectionCode = await navigator.clipboard.readText();
        if (!this.loadSelectionGrid(selectionCode)) {
            return false;
        }
        // if (this.selectionIdGrid.length == 0) {
        //     return false;
        // }
        // if (this.selectionIdGrid[0].length == 0) {
        //     return false;
        // }
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
        var rotatedSelectionIdGrid = [];
        var rotatedSelectionRotationGrid = [];
        var rotatedSelectionDataGrid = [];
        var rotatedSelectionFireGrid = [];
        if (degrees == 1) {
            for (var i = 0; i < this.selectionIdGrid.length; i++) {
                for (var j = 0; j < this.selectionIdGrid[0].length; j++) {
                    if (i == 0) {
                        rotatedSelectionIdGrid[j] = [];
                        rotatedSelectionRotationGrid[j] = [];
                        rotatedSelectionDataGrid[j] = [];
                        rotatedSelectionFireGrid[j] = [];
                    }
                    rotatedSelectionIdGrid[j][i] = this.selectionIdGrid[this.selectionIdGrid.length - i - 1][j];
                    rotatedSelectionRotationGrid[j][i] = this.selectionRotationGrid[this.selectionRotationGrid.length - i - 1][j];
                    rotatedSelectionDataGrid[j][i] = this.selectionDataGrid[this.selectionDataGrid.length - i - 1][j];
                    rotatedSelectionFireGrid[j][i] = this.selectionFireGrid[this.selectionFireGrid.length - i - 1][j];
                    if (pixels[rotatedSelectionIdGrid[j][i]].rotateable > 1) {
                        rotatedSelectionRotationGrid[j][i] = (rotatedSelectionRotationGrid[j][i] + 1) % pixels[rotatedSelectionIdGrid[j][i]].rotateable;
                    }
                }
            }
        }
        else if (degrees == 3) {
            for (var i = 0; i < this.selectionIdGrid.length; i++) {
                for (var j = 0; j < this.selectionIdGrid[0].length; j++) {
                    if (i == 0) {
                        rotatedSelectionIdGrid[j] = [];
                        rotatedSelectionRotationGrid[j] = [];
                        rotatedSelectionDataGrid[j] = [];
                        rotatedSelectionFireGrid[j] = [];
                    }
                    rotatedSelectionIdGrid[j][i] = this.selectionIdGrid[i][this.selectionIdGrid[0].length - j - 1];
                    rotatedSelectionRotationGrid[j][i] = this.selectionRotationGrid[i][this.selectionRotationGrid[0].length - j - 1];
                    rotatedSelectionDataGrid[j][i] = this.selectionDataGrid[i][this.selectionDataGrid[0].length - j - 1];
                    rotatedSelectionFireGrid[j][i] = this.selectionFireGrid[i][this.selectionFireGrid[0].length - j - 1];
                    if (pixels[rotatedSelectionIdGrid[j][i]].rotateable > 1) {
                        rotatedSelectionRotationGrid[j][i] = (rotatedSelectionRotationGrid[j][i] + 3) % pixels[rotatedSelectionIdGrid[j][i]].rotateable;
                    }
                }
            }
        }
        this.selectionIdGrid = rotatedSelectionIdGrid;
        this.selectionRotationGrid = rotatedSelectionRotationGrid;
        this.selectionDataGrid = rotatedSelectionDataGrid;
        this.selectionFireGrid = rotatedSelectionFireGrid;
        this.createPixelOffscreenCanvas();
        this.drawPixelOffscreenCanvas();
        this.draw();
        return true;
    },
    flipSelection: function(axis) {
        if (this.selectionState != 3) {
            return false;
        }
        var rotatedSelectionIdGrid = [];
        var rotatedSelectionRotationGrid = [];
        var rotatedSelectionDataGrid = [];
        var rotatedSelectionFireGrid = [];
        if (axis == 1) {
            for (var i = 0; i < this.selectionIdGrid.length; i++) {
                rotatedSelectionIdGrid[i] = [];
                rotatedSelectionRotationGrid[i] = [];
                rotatedSelectionDataGrid[i] = [];
                rotatedSelectionFireGrid[i] = [];
                for (var j = 0; j < this.selectionIdGrid[0].length; j++) {
                    rotatedSelectionIdGrid[i][j] = this.selectionIdGrid[i][this.selectionIdGrid[0].length - j - 1];
                    rotatedSelectionRotationGrid[i][j] = this.selectionRotationGrid[i][this.selectionRotationGrid[0].length - j - 1];
                    rotatedSelectionDataGrid[i][j] = this.selectionDataGrid[i][this.selectionDataGrid[0].length - j - 1];
                    rotatedSelectionFireGrid[i][j] = this.selectionFireGrid[i][this.selectionFireGrid[0].length - j - 1];
                    if (pixels[rotatedSelectionIdGrid[i][j]].rotateable == 4 && rotatedSelectionRotationGrid[i][j] % 2 == 1) {
                        rotatedSelectionRotationGrid[i][j] = (rotatedSelectionRotationGrid[j][i] + 2) % pixels[rotatedSelectionIdGrid[j][i]].rotateable;
                    }
                }
            }
        }
        else if (axis == 3) {
            for (var i = 0; i < this.selectionIdGrid.length; i++) {
                rotatedSelectionIdGrid[i] = [];
                rotatedSelectionRotationGrid[i] = [];
                rotatedSelectionDataGrid[i] = [];
                rotatedSelectionFireGrid[i] = [];
                for (var j = 0; j < this.selectionIdGrid[0].length; j++) {
                    rotatedSelectionIdGrid[i][j] = this.selectionIdGrid[this.selectionIdGrid.length - i - 1][i];
                    rotatedSelectionRotationGrid[i][j] = this.selectionRotationGrid[this.selectionRotationGrid.length - i - 1][i];
                    rotatedSelectionDataGrid[i][j] = this.selectionDataGrid[this.selectionDataGrid.length - i - 1][i];
                    rotatedSelectionFireGrid[i][j] = this.selectionFireGrid[this.selectionFireGrid.length - i - 1][i];
                    if (pixels[rotatedSelectionIdGrid[i][j]].rotateable == 4 && rotatedSelectionRotationGrid[i][j] % 2 == 0) {
                        rotatedSelectionRotationGrid[i][j] = (rotatedSelectionRotationGrid[j][i] + 2) % pixels[rotatedSelectionIdGrid[j][i]].rotateable;
                    }
                }
            }
        }
        this.selectionIdGrid = rotatedSelectionIdGrid;
        this.selectionRotationGrid = rotatedSelectionRotationGrid;
        this.selectionDataGrid = rotatedSelectionDataGrid;
        this.selectionFireGrid = rotatedSelectionFireGrid;
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
    lineOffscreenCanvas: new OffscreenCanvas(6 * gridSize, 6 * gridSize),
    lineOffscreenCtx: null,
    resizeCanvas: function() {
        this.canvas.width = 6 * gridSize;
        this.canvas.height = 6 * gridSize;
        this.lineOffscreenCanvas = new OffscreenCanvas(6 * gridSize, 6 * gridSize);
        this.lineOffscreenCtx = this.lineOffscreenCanvas.getContext("2d");
    },
    pixelOffscreenCanvas: new OffscreenCanvas(6, 6),
    pixelOffscreenCtx: null,
    createPixelOffscreenCanvas: function() {
        if (this.selectionState == 0) {
            this.pixelOffscreenCanvas = new OffscreenCanvas((this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
        }
        else if (this.selectionState == 3) {
            this.pixelOffscreenCanvas = new OffscreenCanvas(this.selectionIdGrid[0].length * 6, this.selectionIdGrid.length * 6);
        }
        this.pixelOffscreenCtx = this.pixelOffscreenCanvas.getContext("2d");
    },
    drawPixelOffscreenCanvas: function() {
        if (this.selectionState == 0) {
            if (this.pixelId == FIRE) {
                this.pixelOffscreenCtx.clearRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
                for (var i = 0; i < this.size * 2 - 1; i++) {
                    for (var j = 0; j < this.size * 2 - 1; j++) {
                        pixels[FIRE].draw(j, i, this.pixelOffscreenCtx);
                    }
                }
            }
            else if (this.pixelId != AIR) {
                if (this.pixelId == ALLOW_PLACEMENT || this.pixelId == RESTRICT_PLACEMENT || this.pixelId == TARGET) {
                    this.pixelOffscreenCtx.clearRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
                }
                if (pixels[this.pixelId].drawBackground == 2) {
                    if (pixels[this.pixelId].drawNoise) {
                        if (pixels[this.pixelId].animationSpeed == 1) {
                            for (var i = 0; i < this.size * 2 - 1; i++) {
                                for (var j = 0; j < this.size * 2 - 1; j++) {
                                    this.pixelOffscreenCtx.fillStyle = colorTint(colors[this.pixelId], updateNoiseGrid(j, i));
                                    this.pixelOffscreenCtx.fillRect(j * 6, i * 6, 6, 6);
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < this.size * 2 - 1; i++) {
                                for (var j = 0; j < this.size * 2 - 1; j++) {
                                    this.pixelOffscreenCtx.fillStyle = colorTint(colors[this.pixelId], noiseGrid[i][j]);
                                    this.pixelOffscreenCtx.fillRect(j * 6, i * 6, 6, 6);
                                }
                            }
                        }
                    }
                    else {
                        this.pixelOffscreenCtx.fillStyle = colors[this.pixelId];
                        this.pixelOffscreenCtx.fillRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
                    }
                }
                if (pixels[this.pixelId].drawBackground == 1) {
                    this.pixelOffscreenCtx.fillStyle = colors[this.pixelId][0];
                    this.pixelOffscreenCtx.fillRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
                }
                if (pixels[this.pixelId].drawBackground != 2) {
                    for (var i = 0; i < this.size * 2 - 1; i++) {
                        for (var j = 0; j < this.size * 2 - 1; j++) {
                            drawPixel(j, i, this.pixelId, this.pixelRotation, this.pixelData, this.pixelOffscreenCtx);
                        }
                    }
                    if (pixels[this.pixelId].draw) {
                        var drawCallX1 = [];
                        var drawCallX2 = [];
                        var drawCallY = [];
                        var drawCallRotation = [];
                        var drawCallData = [];
                        for (var i = 0; i < this.size * 2 - 1; i++) {
                            drawCallX1.push(0);
                            drawCallX2.push(this.size * 2 - 1);
                            drawCallY.push(i);
                            drawCallRotation.push(this.pixelRotation);
                            drawCallData.push(this.pixelData);
                        }
                        pixels[this.pixelId].draw(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, this.pixelOffscreenCtx);
                    }
                }
            }
            else {
                this.pixelOffscreenCtx.fillStyle = colors[AIR];
                this.pixelOffscreenCtx.fillRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
                // this.pixelOffscreenCtx.clearRect(0, 0, (this.size * 2 - 1) * 6, (this.size * 2 - 1) * 6);
            }
        }
        else if (this.selectionState == 3) {
            var drawCallX1 = {};
            var drawCallX2 = {};
            var drawCallY = {};
            var drawCallRotation = {};
            var drawCallData = {};
            var id = null;
            var rotation = 0;
            var data = 0;
            var pixelX = 0;
            this.pixelOffscreenCtx.clearRect(0, 0, this.selectionIdGrid[0].length * 6, this.selectionIdGrid.length * 6);
            for (var i = 0; i < this.selectionIdGrid.length; i++) {
                for (var j = 0; j < this.selectionIdGrid[0].length; j++) {
                    if (id == null) {
                        id = this.selectionIdGrid[i][j];
                        rotation = this.selectionRotationGrid[i][j];
                        data = this.selectionDataGrid[i][j];
                        pixelX = j;
                    }
                    if (id != this.selectionIdGrid[i][j] || rotation != this.selectionRotationGrid[i][j] || data != this.selectionDataGrid[i][j]) {
                        if (pixels[id].drawBackground == 2) {
                            if (pixels[id].drawNoise) {
                                if (pixels[id].animationSpeed == 1) {
                                    for (var k = pixelX; k < j; k++) {
                                        this.pixelOffscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k, i));
                                        this.pixelOffscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                                    }
                                }
                                else {
                                    for (var k = pixelX; k < j; k++) {
                                        this.pixelOffscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i][k]);
                                        this.pixelOffscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                                    }
                                }
                            }
                            else {
                                this.pixelOffscreenCtx.fillStyle = colors[id];
                                this.pixelOffscreenCtx.fillRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
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
                        id = this.selectionIdGrid[i][j];
                        rotation = this.selectionRotationGrid[i][j];
                        data = this.selectionDataGrid[i][j];
                        pixelX = j;
                    }
                }
                if (pixels[id].drawBackground == 2) {
                    if (pixels[id].drawNoise) {
                        if (pixels[id].animationSpeed == 1) {
                            for (var k = pixelX; k < this.selectionIdGrid[0].length; k++) {
                                this.pixelOffscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k, i));
                                this.pixelOffscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                            }
                        }
                        else {
                            for (var k = pixelX; k < this.selectionIdGrid[0].length; k++) {
                                this.pixelOffscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i][k]);
                                this.pixelOffscreenCtx.fillRect(k * 6, i * 6, 6, 6);
                            }
                        }
                    }
                    else {
                        this.pixelOffscreenCtx.fillStyle = colors[id];
                        this.pixelOffscreenCtx.fillRect(pixelX * 6, i * 6, (this.selectionIdGrid[0].length - pixelX) * 6, 6);
                    }
                }
                else {
                    if (!drawCallX1[id]) {
                        drawCallX1[id] = [pixelX];
                        drawCallX2[id] = [this.selectionIdGrid[0].length];
                        drawCallY[id] = [i];
                        drawCallRotation[id] = [rotation];
                        drawCallData[id] = [data];
                    }
                    else {
                        drawCallX1[id].push(pixelX);
                        drawCallX2[id].push(this.selectionIdGrid[0].length);
                        drawCallY[id].push(i);
                        drawCallRotation[id].push(rotation);
                        drawCallData[id].push(data);
                    }
                }
                id = null;
            }
            drawDrawCalls(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, this.pixelOffscreenCtx);
            var fire = null;
            for (var i = 0; i < this.selectionIdGrid.length; i++) {
                for (var j = 0; j < this.selectionIdGrid[0].length; j++) {
                    if (fire == null) {
                        fire = this.selectionFireGrid[i][j];
                        pixelX = j;
                    }
                    if (fire != this.selectionFireGrid[i][j]) {
                        // this.pixelOffscreenCtx.clearRect(pixelX * 6, i * 6, (j - pixelX) * 6, 6);
                        if (fire) {
                            for (var k = pixelX; k < j; k++) {
                                pixels[FIRE].draw(k, i, this.pixelOffscreenCtx);
                            }
                        }
                        fire = this.selectionFireGrid[i][j];
                        pixelX = j;
                    }
                }
                // this.pixelOffscreenCtx.clearRect(pixelX * 6, i * 6, (gridSize - pixelX) * 6, 6);
                if (fire) {
                    for (var k = pixelX; k < gridSize; k++) {
                        pixels[FIRE].draw(k, i, this.pixelOffscreenCtx);
                    }
                }
                fire = null;
            }
        }
    },
    draw: function() {
        this.ctx.clearRect(this.lastX, this.lastY, this.lastWidth, this.lastHeight);
        this.ctx.globalAlpha = 0.5;
        if (this.lineState != 0) {
            var currentX = this.lineX;
            var currentY = this.lineY;
            var angle = Math.atan2(this.y - this.lineY, this.x - this.lineX);
            var distance = Math.sqrt(Math.pow(this.x - this.lineX, 2) + Math.pow(this.y - this.lineY, 2));
            var xDistance = Math.cos(angle);
            var yDistance = Math.sin(angle);
            if (this.x > this.lineX) {
                this.lastX = (Math.max(Math.floor(this.lineX) - this.size + 1, 0) * 6 - camera.x) * camera.zoom;
                this.lastWidth = ((Math.min(Math.floor(this.x) + this.size - 1, gridSize - 1) + 1) * 6 - camera.x) * camera.zoom - this.lastX;
            }
            else {
                this.lastX = (Math.max(Math.floor(this.x) - this.size + 1, 0) * 6 - camera.x) * camera.zoom;
                this.lastWidth = ((Math.min(Math.floor(this.lineX) + this.size - 1, gridSize - 1) + 1) * 6 - camera.x) * camera.zoom - this.lastX;
            }
            if (this.y > this.lineY) {
                this.lastY = (Math.max(Math.floor(this.lineY) - this.size + 1, 0) * 6 - camera.y) * camera.zoom;
                this.lastHeight = ((Math.min(Math.floor(this.y) + this.size - 1, gridSize - 1) + 1) * 6 - camera.y) * camera.zoom - this.lastY;
            }
            else {
                this.lastY = (Math.max(Math.floor(this.y) - this.size + 1, 0) * 6 - camera.y) * camera.zoom;
                this.lastHeight = ((Math.min(Math.floor(this.lineY) + this.size - 1, gridSize - 1) + 1) * 6 - camera.y) * camera.zoom - this.lastY;
            }
            for (var i = 0; i <= distance; i++) {
                var x1 = Math.max(Math.floor(currentX) - this.size + 1, 0);
                var x2 = Math.min(Math.floor(currentX) + this.size - 1, gridSize - 1);
                var y1 = Math.max(Math.floor(currentY) - this.size + 1, 0);
                var y2 = Math.min(Math.floor(currentY) + this.size - 1, gridSize - 1);
                if (this.lineState == 1) {
                    this.lineOffscreenCtx.drawImage(this.pixelOffscreenCanvas, 0, 0, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6, (x1 * 6 - camera.x) * camera.zoom, (y1 * 6 - camera.y) * camera.zoom, (x2 - x1 + 1) * 6 * camera.zoom, (y2 - y1 + 1) * 6 * camera.zoom);
                }
                else if (this.lineState == 2) {
                    this.lineOffscreenCtx.fillStyle = "rgb(255, 0, 0)";
                    this.lineOffscreenCtx.fillRect((x1 * 6 - camera.x) * camera.zoom, (y1 * 6 - camera.y) * camera.zoom, (x2 - x1 + 1) * 6 * camera.zoom, (y2 - y1 + 1) * 6 * camera.zoom);
                }
                currentX += xDistance;
                currentY += yDistance;
            }
            this.ctx.drawImage(this.lineOffscreenCanvas, this.lastX, this.lastY, this.lastWidth, this.lastHeight, this.lastX, this.lastY, this.lastWidth, this.lastHeight);
            this.lineOffscreenCtx.clearRect(this.lastX, this.lastY, this.lastWidth, this.lastHeight);
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
            if (this.rightClicking) {
                this.ctx.fillStyle = "rgb(255, 0, 0)";
                this.ctx.fillRect(this.lastX, this.lastY, this.lastWidth, this.lastHeight);
            }
            else {
                this.ctx.drawImage(this.pixelOffscreenCanvas, 0, 0, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6, this.lastX, this.lastY, this.lastWidth, this.lastHeight);
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
            this.lastX = (Math.floor(this.x - this.selectionIdGrid[0].length / 2) * 6 - camera.x) * camera.zoom;
            this.lastWidth = this.selectionIdGrid[0].length * 6 * camera.zoom;
            this.lastY = (Math.floor(this.y - this.selectionIdGrid.length / 2) * 6 - camera.y) * camera.zoom;
            this.lastHeight = this.selectionIdGrid.length * 6 * camera.zoom;
            this.ctx.drawImage(this.pixelOffscreenCanvas, 0, 0, this.selectionIdGrid[0].length * 6, this.selectionIdGrid.length * 6, this.lastX, this.lastY, this.lastWidth, this.lastHeight);
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
        if (this.pixelId == FIRE) {
            offscreenFireCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
            for (var y = y1; y <= y2; y++) {
                for (var x = x1; x <= x2; x++) {
                    if (this.placeFire(x, y, true)) {
                        pixels[FIRE].draw(x, y, offscreenFireCtx);
                    }
                    else if (this.inventory[this.pixelId][this.pixelRotation][this.pixelData] <= 0) {
                        return false;
                    }
                }
            }
        }
        else if (this.pixelId == ALLOW_PLACEMENT) {
            if (gameState == 2) {
                return false;
            }
            offscreenPuzzleCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
            for (var y = y1; y <= y2; y++) {
                for (var x = x1; x <= x2; x++) {
                    puzzleGrid[y][x] = 0;
                }
            }
            drawPuzzleCanvas();
        }
        else if (this.pixelId == RESTRICT_PLACEMENT) {
            if (gameState == 2) {
                return false;
            }
            offscreenPuzzleCtx.clearRect(x1 * 6, y1 * 6, (x2 - x1 + 1) * 6, (y2 - y1 + 1) * 6);
            for (var y = y1; y <= y2; y++) {
                for (var x = x1; x <= x2; x++) {
                    puzzleGrid[y][x] = 1;
                    drawPixel(x, y, this.pixelId, this.pixelRotation, this.pixelData, offscreenPuzzleCtx);
                }
            }
            drawPuzzleCanvas();
        }
        else if (this.pixelId == TARGET) {
            if (gameState == 2) {
                return false;
            }
            if (this.rightClicking) {
                offscreenCtx.fillStyle = colors[AIR];
                for (var y = y1; y <= y2; y++) {
                    for (var x = x1; x <= x2; x++) {
                        if (targetGrid[y][x] == 1) {
                            targetGrid[y][x] = 0;
                            offscreenCtx.fillRect(x * 6, y * 6, 6, 6);
                        }
                    }
                }
            }
            else {
                for (var y = y1; y <= y2; y++) {
                    for (var x = x1; x <= x2; x++) {
                        targetGrid[y][x] = 1;
                        drawPixel(x, y, this.pixelId, this.pixelRotation, this.pixelData, offscreenCtx);
                    }
                }
            }
        }
        // else if (pixels[this.pixelId].drawBackground == 2) {

        // }
        else {
            var drawCallX1 = [];
            var drawCallX2 = [];
            var drawCallY = [];
            var drawCallRotation = [];
            var drawCallData = [];
            var returnValue = true;
            for (var y = y1; y <= y2; y++) {
                for (var x = x1; x <= x2; x++) {
                    if (this.placePixel(x, y, this.pixelId, this.pixelRotation, this.pixelData)) {
                        if (pixel == null) {
                            pixel = true;
                            pixelX = x;
                        }
                    }
                    else {
                        if (pixel != null) {
                            if (pixels[this.pixelId].drawBackground == 2) {
                                if (pixels[this.pixelId].drawNoise) {
                                    if (pixels[this.pixelId].animationSpeed == 1) {
                                        for (var k = pixelX; k < x; k++) {
                                            offscreenCtx.fillStyle = colorTint(colors[this.pixelId], updateNoiseGrid(k, y));
                                            offscreenCtx.fillRect(k * 6, y * 6, 6, 6);
                                        }
                                    }
                                    else {
                                        for (var k = pixelX; k < x; k++) {
                                            offscreenCtx.fillStyle = colorTint(colors[this.pixelId], noiseGrid[y][k]);
                                            offscreenCtx.fillRect(k * 6, y * 6, 6, 6);
                                        }
                                    }
                                }
                                else {
                                    offscreenCtx.fillStyle = colors[this.pixelId];
                                    offscreenCtx.fillRect(pixelX * 6, y * 6, (x - pixelX) * 6, 6);
                                }
                                offscreenFireCtx.clearRect(pixelX * 6, y * 6, (x - pixelX) * 6, 6);
                            }
                            else {
                                drawCallX1.push(pixelX);
                                drawCallX2.push(x);
                                drawCallY.push(y);
                                drawCallRotation.push(this.pixelRotation);
                                drawCallData.push(this.pixelData);
                            }
                            pixel = null;
                        }
                        if (gameState == 2 && this.pixelId != AIR && this.inventory[this.pixelId][this.pixelRotation][this.pixelData] <= 0) {
                            returnValue = false;
                            break;
                        }
                    }
                }
                if (pixel != null) {
                    if (pixels[this.pixelId].drawBackground == 2) {
                        if (pixels[this.pixelId].drawNoise) {
                            if (pixels[this.pixelId].animationSpeed == 1) {
                                for (var k = pixelX; k <= x2; k++) {
                                    offscreenCtx.fillStyle = colorTint(colors[this.pixelId], updateNoiseGrid(k, y));
                                    offscreenCtx.fillRect(k * 6, y * 6, 6, 6);
                                }
                            }
                            else {
                                for (var k = pixelX; k <= x2; k++) {
                                    offscreenCtx.fillStyle = colorTint(colors[this.pixelId], noiseGrid[y][k]);
                                    offscreenCtx.fillRect(k * 6, y * 6, 6, 6);
                                }
                            }
                        }
                        else {
                            offscreenCtx.fillStyle = colors[this.pixelId];
                            offscreenCtx.fillRect(pixelX * 6, y * 6, (x2 - pixelX + 1) * 6, 6);
                        }
                        offscreenFireCtx.clearRect(pixelX * 6, y * 6, (x2 - pixelX + 1) * 6, 6);
                    }
                    else {
                        drawCallX1.push(pixelX);
                        drawCallX2.push(x2 + 1);
                        drawCallY.push(y);
                        drawCallRotation.push(this.pixelRotation);
                        drawCallData.push(this.pixelData);
                    }
                    pixel = null;
                }
                if (returnValue == false) {
                    break;
                }
            }
            if (pixels[this.pixelId].drawBackground != 2) {
                drawCallObjectX1 = {};
                drawCallObjectX1[this.pixelId] = drawCallX1;
                drawCallObjectX2 = {};
                drawCallObjectX2[this.pixelId] = drawCallX2;
                drawCallObjectY = {};
                drawCallObjectY[this.pixelId] = drawCallY;
                drawCallObjectRotation = {};
                drawCallObjectRotation[this.pixelId] = drawCallRotation;
                drawCallObjectData = {};
                drawCallObjectData[this.pixelId] = drawCallData;
                drawDrawCalls(drawCallObjectX1, drawCallObjectX2, drawCallObjectY, drawCallObjectRotation, drawCallObjectData, offscreenCtx);
            }
            for (var i in drawCallX1) {
                offscreenFireCtx.clearRect(drawCallX1[i] * 6, drawCallY[i] * 6, (drawCallX2[i] - drawCallX1[i]) * 6, 6);
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
        for (var i = 0; i <= distance; i++) {
            if (!this.brushSquare(Math.floor(currentX), Math.floor(currentY))) {
                break;
            }
            currentX += xDistance;
            currentY += yDistance;
        }
        this.updateInventory();
        storeGrid();
    },
    update: function() {
        if (animationTick & pixels[this.pixelId].animationSpeed == 1) {
            this.drawPixelOffscreenCanvas();
            this.draw();
        }
        if (gameState == 2 && lastGrid != null) {
            return;
        }
        if (this.selectionState == 0) {
            if (this.leftClicking) {
                this.brushSquare(this.x, this.y);
                // drawCanvas();
                this.updateInventory();
            }
            if (this.rightClicking) {
                var pixelId = this.pixelId;
                var pixelRotation = this.pixelRotation;
                var pixelData = this.pixelData;
                if (this.pixelId == ALLOW_PLACEMENT) {
                    this.pixelId = RESTRICT_PLACEMENT;
                }
                else if (this.pixelId == RESTRICT_PLACEMENT) {
                    this.pixelId = ALLOW_PLACEMENT;
                }
                else if (this.pixelId == TARGET) {
                }
                else {
                    this.pixelId = AIR;
                }
                this.pixelRotation = 0;
                this.pixelData = 0;
                this.brushSquare(this.x, this.y);
                this.pixelId = pixelId;
                this.pixelRotation = pixelRotation;
                this.pixelData = pixelData;
                this.updateInventory();
            }
        }
        else if (this.selectionState == 3) {
            if (this.leftClicking) {
                var x = Math.floor(this.x - this.selectionIdGrid[0].length / 2);
                var y = Math.floor(this.y - this.selectionIdGrid.length / 2);
                var drawCallX1 = {};
                var drawCallX2 = {};
                var drawCallY = {};
                var drawCallRotation = {};
                var drawCallData = {};
                var id = null;
                var rotation = 0;
                var data = 0;
                var pixelX = 0;
                for (var i = 0; i < this.selectionIdGrid.length; i++) {
                    for (var j = 0; j < this.selectionIdGrid[0].length; j++) {
                        if (this.placePixel(j + x, i + y, this.selectionIdGrid[i][j], this.selectionRotationGrid[i][j], this.selectionDataGrid[i][j])) {
                            if (id == null) {
                                id = this.selectionIdGrid[i][j];
                                rotation = this.selectionRotationGrid[i][j];
                                data = this.selectionDataGrid[i][j];
                                pixelX = j;
                            }
                            if (id != this.selectionIdGrid[i][j] || rotation != this.selectionRotationGrid[i][j] || data != this.selectionDataGrid[i][j]) {
                                if (pixels[id].drawBackground == 2) {
                                    if (pixels[id].drawNoise) {
                                        if (pixels[id].animationSpeed == 1) {
                                            for (var k = pixelX; k < j; k++) {
                                                offscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k + x, i + y));
                                                offscreenCtx.fillRect(k * 6 + x * 6, i * 6 + y * 6, 6, 6);
                                            }
                                        }
                                        else {
                                            for (var k = pixelX; k < j; k++) {
                                                offscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i + y][k + x]);
                                                offscreenCtx.fillRect(k * 6 + x * 6, i * 6 + y * 6, 6, 6);
                                            }
                                        }
                                    }
                                    else {
                                        offscreenCtx.fillStyle = colors[id];
                                        offscreenCtx.fillRect(pixelX * 6 + x * 6, i * 6 + y * 6, (j - pixelX) * 6, 6);
                                    }
                                }
                                else {
                                    if (!drawCallX1[id]) {
                                        drawCallX1[id] = [pixelX + x];
                                        drawCallX2[id] = [j + x];
                                        drawCallY[id] = [i + y];
                                        drawCallRotation[id] = [rotation];
                                        drawCallData[id] = [data];
                                    }
                                    else {
                                        drawCallX1[id].push(pixelX + x);
                                        drawCallX2[id].push(j + x);
                                        drawCallY[id].push(i + y);
                                        drawCallRotation[id].push(rotation);
                                        drawCallData[id].push(data);
                                    }
                                }
                                id = this.selectionIdGrid[i][j];
                                rotation = this.selectionRotationGrid[i][j];
                                data = this.selectionDataGrid[i][j];
                                pixelX = j;
                            }
                        }
                        else if (id != null) {
                            if (pixels[id].drawBackground == 2) {
                                if (pixels[id].drawNoise) {
                                    if (pixels[id].animationSpeed == 1) {
                                        for (var k = pixelX; k < j; k++) {
                                            offscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k + x, i + y));
                                            offscreenCtx.fillRect(k * 6 + x * 6, i * 6 + y * 6, 6, 6);
                                        }
                                    }
                                    else {
                                        for (var k = pixelX; k < j; k++) {
                                            offscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i + y][k + x]);
                                            offscreenCtx.fillRect(k * 6 + x * 6, i * 6 + y * 6, 6, 6);
                                        }
                                    }
                                }
                                else {
                                    offscreenCtx.fillStyle = colors[id];
                                    offscreenCtx.fillRect(pixelX * 6 + x * 6, i * 6 + y * 6, (j - pixelX) * 6, 6);
                                }
                            }
                            else {
                                if (!drawCallX1[id]) {
                                    drawCallX1[id] = [pixelX + x];
                                    drawCallX2[id] = [j + x];
                                    drawCallY[id] = [i + y];
                                    drawCallRotation[id] = [rotation];
                                    drawCallData[id] = [data];
                                }
                                else {
                                    drawCallX1[id].push(pixelX + x);
                                    drawCallX2[id].push(j + x);
                                    drawCallY[id].push(i + y);
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
                                    for (var k = pixelX; k < this.selectionIdGrid[0].length; k++) {
                                        offscreenCtx.fillStyle = colorTint(colors[id], updateNoiseGrid(k + x, i + y));
                                        offscreenCtx.fillRect(k * 6 + x * 6, i * 6 + y * 6, 6, 6);
                                    }
                                }
                                else {
                                    for (var k = pixelX; k < this.selectionIdGrid[0].length; k++) {
                                        offscreenCtx.fillStyle = colorTint(colors[id], noiseGrid[i + y][k + x]);
                                        offscreenCtx.fillRect(k * 6 + x * 6, i * 6 + y * 6, 6, 6);
                                    }
                                }
                            }
                            else {
                                offscreenCtx.fillStyle = colors[id];
                                offscreenCtx.fillRect(pixelX * 6 + x * 6, i * 6 + y * 6, (this.selectionIdGrid[0].length - pixelX) * 6, 6);
                            }
                        }
                        else {
                            if (!drawCallX1[id]) {
                                drawCallX1[id] = [pixelX + x];
                                drawCallX2[id] = [this.selectionIdGrid[0].length + x];
                                drawCallY[id] = [i + y];
                                drawCallRotation[id] = [rotation];
                                drawCallData[id] = [data];
                            }
                            else {
                                drawCallX1[id].push(pixelX + x);
                                drawCallX2[id].push(this.selectionIdGrid[0].length + x);
                                drawCallY[id].push(i + y);
                                drawCallRotation[id].push(rotation);
                                drawCallData[id].push(data);
                            }
                        }
                        id = null;
                    }
                }
                drawDrawCalls(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, offscreenCtx);
                var fire = null;
                for (var i = 0; i < this.selectionIdGrid.length; i++) {
                    for (var j = 0; j < this.selectionIdGrid[0].length; j++) {
                        if (this.placeFire(j + x, i + y, this.selectionFireGrid[i][j])) {
                            if (fire == null) {
                                fire = this.selectionFireGrid[i][j];
                                pixelX = j;
                            }
                            if (fire != this.selectionFireGrid[i][j]) {
                                offscreenFireCtx.clearRect(pixelX * 6 + x * 6, i * 6 + y * 6, (j - pixelX) * 6, 6);
                                if (fire) {
                                    for (var k = pixelX; k < j; k++) {
                                        pixels[FIRE].draw(k + x, i + y, offscreenFireCtx);
                                    }
                                }
                                fire = this.selectionFireGrid[i][j];
                                pixelX = j;
                            }
                        }
                        else if (fire != null) {
                            offscreenFireCtx.clearRect(pixelX * 6 + x * 6, i * 6 + y * 6, (j - pixelX) * 6, 6);
                            if (fire) {
                                for (var k = pixelX; k < j; k++) {
                                    pixels[FIRE].draw(k + x, i + y, offscreenFireCtx);
                                }
                            }
                            fire = null;
                        }
                    }
                    if (fire != null) {
                        offscreenFireCtx.clearRect(pixelX * 6 + x * 6, i * 6 + y * 6, (gridSize - pixelX) * 6, 6);
                        if (fire) {
                            for (var k = pixelX; k < gridSize; k++) {
                                pixels[FIRE].draw(k + x, i + y, offscreenFireCtx);
                            }
                        }
                        fire = null;
                    }
                }
                drawCanvas();
                this.updateInventory();
                storeGrid();
            }
        }
    },
};

brush.ctx = brush.canvas.getContext("2d");
brush.lineOffscreenCtx = brush.lineOffscreenCanvas.getContext("2d");
brush.pixelOffscreenCtx = brush.pixelOffscreenCanvas.getContext("2d");
brush.ctx.lineWidth = "1px";
brush.ctx.strokeStyle = "rgb(0, 0, 0)";