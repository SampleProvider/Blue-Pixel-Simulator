var pixels = [
    {
        name: "Air",
        description: "It's air. What did you expect?",
        amountColor: "rgb(0, 0, 0)",
        type: "A Pixel World",
        drawBackground: 2,
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
        drawBackground: 2,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[DIRT];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER)) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: MUD, rotation: 0, onFire: grid[y][x].onFire, data: 0 };
                }
                return;
            }
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
        drawBackground: 2,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[GRASS];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER)) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: MUD, rotation: 0, onFire: grid[y][x].onFire, data: 0 };
                }
                return;
            }
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
        drawBackground: 2,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[SAND];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouchingHeated(x, y, 1) && getRandom(x, y) < 0.1) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: GLASS, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
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
        drawBackground: 0,
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
        drawBackground: 1,
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
        drawBackground: 2,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[LEAF];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (!isTouching(x, y, 1, OAK_WOOD) && !isTouching(x, y, 1, SPRUCE_WOOD) && getTouching(x, y, 1, LEAF) == 0) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: grid[y][x].onFire, data: 0 };
                }
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
        flammability: 20,
        blastResistance: 1,
    },
    {
        name: "Mud",
        description: "It's like dirt, but wet and slightly liquid.",
        type: "A Pixel World",
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[MUD]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (!isTouching(x, y, 1, WATER) && getRandom(x, y) < 0.1) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: DRIED_MUD, rotation: 0, onFire: grid[y][x].onFire, data: 0 };
                }
                return;
            }
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
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[DRIED_MUD]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER)) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: MUD, rotation: 0, onFire: grid[y][x].onFire, data: 0 };
                }
                return;
            }
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
        name: "Moss",
        description: "Grows on stone. It's, uhhh, not very realistic.",
        type: "A Pixel World",
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[MOSS]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouching(x, y, 2, MOSS) >= 7 && getRandom(x, y) < 0.25) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: WATER, rotation: 0, onFire: false, data: 0 };
                }
                return;
            }
            forAllTouching(x, y, 2, function(x1, y1) {
                if (nextGrid[y1][x1] != null) {
                    return;
                }
                var distance = Math.abs(x1 - x) + Math.abs(y1 - y);
                var pixel = grid[y1][x1];
                if (pixel.id == STONE && getRandom(x, y) < 1 / 30 / distance) {
                    nextGrid[y1][x1] = { id: MOSS, rotation: 0, onFire: false, data: 0 };
                }
                if (pixel.id == BASALT && getRandom(x, y) < 1 / 45 / distance) {
                    nextGrid[y1][x1] = { id: MOSS, rotation: 0, onFire: false, data: 0 };
                }
                if (pixel.id == ASH && getRandom(x, y) < 1 / 60 / distance) {
                    nextGrid[y1][x1] = { id: MOSS, rotation: 0, onFire: false, data: 0 };
                }
                if (pixel.id == HARDENED_ASH && getRandom(x, y) < 1 / 75 / distance) {
                    nextGrid[y1][x1] = { id: MOSS, rotation: 0, onFire: false, data: 0 };
                }
                if (pixel.id == SLUSH && getRandom(x, y) < 1 / 90 / distance) {
                    nextGrid[y1][x1] = { id: MOSS, rotation: 0, onFire: false, data: 0 };
                }
            });
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
        flammability: 13,
        blastResistance: 4,
    },
    {
        name: "Sponge",
        description: "Do you want an PlastiSponge™? Well today is your lucky day! If you don't want an PlastiSponge™ today is also your lucky day because we are now selling InstaSpongePlasti™ (SP™) 3000™ and InstaNotSpongePlasti™ (SP™) 3000™! Now sucks up to NaN™ pixels! Buy now for the cheap cheap price of $39,999™! Or buy later for $49,999™! Buy 12™ and get a Free™ ValuBundle™ consisting of 12 PlastiSnow™, 8 PlastiAbrasive™, and a 1% chance to get a Modified™ Modified™ InstaCar™ with a InstaSnowDepot™ and InstaAbrasiveSpreader™! The new BlizzardPack™ is out! Consisting of 64 PlastiSnow™, 24 PlastiAbrasive™, 8 PlastiCars™, 2 PlastiWalls™, a InstaSnowDepot™ and InstaAbrasiveSpreader™, as well as the old RareSnow™ Pack! In the RareSnow™ Pack, you have a 3% chance of getting DyeSnow™, a 0.6% chance of getting IredecenSnow™, and a 0.02% of getting the extremely rare GlowinSnow™! Tune into SampleProvider™ Today™ for more details.",
        amountColor: "rgb(0, 0, 0)",
        type: "A Pixel World",
        drawBackground: 2,
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
        name: "Glass",
        description: "A block of transparent glass. Strangely, it's very heat resistant. Lasers can pass through but not pixels.",
        type: "A Pixel World",
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[GLASS][1];
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillRect(1, 3, 1, 1);
            ctx.fillRect(2, 4, 1, 1);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[GLASS][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[GLASS][1];
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillRect(1, 3, 1, 1);
            ctx.fillRect(2, 4, 1, 1);
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
        flammability: 0,
        blastResistance: 7,
    },
    {
        name: "Reinforced Glass",
        description: "A border of obsidian surrounds this glass. Can not be destroyed by explosions. Lasers can pass through but not pixels.",
        type: "A Pixel World",
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[REINFORCED_GLASS][1];
            ctx.fillRect(2, 0, 2, 1);
            ctx.fillRect(2, 5, 2, 1);
            ctx.fillRect(0, 2, 1, 2);
            ctx.fillRect(5, 2, 1, 2);
            ctx.fillStyle = colors[REINFORCED_GLASS][2];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[REINFORCED_GLASS][3];
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillRect(1, 3, 1, 1);
            ctx.fillRect(2, 4, 1, 1);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[REINFORCED_GLASS][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[REINFORCED_GLASS][1];
            ctx.fillRect(2, 0, 2, 1);
            ctx.fillRect(2, 5, 2, 1);
            ctx.fillRect(0, 2, 1, 2);
            ctx.fillRect(5, 2, 1, 2);
            ctx.fillStyle = colors[REINFORCED_GLASS][2];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[REINFORCED_GLASS][3];
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillRect(1, 3, 1, 1);
            ctx.fillRect(2, 4, 1, 1);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: false,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 20,
    },
    {
        name: "Lava",
        description: "Extremely hot and melts rocks. Burns flammable pixels. Flows everywhere but slowly. Water can cool it into rocks. Can cause third degree burns.",
        type: "A Pixel World",
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = "rgb(255, 255, 25)";
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = "rgb(225, 25, 0, 0.5)";
            ctx.fillRect(0, 0, 6, 6);
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
        drawBackground: 0,
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
            if (isTouching(x, y, 1, WATER) && getRandom(x, y) < 0.25) {
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
        drawBackground: 0,
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
        drawBackground: 0,
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
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[HARDENED_ASH]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouchingHeated(x, y, 1) && !isTouching(x, y, 1, WATER) && getRandom(x, y) < 0.1) {
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
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[STEAM]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getRandom(x, y) < 0.01 || isTouching(x, y, 1, ICE)) {
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
        description: "Molten rock. Without a heat source it will cool down.",
        type: "A Pixel World",
        drawBackground: 0,
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
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[STONE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 2 && getRandom(x, y) < 0.1) {
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
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[BASALT]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 3 && getRandom(x, y) < 0.1) {
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
        drawBackground: 0,
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
        drawBackground: 2,
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
        drawBackground: 1,
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
            if (getTouching(x, y, 1, WATER) >= 2 && getRandom(x, y) < 0.1) {
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
        drawBackground: 0,
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
            if (getTouching(x, y, 1, WATER) >= 2 && getRandom(x, y) < 0.1) {
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
        drawBackground: 1,
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
        name: ["Pusher Up", "Pusher Right", "Pusher Down", "Pusher Left"],
        description: ["Pushes pixels upwards.", "Pushes pixels rightwards.", "Pushes pixels downwards.", "Pushes pixels leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
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
        name: ["Puller Up", "Puller Right", "Puller Down", "Puller Left"],
        description: ["Pulls pixels upwards.", "Pulls pixels rightwards.", "Pulls pixels downwards.", "Pulls pixels leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
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
        name: ["Penetrator Up", "Penetrator Right", "Penetrator Down", "Penetrator Left"],
        description: ["Can penetrate pixels upwards.", "Can penetrate pixels rightwards.", "Can penetrate pixels downwards.", "Can penetrate pixels leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
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
            if (!canMove(location[0], location[1], pixel, grid[y][x].rotation)) {
                if (pixel.id == DELETER) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                }
                if (pixel.id == MONSTER) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                    nextGrid[location[1]][location[0]] = { id: AIR, rotation: 0, onFire: false, data: 0 };
                }
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
        name: ["Copier Up", "Copier Right", "Copier Down", "Copier Left"],
        description: ["Copies pixels upwards.", "Copies pixels rightwards.", "Copies pixels downwards.", "Copies pixels leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
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
            var backLocation = getLocation(x, y, (grid[y][x].rotation + 2) % 4, 1);
            var pixel = grid[backLocation[1]][backLocation[0]];
            if (!pixels[pixel.id].cloneable) {
                return;
            }
            if (nextGrid[frontLocation[1]][frontLocation[0]] == null) {
                if (grid[frontLocation[1]][frontLocation[0]].id == AIR) {
                    if (Array.isArray(pixel.data)) {
                        var data = [];
                        for (var i in pixel.data) {
                            data.push(pixel.data[i]);
                        }
                        nextGrid[frontLocation[1]][frontLocation[0]] = { id: pixel.id, rotation: pixel.rotation, onFire: pixel.onFire, data: data };
                    }
                    else {
                        nextGrid[frontLocation[1]][frontLocation[0]] = { id: pixel.id, rotation: pixel.rotation, onFire: pixel.onFire, data: pixel.data };
                    }
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
        name: ["Cloner Up", "Cloner Right", "Cloner Down", "Cloner Left"],
        description: ["Clones pixels upwards.", "Clones pixels rightwards.", "Clones pixels downwards.", "Clones pixels leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
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
            if (!pixels[pixel.id].cloneable) {
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
                    if (Array.isArray(pixel.data)) {
                        var data = [];
                        for (var i in pixel.data) {
                            data.push(pixel.data[i]);
                        }
                        nextGrid[frontLocation[1]][frontLocation[0]] = { id: pixel.id, rotation: pixel.rotation, onFire: pixel.onFire, data: data };
                    }
                    else {
                        nextGrid[frontLocation[1]][frontLocation[0]] = { id: pixel.id, rotation: pixel.rotation, onFire: pixel.onFire, data: pixel.data };
                    }
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
        name: ["Fan Up", "Fan Right", "Fan Down", "Fan Left"],
        description: ["Blows away pixels upwards.", "Blows away pixels rightwards.", "Blows away pixels downwards.", "Blows away pixels leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
        render: function(pixel, ctx) {
            if (pixel.rotation == 0) {
                ctx.fillStyle = colors[AIR];
                ctx.fillRect(0, 0, 6, 3);
                // ctx.fillStyle = colors[FAN][0];
                // ctx.fillRect(0, 3, 6, 3);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 2, 2, 1);
            }
            else if (pixel.rotation == 1) {
                ctx.fillStyle = colors[AIR];
                ctx.fillRect(3, 0, 3, 6);
                // ctx.fillStyle = colors[FAN][0];
                // ctx.fillRect(0, 0, 3, 6);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(3, 2, 1, 2);
            }
            else if (pixel.rotation == 2) {
                ctx.fillStyle = colors[AIR];
                ctx.fillRect(0, 3, 6, 3);
                // ctx.fillStyle = colors[FAN][0];
                // ctx.fillRect(0, 0, 6, 3);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 3, 2, 1);
            }
            else if (pixel.rotation == 3) {
                ctx.fillStyle = colors[AIR];
                ctx.fillRect(0, 0, 3, 6);
                // ctx.fillStyle = colors[FAN][0];
                // ctx.fillRect(3, 0, 3, 6);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 2, 1, 2);
            }
            if (Math.floor(animationTick / 4) % 10 == 0 || Math.floor(animationTick / 4) % 10 == 4) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(2, 0, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(3, 0, 1, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 2, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 3, 2, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(3, 4, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(2, 4, 1, 2);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 3, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 2, 2, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 1 || Math.floor(animationTick / 4) % 10 == 3) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(1, 0, 1, 2);
                    ctx.fillRect(2, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 0, 1, 2);
                    ctx.fillRect(3, 1, 1, 1);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 1, 2, 1);
                    ctx.fillRect(4, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 2, 1);
                    ctx.fillRect(4, 3, 1, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 1, 2);
                    ctx.fillRect(3, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(1, 4, 1, 2);
                    ctx.fillRect(2, 4, 1, 1);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 4, 2, 1);
                    ctx.fillRect(1, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 1, 2, 1);
                    ctx.fillRect(1, 2, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 2) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(2, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(3, 1, 1, 1);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(4, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(4, 3, 1, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(3, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(2, 4, 1, 1);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(1, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(1, 2, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 5 || Math.floor(animationTick / 4) % 10 == 9) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(3, 0, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(2, 0, 1, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 3, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 2, 2, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(2, 4, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(3, 4, 1, 2);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 2, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 3, 2, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 6 || Math.floor(animationTick / 4) % 10 == 8) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 0, 1, 2);
                    ctx.fillRect(3, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(1, 0, 1, 2);
                    ctx.fillRect(2, 1, 1, 1);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 2, 1);
                    ctx.fillRect(4, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 1, 2, 1);
                    ctx.fillRect(4, 2, 1, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(1, 4, 1, 2);
                    ctx.fillRect(2, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 1, 2);
                    ctx.fillRect(3, 4, 1, 1);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 1, 2, 1);
                    ctx.fillRect(1, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 4, 2, 1);
                    ctx.fillRect(1, 3, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 7) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(3, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(2, 1, 1, 1);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(4, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(4, 2, 1, 1);
                }
                else if (pixel.rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(2, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(3, 4, 1, 1);
                }
                else if (pixel.rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(1, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(1, 3, 1, 1);
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            if (pixel.rotation == 0) {
                ctx.fillStyle = colors[AIR];
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
                ctx.fillStyle = colors[AIR];
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
                ctx.fillStyle = colors[AIR];
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
                ctx.fillStyle = colors[AIR];
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
            if (frontPixel.id == AIR || !canMove(frontLocation[0], frontLocation[1], frontPixel, grid[y][x].rotation)) {
                return;
            }
            if (nextGrid[frontLocation[1]][frontLocation[0]] == null) {
                push(frontLocation[0], frontLocation[1], grid[y][x].rotation, gridSize);
            }
        },
        updateStage: 3,
        animationSpeed: 4,
        animationFrames: 10,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 4,
        blastResistance: 8,
    },
    {
        name: ["Rotator Clockwise", "Rotator Counterclockwise"],
        description: ["Rotates pixels clockwise.", "Rotates pixels counterclockwise."],
        type: "Mechanical Movement",
        drawBackground: 1,
        render: function(pixel, ctx) {
            if (Math.floor(animationTick / 8) % 8 == 0) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 2, 2, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(2, 4, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 1) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 4, 2, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 4, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 2) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(2, 4, 2, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 2, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 3) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 4, 2, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 0, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 4) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 2, 2, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(2, 0, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 5) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 0, 2, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 0, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 6) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(2, 0, 2, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 2, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 7) {
                if (pixel.rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 0, 2, 2);
                }
                else if (pixel.rotation == 1) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 4, 2, 2);
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
        name: ["Directional Rotator Up", "Directional Rotator Right", "Directional Rotator Down", "Directional Rotator Left"],
        description: ["Rotates pixels to face upwards.", "Rotates pixels to face rightwards.", "Rotates pixels to face downwards.", "Rotates pixels to face leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
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
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[DELETER][1];
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(1, 4, 1, 1);
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillRect(2, 2, 2, 2);
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
        density: -1,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 20,
    },
    {
        name: ["Horizontal Slider Up", "Vertical Slider Right"],
        description: ["Can only be pushed and pulled horizontally.", "Can only be pushed and pulled vertically."],
        type: "Mechanical Movement",
        drawBackground: 1,
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
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[COLLAPSABLE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[COLLAPSABLE][2];
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(3, 2, 1, 1);
            ctx.fillRect(2, 3, 1, 1);
            ctx.fillRect(1, 4, 1, 1);
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
        flammability: 18,
        blastResistance: 1,
    },
    {
        name: "Gunpowder",
        description: "A low explosive that spreads a lot of fire. Careful while handling.",
        amountColor: "rgb(0, 0, 0)",
        type: "Explosive Destruction",
        drawBackground: 1,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colorToRGB(colors[GUNPOWDER]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouchingHeated(x, y, 1)) {
                explode(x, y, 4, 10, 20);
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
                return;
            }
            flow(x, y, 1);
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
        name: "Dynamite",
        description: "A high explosive. Careful while handling.",
        amountColor: "rgb(0, 0, 0)",
        type: "Explosive Destruction",
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[DYNAMITE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[DYNAMITE][2];
            ctx.fillRect(2, 0, 2, 1);
            ctx.fillRect(0, 2, 1, 2);
            ctx.fillRect(2, 5, 2, 1);
            ctx.fillRect(5, 2, 1, 2);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[DYNAMITE][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[DYNAMITE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[DYNAMITE][2];
            ctx.fillRect(2, 0, 2, 1);
            ctx.fillRect(0, 2, 1, 2);
            ctx.fillRect(2, 5, 2, 1);
            ctx.fillRect(5, 2, 1, 2);
        },
        update: function(x, y) {
            if (isTouchingHeated(x, y, 1)) {
                explode(x, y, 5, 20, 5);
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
                return;
            }
            fall(x, y);
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: false,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 15,
        blastResistance: 3,
    },
    {
        name: ["Ignitor Up", "Ignitor Right", "Ignitor Down", "Ignitor Left"],
        description: ["Lights pixels on fire upwards.", "Lights pixels on fire rightwards.", "Lights pixels on fire downwards.", "Lights pixels on fire leftwards."],
        amountColor: "rgb(0, 0, 0)",
        type: "Explosive Destruction",
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[IGNITOR][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[IGNITOR][2];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(3, 1, 2, 4);
            }
            else if (pixel.rotation == 2) {
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 3, 4, 2);
            }
            else if (pixel.rotation == 3) {
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 2, 4);
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[IGNITOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[IGNITOR][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[IGNITOR][2];
            if (pixel.rotation == 0) {
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(3, 1, 2, 4);
            }
            else if (pixel.rotation == 2) {
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 3, 4, 2);
            }
            else if (pixel.rotation == 3) {
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 2, 4);
            }
        },
        update: function(x, y) {
            if (isLocationInGrid(x, y, grid[y][x].rotation, 1)) {
                var location = getLocation(x, y, grid[y][x].rotation, 1);
                if (nextGrid[location[1]][location[0]] == null && grid[location[1]][location[0]].onFire == false) {
                    nextGrid[location[1]][location[0]] = { id: grid[location[1]][location[0]].id, rotation: grid[location[1]][location[0]].rotation, onFire: true, data: grid[location[1]][location[0]].data };
                }
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: false,
        density: 3,
        pushable: true,
        rotateable: 4,
        cloneable: true,
        flammability: 0,
        blastResistance: 6,
    },
    {
        name: "Laser Explosive",
        description: "Explodes when hit by a laser beam.",
        amountColor: "rgb(0, 0, 0)",
        type: "Explosive Destruction",
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[LASER_EXPLOSIVE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[LASER_EXPLOSIVE][2];
            ctx.fillRect(2, 0, 2, 1);
            ctx.fillRect(0, 2, 1, 2);
            ctx.fillRect(2, 5, 2, 1);
            ctx.fillRect(5, 2, 1, 2);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[LASER_EXPLOSIVE][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[LASER_EXPLOSIVE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[LASER_EXPLOSIVE][2];
            ctx.fillRect(2, 0, 2, 1);
            ctx.fillRect(0, 2, 1, 2);
            ctx.fillRect(2, 5, 2, 1);
            ctx.fillRect(5, 2, 1, 2);
            // ctx.fillStyle = colors[AIR];
            // ctx.fillRect(0, 0, 6, 6);
            // ctx.fillStyle = colors[LASER_EXPLOSIVE][0];
            // ctx.fillRect(1, 0, 1, 6);
            // ctx.fillRect(4, 0, 1, 6);
            // ctx.fillRect(0, 1, 6, 1);
            // ctx.fillRect(0, 4, 6, 1);
            // ctx.fillStyle = colors[LASER_EXPLOSIVE][1];
            // ctx.fillRect(1, 1, 4, 4);
            // ctx.fillStyle = colors[LASER_EXPLOSIVE][2];
            // ctx.fillRect(2, 2, 2, 2);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        drawNoise: false,
        density: 2,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 16,
    },
    {
        name: ["1w Green Laser Up", "1w Green Laser Right", "1w Green Laser Down", "1w Green Laser Left"],
        description: "Fires a weak laser beam capable of destroying weak pixels and setting pixels on fire. Explodes when lit on fire.",
        type: "Explosive Destruction",
        drawBackground: 1,
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
            offscreenAboveCtx.fillStyle = colors[GREEN_LASER][3];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.data != 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        var x = j;
                        var y = drawCalls[i].y;
                        var direction = drawCalls[i].pixel.rotation;
                        for (var k = 0; k < drawCalls[i].pixel.data.length; k++) {
                            if (k != 0) {
                                direction = (direction + ((drawCalls[i].pixel.data[k] % 2 == 0) ? 1 : 3)) % 4;
                            }
                            var length = Math.floor(drawCalls[i].pixel.data[k] / 2);
                            if (direction == 0) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 4);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 5);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6 + 1);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6);
                                    }
                                }
                                y -= length;
                            }
                            else if (direction == 1) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 3, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 2, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6, 2);
                                    }
                                }
                                x += length;
                            }
                            else if (direction == 2) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 - 4);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6 - 5);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 + 1);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6);
                                    }
                                }
                                y += length;
                            }
                            else if (direction == 3) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 2, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 3, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6, 2);
                                    }
                                }
                                x -= length;
                            }
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
            if (grid[y][x].onFire) {
                explode(x, y, 2, 10, 10);
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
                return;
            }
            var onFire = grid[y][x].onFire;
            var path = laser(x, y, grid[y][x].rotation, function(x1, y1, direction) {
                if (nextGrid[y1][x1] != null) {
                    return false;
                }
                var pixel = grid[y1][x1];
                if (pixel.id == LASER_SCATTERER) {
                    return false;
                }
                if (pixel.id == LASER_TUNNEL) {
                    if (pixel.rotation == (direction + 1) % 2) {
                        return true;
                    }
                    return false;
                }
                if (pixel.id == LASER_EXPLOSIVE) {
                    explode(x1, y1, 5, 20, 20);
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                    return true;
                }
                if (pixel.id == GLASS || pixel.id == REINFORCED_GLASS) {
                    return true;
                }
                var onFire = pixel.onFire;
                if (getRandom(x, y) < pixels[pixel.id].flammability / 100) {
                    onFire = true;
                }
                if (pixels[pixel.id].blastResistance <= 10 && getRandom(x, y) < 0.1 - pixels[pixel.id].blastResistance / 200) {
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: onFire, data: 0 };
                    return true;
                }
                else if (onFire) {
                    if (x1 == x && y1 == y) {
                        onFire = true;
                    }
                    else {
                        nextGrid[y1][x1] = { id: pixel.id, rotation: pixel.rotation, onFire: true, data: pixel.data };
                    }
                }
                return false;
            });
            if (nextGrid[y][x] == null) {
                var redraw = false;
                if (grid[y][x].data == 0) {
                    redraw = true;
                }
                else if (grid[y][x].data.length != path) {
                    redraw = true;
                }
                else {
                    for (var i = 0; i < path.length; i++) {
                        if (grid[y][x].data[i] != path[i]) {
                            redraw = true;
                            break;
                        }
                    }
                }
                if (redraw) {
                    nextGrid[y][x] = { id: GREEN_LASER, rotation: grid[y][x].rotation, onFire: onFire, data: path };
                }
            }
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
        name: ["5w Blue Laser Up", "5w Blue Laser Right", "5w Blue Laser Down", "5w Blue Laser Left"],
        description: "Fires a powerful laser beam capable of mass destruction. Explodes when lit on fire.",
        type: "Explosive Destruction",
        drawBackground: 1,
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
            offscreenAboveCtx.fillStyle = colors[BLUE_LASER][3];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.data != 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        var x = j;
                        var y = drawCalls[i].y;
                        var direction = drawCalls[i].pixel.rotation;
                        for (var k = 0; k < drawCalls[i].pixel.data.length; k++) {
                            if (k != 0) {
                                direction = (direction + ((drawCalls[i].pixel.data[k] % 2 == 0) ? 1 : 3)) % 4;
                            }
                            var length = Math.floor(drawCalls[i].pixel.data[k] / 2);
                            if (direction == 0) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 4);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 5);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6 + 1);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6);
                                    }
                                }
                                y -= length;
                            }
                            else if (direction == 1) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 3, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 2, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6, 2);
                                    }
                                }
                                x += length;
                            }
                            else if (direction == 2) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 - 4);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6 - 5);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 + 1);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6);
                                    }
                                }
                                y += length;
                            }
                            else if (direction == 3) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 2, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 3, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6, 2);
                                    }
                                }
                                x -= length;
                            }
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
            if (grid[y][x].onFire) {
                explode(x, y, 3, 20, 20);
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
                return;
            }
            var onFire = grid[y][x].onFire;
            var path = laser(x, y, grid[y][x].rotation, function(x1, y1, direction) {
                if (nextGrid[y1][x1] != null) {
                    return false;
                }
                var pixel = grid[y1][x1];
                if (pixel.id == LASER_SCATTERER) {
                    return false;
                }
                if (pixel.id == LASER_TUNNEL) {
                    if (pixel.rotation == (direction + 1) % 2) {
                        return true;
                    }
                    return false;
                }
                if (pixel.id == LASER_EXPLOSIVE) {
                    explode(x1, y1, 5, 20, 20);
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                    return true;
                }
                if (pixel.id == GLASS || pixel.id == REINFORCED_GLASS) {
                    return true;
                }
                var onFire = pixel.onFire;
                if (getRandom(x, y) < pixels[pixel.id].flammability / 20) {
                    onFire = true;
                }
                if (getRandom(x, y) < 0.2 - pixels[pixel.id].blastResistance / 100) {
                    if (getRandom(x, y) < 0.25) {
                        explode(x1, y1, 2, 20, 5);
                    }
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: onFire, data: 0 };
                    return true;
                }
                else if (onFire) {
                    if (x1 == x && y1 == y) {
                        onFire = true;
                    }
                    else {
                        nextGrid[y1][x1] = { id: pixel.id, rotation: pixel.rotation, onFire: true, data: pixel.data };
                    }
                }
                return false;
            });
            if (nextGrid[y][x] == null) {
                var redraw = false;
                if (grid[y][x].data == 0) {
                    redraw = true;
                }
                else if (grid[y][x].data.length != path) {
                    redraw = true;
                }
                else {
                    for (var i = 0; i < path.length; i++) {
                        if (grid[y][x].data[i] != path[i]) {
                            redraw = true;
                            break;
                        }
                    }
                }
                if (redraw) {
                    nextGrid[y][x] = { id: BLUE_LASER, rotation: grid[y][x].rotation, onFire: onFire, data: path };
                }
            }
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
        // name: "10Pw Red Laser",
        // description: "This is a great idea... Explodes when lit on fire.",
        name: ["Scanning Red Laser Up", "Scanning Red Laser Right", "Scanning Red Laser Down", "Scanning Red Laser Left"],
        description: "Scans for the pixel behind it and removes it. Can scan through pixels. Explodes when lit on fire.",
        type: "Explosive Destruction",
        drawBackground: 1,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[RED_LASER][1];
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
            offscreenAboveCtx.fillStyle = colors[RED_LASER][3];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.data != 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        var x = j;
                        var y = drawCalls[i].y;
                        var direction = drawCalls[i].pixel.rotation;
                        for (var k = 0; k < drawCalls[i].pixel.data.length; k++) {
                            if (k != 0) {
                                direction = (direction + ((drawCalls[i].pixel.data[k] % 2 == 0) ? 1 : 3)) % 4;
                            }
                            var length = Math.floor(drawCalls[i].pixel.data[k] / 2);
                            if (direction == 0) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 4);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 5);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6 + 1);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6);
                                    }
                                }
                                y -= length;
                            }
                            else if (direction == 1) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 3, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 2, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6, 2);
                                    }
                                }
                                x += length;
                            }
                            else if (direction == 2) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 - 4);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6 - 5);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 + 1);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6);
                                    }
                                }
                                y += length;
                            }
                            else if (direction == 3) {
                                if (k != drawCalls[i].pixel.data.length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCalls[i].pixel.data[k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 2, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 3, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCalls[i].pixel.data[k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6, 2);
                                    }
                                }
                                x -= length;
                            }
                        }
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[RED_LASER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[RED_LASER][1];
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
            if (grid[y][x].onFire) {
                explode(x, y, 3, 20, 20);
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                }
                return;
            }
            if (!isLocationInGrid(x, y, (grid[y][x].rotation + 2) % 4, 1)) {
                if (nextGrid[y][x] == null) {
                    var redraw = false;
                    if (grid[y][x].data == 0) {
                        redraw = true;
                    }
                    else if (grid[y][x].data.length != 0) {
                        redraw = true;
                    }
                    if (redraw) {
                        nextGrid[y][x] = { id: RED_LASER, rotation: grid[y][x].rotation, onFire: grid[y][x].onFire, data: [] };
                    }
                }
                return;
            }
            var backLocation = getLocation(x, y, (grid[y][x].rotation + 2) % 4, 1);
            var backPixel = grid[backLocation[1]][backLocation[0]];
            var path = laser(x, y, grid[y][x].rotation, function(x1, y1, direction) {
                if (nextGrid[y1][x1] != null) {
                    return false;
                }
                var pixel = grid[y1][x1];
                if (pixel.id == LASER_SCATTERER) {
                    return false;
                }
                if (pixel.id == LASER_TUNNEL) {
                    if (pixel.rotation == (direction + 1) % 2) {
                        return true;
                    }
                    return false;
                }
                if (pixel.id == LASER_EXPLOSIVE) {
                    explode(x1, y1, 5, 20, 20);
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                    return true;
                }
                if (pixel.id == GLASS || pixel.id == REINFORCED_GLASS) {
                    return true;
                }
                if (pixels[pixel.id].pushable == false || pixel.id == DELETER || (pixel.id == GOAL && levelGrid[y1][x1][1] == 1)) {
                    return false;
                }
                if (backPixel.id == AIR) {
                    return false;
                }
                if (pixel.id == backPixel.id && pixel.rotation == backPixel.rotation) {
                    nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
                    return true;
                }
                return true;
            });
            if (nextGrid[y][x] == null) {
                var redraw = false;
                if (grid[y][x].data == 0) {
                    redraw = true;
                }
                else if (grid[y][x].data.length != path) {
                    redraw = true;
                }
                else {
                    for (var i = 0; i < path.length; i++) {
                        if (grid[y][x].data[i] != path[i]) {
                            redraw = true;
                            break;
                        }
                    }
                }
                if (redraw) {
                    nextGrid[y][x] = { id: RED_LASER, rotation: grid[y][x].rotation, onFire: grid[y][x].onFire, data: path };
                }
            }
        },
        // update: function(x, y) {
        //     if (grid[y][x].onFire) {
        //         explode(x, y, 3, 20, 20);
        //         if (nextGrid[y][x] == null) {
        //             nextGrid[y][x] = { id: AIR, rotation: 0, onFire: true, data: 0 };
        //         }
        //         return;
        //     }
        //     var onFire = grid[y][x].onFire;
        //     var path = laser(x, y, grid[y][x].rotation, function(x1, y1, direction) {
        //         if (nextGrid[y1][x1] != null) {
        //             return;
        //         }
        //         var pixel = grid[y1][x1];
        //         if (pixel.id == LASER_SCATTERER) {
        //             return false;
        //         }
        //         if (pixel.id == LASER_TUNNEL) {
        //             if (pixel.rotation == (direction + 1) % 2) {
        //                 return true;
        //             }
        //             return false;
        //         }
        //         if (pixel.id == LASER_EXPLOSIVE) {
        //             explode(x1, y1, 5, 20, 20);
        //             nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: true, data: 0 };
        //             return true;
        //         }
        //         if (pixel.id == GLASS || pixel.id == REINFORCED_GLASS) {
        //             return true;
        //         }
        //         var onFire = pixel.onFire;
        //         if (getRandom(x, y) < pixels[pixel.id].flammability / 10) {
        //             onFire = true;
        //         }
        //         if (getRandom(x, y) < 1 - pixels[pixel.id].blastResistance / 20) {
        //             explode(x1, y1, 20, 20, 20);
        //             nextGrid[y1][x1] = { id: AIR, rotation: 0, onFire: onFire, data: 0 };
        //             return true;
        //         }
        //         else if (onFire) {
        //             if (x1 == x && y1 == y) {
        //                 onFire = true;
        //             }
        //             else {
        //                 nextGrid[y1][x1] = { id: pixel.id, rotation: pixel.rotation, onFire: true, data: pixel.data };
        //             }
        //         }
        //         return false;
        //     });
        //     if (nextGrid[y][x] == null) {
        //         var redraw = false;
        //         if (grid[y][x].data == 0) {
        //             redraw = true;
        //         }
        //         else if (grid[y][x].data.length != path) {
        //             redraw = true;
        //         }
        //         else {
        //             for (var i = 0; i < path.length; i++) {
        //                 if (grid[y][x].data[i] != path[i]) {
        //                     redraw = true;
        //                     break;
        //                 }
        //             }
        //         }
        //         if (redraw) {
        //             nextGrid[y][x] = { id: RED_LASER, rotation: grid[y][x].rotation, onFire: onFire, data: path };
        //         }
        //     }
        // },
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
        name: "Mirror",
        description: "Reflects lasers.",
        type: "Explosive Destruction",
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[MIRROR][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(0, 0, 2, 2);
                ctx.fillRect(1, 1, 2, 2);
                ctx.fillRect(2, 2, 2, 2);
                ctx.fillRect(3, 3, 2, 2);
                ctx.fillRect(4, 4, 2, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(0, 4, 2, 2);
                ctx.fillRect(1, 3, 2, 2);
                ctx.fillRect(2, 2, 2, 2);
                ctx.fillRect(3, 1, 2, 2);
                ctx.fillRect(4, 0, 2, 2);
            }
            ctx.fillStyle = colors[MIRROR][2];
            ctx.fillRect(0, 0, 1, 1);
            ctx.fillRect(5, 0, 1, 1);
            ctx.fillRect(0, 5, 1, 1);
            ctx.fillRect(5, 5, 1, 1);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[MIRROR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[MIRROR][1];
            if (pixel.rotation == 0) {
                ctx.fillRect(0, 0, 2, 2);
                ctx.fillRect(1, 1, 2, 2);
                ctx.fillRect(2, 2, 2, 2);
                ctx.fillRect(3, 3, 2, 2);
                ctx.fillRect(4, 4, 2, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillRect(0, 4, 2, 2);
                ctx.fillRect(1, 3, 2, 2);
                ctx.fillRect(2, 2, 2, 2);
                ctx.fillRect(3, 1, 2, 2);
                ctx.fillRect(4, 0, 2, 2);
            }
            ctx.fillStyle = colors[MIRROR][2];
            ctx.fillRect(0, 0, 1, 1);
            ctx.fillRect(5, 0, 1, 1);
            ctx.fillRect(0, 5, 1, 1);
            ctx.fillRect(5, 5, 1, 1);
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
        blastResistance: 16,
    },
    {
        name: "Laser Scatterer",
        description: "Scatters lasers that pass through them, making them useless.",
        type: "Explosive Destruction",
        drawBackground: 1,
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
        name: "1-Way Laser Tunnel",
        description: "Scatters lasers that pass through them in one direction and allows lasers through the other direction.",
        type: "Explosive Destruction",
        drawBackground: 1,
        draw: function(drawCalls, ctx) {
            ctx.fillStyle = colors[LASER_TUNNEL][1];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 1, 6, 1);
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 5, 6, 1);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6, 1, 6);
                        ctx.fillRect(j * 6 + 5, drawCalls[i].y * 6, 1, 6);
                    }
                }
            }
            ctx.fillStyle = colors[LASER_TUNNEL][2];
            for (var i in drawCalls) {
                if (drawCalls[i].pixel.rotation == 0) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6, drawCalls[i].y * 6 + 2, 6, 2);
                    }
                }
                else if (drawCalls[i].pixel.rotation == 1) {
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6, 2, 6);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[LASER_TUNNEL][0];
            ctx.fillRect(0, 0, 6, 6);
            if (pixel.rotation == 0) {
                ctx.fillStyle = colors[LASER_TUNNEL][1];
                ctx.fillRect(0, 1, 6, 1);
                ctx.fillRect(0, 5, 6, 1);
                ctx.fillStyle = colors[LASER_TUNNEL][2];
                ctx.fillRect(0, 2, 6, 2);
            }
            else if (pixel.rotation == 1) {
                ctx.fillStyle = colors[LASER_TUNNEL][1];
                ctx.fillRect(1, 0, 1, 6);
                ctx.fillRect(5, 0, 1, 6);
                ctx.fillStyle = colors[LASER_TUNNEL][2];
                ctx.fillRect(2, 0, 2, 6);
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
        blastResistance: 16,
    },
    {
        name: "",
        description: "Makes sounds when touched.",
        type: "Musical Notes",
        drawBackground: 1,
        draw: function(drawCalls, ctx) {
            for (var i in drawCalls) {
                if (Array.isArray(drawCalls[i].pixel.data)) {
                    ctx.fillStyle = colors[OSCILLATOR][Math.floor(drawCalls[i].pixel.data[0] / 37) * 2 + ((drawCalls[i].pixel.data[1] == 1) ? 4 : 3)];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 3, 4, 2);
                    }
                }
                else {
                    ctx.fillStyle = colors[OSCILLATOR][Math.floor(drawCalls[i].pixel.data / 37) * 2 + 3];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 3, 4, 2);
                    }
                }
            }
            ctx.fillStyle = colors[OSCILLATOR][2];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 2, 2, 1);
                }
            }
            for (var i in drawCalls) {
                if (Array.isArray(drawCalls[i].pixel.data)) {
                    ctx.fillStyle = colors[OSCILLATOR][drawCalls[i].pixel.data[0] % 37 + 13];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 4, 1);
                    }
                }
                else {
                    ctx.fillStyle = colors[OSCILLATOR][drawCalls[i].pixel.data % 37 + 13];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 4, 1);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[OSCILLATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[OSCILLATOR][Math.floor(pixel.data / 37) * 2 + 4];
            ctx.fillRect(1, 3, 4, 2);
            ctx.fillStyle = colors[OSCILLATOR][2];
            ctx.fillRect(2, 2, 2, 1);
            ctx.fillStyle = colors[OSCILLATOR][pixel.data % 37 + 13];
            ctx.fillRect(1, 1, 4, 1);
        },
        update: function(x, y) {
            var touching = false;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (grid[y1][x1].id != AIR && grid[y1][x1].id != OSCILLATOR && grid[y1][x1].id != OSCILLATOR_TUNER && grid[y1][x1].id != DRUM) {
                    touching = true;
                }
            });
            if (touching) {
                if (Array.isArray(grid[y][x].data)) {
                    if (grid[y][x].data[1] == 0) {
                        effects.oscillator.play(Math.floor(grid[y][x].data[0] / 37), grid[y][x].data[0] % 37);
                    }
                }
                else {
                    effects.oscillator.play(Math.floor(grid[y][x].data / 37), grid[y][x].data % 37);
                }
            }
            if (nextGrid[y][x] == null) {
                if (!Array.isArray(grid[y][x].data)) {
                    nextGrid[y][x] = { id: OSCILLATOR, rotation: 0, onFire: grid[y][x].onFire, data: [grid[y][x].data, touching ? 1 : 0] };
                }
                else if (grid[y][x].data[1] != touching ? 1 : 0) {
                    nextGrid[y][x] = { id: OSCILLATOR, rotation: 0, onFire: grid[y][x].onFire, data: [grid[y][x].data[0], touching ? 1 : 0] };
                }
            }
        },
        updateStage: 4,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 222,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 5,
        blastResistance: 11,
    },
    {
        name: "Oscillator Tuner",
        description: "Tunes oscillators. (changing the frequency is 100% tuning it, even though all the oscillators are already in tune.)",
        type: "Musical Notes",
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8) % 12 + 1];
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 1) % 12 + 1];
            ctx.fillRect(2, 1, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 2) % 12 + 1];
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 3) % 12 + 1];
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 4) % 12 + 1];
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 5) % 12 + 1];
            ctx.fillRect(4, 3, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 6) % 12 + 1];
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 7) % 12 + 1];
            ctx.fillRect(3, 4, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 8) % 12 + 1];
            ctx.fillRect(2, 4, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 9) % 12 + 1];
            ctx.fillRect(1, 4, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 10) % 12 + 1];
            ctx.fillRect(1, 3, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][Math.floor(animationTick / 8 + 11) % 12 + 1];
            ctx.fillRect(1, 2, 1, 1);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[OSCILLATOR_TUNER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][1];
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][2];
            ctx.fillRect(2, 1, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][3];
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][4];
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][5];
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][6];
            ctx.fillRect(4, 3, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][7];
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][8];
            ctx.fillRect(3, 4, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][9];
            ctx.fillRect(2, 4, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][10];
            ctx.fillRect(1, 4, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][11];
            ctx.fillRect(1, 3, 1, 1);
            ctx.fillStyle = colors[OSCILLATOR_TUNER][12];
            ctx.fillRect(1, 2, 1, 1);
        },
        update: function(x, y) {
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextGrid[y1][x1] == null && grid[y1][x1].id == OSCILLATOR) {
                    if (Array.isArray(grid[y1][x1].data)) {
                        var data = Math.floor(grid[y1][x1].data[0] / 37) * 37;
                        nextGrid[y1][x1] = { id: OSCILLATOR, rotation: 0, onFire: grid[y1][x1].onFire, data: [data + (grid[y1][x1].data[0] % 37 + 1) % 36, grid[y1][x1].data[1]] };
                    }
                    else {
                        var data = Math.floor(grid[y1][x1].data / 37) * 37;
                        nextGrid[y1][x1] = { id: OSCILLATOR, rotation: 0, onFire: grid[y1][x1].onFire, data: data + (grid[y1][x1].data % 37 + 1) % 36 };
                    }
                }
            });
        },
        updateStage: 1,
        animationSpeed: 8,
        animationFrames: 12,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 5,
        blastResistance: 11,
    },
    {
        name: [["Drum 1", "Drum 2", "Drum 3", "Drum 4", "Drum 5", "Drum 6", "Drum 7", "Drum 8", "Drum 9", "Drum 10", "Drum 11", "Drum 12"]],
        description: "Plays a funny drum sound that hurts your ears.",
        type: "Musical Notes",
        drawBackground: 1,
        draw: function(drawCalls, ctx) {
            for (var i in drawCalls) {
                if (Array.isArray(drawCalls[i].pixel.data)) {
                    ctx.fillStyle = colors[DRUM][(drawCalls[i].pixel.data[1] == 1 ? 2 : 1)];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 3, 4, 2);
                    }
                }
                else {
                    ctx.fillStyle = colors[DRUM][1];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 3, 4, 2);
                    }
                }
            }
            for (var i in drawCalls) {
                if (Array.isArray(drawCalls[i].pixel.data)) {
                    ctx.fillStyle = colors[DRUM][(drawCalls[i].pixel.data[1] == 1 ? 4 : 3)];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 2, 2, 1);
                    }
                }
                else {
                    ctx.fillStyle = colors[DRUM][3];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 2, drawCalls[i].y * 6 + 2, 2, 1);
                    }
                }
            }
            for (var i in drawCalls) {
                if (Array.isArray(drawCalls[i].pixel.data)) {
                    ctx.fillStyle = colors[DRUM][drawCalls[i].pixel.data[0] + 5];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 4, 1);
                    }
                }
                else {
                    ctx.fillStyle = colors[DRUM][drawCalls[i].pixel.data + 5];
                    for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                        ctx.fillRect(j * 6 + 1, drawCalls[i].y * 6 + 1, 4, 1);
                    }
                }
            }
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[DRUM][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[DRUM][2];
            ctx.fillRect(1, 3, 4, 2);
            ctx.fillStyle = colors[DRUM][4];
            ctx.fillRect(2, 2, 2, 1);
            ctx.fillStyle = colors[DRUM][pixel.data + 5];
            ctx.fillRect(1, 1, 4, 1);
        },
        update: function(x, y) {
            var touching = false;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (grid[y1][x1].id != AIR && grid[y1][x1].id != OSCILLATOR && grid[y1][x1].id != OSCILLATOR_TUNER && grid[y1][x1].id != DRUM) {
                    touching = true;
                }
            });
            if (touching) {
                if (Array.isArray(grid[y][x].data)) {
                    if (grid[y][x].data[1] == 0) {
                        effects[`drum${(grid[y][x].data[0] + 1)}`].play();
                    }
                }
                else {
                    effects[`drum${(grid[y][x].data + 1)}`].play();
                }
            }
            if (nextGrid[y][x] == null) {
                if (!Array.isArray(grid[y][x].data)) {
                    nextGrid[y][x] = { id: DRUM, rotation: 0, onFire: grid[y][x].onFire, data: [grid[y][x].data, touching ? 1 : 0] };
                }
                else if (grid[y][x].data[1] != touching ? 1 : 0) {
                    nextGrid[y][x] = { id: DRUM, rotation: 0, onFire: grid[y][x].onFire, data: [grid[y][x].data[0], touching ? 1 : 0] };
                }
            }
        },
        updateStage: 4,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 12,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 5,
        blastResistance: 11,
    },
    {
        name: "Allow Placement",
        description: "Allows placement and removal of pixels in levels.",
        type: "Level Construction",
        drawBackground: 0,
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[AIR];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[ALLOW_PLACEMENT][1];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[AIR];
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
        drawBackground: 0,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[RESTRICT_PLACEMENT][1];
            ctx.fillRect(2, 0, 3, 1);
            ctx.fillRect(3, 1, 3, 1);
            ctx.fillRect(4, 2, 2, 1);
            ctx.fillRect(0, 2, 1, 1);
            ctx.fillRect(5, 3, 1, 1);
            ctx.fillRect(0, 3, 2, 1);
            ctx.fillRect(0, 4, 3, 1);
            ctx.fillRect(1, 5, 3, 1);
            // ctx.fillRect(0, 0, 2, 1);
            // ctx.fillRect(0, 1, 3, 1);
            // ctx.fillRect(1, 2, 3, 1);
            // ctx.fillRect(2, 3, 3, 1);
            // ctx.fillRect(3, 4, 3, 1);
            // ctx.fillRect(4, 5, 2, 1);
            // ctx.fillRect(5, 0, 1, 1);
            // ctx.fillRect(0, 5, 1, 1);
            ctx.fillStyle = colors[RESTRICT_PLACEMENT][2];
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
            ctx.fillStyle = colors[AIR];
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
        name: "Goal",
        description: "Must be pushed into the target to finish the level.",
        type: "Level Construction",
        drawBackground: 1,
        draw: function(drawCalls, ctx) {
            offscreenAboveCtx.fillStyle = colors[GOAL][2];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    offscreenAboveCtx.fillRect(j * 6 - colors[GOAL][3] * 6, drawCalls[i].y * 6 - colors[GOAL][3] * 6, 6 + colors[GOAL][3] * 12, 6 + colors[GOAL][3] * 12);
                }
            }
        },
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[GOAL][1];
            ctx.fillRect(1, 1, 4, 4);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[GOAL][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[GOAL][1];
            ctx.fillRect(1, 1, 4, 4);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 1,
        animationFrames: 1,
        dataFrames: 1,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: false,
        flammability: 0,
        blastResistance: 20,
    },
    {
        name: "Target",
        description: "Goals must be pushed into it to finish the puzzle.",
        type: "Level Construction",
        drawBackground: 0,
        draw: function(drawCalls, ctx) {
            offscreenAboveCtx.fillStyle = colors[TARGET][1];
            for (var i in drawCalls) {
                for (var j = drawCalls[i].x1; j < drawCalls[i].x2; j++) {
                    offscreenAboveCtx.fillRect(j * 6 - colors[TARGET][2] * 6, drawCalls[i].y * 6 - colors[TARGET][2] * 6, 6 + colors[TARGET][2] * 12, 6 + colors[TARGET][2] * 12);
                }
            }
        },
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[TARGET][0];
            ctx.fillRect(0, 0, 6, 1);
            ctx.fillRect(0, 1, 1, 5);
            ctx.fillRect(1, 5, 5, 1);
            ctx.fillRect(5, 1, 1, 4);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[TARGET][0];
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
        name: "Monster",
        description: "Can be destroyed with any pixel. All monsters need to be destroyed to finish the level.",
        type: "Level Construction",
        drawBackground: 1,
        render: function(pixel, ctx) {
            ctx.fillStyle = colors[MONSTER][2];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[MONSTER][1];
            ctx.fillRect(1, 2, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillStyle = colors[MONSTER][3];
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(2, 4, 2, 1);
        },
        drawPreview: function(pixel, ctx) {
            ctx.fillStyle = colors[MONSTER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[MONSTER][2];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[MONSTER][1];
            ctx.fillRect(1, 2, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillStyle = colors[MONSTER][3];
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(2, 4, 2, 1);
        },
        update: function(x, y) {
            if (y != gridSize - 1) {
                if (grid[y + 1][x].id != MONSTER) {
                    if (pixels[grid[y + 1][x].id].density == -1) {
                        move(x, y, [{ x: 0, y: 1 }]);
                    }
                }
            }
        },
        updateStage: 1,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 1,
        density: -1,
        pushable: true,
        rotateable: 1,
        cloneable: false,
        flammability: 20,
        blastResistance: 2,
        monster: true,
    },
];

var oscillatorNames = [[]];
var oscillatorDescriptions = [[]];
var oscillatorTypes = ["Square", "Triangle", "Sawtooth"];
var oscillatorPrefixes = ["Short", "Long"];
var oscillatorNotes = ["A3", "A#3/Bb3", "B3", "C4", "C#4/Db4", "D4", "D#4/Eb4", "E4", "F4", "F#4/Gb4", "G4", "G#4/Ab4", "A4", "A#4/Bb4", "B4", "C5", "C#5/Db5", "D5", "D#5/Eb5", "E5", "F5", "F#5/Gb5", "G5", "G#5/Ab5", "A5", "A#5/Bb5", "B5", "C6", "C#6/Db6", "D6", "D#6/Eb6", "E6", "F6", "F#6/Gb6", "G6", "G#6/Ab6", "A6"];

for (var i in oscillatorTypes) {
    for (var j in oscillatorPrefixes) {
        for (var k in oscillatorNotes) {
            oscillatorNames[0].push(`${oscillatorPrefixes[j]} ${oscillatorTypes[i]} Oscillator ${oscillatorNotes[k]}`);
            oscillatorDescriptions[0].push(`Plays a funny ${oscillatorPrefixes[j]} ${oscillatorTypes[i]}  ${oscillatorNotes[k]} note that hurts your ears.`);
        }
    }
}

pixels[OSCILLATOR].name = oscillatorNames;
pixels[OSCILLATOR].description = oscillatorDescriptions;