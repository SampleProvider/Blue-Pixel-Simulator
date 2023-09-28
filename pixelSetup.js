

var isTouching = function(x, y, distance, pixel) {
    for (var i = Math.max(x - distance, 0); i <= Math.min(x + distance, gridSize - 1); i++) {
        for (var j = Math.max(y - distance, 0); j <= Math.min(y + distance, gridSize - 1); j++) {
            if (i == x && j == y) {
                continue;
            }
            if (Math.abs(x - i) + Math.abs(y - j) > distance) {
                continue;
            }
            if (idGrid[j][i] == pixel) {
                return true;
            }
        }
    }
    if (a != true) {
        while (true) {
            console.log(a);
        }
    }
    return false;
};
var getTouching = function(x, y, distance, pixel) {
    var touchingPixels = 0;
    for (var i = Math.max(x - distance, 0); i <= Math.min(x + distance, gridSize - 1); i++) {
        for (var j = Math.max(y - distance, 0); j <= Math.min(y + distance, gridSize - 1); j++) {
            if (i == x && j == y) {
                continue;
            }
            if (Math.abs(x - i) + Math.abs(y - j) > distance) {
                continue;
            }
            if (idGrid[j][i] == pixel) {
                touchingPixels += 1;
            }
        }
    }
    return touchingPixels;
};
var forEachTouching = function(x, y, distance, pixel, action) {
    for (var i = Math.max(x - distance, 0); i <= Math.min(x + distance, gridSize - 1); i++) {
        for (var j = Math.max(y - distance, 0); j <= Math.min(y + distance, gridSize - 1); j++) {
            if (i == x && j == y) {
                continue;
            }
            if (Math.abs(x - i) + Math.abs(y - j) > distance) {
                continue;
            }
            if (idGrid[j][i] == pixel) {
                action(i, j);
            }
        }
    }
};
var forAllTouching = function(x, y, distance, action) {
    for (var i = Math.max(x - distance, 0); i <= Math.min(x + distance, gridSize - 1); i++) {
        for (var j = Math.max(y - distance, 0); j <= Math.min(y + distance, gridSize - 1); j++) {
            if (i == x && j == y) {
                continue;
            }
            if (Math.abs(x - i) + Math.abs(y - j) > distance) {
                continue;
            }
            action(i, j);
        }
    }
};

var isTouchingHeated = function(x, y, distance) {
    if (fireGrid[y][x]) {
        return true;
    }
    for (var i = Math.max(x - distance, 0); i <= Math.min(x + distance, gridSize - 1); i++) {
        for (var j = Math.max(y - distance, 0); j <= Math.min(y + distance, gridSize - 1); j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            if (Math.abs(x - i) + Math.abs(y - j) > distance) {
                continue;
            }
            if (idGrid[j][i] == LAVA || idGrid[j][i] == FIRE || idGrid[j][i] == MAGMA) {
                return true;
            }
        }
    }
    return false;
};
var getTouchingHeated = function(x, y, distance) {
    var touchingPixels = 0;
    if (fireGrid[y][x]) {
        touchingPixels += 1;
    }
    for (var i = Math.max(x - distance, 0); i <= Math.min(x + distance, gridSize - 1); i++) {
        for (var j = Math.max(y - distance, 0); j <= Math.min(y + distance, gridSize - 1); j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            if (Math.abs(x - i) + Math.abs(y - j) > distance) {
                continue;
            }
            if (idGrid[j][i] == LAVA || idGrid[j][i] == FIRE || idGrid[j][i] == MAGMA) {
                touchingPixels += 1;
            }
        }
    }
    return touchingPixels;
};
var isTouchingCooled = function(x, y, distance) {
    for (var i = Math.max(x - distance, 0); i <= Math.min(x + distance, gridSize - 1); i++) {
        for (var j = Math.max(y - distance, 0); j <= Math.min(y + distance, gridSize - 1); j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            if (Math.abs(x - i) + Math.abs(y - j) > distance) {
                continue;
            }
            if (idGrid[j][i] == SNOW || idGrid[j][i] == ICE || idGrid[j][i] == SLUSH) {
                return true;
            }
        }
    }
    return false;
};

var getMinimalFlowSpace = function(x, y, distance) {
    var id = idGrid[y][x];
    var leftSpaceStopped = false;
    var rightSpaceStopped = false;
    for (var i = 1; i <= distance; i++) {
        var leftSpace = false;
        var rightSpace = false;
        if (x - i == -1) {
            leftSpaceStopped = true;
        }
        if (!leftSpaceStopped) {
            if ((idGrid[y + 1][x - i + 1] == id || pixels[idGrid[y][x - i]].density < pixels[id].density) && pixels[idGrid[y + 1][x - i]].density < pixels[id].density && idGrid[y][x - i] != id) {
                leftSpace = true;
            }
            if (pixels[idGrid[y][x - i]].density >= pixels[id].density) {
                leftSpaceStopped = true;
            }
        }
        if (x + i == gridSize) {
            rightSpaceStopped = true;
        }
        if (!rightSpaceStopped) {
            if ((idGrid[y + 1][x + i - 1] == id || pixels[idGrid[y][x + i]].density < pixels[id].density) && pixels[idGrid[y + 1][x + i]].density < pixels[id].density && idGrid[y][x + i] != id) {
                rightSpace = true;
            }
            if (pixels[idGrid[y][x + i]].density >= pixels[id].density) {
                rightSpaceStopped = true;
            }
        }
        if (leftSpace || rightSpace) {
            return [leftSpace ? i : 0, rightSpace ? i : 0];
        }
        if (leftSpaceStopped && rightSpaceStopped) {
            return [0, 0];
        }
    }
    return [0, 0];
};
var getMinimalAscendSpace = function(x, y, distance) {
    var id = idGrid[y][x];
    var leftSpaceStopped = false;
    var rightSpaceStopped = false;
    for (var i = 1; i <= distance; i++) {
        var leftSpace = false;
        var rightSpace = false;
        if (x - i == -1) {
            leftSpaceStopped = true;
        }
        if (!leftSpaceStopped) {
            if ((idGrid[y - 1][x - i + 1] == id || pixels[idGrid[y][x - i]].density < pixels[id].density) && pixels[idGrid[y - 1][x - i]].density < pixels[id].density && idGrid[y][x - i] != id) {
                leftSpace = true;
            }
            if (pixels[idGrid[y][x - i]].density >= pixels[id].density) {
                leftSpaceStopped = true;
            }
        }
        if (x + i == gridSize) {
            rightSpaceStopped = true;
        }
        if (!rightSpaceStopped) {
            if ((idGrid[y - 1][x + i - 1] == id || pixels[idGrid[y][x + i]].density < pixels[id].density) && pixels[idGrid[y - 1][x + i]].density < pixels[id].density && idGrid[y][x + i] != id) {
                rightSpace = true;
            }
            if (pixels[idGrid[y][x + i]].density >= pixels[id].density) {
                rightSpaceStopped = true;
            }
        }
        if (leftSpace || rightSpace) {
            return [leftSpace ? i : 0, rightSpace ? i : 0];
        }
        if (leftSpaceStopped && rightSpaceStopped) {
            return [0, 0];
        }
    }
    return [0, 0];
};
var getMinimalAir = function(x, y, distance) {
    var id = idGrid[y][x];
    for (var i = 1; i <= distance; i++) {
        var leftAir = false;
        var rightAir = false;
        if (x - i == -1) {
            leftAir = true;
        }
        else {
            if (pixels[idGrid[y][x - i]].density != 0 && idGrid[y][x - i] != id) {
                leftAir = true;
            }
        }
        if (x + i == gridSize) {
            rightAir = true;
        }
        else {
            if (pixels[idGrid[y][x + i]].density != 0 && idGrid[y][x + i] != id) {
                rightAir = true;
            }
        }
        if (leftAir || rightAir) {
            return [leftAir ? i : 0, rightAir ? i : 0];
        }
    }
    return [0, 0];
};

var move = function(x, y, positions) {
    if (nextIdGrid[y][x] != null) {
        return false;
    }
    var moveablePositions = [];
    for (var i in positions) {
        if (x + positions[i].x >= 0 && x + positions[i].x < gridSize && y + positions[i].y >= 0 && y + positions[i].y < gridSize) {
            if (nextIdGrid[y + positions[i].y][x + positions[i].x] == null) {
                moveablePositions.push(positions[i]);
            }
        }
    }
    if (moveablePositions.length > 0) {
        var move = moveablePositions[Math.floor(getRandom(x, y) * moveablePositions.length)];
        if (idGrid[y + move.y][x + move.x] == DELETER) {
            nextIdGrid[y][x] = AIR;
            nextRotationGrid[y][x] = 0;
            nextDataGrid[y][x] = 0;
            nextFireGrid[y][x] = false;
            return true;
        }
        if (idGrid[y + move.y][x + move.x] == MONSTER) {
            nextIdGrid[y][x] = AIR;
            nextRotationGrid[y][x] = 0;
            nextDataGrid[y][x] = 0;
            nextFireGrid[y][x] = false;
            nextIdGrid[y + move.y][x + move.x] = AIR;
            nextDataGrid[y + move.y][x + move.x] = 0;
            nextFireGrid[y + move.y][x + move.x] = false;
            return true;
        }
        if (idGrid[y + move.y][x + move.x] == PIXELITE_CRYSTAL) {
            nextIdGrid[y][x] = AIR;
            nextRotationGrid[y][x] = 0;
            nextDataGrid[y][x] = 0;
            if (dataGrid[y + move.y][x + move.x] == 0) {
                nextIdGrid[y + move.y][x + move.x] = AIR;
                nextFireGrid[y + move.y][x + move.x] = false;
            }
            else {
                nextDataGrid[y + move.y][x + move.x] = dataGrid[y + move.y][x + move.x] - 1;
                dataGrid[y + move.y][x + move.x] -= 1;
            }
            return true;
        }
        nextIdGrid[y][x] = idGrid[y + move.y][x + move.x];
        nextRotationGrid[y][x] = rotationGrid[y + move.y][x + move.x];
        nextDataGrid[y][x] = dataGrid[y + move.y][x + move.x];
        nextFireGrid[y][x] = fireGrid[y + move.y][x + move.x];
        nextIdGrid[y + move.y][x + move.x] = idGrid[y][x];
        nextRotationGrid[y + move.y][x + move.x] = rotationGrid[y][x];
        nextDataGrid[y + move.y][x + move.x] = dataGrid[y][x];
        nextFireGrid[y + move.y][x + move.x] = fireGrid[y][x];
        return true;
    }
    return false;
};
var fall = function(x, y) {
    if (nextIdGrid[y][x] != null) {
        return false;
    }
    if (y + 1 == gridSize) {
        return false;
    }
    if (pixels[idGrid[y + 1][x]].density < pixels[idGrid[y][x]].density) {
        return move(x, y, [{ x: 0, y: 1 }]);
    }
    return false;
};
var flow = function(x, y, distance) {
    if (nextIdGrid[y][x] != null) {
        return false;
    }
    if (y + 1 == gridSize) {
        return false;
    }
    if (fall(x, y)) {
        return true;
    }
    if (!(x != 0 && nextIdGrid[y][x - 1] == null && pixels[idGrid[y][x - 1]].density < pixels[idGrid[y][x]].density) && !(x != gridSize - 1 && nextIdGrid[y][x + 1] == null && pixels[idGrid[y][x + 1]].density < pixels[idGrid[y][x]].density)) {
        return false;
    }
    var positions = [];
    var minimalSpace = getMinimalFlowSpace(x, y, distance);
    if (minimalSpace[0] == 1) {
        positions.push({ x: -1, y: 1 });
    }
    if (minimalSpace[1] == 1) {
        positions.push({ x: 1, y: 1 });
    }
    if (positions.length == 0) {
        if (minimalSpace[0] != 0) {
            positions.push({ x: -1, y: 0 });
        }
        if (minimalSpace[1] != 0) {
            positions.push({ x: 1, y: 0 });
        }
        if (positions.length == 0) {
            if (x != 0 && x != gridSize - 1 && y != 0) {
                var id = idGrid[y][x];
                if (pixels[idGrid[y - 1][x]].density >= pixels[id].density) {
                    var minimalAir = getMinimalAir(x, y, distance);
                    if (pixels[idGrid[y][x - 1]].density < pixels[id].density && pixels[idGrid[y - 1][x - 1]].density > pixels[id].density && minimalAir[0] != 0) {
                        positions.push({ x: -1, y: 0 });
                    }
                    if (pixels[idGrid[y][x + 1]].density < pixels[id].density && pixels[idGrid[y - 1][x + 1]].density > pixels[id].density && minimalAir[1] != 0) {
                        positions.push({ x: 1, y: 0 });
                    }
                }
            }
        }
    }
    return move(x, y, positions);
};
var rise = function(x, y) {
    if (nextIdGrid[y][x] != null) {
        return false;
    }
    if (y == 0) {
        return false;
    }
    if (pixels[idGrid[y - 1][x]].density < pixels[idGrid[y][x]].density) {
        return move(x, y, [{ x: 0, y: -1 }]);
    }
    return false;
};
var ascend = function(x, y, distance) {
    if (nextIdGrid[y][x] != null) {
        return false;
    }
    if (y == 0) {
        return false;
    }
    if (rise(x, y)) {
        return true;
    }
    if (!(x != 0 && nextIdGrid[y][x - 1] == null && pixels[idGrid[y][x - 1]].density < pixels[idGrid[y][x]].density) && !(x != gridSize - 1 && nextIdGrid[y][x + 1] == null && pixels[idGrid[y][x + 1]].density < pixels[idGrid[y][x]].density)) {
        return false;
    }
    var positions = [];
    var minimalSpace = getMinimalAscendSpace(x, y, distance);
    if (minimalSpace[0] == 1) {
        positions.push({ x: -1, y: -1 });
    }
    if (minimalSpace[1] == 1) {
        positions.push({ x: 1, y: -1 });
    }
    if (positions.length == 0) {
        if (minimalSpace[0] != 0) {
            positions.push({ x: -1, y: 0 });
        }
        if (minimalSpace[1] != 0) {
            positions.push({ x: 1, y: 0 });
        }
        if (positions.length == 0) {
            if (x != 0 && x != gridSize - 1 && y != gridSize - 1) {
                var id = idGrid[y][x];
                if (pixels[idGrid[y + 1][x]].density >= pixels[id].density) {
                    var minimalAir = getMinimalAir(x, y, distance);
                    if (pixels[idGrid[y][x - 1]].density < pixels[id].density && pixels[idGrid[y + 1][x - 1]].density > pixels[id].density && minimalAir[0] != 0) {
                        positions.push({ x: -1, y: 0 });
                    }
                    if (pixels[idGrid[y][x + 1]].density < pixels[id].density && pixels[idGrid[y + 1][x + 1]].density > pixels[id].density && minimalAir[1] != 0) {
                        positions.push({ x: 1, y: 0 });
                    }
                }
            }
        }
    }
    return move(x, y, positions);
};

var isLocationInGrid = function(x, y, direction, distance) {
    if (direction == 0) {
        if (y - distance < 0) {
            return false;
        }
    }
    else if (direction == 1) {
        if (x + distance >= gridSize) {
            return false;
        }
    }
    else if (direction == 2) {
        if (y + distance >= gridSize) {
            return false;
        }
    }
    else if (direction == 3) {
        if (x - distance < 0) {
            return false;
        }
    }
    return true;
};
var getLocation = function(x, y, direction, distance) {
    if (direction == 0) {
        return [x, y - distance];
    }
    else if (direction == 1) {
        return [x + distance, y];
    }
    else if (direction == 2) {
        return [x, y + distance];
    }
    else if (direction == 3) {
        return [x - distance, y];
    }
};
var canMove = function(x, y, id, rotation, data, direction) {
    if (pixels[id].pushable == false) {
        return false;
    }
    if (id == DELETER || id == MONSTER || id == PIXELITE_CRYSTAL) {
        return false;
    }
    if (id == SLIDER && direction % 2 != rotation) {
        return false;
    }
    if (id == GOAL && targetGrid[y][x] == 1) {
        return false;
    }
    return true;
};
var push = function(x, y, direction, distance) {
    var pushIndex = 0;
    for (var i = 1; i <= distance; i++) {
        if (!isLocationInGrid(x, y, direction, i)) {
            break;
        }
        var location = getLocation(x, y, direction, i);
        var x1 = location[0];
        var y1 = location[1];
        if (nextIdGrid[y1][x1] != null) {
            return false;
        }
        var id = idGrid[y1][x1];
        if (id == COLLAPSABLE) {
            pushIndex = i;
            continue;
        }
        if (!pixels[id].pushable || (id == SLIDER && rotationGrid[y1][x1] == (direction + 1) % 2) || (id == GOAL && targetGrid[y1][x1] == 1)) {
            break;
        }
        if (pixels[id].density == -1) {
            pushIndex = i;
            break;
        }
    }
    if (pushIndex != 0) {
        var location = getLocation(x, y, direction, pushIndex);
        var id = idGrid[location[1]][location[0]];
        var index = (id == DELETER || id == MONSTER || id == PIXELITE_CRYSTAL) ? pushIndex - 1 : pushIndex;
        for (var i = 1; i <= index; i++) {
            var pushingLocation = getLocation(x, y, direction, i - 1);
            var setLocation = getLocation(x, y, direction, i);
            nextIdGrid[setLocation[1]][setLocation[0]] = idGrid[pushingLocation[1]][pushingLocation[0]];
            nextRotationGrid[setLocation[1]][setLocation[0]] = rotationGrid[pushingLocation[1]][pushingLocation[0]];
            nextDataGrid[setLocation[1]][setLocation[0]] = dataGrid[pushingLocation[1]][pushingLocation[0]];
            nextFireGrid[setLocation[1]][setLocation[0]] = fireGrid[pushingLocation[1]][pushingLocation[0]];
        }
        if (id == MONSTER) {
            nextIdGrid[location[1]][location[0]] = AIR;
            nextFireGrid[location[1]][location[0]] = false;
        }
        if (id == PIXELITE_CRYSTAL) {
            if (dataGrid[location[1]][location[0]] == 0) {
                nextIdGrid[location[1]][location[0]] = AIR;
                nextFireGrid[location[1]][location[0]] = false;
            }
            else {
                nextDataGrid[location[1]][location[0]] = dataGrid[location[1]][location[0]] - 1;
                dataGrid[location[1]][location[0]] -= 1;
            }
        }
        nextIdGrid[y][x] = AIR;
        nextRotationGrid[y][x] = 0;
        nextDataGrid[y][x] = 0;
        nextFireGrid[y][x] = false;
        return true;
    }
    return false;
};
var pull = function(x, y, direction, distance) {
    if (!isLocationInGrid(x, y, direction, 1)) {
        return false;
    }
    var frontLocation = getLocation(x, y, direction, 1);
    var frontId = idGrid[frontLocation[1]][frontLocation[0]];
    if (pixels[frontId].density != -1) {
        return false;
    }
    if (nextIdGrid[frontLocation[1]][frontLocation[0]] != null) {
        return false;
    }
    var pullIndex = 0;
    for (var i = 1; i <= distance; i++) {
        if (!isLocationInGrid(x, y, (direction + 2) % 4, i)) {
            pullIndex = i;
            break;
        }
        var location = getLocation(x, y, (direction + 2) % 4, i);
        var x1 = location[0];
        var y1 = location[1];
        if (nextIdGrid[y1][x1] != null) {
            pullIndex = i;
            break;
        }
        var id = idGrid[y1][x1];
        var rotation = rotationGrid[y1][x1];
        var data = dataGrid[y1][x1];
        if (!canMove(x1, y1, id, rotation, data, direction)) {
            pullIndex = i;
            break;
        }
        if (id == AIR) {
            pullIndex = i;
            break;
        }
    }
    if (pullIndex != 0) {
        if (frontId == AIR) {
            nextIdGrid[frontLocation[1]][frontLocation[0]] = idGrid[y][x];
            nextRotationGrid[frontLocation[1]][frontLocation[0]] = rotationGrid[y][x];
            nextDataGrid[frontLocation[1]][frontLocation[0]] = dataGrid[y][x];
            nextFireGrid[frontLocation[1]][frontLocation[0]] = fireGrid[y][x];
        }
        else if (frontId == MONSTER) {
            nextIdGrid[frontLocation[1]][frontLocation[0]] = AIR;
            nextFireGrid[frontLocation[1]][frontLocation[0]] = false;
        }
        else if (frontId == PIXELITE_CRYSTAL) {
            if (frontPixel.data == 0) {
                nextIdGrid[frontLocation[1]][frontLocation[0]] = AIR;
                nextFireGrid[frontLocation[1]][frontLocation[0]] = false;
            }
            else {
                nextDataGrid[frontLocation[1]][frontLocation[0]] = dataGrid[frontLocation[1]][frontLocation[0]] - 1;
                dataGrid[frontLocation[1]][frontLocation[0]] -= 1;
            }
        }
        for (var i = 0; i < pullIndex - 1; i++) {
            var pullingLocation = getLocation(x, y, (direction + 2) % 4, i + 1);
            var setLocation = getLocation(x, y, (direction + 2) % 4, i);
            nextIdGrid[setLocation[1]][setLocation[0]] = idGrid[pullingLocation[1]][pullingLocation[0]];
            nextRotationGrid[setLocation[1]][setLocation[0]] = rotationGrid[pullingLocation[1]][pullingLocation[0]];
            nextDataGrid[setLocation[1]][setLocation[0]] = dataGrid[pullingLocation[1]][pullingLocation[0]];
            nextFireGrid[setLocation[1]][setLocation[0]] = fireGrid[pullingLocation[1]][pullingLocation[0]];
        }
        var setLocation = getLocation(x, y, (direction + 2) % 4, pullIndex - 1);
        nextIdGrid[setLocation[1]][setLocation[0]] = AIR;
        nextRotationGrid[setLocation[1]][setLocation[0]] = 0;
        nextDataGrid[setLocation[1]][setLocation[0]] = 0;
        nextFireGrid[setLocation[1]][setLocation[0]] = false;
        return true;
    }
    return false;
};
var rotate = function(x, y) {
    var rotation = 0;
    var directionalRotations = [0, 0, 0, 0];
    forAllTouching(x, y, 1, function(x1, y1) {
        if (idGrid[y1][x1] == ROTATOR) {
            if (rotationGrid[y1][x1] == 0) {
                rotation += 1;
            }
            else {
                rotation += 3;
            }
        }
        else if (idGrid[y1][x1] == DIRECTIONAL_ROTATOR) {
            directionalRotations[rotationGrid[y1][x1]] = true;
        }
    });
    for (var i = 0; i < 4; i++) {
        if (directionalRotations[i]) {
            rotation += i - rotationGrid[y][x] + 4;
        }
    }
    nextIdGrid[y][x] = idGrid[y][x];
    nextRotationGrid[y][x] = (rotationGrid[y][x] + rotation) % pixels[idGrid[y][x]].rotateable;
};
var laser = function(x, y, direction, onHit) {
    var turns = [0];
    var turnIndex = 0;
    while (true) {
        if (!isLocationInGrid(x, y, direction, 1)) {
            return turns;
        }
        var location = getLocation(x, y, direction, 1);
        var id = idGrid[location[1]][location[0]];
        x = location[0];
        y = location[1];
        if (id != AIR && id != MIRROR) {
            if (!onHit(x, y, direction)) {
                return turns;
            }
        }
        turns[turnIndex] += 2;
        if (id == MIRROR) {
            if (rotationGrid[location[1]][location[0]] == 0) {
                turnIndex += 1;
                if (direction == 0) {
                    direction = 3;
                    turns[turnIndex] = 1;
                }
                else if (direction == 1) {
                    direction = 2;
                    turns[turnIndex] = 0;
                }
                else if (direction == 2) {
                    direction = 1;
                    turns[turnIndex] = 1;
                }
                else if (direction == 3) {
                    direction = 0;
                    turns[turnIndex] = 0;
                }
            }
            else {
                turnIndex += 1;
                if (direction == 0) {
                    direction = 1;
                    turns[turnIndex] = 0;
                }
                else if (direction == 1) {
                    direction = 0;
                    turns[turnIndex] = 1;
                }
                else if (direction == 2) {
                    direction = 3;
                    turns[turnIndex] = 0;
                }
                else if (direction == 3) {
                    direction = 2;
                    turns[turnIndex] = 1;
                }
            }
        }
    }
};
var explode = function(x, y, radius, destroyPower, burnPower) {
    // effects.explosion.activated = true;
    for (var i = Math.max(x - radius, 0); i <= Math.min(x + radius, gridSize - 1); i++) {
        for (var j = Math.max(y - radius, 0); j <= Math.min(y + radius, gridSize - 1); j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            var distance = Math.pow(i - x, 2) + Math.pow(j - y, 2);
            if (distance > Math.pow(radius, 2)) {
                continue;
            }
            var id = null;
            if (nextIdGrid[j][i] == null) {
                id = idGrid[j][i];
            }
            else {
                id = nextIdGrid[j][i];
            }
            if (pixels[id].blastResistance <= destroyPower && getRandom(x, y) < (1 - (distance - 1) / Math.pow(radius, 2)) * (20 - pixels[id].blastResistance) / 200 * destroyPower) {
                if (id == PIXELITE_CRYSTAL) {
                    var data = nextDataGrid[j][i] == null ? dataGrid[j][i] : nextDataGrid[j][i];
                    if (data < destroyPower) {
                        nextIdGrid[j][i] = AIR;
                        nextRotationGrid[j][i] = 0;
                        nextDataGrid[j][i] = 0;
                        if (getRandom(x, y) < 0.25) {
                            nextFireGrid[j][i] = true;
                        }
                    }
                    else {
                        if (nextDataGrid[j][i] == null) {
                            nextDataGrid[j][i] = data - destroyPower;
                            dataGrid[j][i] = data - destroyPower;
                        }
                        else {
                            nextDataGrid[j][i] = data - destroyPower;
                        }
                    }
                }
                else {
                    nextIdGrid[j][i] = AIR;
                    nextRotationGrid[j][i] = 0;
                    nextDataGrid[j][i] = 0;
                    if (getRandom(x, y) < 0.25) {
                        nextFireGrid[j][i] = true;
                    }
                }
            }
            else if (getRandom(x, y) < (1 - (distance - 1) / Math.pow(radius, 2)) * pixels[id].flammability / 20 * burnPower) {
                nextFireGrid[j][i] = true;
            }
        }
    }
};

if (a != true) {
    while (true) {
        console.log(a);
    }
}
if (!rect) {
    laskdjfasdfk
}
if (!document) {
    document.getElementById("menuTitleBlue").innerHTML = "Blue";
    document.getElementById("menuTitleBlue").style.color = "idk";
}

if (") {".length != 3) {
    throw ajshdnflkwjawe;
}
if ("//".length != 2) {
    throw oooooof;
}
document = null;
if (document == null) {
    throw buh;
}

if (!/blue_pixel/.test(function(blue_pixel) { })) {
    blue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixelblue_pixel;
    blue_pixelblue_pixelblue_pixelblue_pixelblue_pixel;
    blue_pixelblue_pixelblue_pixel;
    throw blue_pixel;
}