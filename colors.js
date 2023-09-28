var colors = {};

colors[AIR] = "rgb(255, 255, 255)";
colors[DIRT] = "rgb(125, 75, 0)";
colors[GRASS] = "rgb(25, 150, 75)";
colors[SAND] = "rgb(255, 225, 125)";
colors[WATER] = [125, 225, 255, 25, 75, 175];
colors[OAK_WOOD] = ["rgb(175, 125, 75)", "rgb(150, 100, 75)"];
colors[LEAF] = "rgb(125, 225, 75)";
colors[MUD] = [125, 75, 25, 50, 25, 0];
colors[DRIED_MUD] = [150, 100, 50, 75, 50, 0];
colors[VINE] = [75, 255, 25, 25, 75, 0];
colors[MOSS] = [25, 175, 25, 0, 100, 0];
colors[SPONGE] = "rgb(225, 255, 75)";
colors[GLASS] = ["rgb(235, 235, 255)", "rgb(245, 245, 255)"];
colors[REINFORCED_GLASS] = ["rgb(200, 200, 255)", "rgb(225, 225, 255)", "rgb(235, 235, 255)", "rgb(245, 245, 255)"];
colors[LAVA] = [255, 255, 25, 225, 25, 0];
colors[FIRE] = [255, 175, 25, 225, 100, 25];
colors[SMOKE] = [75, 75, 75, 25, 25, 25];
colors[ASH] = [125, 125, 135, 75, 75, 85];
colors[HARDENED_ASH] = [100, 100, 110, 50, 50, 60];
colors[STEAM] = [225, 225, 225, 200, 200, 200];
colors[MAGMA] = [350, 150, 25, 0, 0, 25];
colors[STONE] = [100, 100, 100, 75, 75, 75];
colors[BASALT] = [75, 75, 75, 50, 50, 50];
colors[OBSIDIAN] = [25, 25, 25, 25, 0, 50];
colors[SNOW] = "rgb(235, 235, 255)";
colors[ICE] = ["rgb(150, 150, 255)", "rgb(125, 125, 255)"];
colors[SLUSH] = [150, 150, 200, 100, 100, 150];
colors[SPRUCE_WOOD] = ["rgb(125, 75, 50)", "rgb(100, 50, 25)"];
colors[PUSHER] = ["rgb(75, 255, 255)", "rgb(25, 175, 255)"];
colors[PULLER] = ["rgb(125, 255, 75)", "rgb(75, 175, 0)"];
colors[DRILLER] = ["rgb(75, 75, 175)", "rgb(25, 25, 125)"];
colors[PENETRATOR] = ["rgb(255, 125, 75)", "rgb(175, 75, 0)"];
colors[COPIER] = ["rgb(100, 100, 100)", "rgb(75, 255, 255)", "rgb(125, 255, 75)"];
colors[CONVERTER] = ["rgb(100, 100, 100)", "rgb(75, 255, 255)", "rgb(75, 75, 175)"];
colors[CLONER] = ["rgb(100, 100, 100)", "rgb(75, 255, 255)", "rgb(255, 125, 75)"];
colors[FAN] = ["rgb(100, 100, 100)", "rgb(225, 225, 255)", "rgb(200, 200, 225)", "rgb(175, 125, 75)"];
colors[ROTATOR] = ["rgb(100, 100, 100)", "rgb(75, 255, 255)", "rgb(85, 175, 175)", "rgb(125, 255, 75)", "rgb(115, 175, 85)"];
colors[GRABBER_ROTATOR] = ["rgb(100, 100, 100)", "rgb(75, 75, 175)", "rgb(85, 85, 135)", "rgb(255, 125, 75)", "rgb(175, 115, 85)"];
colors[DIRECTIONAL_ROTATOR] = ["rgb(100, 100, 100)", "rgb(75, 255, 255)"];
colors[DELETER] = ["rgb(100, 100, 100)", "rgb(255, 75, 75)", [255, 75, 75, 255, 255, 25]];
colors[SLIDER] = ["rgb(255, 175, 0)", "rgb(200, 100, 0)"];
colors[COLLAPSABLE] = ["rgb(200, 100, 0)", "rgb(255, 175, 0)", "rgb(225, 135, 0)"];
colors[GUNPOWDER] = [50, 35, 35, 15, 0, 0];
colors[DYNAMITE] = ["rgb(175, 25, 25)", "rgb(255, 25, 25)", "rgb(125, 25, 25)"];
colors[IGNITOR] = ["rgb(175, 25, 25)", "rgb(255, 25, 25)", "rgb(125, 25, 25)"];
colors[LASER_EXPLOSIVE] = ["rgb(200, 200, 225)", "rgb(225, 225, 255)", "rgb(175, 175, 225)"];
colors[RED_LASER] = ["rgb(125, 0, 50)", "rgb(255, 0, 75)", [255, 0, 75, 255, 75, 0], "rgba(225, 150, 75, 0.5)", "rgb(225, 150, 75)"];
colors[GREEN_LASER] = ["rgb(0, 175, 125)", "rgb(0, 255, 150)", [0, 255, 150, 25, 175, 255], "rgba(75, 225, 150, 0.5)", "rgb(75, 225, 150)"];
colors[BLUE_LASER] = ["rgb(75, 0, 125)", "rgb(255, 0, 150)", [255, 0, 150, 75, 125, 255], "rgba(75, 150, 225, 0.5)", "rgb(75, 150, 225)"];
colors[MIRROR] = ["rgb(255, 255, 255)", "rgb(225, 225, 255)", "rgb(175, 175, 200)"];
colors[LASER_SCATTERER] = ["rgb(225, 225, 255)", "rgb(200, 200, 225)"];
colors[LASER_TUNNEL] = ["rgb(225, 225, 255)", "rgb(200, 200, 225)", "rgb(175, 175, 200)"];
colors[RED_SAND] = "rgb(225, 75, 0)";
colors[PINK_SAND] = "rgb(255, 100, 175)";
colors[SPONGY_RICE] = [225, 255, 50, 255, 255, 255];
// colors[OSCILLATOR] = ["rgb(100, 100, 100)", "rgb(200, 0, 150)", "rgb(255, 0, 200)", "rgb(150, 0, 200)", "rgb(200, 0, 255)", "rgb(200, 200, 0)", "rgb(255, 255, 0)", "rgb(100, 200, 0)", "rgb(150, 255, 0)", "rgb(125, 0, 0)", "rgb(175, 125, 0)", "rgb(175, 175, 0)", "rgb(125, 175, 0)", "rgb(0, 175, 0)", "rgb(0, 175, 125)", "rgb(0, 175, 175)", "rgb(0, 125, 175)", "rgb(0, 0, 175)", "rgb(125, 0, 175)", "rgb(175, 0, 175)", "rgb(175, 0, 125)", "rgb(175, 0, 0)", "rgb(255, 125, 0)", "rgb(255, 255, 0)", "rgb(125, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 125)", "rgb(0, 255, 255)", "rgb(0, 125, 255)", "rgb(0, 0, 255)", "rgb(125, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 125)", "rgb(255, 0, 0)"];
colors[OSCILLATOR] = ["rgb(100, 100, 100)", "rgb(175, 175, 175)", "rgb(225, 225, 225)", "rgb(200, 0, 150)", "rgb(255, 0, 200)", "rgb(150, 0, 200)", "rgb(200, 0, 255)", "rgb(0, 25, 200)", "rgb(0, 75, 255)", "rgb(0, 200, 25)", "rgb(0, 255, 75)", "rgb(125, 200, 0)", "rgb(175, 255, 0)", "rgb(75, 0, 0)", "rgb(125, 75, 0)", "rgb(125, 125, 0)", "rgb(75, 125, 0)", "rgb(0, 125, 0)", "rgb(0, 125, 75)", "rgb(0, 125, 125)", "rgb(0, 75, 125)", "rgb(0, 0, 125)", "rgb(75, 0, 125)", "rgb(125, 0, 125)", "rgb(125, 0, 75)", "rgb(125, 0, 0)", "rgb(175, 125, 0)", "rgb(175, 175, 0)", "rgb(125, 175, 0)", "rgb(0, 175, 0)", "rgb(0, 175, 125)", "rgb(0, 175, 175)", "rgb(0, 125, 175)", "rgb(0, 0, 175)", "rgb(125, 0, 175)", "rgb(175, 0, 175)", "rgb(175, 0, 125)", "rgb(175, 0, 0)", "rgb(255, 125, 0)", "rgb(255, 255, 0)", "rgb(125, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 125)", "rgb(0, 255, 255)", "rgb(0, 125, 255)", "rgb(0, 0, 255)", "rgb(125, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 125)", "rgb(255, 0, 0)"];
colors[OSCILLATOR_TUNER] = ["rgb(100, 100, 100)", "rgb(255, 0, 0)", "rgb(255, 125, 0)", "rgb(255, 255, 0)", "rgb(125, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 125)", "rgb(0, 255, 255)", "rgb(0, 125, 255)", "rgb(0, 0, 255)", "rgb(125, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 125)"];
colors[DRUM] = ["rgb(100, 100, 100)", "rgb(75, 75, 75)", "rgb(175, 175, 175)", "rgb(150, 150, 150)", "rgb(225, 225, 225)", "rgb(255, 0, 0)", "rgb(255, 125, 0)", "rgb(255, 255, 0)", "rgb(125, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 125)", "rgb(0, 255, 255)", "rgb(0, 125, 255)", "rgb(0, 0, 255)", "rgb(125, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 125)"];
colors[ALLOW_PLACEMENT] = ["rgb(0, 0, 0)", "rgba(0, 0, 0, 0.3)"];
colors[RESTRICT_PLACEMENT] = ["rgb(0, 0, 0)", "rgba(0, 0, 0, 0.3)", "rgba(255, 255, 255, 0.3)"];
colors[GOAL] = ["rgb(255, 200, 0)", "rgb(255, 240, 0)", "rgba(255, 175, 0, 0.3)", 0];
colors[TARGET] = ["rgb(0, 200, 255)", "rgba(0, 255, 255, 0.3)", 0];
colors[MONSTER] = ["rgb(175, 0, 0)", "rgb(255, 255, 255)", "rgb(255, 0, 0)", "rgb(0, 0, 0)"];
colors[PIXELITE_CRYSTAL] = ["rgb(255, 255, 255)", [255, 0, 0], [127, 255, 0], [0, 255, 255], [127, 0, 255], [255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255]];
colors[CORRUPTION] = ["rgb(255, 255, 255)", [255, 0, 0], [127, 255, 0], [0, 255, 255], [127, 0, 255], [255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255]];

var colorToRGB = function(array) {
    return `rgb(${array[0]}, ${array[1]}, ${array[2]})`;
}
var colorToRGBTransparent = function(array, a) {
    return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${a})`;
}
var colorTint = function(array, t) {
    return `rgb(${Math.round(array[0] * (1 - t) + array[3] * t)}, ${Math.round(array[1] * (1 - t) + array[4] * t)}, ${Math.round(array[2] * (1 - t) + array[5] * t)})`;
};
var colorTintTransparent = function(array, a, t) {
    return `rgba(${Math.round(array[0] * (1 - t) + array[3] * t)}, ${Math.round(array[1] * (1 - t) + array[4] * t)}, ${Math.round(array[2] * (1 - t) + array[5] * t)}, ${a})`;
};
var colorLerp = function(array, p) {
    return `rgb(${(array[0] * (Math.sin(animationTick * 2 * Math.PI / p) + 1) / 2) + (array[3] * (Math.sin((animationTick * 2 + p) * Math.PI / p) + 1) / 2)}, ${(array[1] * (Math.sin(animationTick * 2 * Math.PI / p) + 1) / 2) + (array[4] * (Math.sin((animationTick * 2 + p) * Math.PI / p) + 1) / 2)}, ${(array[2] * (Math.sin(animationTick * 2 * Math.PI / p) + 1) / 2) + (array[5] * (Math.sin((animationTick * 2 + p) * Math.PI / p) + 1) / 2)})`;
};
var pixeliteLerp = function(array1, array2, t) {
    return [Math.round(array1[0] * (1 - t) + array2[0] * t), Math.round(array1[1] * (1 - t) + array2[1] * t), Math.round(array1[2] * (1 - t) + array2[2] * t)];
};

var setLerpColor = function() {
    colors[DELETER][1] = colorLerp(colors[DELETER][2], pixels[DELETER].animationSpeed * pixels[DELETER].animationFrames);
    colors[RED_LASER][1] = colorLerp(colors[RED_LASER][2], pixels[RED_LASER].animationSpeed * pixels[RED_LASER].animationFrames);
    colors[GREEN_LASER][1] = colorLerp(colors[GREEN_LASER][2], pixels[GREEN_LASER].animationSpeed * pixels[GREEN_LASER].animationFrames);
    colors[BLUE_LASER][1] = colorLerp(colors[BLUE_LASER][2], pixels[BLUE_LASER].animationSpeed * pixels[BLUE_LASER].animationFrames);
    colors[GOAL][3] = (Math.sin(animationTick * Math.PI / 120) + 1) / 4;
    colors[TARGET][2] = (Math.sin(animationTick * Math.PI / 120) + 1) / 4;
    var pixeliteCrystalColor1 = colors[PIXELITE_CRYSTAL][Math.floor(animationTick / 16) % 6 + 5];
    var pixeliteCrystalColor2 = colors[PIXELITE_CRYSTAL][Math.floor(animationTick / 16 + 1) % 6 + 5];
    colors[PIXELITE_CRYSTAL][1] = pixeliteLerp(pixeliteCrystalColor1, pixeliteCrystalColor2, animationTick / 16 - Math.floor(animationTick / 16));
    pixeliteCrystalColor1 = colors[PIXELITE_CRYSTAL][Math.floor(animationTick / 16 + 1.5) % 6 + 5];
    pixeliteCrystalColor2 = colors[PIXELITE_CRYSTAL][Math.floor(animationTick / 16 + 2.5) % 6 + 5];
    colors[PIXELITE_CRYSTAL][2] = pixeliteLerp(pixeliteCrystalColor1, pixeliteCrystalColor2, animationTick / 16 + 0.5 - Math.floor(animationTick / 16 + 0.5));
    pixeliteCrystalColor1 = colors[PIXELITE_CRYSTAL][Math.floor(animationTick / 16 + 3) % 6 + 5];
    pixeliteCrystalColor2 = colors[PIXELITE_CRYSTAL][Math.floor(animationTick / 16 + 4) % 6 + 5];
    colors[PIXELITE_CRYSTAL][3] = pixeliteLerp(pixeliteCrystalColor1, pixeliteCrystalColor2, animationTick / 16 - Math.floor(animationTick / 16));
    pixeliteCrystalColor1 = colors[PIXELITE_CRYSTAL][Math.floor(animationTick / 16 + 4.5) % 6 + 5];
    pixeliteCrystalColor2 = colors[PIXELITE_CRYSTAL][Math.floor(animationTick / 16 + 5.5) % 6 + 5];
    colors[PIXELITE_CRYSTAL][4] = pixeliteLerp(pixeliteCrystalColor1, pixeliteCrystalColor2, animationTick / 16 + 0.5 - Math.floor(animationTick / 16 + 0.5));
};