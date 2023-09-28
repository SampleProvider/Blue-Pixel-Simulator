var pixels = [
    {
        name: "Air",
        description: "It's air. What did you expect?",
        amountColor: "rgb(0, 0, 0)",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[AIR];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: -1,
        pushable: true,
        rotateable: 1,
        cloneable: false,
        flammability: 0,
        blastResistance: 0,
    },
    {
        name: "Dirt",
        description: "Pretty dirty. Wash your hands after touching it.",
        amountColor: "rgb(255, 255, 255)",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[DIRT];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            var supportedPixels = 0;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (pixels[grid[y1][x1].id].density >= this.density) {
                    supportedPixels += 1;
                }
            });
            if (supportedPixels <= 1) {
                fall(x, y);
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 3,
        blastResistance: 3,
    },
    {
        name: "Grass",
        description: "Grows on dirt. You should touch some.",
        amountColor: "rgb(255, 255, 255)",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[GRASS];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (y == 0 || grid[y - 1][x].id != AIR) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: DIRT, rotation: 0, onFire: grid[y][x].onFire, data: 0 };
                }
                return;
            }
            var supportedPixels = 0;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (pixels[grid[y1][x1].id].density >= this.density) {
                    supportedPixels += 1;
                }
            });
            forAllTouching(x, y, 2, function(x1, y1) {
                if (nextGrid[y1][x1] != null) {
                    return;
                }
                if (y1 != 0 && grid[y1][x1].id == DIRT && grid[y1 - 1][x1].id == AIR && getRandom(x, y) < 1 / (Math.pow(x1 - x, 4) + Math.pow(y1 - y, 4))) {
                    nextGrid[y1][x1] = { id: GRASS, rotation: 0, onFire: grid[y][x].onFire, data: 0 };
                }
            });
            if (supportedPixels <= 2) {
                fall(x, y);
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 5,
        blastResistance: 3,
    },
    {
        name: "Sand",
        description: "A fine, light-yellow powder. It likes to make pyramids.",
        amountColor: "rgb(0, 0, 0)",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[SAND];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            flow(x, y, 1);
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 5,
    },
    {
        name: "Water",
        description: "Flows everywhere. Not very realistic. Very buggy.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = "rgb(125, 225, 255)";
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = "rgba(25, 75, 175, 0.5)";
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            flow(x, y, gridSize);
        },
        updateStage: 1,
        animationSpeed: 1,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 1,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 3,
    },
    {
        name: "Oak Wood",
        description: "A thick, rough, oak log. Definitely don't punch it, that's not how the game works.",
        type: "A Pixel World",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[OAK_WOOD][1];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    ctx.fillRect(j * 6, drawCalls[i].y * 6, 3, 6);
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[OAK_WOOD][0];
            ctx.fillRect(3, 0, 3, 6);
            ctx.fillStyle = colors[OAK_WOOD][1];
            ctx.fillRect(0, 0, 3, 6);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 10,
        blastResistance: 10,
    },
    {
        name: "Leaf",
        description: "A nice, springy leaf. It's edible??",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[LEAF];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 20,
        blastResistance: 1,
    },
    {
        name: "Mud",
        description: "It's like dirt, but wet and slightly liquid.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[MUD]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            var supportedPixels = 0;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (pixels[grid[y1][x1].id].density >= this.density) {
                    supportedPixels += 1;
                }
            });
            if (supportedPixels <= 2) {
                flow(x, y, 3);
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 2,
        blastResistance: 3,
    },
    {
        name: "Dried Mud",
        description: "Cracked dry mud. Extremely flammable.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[DRIED_MUD]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            fall(x, y);
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 15,
        blastResistance: 2,
    },
    {
        name: "Sponge",
        description: "Do you want an PlastiSponge™? Well today is your lucky day! If you don't want an PlastiSponge™ today is also your lucky day because we are now selling InstaSpongePlasti™ (SP™) 3000™ and InstaNotSpongePlasti™ (SP™) 3000™! Now sucks up to NaN™ pixels! Buy now for the cheap cheap price of $39,999™! Or buy later for $49,999™! Buy 12™ and get a Free™ ValuBundle™ consisting of 12 PlastiSnow™, 8 PlastiAbrasive™, and a 1% chance to get a Modified™ Modified™ InstaCar™ with a InstaSnowDepot™ and InstaAbrasiveSpreader™! The new BlizzardPack™ is out! Consisting of 64 PlastiSnow™, 24 PlastiAbrasive™, 8 PlastiCars™, 2 PlastiWalls™, a InstaSnowDepot™ and InstaAbrasiveSpreader™, as well as the old RareSnow™ Pack! In the RareSnow™ Pack, you have a 3% chance of getting DyeSnow™, a 0.6% chance of getting IredecenSnow™, and a 0.02% of getting the extremely rare GlowinSnow™! Tune into SampleProvider™ Today™ for more details.",
        amountColor: "rgb(0, 0, 0)",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[SPONGE];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getRandom(x, y) < getTouching(x, y, 1, SPONGE) / 10) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            forEachTouching(x, y, 1, WATER, function(x1, y1) {
                if (nextGrid[y1][x1] == null) {
                    nextGrid[y1][x1] = { id: SPONGE, rotation: 0, onFire: false, data: 0 };
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                    }
                }
            });
            fall(x, y);
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 1,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 10,
        blastResistance: 1,
    },
    {
        name: "Lava",
        description: "Extremely hot and melts rocks. Burns flammable pixels. Flows everywhere but slowly. Water can cool it into rocks. Can cause third degree burns.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = "rgb(255, 255, 25)";
            ctx.fillRect(0, 0, 60, 60);
            ctx.fillStyle = "rgb(225, 25, 0, 0.5)";
            ctx.fillRect(0, 0, 60, 60);
        },
        update: function(x, y) {
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextGrid[y1][x1] != null) {
                    return;
                }
                if (grid[y1][x1].id == WATER && nextGrid[y][x] == null) {
                    var rockRandom = getRandom(x, y);
                    if (y1 > y) {
                        if (rockRandom < 0.1) {
                            nextGrid[y1][x1] = { id: OBSIDIAN, rotation: 0, onFire: false, data: 0 };
                        }
                        else if (rockRandom < 0.5) {
                            nextGrid[y1][x1] = { id: BASALT, rotation: 0, onFire: false, data: 0 };
                        }
                        else {
                            nextGrid[y1][x1] = { id: STONE, rotation: 0, onFire: false, data: 0 };
                        }
                        nextGrid[y][x] = { id: STEAM, rotation: 0, onFire: false, data: 0 };
                    }
                    else {
                        if (rockRandom < 0.1) {
                            nextGrid[y][x] = { id: OBSIDIAN, rotation: 0, onFire: false, data: 0 };
                        }
                        else if (rockRandom < 0.5) {
                            nextGrid[y][x] = { id: BASALT, rotation: 0, onFire: false, data: 0 };
                        }
                        else {
                            nextGrid[y][x] = { id: STONE, rotation: 0, onFire: false, data: 0 };
                        }
                        nextGrid[y1][x1] = { id: STEAM, rotation: 0, onFire: false, data: 0 };
                    }
                }
                if (grid[y1][x1].id == AIR && getRandom(x, y) < 0.1) {
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
                if (pixels[grid[y1][x1].id].flammability > 0 && getRandom(x, y) < pixels[grid[y1][x1].id].flammability / 120) {
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
            });
            if (getRandom(x, y) < 0.25) {
                flow(x, y, gridSize);
            }
        },
        updateStage: 1,
        animationSpeed: 1,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 1,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 5,
    },
    {
        name: "Fire",
        description: "Spreads and burns flammable pixels.",
        type: "A Pixel World",
        drawBackground: false,
        draw: function(x, y, ctx) {
            ctx.fillStyle = colorTintTransparent(colors[FIRE], noiseGrid[y][x] / 2 + 0.3, noiseGrid[y][x] / 2);
            ctx.fillRect(x * 6, y * 6, 6, 6);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[FIRE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            var flammability = pixels[grid[y][x].id].flammability;
            if (flammability == 0 && (grid[y][x].id != AIR || getRandom(x, y) < 0.3)) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: grid[y][x].id, rotation: grid[y][x].rotation, onFire: false, data: grid[y][x].data };
                }
                return;
            }
            var touchingAir = !isTouching(x, y, 2, AIR);
            if (touchingAir && getRandom(x, y) < 0.5) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: grid[y][x].id, rotation: grid[y][x].rotation, onFire: false, data: grid[y][x].data };
                }
                return;
            }
            // if (getRandom(x, y) < (20 - flammability) / 360) {
            //     if (nextGrid[y][x] == null) {
            //         nextGrid[y][x] = { id: grid[y][x].id, rotation: grid[y][x].rotation, onFire: false, data: grid[y][x].data };
            //     }
            //     return;
            // }
            var burned = false;
            if (getRandom(x, y) < flammability / 1200 && nextGrid[y][x] == null) {
                // if (grid[y][x].id == )
                if (grid[y][x].id != ASH && getRandom(x, y) < 0.5) {
                    nextGrid[y][x] = { id: ASH, rotation: 0, onFire: true, data: 0 };
                }
                else {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
                burned = true;
            }
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextGrid[y1][x1] != null) {
                    return;
                }
                if (grid[y1][x1].id == AIR && getRandom(x, y) < (burned ? 0.5 : (20 - flammability) / 360)) {
                    nextGrid[y1][x1] = { id: SMOKE, rotation: 0, onFire: grid[y1][x1].onFire, data: 0 };
                    return;
                }
                var flammability = pixels[grid[y1][x1].id].flammability;
                if (grid[y1][x1].onFire == false && getRandom(x, y) < flammability / 40 + (y1 < y ? 0.4 : 0) + (burned ? 0.4 : 0)) {
                    nextGrid[y1][x1] = { id: grid[y1][x1].id, rotation: grid[y1][x1].rotation, onFire: true, data: grid[y1][x1].data };
                }
            });
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 0,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 0,
    },
    {
        name: "Smoke",
        description: "Smoke from a fire. Toxic!",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[SMOKE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getRandom(x, y) < 0.01) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextGrid[y1][x1] != null) {
                    return;
                }
                var flammability = pixels[grid[y1][x1].id].flammability;
                if (getRandom(x, y) < flammability / 20) {
                    nextGrid[y1][x1] = { id: grid[y1][x1].id, rotation: grid[y1][x1].rotation, onFire: true, data: grid[y1][x1].data };
                }
            });
            if (getRandom(x, y) < 0.5) {
                ascend(x, y, gridSize);
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 0,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 0,
    },
    {
        name: "Ash",
        description: "Burnt remains. Can sustain fire for a long time.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[ASH]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER)) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: HARDENED_ASH, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            flow(x, y, 2);
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 1,
        blastResistance: 2,
    },
    {
        name: "Hardened Ash",
        description: "A hard, sturdy material. Made from ash.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[HARDENED_ASH]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouchingHeated(x, y, 1, LAVA) && !isTouching(x, y, 1, WATER) && getRandom(x, y) < 0.1) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: ASH, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 15,
    },
    {
        name: "Steam",
        description: "Hot water steam. Can cause second degree burns.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[STEAM]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getRandom(x, y) < 0.01) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: WATER, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            var burned = false;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextGrid[y1][x1] != null) {
                    return;
                }
                var flammability = pixels[grid[y1][x1].id].flammability;
                if (getRandom(x, y) < flammability / 20) {
                    burned = true;
                    nextGrid[y1][x1] = { id: grid[y1][x1].id, rotation: grid[y1][x1].rotation, onFire: true, data: grid[y1][x1].data };
                }
            });
            if (burned) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: WATER, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            ascend(x, y, gridSize);
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 0,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 0,
    },
    {
        name: "Magma",
        description: "Molten rock. Without a heat source it will cool into rocks.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[MAGMA]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            var touchingHeated = getTouchingHeated(x, y, 1);
            if (touchingHeated <= 2 && getRandom(x, y) < (2 - touchingHeated) / 100) {
                if (nextGrid[y][x] == null) {
                    if (touchingHeated >= 2) {
                        nextGrid[y][x] = { id: BASALT, rotation: 0, onFire: false, data: 0 };
                    }
                    else {
                        nextGrid[y][x] = { id: STONE, rotation: 0, onFire: false, data: 0 };
                    }
                }
                return;
            }
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextGrid[y1][x1] != null) {
                    return;
                }
                if (grid[y1][x1].id == WATER && nextGrid[y][x] == null) {
                    if (y1 > y) {
                        if (getRandom(x, y) < 0.5) {
                            nextGrid[y1][x1] = { id: BASALT, rotation: 0, onFire: false, data: 0 };
                        }
                        else {
                            nextGrid[y1][x1] = { id: STONE, rotation: 0, onFire: false, data: 0 };
                        }
                        nextGrid[y][x] = { id: STEAM, rotation: 0, onFire: false, data: 0 };
                    }
                    else {
                        if (getRandom(x, y) < 0.5) {
                            nextGrid[y][x] = { id: BASALT, rotation: 0, onFire: false, data: 0 };
                        }
                        else {
                            nextGrid[y][x] = { id: STONE, rotation: 0, onFire: false, data: 0 };
                        }
                        nextGrid[y1][x1] = { id: STEAM, rotation: 0, onFire: false, data: 0 };
                    }
                }
                if (grid[y1][x1].id == AIR && getRandom(x, y) < 0.1) {
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
                if (pixels[grid[y1][x1].id].flammability > 0 && getRandom(x, y) < pixels[grid[y1][x1].id].flammability / 480) {
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
            });
            if (getRandom(x, y) < 0.125) {
                flow(x, y, gridSize);
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 1,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 7,
    },
    {
        name: "Stone",
        description: "A hard, gray, rock. Easy to melt with lava.",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[STONE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 2) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: MAGMA, rotation: 0, onFire: false, data: 0 };
                }
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 10,
    },
    {
        name: "Basalt",
        description: "Requires strong heating to melt. No, you have to pronounce it as BUH-salt.",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[BASALT]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 3) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: MAGMA, rotation: 0, onFire: false, data: 0 };
                }
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 15,
    },
    {
        name: "Obsidian",
        description: "A unbreakable rock resistant to explosions.",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[OBSIDIAN]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 4,
        pushable: false,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 20,
    },
    {
        name: "Snow",
        description: "White, fluffy, snow. Can melt into water.",
        type: "A Pixel World",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[SNOW];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 1) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: WATER, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            if (getTouching(x, y, 1, WATER) >= 2) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: WATER, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            forEachTouching(x, y, 1, ASH, function(x1, y1) {
                if (nextGrid[y1][x1] == null) {
                    nextGrid[y1][x1] = { id: SLUSH, rotation: 0, onFire: false, data: 0 };
                }
            });
            fall(x, y);
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 3,
    },
    {
        name: "Ice",
        description: "Slippery! Can melt into water.",
        type: "A Pixel World",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[ICE][1];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                    ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 2, 2, 2);
                    ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[ICE][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[ICE][1];
            ctx.fillRect(0, 4, 2, 2);
            ctx.fillRect(2, 2, 2, 2);
            ctx.fillRect(4, 0, 2, 2);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 1) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: WATER, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            if (getTouching(x, y, 1, WATER) >= 2) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: WATER, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            forEachTouching(x, y, 1, ASH, function(x1, y1) {
                if (nextGrid[y1][x1] == null) {
                    nextGrid[y1][x1] = { id: SLUSH, rotation: 0, onFire: false, data: 0 };
                }
            });
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 4,
    },
    {
        name: "Slush",
        description: "A mixture of snow and ash. Can melt into ash.",
        type: "A Pixel World",
        drawBackground: false,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[SLUSH]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 1) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: ASH, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            if (getTouching(x, y, 1, WATER) >= 2) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: ASH, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            forEachTouching(x, y, 1, ASH, function(x1, y1) {
                if (nextGrid[y1][x1] == null) {
                    nextGrid[y1][x1] = { id: SLUSH, rotation: 0, onFire: false, data: 0 };
                }
            });
            if (getRandom(x, y) < 0.5) {
                flow(x, y, 1);
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: true,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 2,
    },
    {
        name: "Spruce Wood",
        description: "A hard piece of spruce wood. The bark is frozen.",
        type: "A Pixel World",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[SPRUCE_WOOD][1];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    ctx.fillRect(j * 6, drawCalls[i].y * 6, 3, 6);
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[SPRUCE_WOOD][0];
            ctx.fillRect(3, 0, 3, 6);
            ctx.fillStyle = colors[SPRUCE_WOOD][1];
            ctx.fillRect(0, 0, 3, 6);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 10,
        blastResistance: 10,
    },
    {
        name: "Pusher",
        description: "Pushes pixels.",
        type: "Mechanical Movement",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[PUSHER][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 3, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 2) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 3, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 3) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[PUSHER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[PUSHER][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (pixel.rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            if (isLocationInGrid(x, y, (grid[y][x].rotation + 2) % 4, 1)) {
                var location = getLocation(x, y, (grid[y][x].rotation + 2) % 4, 1);
                var pixel = grid[location[1]][location[0]];
                if (pixel.id == PUSHER && pixel.rotation == grid[y][x].rotation) {
                    return;
                }
            }
            push(x, y, grid[y][x].rotation, gridSize);
        },
        updateStage: 2,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 6,
        blastResistance: 10,
    },
    {
        name: "Puller",
        description: "Pulls pixels.",
        type: "Mechanical Movement",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[PULLER][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 3, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 2) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 3, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 3) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[PULLER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[PULLER][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (pixel.rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            pull(x, y, grid[y][x].rotation, gridSize);
        },
        updateStage: 2,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 6,
        blastResistance: 10,
    },
    {
        name: "Penetrator",
        description: "Can penetrate obsidian.",
        type: "Mechanical Movement",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[PENETRATOR][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 3, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 2) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 3, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 3) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[PENETRATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[PENETRATOR][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (pixel.rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            if (!isLocationInGrid(x, y, grid[y][x].rotation, 1)) {
                return;
            }
            var location = getLocation(x, y, grid[y][x].rotation, 1);
            if (nextGrid[y][x] != null || nextGrid[location[1]][location[0]] != null) {
                return;
            }
            var pixel = grid[location[1]][location[0]];
            if (pixel.id == PENETRATOR && pixel.rotation == grid[y][x].rotation) {
                return;
            }
            if (pixel.id == DELETER) {
                nextGrid[y][x] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                return;
            }
            if (pixel.id == MONSTER) {
                nextGrid[y][x] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                nextGrid[location[1]][location[0]] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                return;
            }
            nextGrid[y][x] = pixel;
            nextGrid[location[1]][location[0]] = grid[y][x];
        },
        updateStage: 2,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 7,
        blastResistance: 9,
    },
    {
        name: "Copier",
        description: "Copies pixels.",
        type: "Mechanical Movement",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[COPIER][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 4, 1);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 5, drawCalls[i].y * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 1, 1, 4);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 2) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 5, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 4, 4, 1);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 3) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 1, 4);
                    }
                }
            }
            ctx.fillStyle = colors[COPIER][2];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                    }
                    else if (drawCalls[i].pixel.rotation == 2) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                    }
                    else if (drawCalls[i].pixel.rotation == 3) {
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[COPIER][0];
            ctx.fillRect(0, 0, 6, 6);
            if (pixel.rotation == 0) {
                ctx.fillStyle = colors[COPIER][1];
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 1);
                ctx.fillStyle = colors[COPIER][2];
                ctx.fillRect(2, 4, 2, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillStyle = colors[COPIER][1];
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(4, 1, 1, 4);
                ctx.fillStyle = colors[COPIER][2];
                ctx.fillRect(0, 2, 2, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillStyle = colors[COPIER][1];
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 4, 4, 1);
                ctx.fillStyle = colors[COPIER][2];
                ctx.fillRect(2, 0, 2, 2);
            }
            else if (pixel.rotation == 3) {
                ctx.fillStyle = colors[COPIER][1];
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 1, 4);
                ctx.fillStyle = colors[COPIER][2];
                ctx.fillRect(4, 2, 2, 2);
            }
        },
        update: function(x, y) {
            if (!isLocationInGrid(x, y, grid[y][x].rotation, 1) || !isLocationInGrid(x, y, (grid[y][x].rotation + 2) % 4, 1)) {
                return;
            }
            var frontLocation = getLocation(x, y, grid[y][x].rotation, 1);
            if (nextGrid[frontLocation[1]][frontLocation[0]] == null) {
                if (grid[frontLocation[1]][frontLocation[0]].id == AIR) {
                    var backLocation = getLocation(x, y, (grid[y][x].rotation + 2) % 4, 1);
                    var pixel = grid[backLocation[1]][backLocation[0]];
                    nextGrid[frontLocation[1]][frontLocation[0]] = { id: pixel.id, rotation: pixel.rotation, onFire: pixel.onFire, data: pixel.data };
                }
                else if (grid[frontLocation[1]][frontLocation[0]].id == MONSTER) {
                    nextGrid[frontLocation[1]][frontLocation[0]] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                }
            }
        },
        updateStage: 3,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 8,
        blastResistance: 14,
    },
    {
        name: "Cloner",
        description: "Clones pixels.",
        type: "Mechanical Movement",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[CLONER][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 4, 1);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 5, drawCalls[i].y * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 1, 1, 4);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 2) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 5, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 4, 4, 1);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 3) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 1, 4);
                    }
                }
            }
            ctx.fillStyle = colors[CLONER][2];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                    }
                    else if (drawCalls[i].pixel.rotation == 2) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                    }
                    else if (drawCalls[i].pixel.rotation == 3) {
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[CLONER][0];
            ctx.fillRect(0, 0, 6, 6);
            if (pixel.rotation == 0) {
                ctx.fillStyle = colors[CLONER][1];
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 1);
                ctx.fillStyle = colors[CLONER][2];
                ctx.fillRect(2, 4, 2, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillStyle = colors[CLONER][1];
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(4, 1, 1, 4);
                ctx.fillStyle = colors[CLONER][2];
                ctx.fillRect(0, 2, 2, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillStyle = colors[CLONER][1];
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 4, 4, 1);
                ctx.fillStyle = colors[CLONER][2];
                ctx.fillRect(2, 0, 2, 2);
            }
            else if (pixel.rotation == 3) {
                ctx.fillStyle = colors[CLONER][1];
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 1, 4);
                ctx.fillStyle = colors[CLONER][2];
                ctx.fillRect(4, 2, 2, 2);
            }
        },
        update: function(x, y) {
            if (!isLocationInGrid(x, y, grid[y][x].rotation, 1) || !isLocationInGrid(x, y, (grid[y][x].rotation + 2) % 4, 1)) {
                return;
            }
            var frontLocation = getLocation(x, y, grid[y][x].rotation, 1);
            var frontPixel = grid[frontLocation[1]][frontLocation[0]];
            if (frontPixel.id == CLONER && frontPixel.rotation == grid[y][x].rotation) {
                return;
            }
            var backLocation = getLocation(x, y, (grid[y][x].rotation + 2) % 4, 1);
            var pixel = grid[backLocation[1]][backLocation[0]];
            if (pixel.id == AIR) {
                return;
            }
            if (nextGrid[frontLocation[1]][frontLocation[0]] == null) {
                if (grid[frontLocation[1]][frontLocation[0]].id == DELETER) {
                    return;
                }
                if (grid[frontLocation[1]][frontLocation[0]].id == MONSTER) {
                    nextGrid[frontLocation[1]][frontLocation[0]] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                    return;
                }
                if (push(frontLocation[0], frontLocation[1], grid[y][x].rotation, gridSize)) {
                    nextGrid[frontLocation[1]][frontLocation[0]] = { id: pixel.id, rotation: pixel.rotation, onFire: pixel.onFire, data: pixel.data };
                }
            }
        },
        updateStage: 3,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 8,
        blastResistance: 12,
    },
    {
        name: "Fan",
        description: "Blows away pixels.",
        type: "Mechanical Movement",
        drawBackground: true,
        renderedCanvas: [],
        render: function(drawCalls, ctx) {
            /*
            if (Math.floor(animationTick / 8) % 8 == 0) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6, 2, 2);
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 4, 2, 2);
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
            }*/
            if (pixel.rotation == 0) {
                ctx.fillStyle = colors[AIR][0];
                ctx.fillRect(x * 6, y * 6, 6, 3);
                ctx.fillStyle = colors[FAN][0];
                ctx.fillRect(x * 6, y * 6 + 3, 6, 3);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(x * 6 + 2, y * 6 + 2, 2, 1);
            }
            else if (pixel.rotation == 1) {
                ctx.fillStyle = colors[AIR][0];
                ctx.fillRect(x * 6 + 3, y * 6, 3, 6);
                ctx.fillStyle = colors[FAN][0];
                ctx.fillRect(x * 6, y * 6, 3, 6);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(x * 6 + 3, y * 6 + 2, 1, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillStyle = colors[AIR][0];
                ctx.fillRect(x * 6, y * 6 + 3, 6, 3);
                ctx.fillStyle = colors[FAN][0];
                ctx.fillRect(x * 6, y * 6, 6, 3);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(x * 6 + 2, y * 6 + 3, 2, 1);
            }
            else if (pixel.rotation == 3) {
                ctx.fillStyle = colors[AIR][0];
                ctx.fillRect(x * 6, y * 6, 3, 6);
                ctx.fillStyle = colors[FAN][0];
                ctx.fillRect(x * 6 + 3, y * 6, 3, 6);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(x * 6 + 2, y * 6 + 2, 1, 2);
            }
            if (Math.floor(animationTick / 4) % 10 == 0 || Math.floor(animationTick / 4) % 10 == 4) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 2, y * 6, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 3, y * 6, 1, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6 + 2, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6 + 3, 2, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 3, y * 6 + 4, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 2, y * 6 + 4, 1, 2);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6, y * 6 + 3, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6, y * 6 + 2, 2, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 1 || Math.floor(animationTick / 4) % 10 == 3) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 1, y * 6, 1, 2);
                    ctx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6, 1, 2);
                    ctx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6 + 1, 2, 1);
                    ctx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6 + 4, 2, 1);
                    ctx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6 + 4, 1, 2);
                    ctx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 1, y * 6 + 4, 1, 2);
                    ctx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6, y * 6 + 4, 2, 1);
                    ctx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6, y * 6 + 1, 2, 1);
                    ctx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 2) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6, y * 6, 2, 2);
                    ctx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6, 2, 2);
                    ctx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6, 2, 2);
                    ctx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6 + 4, 2, 2);
                    ctx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6 + 4, 2, 2);
                    ctx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6, y * 6 + 4, 2, 2);
                    ctx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6, y * 6 + 4, 2, 2);
                    ctx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6, y * 6, 2, 2);
                    ctx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 5 || Math.floor(animationTick / 4) % 10 == 9) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 3, y * 6, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 2, y * 6, 1, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6 + 3, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6 + 2, 2, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 2, y * 6 + 4, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 3, y * 6 + 4, 1, 2);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6, y * 6 + 2, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6, y * 6 + 3, 2, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 6 || Math.floor(animationTick / 4) % 10 == 8) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6, 1, 2);
                    ctx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 1, y * 6, 1, 2);
                    ctx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6 + 4, 2, 1);
                    ctx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6 + 1, 2, 1);
                    ctx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 1, y * 6 + 4, 1, 2);
                    ctx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6 + 4, 1, 2);
                    ctx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6, y * 6 + 1, 2, 1);
                    ctx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6, y * 6 + 4, 2, 1);
                    ctx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 7) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6, 2, 2);
                    ctx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6, y * 6, 2, 2);
                    ctx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6 + 4, y * 6 + 4, 2, 2);
                    ctx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6, 2, 2);
                    ctx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6, y * 6 + 4, 2, 2);
                    ctx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6 + 4, y * 6 + 4, 2, 2);
                    ctx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(x * 6, y * 6, 2, 2);
                    ctx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(x * 6, y * 6 + 4, 2, 2);
                    ctx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            if (pixel.rotation == 0) {
                ctx.fillStyle = colors[AIR][0];
                ctx.fillRect(0, 0, 6, 3);
                ctx.fillStyle = colors[FAN][0];
                ctx.fillRect(0, 3, 6, 3);
                ctx.fillStyle = colors[FAN][1];
                ctx.fillRect(0, 0, 2, 2);
                ctx.fillRect(2, 1, 1, 1);
                ctx.fillStyle = colors[FAN][2];
                ctx.fillRect(4, 0, 2, 2);
                ctx.fillRect(3, 1, 1, 1);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 2, 2, 1);
            }
            else if (pixel.rotation == 1) {
                ctx.fillStyle = colors[AIR][0];
                ctx.fillRect(3, 0, 3, 6);
                ctx.fillStyle = colors[FAN][0];
                ctx.fillRect(0, 0, 3, 6);
                ctx.fillStyle = colors[FAN][1];
                ctx.fillRect(4, 0, 2, 2);
                ctx.fillRect(4, 2, 1, 1);
                ctx.fillStyle = colors[FAN][2];
                ctx.fillRect(4, 4, 2, 2);
                ctx.fillRect(4, 3, 1, 1);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(3, 2, 1, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillStyle = colors[AIR][0];
                ctx.fillRect(0, 3, 6, 3);
                ctx.fillStyle = colors[FAN][0];
                ctx.fillRect(0, 0, 6, 3);
                ctx.fillStyle = colors[FAN][1];
                ctx.fillRect(4, 4, 2, 2);
                ctx.fillRect(3, 4, 1, 1);
                ctx.fillStyle = colors[FAN][2];
                ctx.fillRect(0, 4, 2, 2);
                ctx.fillRect(2, 4, 1, 1);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 3, 2, 1);
            }
            else if (pixel.rotation == 3) {
                ctx.fillStyle = colors[AIR][0];
                ctx.fillRect(0, 0, 3, 6);
                ctx.fillStyle = colors[FAN][0];
                ctx.fillRect(3, 0, 3, 6);
                ctx.fillStyle = colors[FAN][1];
                ctx.fillRect(0, 4, 2, 2);
                ctx.fillRect(1, 3, 1, 1);
                ctx.fillStyle = colors[FAN][2];
                ctx.fillRect(0, 0, 2, 2);
                ctx.fillRect(1, 2, 1, 1);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 2, 1, 2);
            }
        },
        update: function(x, y) {
            if (!isLocationInGrid(x, y, grid[y][x].rotation, 1)) {
                return;
            }
            var frontLocation = getLocation(x, y, grid[y][x].rotation, 1);
            var frontPixel = grid[frontLocation[1]][frontLocation[0]];
            if (frontPixel.id == AIR) {
                return;
            }
            if (nextGrid[frontLocation[1]][frontLocation[0]] == null) {
                push(frontLocation[0], frontLocation[1], grid[y][x].rotation, gridSize);
            }
        },
        updateStage: 3,
        animationSpeed: 4,
        animationFrames: 6,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 4,
        blastResistance: 8,
    },
    {
        name: "Rotator",
        description: "Rotates pixels.",
        type: "Mechanical Movement",
        drawBackground: true,
        renderedCanvas: [],
        render: function(drawCalls, ctx) {
            if (Math.floor(animationTick / 8) % 8 == 0) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6, 2, 2);
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 4, 2, 2);
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 1) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6, 2, 2);
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 4, 2, 2);
                    }
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 2) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 3) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 4) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 4, 2, 2);
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6, 2, 2);
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 5) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 4, 2, 2);
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6, 2, 2);
                    }
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 6) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 7) {
                ctx.fillStyle = colors[ROTATOR][1];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][2];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][3];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 2, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
                ctx.fillStyle = colors[ROTATOR][4];
                for (var i in drawCalls) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6, 2, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            ctx.fillRect(j * 6, drawCalls[i].y * 6 + 4, 2, 2);
                        }
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[ROTATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[ROTATOR][1];
            ctx.fillRect(0, 0, 2, 2);
            ctx.fillStyle = colors[ROTATOR][2];
            if (pixel.rotation == 0) {
                ctx.fillRect(0, 2, 2, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(2, 0, 2, 2);
            }
            ctx.fillStyle = colors[ROTATOR][3];
            ctx.fillRect(4, 4, 2, 2);
            ctx.fillStyle = colors[ROTATOR][4];
            if (pixel.rotation == 0) {
                ctx.fillRect(4, 2, 2, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(2, 4, 2, 2);
            }
        },
        update: function(x, y) {
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextGrid[y1][x1] == null && pixels[grid[y1][x1].id].rotateable > 1 && grid[y1][x1].id != ROTATOR && grid[y1][x1].id != DIRECTIONAL_ROTATOR) {
                    nextGrid[y1][x1] = rotate(grid[y1][x1], grid[y][x].rotation == 0 ? 1 : 3);
                }
                else if (nextGrid[y1][x1] != null && pixels[nextGrid[y1][x1].id].rotateable > 1 && nextGrid[y1][x1].id != ROTATOR && nextGrid[y1][x1].id != DIRECTIONAL_ROTATOR) {
                    nextGrid[y1][x1] = rotate(nextGrid[y1][x1], grid[y][x].rotation == 0 ? 1 : 3);
                }
            });
        },
        updateStage: 1,
        animationSpeed: 8,
        animationFrames: 8,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 2,
        cloneable: true,
        flammability: 4,
        blastResistance: 8,
    },
    {
        name: "Directional Rotator",
        description: "Rotates pixels.",
        type: "Mechanical Movement",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[DIRECTIONAL_ROTATOR][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 3, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 2) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 3, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 3) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[DIRECTIONAL_ROTATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[DIRECTIONAL_ROTATOR][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (pixel.rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextGrid[y1][x1] == null && pixels[grid[y1][x1].id].rotateable > 1 && grid[y1][x1].id != ROTATOR && grid[y1][x1].id != DIRECTIONAL_ROTATOR) {
                    nextGrid[y1][x1] = rotate(grid[y1][x1], grid[y][x].rotation - grid[y1][x1].rotation + pixels[grid[y1][x1].id].rotateable);
                }
                else if (nextGrid[y1][x1] != null && pixels[nextGrid[y1][x1].id].rotateable > 1 && nextGrid[y1][x1].id != ROTATOR && nextGrid[y1][x1].id != DIRECTIONAL_ROTATOR) {
                    nextGrid[y1][x1] = rotate(nextGrid[y1][x1], grid[y][x].rotation - nextGrid[y1][x1].rotation + pixels[nextGrid[y1][x1].id].rotateable);
                }
            });
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 4,
        blastResistance: 8,
    },
    {
        name: "Deleter",
        description: "Deletes pixels.",
        type: "Mechanical Movement",
        drawBackground: true,
        renderedCanvas: [],
        render: function(drawCalls, ctx) {
            ctx.fillStyle = colors[DELETER][1];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 1, 1);
                    ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 1, 1, 1);
                    ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 4, 1, 1);
                    ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 4, 1, 1);
                    ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 2, 2, 2);
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[DELETER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[DELETER][1];
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(1, 4, 1, 1);
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillRect(2, 2, 2, 2);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 4,
        animationFrames: 30,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 20,
    },
    {
        name: "Slider",
        description: "Can only be pushed and pulled in certain directions.",
        type: "Mechanical Movement",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[SLIDER][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 6);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 6, 2);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[SLIDER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[SLIDER][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 6);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(0, 2, 6, 2);
            }
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 2,
        cloneable: true,
        flammability: 0,
        blastResistance: 18,
    },
    {
        name: "Collapsable",
        description: "A soft, collapsable box.",
        type: "Mechanical Movement",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[COLLAPSABLE][1];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 4, 4);
                }
            }
            ctx.fillStyle = colors[COLLAPSABLE][2];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    ctx.fillRect(j * 6 + 4, drawCalls[i].y * 6 + 1, 1, 1);
                    ctx.fillRect(j * 6 + 3, drawCalls[i].y * 6 + 2, 1, 1);
                    ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 3, 1, 1);
                    ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 4, 1, 1);
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[COLLAPSABLE][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[COLLAPSABLE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[COLLAPSABLE][2];
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(3, 2, 1, 1);
            ctx.fillRect(2, 3, 1, 1);
            ctx.fillRect(1, 4, 1, 1);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 18,
        blastResistance: 1,
    },
    {
        name: "1w Green Laser",
        description: "Fires a weak laser beam capable of destroying weak pixels and setting pixels on fire.",
        type: "Explosive Destruction",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[GREEN_LASER][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 3, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 2) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 3, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 3) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
            }
            offscreenLaserCtx.fillStyle = colors[GREEN_LASER][3];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.data > 0) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            offscreenLaserCtx.fillRect(j * 6 + 2, drawCalls[i].y * 6 - drawCalls[i].pixel.data * 6, 2, drawCalls[i].pixel.data * 6);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            offscreenLaserCtx.fillRect(j * 6 + 6, drawCalls[i].y * 6 + 2, drawCalls[i].pixel.data * 6, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 2) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            offscreenLaserCtx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 6, 2, drawCalls[i].pixel.data * 6);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 3) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            offscreenLaserCtx.fillRect(j * 6 - drawCalls[i].pixel.data * 6, drawCalls[i].y * 6 + 2, drawCalls[i].pixel.data * 6, 2);
                        }
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[GREEN_LASER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[GREEN_LASER][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (pixel.rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            var distance = laser(x, y, grid[y][x].rotation);
            if (grid[y][x].data != distance) {
                nextGrid[y][x] = { id: GREEN_LASER, rotation: grid[y][x].rotation, onFire: grid[y][x].onFire, data: distance };
            }
            if (isLocationInGrid(x, y, grid[y][x].rotation, distance + 1)) {
                var location = getLocation(x, y, grid[y][x].rotation, distance + 1);
                if (nextGrid[location[1]][location[0]] == null) {
                    var pixel = grid[location[1]][location[0]];
                    if (pixel.id == LASER_SCATTERER) {
                        return;
                    }
                    var onFire = pixel.onFire;
                    if (getRandom(x, y) < 0.2 - pixels[pixel.id].flammability / 100) {
                        onFire = true;
                    }
                    if (pixels[pixel.id].blastResistance <= 10 && getRandom(x, y) < 0.1 - pixels[pixel.id].blastResistance / 200) {
                        nextGrid[location[1]][location[0]] = { id: AIR, rotation: 0, onFire: onFire, data: 0 };
                    }
                    else if (onFire) {
                        nextGrid[location[1]][location[0]] = { id: pixel.id, rotation: pixel.rotation, onFire: true, data: pixel.data };
                    }
                }
            }
            var location = getLocation(x, y, grid[y][x].rotation, distance);
            redrawGrid[location[1]][location[0]][0] = true;
        },
        updateStage: 4,
        animationSpeed: 1,
        animationFrames: 60,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 19,
        blastResistance: 5,
    },
    {
        name: "5w Blue Laser",
        description: "Fires a powerful laser beam capable of mass destruction.",
        type: "Explosive Destruction",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[BLUE_LASER][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 3, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 2) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 3, 2, 3);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 3) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 3, 2);
                    }
                }
            }
            offscreenLaserCtx.fillStyle = colors[BLUE_LASER][3];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.data > 0) {
                    if (drawCalls[i].pixel.rotation == 0) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            offscreenLaserCtx.fillRect(j * 6 + 2, drawCalls[i].y * 6 - drawCalls[i].pixel.data * 6, 2, drawCalls[i].pixel.data * 6);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 1) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            offscreenLaserCtx.fillRect(j * 6 + 6, drawCalls[i].y * 6 + 2, drawCalls[i].pixel.data * 6, 2);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 2) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            offscreenLaserCtx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 6, 2, drawCalls[i].pixel.data * 6);
                        }
                    }
                    else if (drawCalls[i].pixel.rotation == 3) {
                        for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                            offscreenLaserCtx.fillRect(j * 6 - drawCalls[i].pixel.data * 6, drawCalls[i].y * 6 + 2, drawCalls[i].pixel.data * 6, 2);
                        }
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[BLUE_LASER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[BLUE_LASER][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (pixel.rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            var distance = laser(x, y, grid[y][x].rotation);
            if (grid[y][x].data != distance) {
                nextGrid[y][x] = { id: BLUE_LASER, rotation: grid[y][x].rotation, onFire: grid[y][x].onFire, data: distance };
            }
            if (isLocationInGrid(x, y, grid[y][x].rotation, distance + 1)) {
                var location = getLocation(x, y, grid[y][x].rotation, distance + 1);
                if (nextGrid[location[1]][location[0]] == null) {
                    var pixel = grid[location[1]][location[0]];
                    if (pixel.id == LASER_SCATTERER) {
                        return;
                    }
                    var onFire = pixel.onFire;
                    if (getRandom(x, y) < 1 - pixels[pixel.id].flammability / 20) {
                        onFire = true;
                    }
                    if (getRandom(x, y) < 0.2 - pixels[pixel.id].blastResistance / 100) {
                        if (getRandom(x, y) < 0.25) {
                            explode(location[0], location[1], 2, 1, 3);
                        }
                        nextGrid[location[1]][location[0]] = { id: AIR, rotation: 0, onFire: onFire, data: 0 };
                    }
                    else if (onFire) {
                        nextGrid[location[1]][location[0]] = { id: pixel.id, rotation: pixel.rotation, onFire: true, data: pixel.data };
                    }
                }
            }
            var location = getLocation(x, y, grid[y][x].rotation, distance);
            redrawGrid[location[1]][location[0]][0] = true;
        },
        updateStage: 4,
        animationSpeed: 1,
        animationFrames: 60,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 19,
        blastResistance: 5,
    },
    {
        name: "Laser Scatterer",
        description: "Scatters lasers that pass through them, making them useless.",
        type: "Explosive Destruction",
        drawBackground: true,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[LASER_SCATTERER][1];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6, 1, 6);
                    ctx.fillRect(j * 6 + 3, drawCalls[i].y * 6, 1, 6);
                    ctx.fillRect(j * 6 + 5, drawCalls[i].y * 6, 1, 6);
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[LASER_SCATTERER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[LASER_SCATTERER][1];
            ctx.fillRect(1, 0, 1, 6);
            ctx.fillRect(3, 0, 1, 6);
            ctx.fillRect(5, 0, 1, 6);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 16,
    },
    {
        name: "Allow Placement",
        description: "Allows placement and removal of pixels in levels.",
        type: "Level Construction",
        drawBackground: true,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[AIR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[ALLOW_PLACEMENT][1];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[AIR][0];
            ctx.fillRect(1, 1, 4, 4);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 0,
        pushable: false,
        rotateable: 1,
        cloneable: false,
        flammability: 0,
        blastResistance: 0,
    },
    {
        name: "Restrict Placement",
        description: "Restricts placement and removal of pixels in levels.",
        type: "Level Construction",
        drawBackground: true,
        renderedCanvas: [],
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[RESTRICT_PLACEMENT][0];
            ctx.fillRect(0, 0, 2, 1);
            ctx.fillRect(0, 1, 3, 1);
            ctx.fillRect(1, 2, 3, 1);
            ctx.fillRect(2, 3, 3, 1);
            ctx.fillRect(3, 4, 3, 1);
            ctx.fillRect(4, 5, 2, 1);
            ctx.fillRect(5, 0, 1, 1);
            ctx.fillRect(0, 5, 1, 1);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[AIR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[RESTRICT_PLACEMENT][1];
            ctx.fillRect(1, 1, 4, 4);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 0,
        pushable: false,
        rotateable: 1,
        cloneable: false,
        flammability: 0,
        blastResistance: 0,
    },
    {
        name: "Monster",
        description: "testing buh",
        type: "Level Construction",
        drawBackground: true,
        // renderedCanvas: [],
        // draw: function(drawCalls, ctx) {
        //     ctx.fillStyle = colors[MONSTER][1];
        //     for (var i in drawCalls) {
        //         for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
        //             ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6, 3, 6);
        //         }
        //     }
        // },
        drawDetail: function(x, y, pixel, ctx) {
            ctx.fillStyle = colors[MONSTER][1];
            ctx.fillRect(x * 6 + 1, y * 6 + 1, 1, 1);
            ctx.fillRect(x * 6 + 4, y * 6 + 1, 1, 1);
            ctx.fillRect(x * 6 + 2, y * 6 + 4, 2, 1);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[MONSTER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[MONSTER][1];
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(2, 4, 2, 1);
        },
        update: function(x, y) {
        },
        updateStage: 1,
        animationSpeed: 1,
        animationFrames: 1,
        dataFrames: 1,
        density: 0,
        pushable: true,
        rotateable: 1,
        cloneable: false,
        flammability: 20,
        blastResistance: 2,
        monster: true,
    },
];