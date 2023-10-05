var pixelIds = [
    "AIR",
    "DIRT",
    "GRASS",
    "SAND",
    "WATER",
    "OAK_WOOD",
    "LEAF",
    "MUD",
    "DRIED_MUD",
    "VINE",
    "MOSS",
    "SPONGE",
    "GLASS",
    "REINFORCED_GLASS",
    "LAVA",
    "FIRE",
    "SMOKE",
    "ASH",
    "HARDENED_ASH",
    "STEAM",
    "MAGMA",
    "STONE",
    "BASALT",
    "OBSIDIAN",
    "SNOW",
    "ICE",
    "SLUSH",
    "SPRUCE_WOOD",
    "PUSHER",
    "PULLER",
    "DRILLER",
    "PENETRATOR",
    "COPIER",
    "CONVERTER",
    "CLONER",
    "FAN",
    "ROTATOR",
    "GRABBER_ROTATOR",
    "DIRECTIONAL_ROTATOR",
    "DELETER",
    "SLIDER",
    "COLLAPSABLE",
    "GUNPOWDER",
    "DYNAMITE",
    "IGNITOR",
    "LASER_EXPLOSIVE",
    "RED_LASER",
    "GREEN_LASER",
    "BLUE_LASER",
    "MIRROR",
    "LASER_SCATTERER",
    "LASER_TUNNEL",
    "RED_SAND",
    "PINK_SAND",
    "SPONGY_RICE",
    "OSCILLATOR",
    "OSCILLATOR_TUNER",
    "DRUM",
    "ALLOW_PLACEMENT",
    "RESTRICT_PLACEMENT",
    "GOAL",
    "TARGET",
    "MONSTER",
    "PIXELITE_CRYSTAL",
    "CORRUPTION",
];

for (var i = 0; i < pixelIds.length; i++) {
    eval(`${pixelIds[i]}=${i};`);
}

var pixsimIds = {};
var pixsimToGame = [];
var gameToPixsim = [];
var pixsimToRotation = [];
for (var i = 0, j = 0; i < pixels.length; i++) {
    gameToPixsim.push(j);
    if (pixels[i].rotateable > 1) {
        for (var k = 0; k < pixels[i].rotateable; k++, j++) {
            pixsimIds[pixelIds[i] + k] = i;
            pixsimToGame.push(i);
            pixsimToRotation.push(k);
        }
    } else {
        pixsimIds[pixelIds[i]] = i;
        pixsimToGame.push(i);
        pixsimToRotation.push(0);
        j++;
    }
}

var getPixSimId = function(id, rotation) {
    return gameToPixsim[id] + rotation;
};
var getGameId = function(pixsimId) {
    return pixsimToGame[pixsimId];
};
var getGameRotation = function(pixsimId) {
    return pixsimToRotation[pixsimId];
};