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

var pixels = [
    {
        name: "Air",
        description: "It's air. What did you expect?",
        amountColor: "rgb(0, 0, 0)",
        type: "A Pixel World",
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[DIRT];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER)) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = MUD;
                }
                return;
            }
            var supportedPixels = 0;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (pixels[idGrid[y1][x1]].density >= this.density) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[GRASS];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER)) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = MUD;
                }
                return;
            }
            if (y == 0 || idGrid[y - 1][x] != AIR) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = DIRT;
                }
                return;
            }
            var supportedPixels = 0;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (pixels[idGrid[y1][x1]].density >= this.density) {
                    supportedPixels += 1;
                }
            });
            forAllTouching(x, y, 2, function(x1, y1) {
                if (nextIdGrid[y1][x1] != null) {
                    return;
                }
                if (y1 != 0 && idGrid[y1][x1] == DIRT && idGrid[y1 - 1][x1] == AIR && getRandom(x, y) < 1 / (Math.pow(x1 - x, 4) + Math.pow(y1 - y, 4))) {
                    nextIdGrid[y1][x1] = GRASS;
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[SAND];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouchingHeated(x, y, 1) && getRandom(x, y) < 0.1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = GLASS;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[OAK_WOOD][1];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    ctx.fillRect(j * 6, drawCallY[i] * 6, 3, 6);
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[LEAF];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (!isTouching(x, y, 1, OAK_WOOD) && !isTouching(x, y, 1, SPRUCE_WOOD) && getTouching(x, y, 1, LEAF) == 0) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = AIR;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[MUD]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (!isTouching(x, y, 1, WATER) && getRandom(x, y) < 0.1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = DRIED_MUD;
                }
                return;
            }
            var supportedPixels = 0;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (pixels[idGrid[y1][x1]].density >= this.density) {
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[DRIED_MUD]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER)) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = MUD;
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
        name: "Vine",
        description: "Needs supports to grow. It's, uhhh, not very realistic.",
        type: "A Pixel World",
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[VINE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouching(x, y, 2, VINE) >= 7 && getRandom(x, y) < 0.25) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = WATER;
                }
                return;
            }
            var onGround = false;
            if (y != gridSize - 1) {
                if (idGrid[y + 1][x] != VINE) {
                    onGround = true;
                }
            }
            if (onGround) {
                forAllTouching(x, y, 2, function(x1, y1) {
                    if (Math.abs(x - x1) == 2 || Math.abs(y - y1) == 2) {
                        return;
                    }
                    if (y1 == y) {
                        return;
                    }
                    if (nextIdGrid[y1][x1] != null) {
                        return;
                    }
                    if (idGrid[y1][x1] != AIR) {
                        return;
                    }
                    // if (y1 != gridSize - 1 && idGrid[y1 + 1][x1] == AIR) {
                    //     return;
                    // }
                    var supported = false;
                    forAllTouching(x1, y1, 2, function(x2, y2) {
                        if (idGrid[y2][x2] != AIR && idGrid[y2][x2] != VINE && idGrid[y2][x2] != WATER && idGrid[y2][x2] != LAVA && idGrid[y2][x2] != MAGMA) {
                            supported = true;
                        }
                    });
                    if (supported && getRandom(x, y) < 1 / 60) {
                        nextIdGrid[y1][x1] = VINE;
                    }
                });
            }
            else {
                forAllTouching(x, y, 2, function(x1, y1) {
                    if (Math.abs(x - x1) == 2 || Math.abs(y - y1) == 2) {
                        return;
                    }
                    if (nextIdGrid[y1][x1] != null) {
                        return;
                    }
                    if (idGrid[y1][x1] != AIR) {
                        return;
                    }
                    if (y1 != gridSize - 1 && idGrid[y1 + 1][x1] == AIR) {
                        return;
                    }
                    var supported = false;
                    forAllTouching(x1, y1, 2, function(x2, y2) {
                        if (Math.abs(x1 - x2) == 2 || Math.abs(y1 - y2) == 2) {
                            return;
                        }
                        if (idGrid[y2][x2] != AIR && idGrid[y2][x2] != VINE && idGrid[y2][x2] != WATER && idGrid[y2][x2] != LAVA && idGrid[y2][x2] != MAGMA) {
                            supported = true;
                        }
                    });
                    if (supported && getRandom(x, y) < 1 / 120) {
                        nextIdGrid[y1][x1] = VINE;
                    }
                });
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
        flammability: 13,
        blastResistance: 4,
    },
    {
        name: "Moss",
        description: "Grows on stone. It's, uhhh, not very realistic.",
        type: "A Pixel World",
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[MOSS]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouching(x, y, 2, MOSS) >= 9 && getRandom(x, y) < 0.25) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = WATER;
                }
                return;
            }
            forAllTouching(x, y, 2, function(x1, y1) {
                if (Math.abs(x - x1) == 2 || Math.abs(y - y1) == 2) {
                    return;
                }
                if (nextIdGrid[y1][x1] != null) {
                    return;
                }
                var distance = Math.abs(x1 - x) + Math.abs(y1 - y);
                var id = idGrid[y1][x1];
                if (id == STONE && getRandom(x, y) < 1 / 30 / distance) {
                    nextIdGrid[y1][x1] = MOSS;
                }
                if (id == BASALT && getRandom(x, y) < 1 / 45 / distance) {
                    nextIdGrid[y1][x1] = MOSS;
                }
                if (id == ASH && getRandom(x, y) < 1 / 60 / distance) {
                    nextIdGrid[y1][x1] = MOSS;
                }
                if (id == SLUSH && getRandom(x, y) < 1 / 75 / distance) {
                    nextIdGrid[y1][x1] = MOSS;
                }
                if (id == HARDENED_ASH && getRandom(x, y) < 1 / 90 / distance) {
                    nextIdGrid[y1][x1] = MOSS;
                }
            });
            if (y != gridSize - 1 && idGrid[y + 1][x] != WATER) {
                fall(x, y);
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
        flammability: 13,
        blastResistance: 4,
    },
    {
        name: "Sponge",
        description: "Do you want an PlastiSponge™? Well today is your lucky day! If you don't want an PlastiSponge™ today is also your lucky day because we are now selling InstaSpongePlasti™ (SP™) 3000™ and InstaNotSpongePlasti™ (SP™) 3000™! Now sucks up to NaN™ pixels! Buy now for the cheap cheap price of $39,999™! Or buy later for $49,999™! Buy 12™ and get a Free™ ValuBundle™ consisting of 12 PlastiSnow™, 8 PlastiAbrasive™, and a 1% chance to get a Modified™ Modified™ InstaCar™ with a InstaSnowDepot™ and InstaAbrasiveSpreader™! The new BlizzardPack™ is out! Consisting of 64 PlastiSnow™, 24 PlastiAbrasive™, 8 PlastiCars™, 2 PlastiWalls™, a InstaSnowDepot™ and InstaAbrasiveSpreader™, as well as the old RareSnow™ Pack! In the RareSnow™ Pack, you have a 3% chance of getting DyeSnow™, a 0.6% chance of getting IredecenSnow™, and a 0.02% of getting the extremely rare GlowinSnow™! Tune into SampleProvider™ Today™ for more details.",
        amountColor: "rgb(0, 0, 0)",
        type: "A Pixel World",
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[SPONGE];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getRandom(x, y) < getTouching(x, y, 1, SPONGE) / 10) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = AIR;
                }
                return;
            }
            forEachTouching(x, y, 1, WATER, function(x1, y1) {
                if (nextIdGrid[y1][x1] == null) {
                    nextIdGrid[y1][x1] = SPONGE;
                    if (nextIdGrid[y][x] == null) {
                        nextIdGrid[y][x] = AIR;
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
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[GLASS][1];
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillRect(1, 3, 1, 1);
            ctx.fillRect(2, 4, 1, 1);
        },
        drawPreview: function(rotation, data, ctx) {
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
        render: function(rotation, data, ctx) {
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
        drawPreview: function(rotation, data, ctx) {
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = "rgb(255, 255, 25)";
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = "rgb(225, 25, 0, 0.5)";
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextIdGrid[y1][x1] != null) {
                    return;
                }
                if (idGrid[y1][x1] == WATER && nextIdGrid[y][x] == null) {
                    var rockRandom = getRandom(x, y);
                    if (y1 > y) {
                        if (rockRandom < 0.1) {
                            nextIdGrid[y1][x1] = OBSIDIAN;
                        }
                        else if (rockRandom < 0.5) {
                            nextIdGrid[y1][x1] = BASALT;
                        }
                        else {
                            nextIdGrid[y1][x1] = STONE;
                        }
                        nextIdGrid[y][x] = STEAM;
                    }
                    else {
                        if (rockRandom < 0.1) {
                            nextIdGrid[y][x] = OBSIDIAN;
                        }
                        else if (rockRandom < 0.5) {
                            nextIdGrid[y][x] = BASALT;
                        }
                        else {
                            nextIdGrid[y][x] = STONE;
                        }
                        nextIdGrid[y1][x1] = STEAM;
                    }
                }
                if (idGrid[y1][x1] == AIR && getRandom(x, y) < 0.1) {
                    nextIdGrid[y1][x1] = AIR;
                    nextFireGrid[y1][x1] = true;
                }
                else if (pixels[idGrid[y1][x1]].flammability > 0 && getRandom(x, y) < pixels[idGrid[y1][x1]].flammability / 120) {
                    nextIdGrid[y1][x1] = AIR;
                    nextFireGrid[y1][x1] = true;
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[FIRE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            var touchingWater = false;
            forEachTouching(x, y, 1, WATER, function(x1, y1) {
                if (getRandom(x, y) < 0.25) {
                    if (nextFireGrid[y][x] == null) {
                        nextFireGrid[y][x] = false;
                        touchingWater = true;
                    }
                    nextIdGrid[y1][x1] = STEAM;
                }
            });
            if (touchingWater) {
                return;
            }
            var flammability = pixels[idGrid[y][x]].flammability;
            if (flammability == 0 && (idGrid[y][x] != AIR || getRandom(x, y) < 0.3)) {
                if (nextFireGrid[y][x] == null) {
                    nextFireGrid[y][x] = false;
                }
                return;
            }
            var touchingAir = !isTouching(x, y, 2, AIR);
            if (touchingAir && getRandom(x, y) < 0.5) {
                if (nextFireGrid[y][x] == null) {
                    nextFireGrid[y][x] = false;
                }
                return;
            }
            // if (getRandom(x, y) < (20 - flammability) / 360) {
            //     if (nextGrid[y][x] == null) {
            //         nextGrid[y][x] = { id: grid[y][x].id, rotation: rotationGrid[y][x], onFire: false, data: grid[y][x].data };
            //     }
            //     return;
            // }
            var burned = false;
            if (getRandom(x, y) < flammability / 1200 && nextIdGrid[y][x] == null) {
                // if (grid[y][x].id == )
                if (idGrid[y][x] != ASH && getRandom(x, y) < 0.5) {
                    nextIdGrid[y][x] = ASH;
                }
                else {
                    nextIdGrid[y][x] = AIR;
                }
                nextRotationGrid[y][x] = 0;
                nextDataGrid[y][x] = 0;
                burned = true;
            }
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextIdGrid[y1][x1] != null) {
                    return;
                }
                if (idGrid[y1][x1] == AIR && getRandom(x, y) < (burned ? 0.5 : flammability / 600)) {
                    nextIdGrid[y1][x1] = SMOKE;
                    return;
                }
                if (fireGrid[y1][x1] == false && getRandom(x, y) < pixels[idGrid[y1][x1]].flammability / 40 + (y1 < y ? 0.4 : 0) + (burned ? 0.4 : 0)) {
                    nextFireGrid[y1][x1] = true;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[SMOKE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getRandom(x, y) < 1 / 480) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = AIR;
                }
                return;
            }
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextIdGrid[y1][x1] != null) {
                    return;
                }
                if (fireGrid[y1][x1]) {
                    return;
                }
                var flammability = pixels[idGrid[y1][x1]].flammability;
                if (getRandom(x, y) < flammability / 20) {
                    nextIdGrid[y1][x1] = idGrid[y1][x1];
                    nextFireGrid[y1][x1] = true;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[ASH]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER)) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = HARDENED_ASH;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[HARDENED_ASH]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouchingHeated(x, y, 1) && !isTouching(x, y, 1, WATER) && getRandom(x, y) < 0.1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = ASH;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[STEAM]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getRandom(x, y) < 1 / 120 || isTouching(x, y, 1, ICE)) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = WATER;
                }
                return;
            }
            var burned = false;
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextIdGrid[y1][x1] != null) {
                    return;
                }
                if (fireGrid[y1][x1]) {
                    return;
                }
                var flammability = pixels[idGrid[y1][x1]].flammability;
                if (getRandom(x, y) < flammability / 20) {
                    nextIdGrid[y1][x1] = idGrid[y1][x1];
                    nextFireGrid[y1][x1] = true;
                    burned = true;
                }
            });
            if (burned) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = WATER;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[MAGMA]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            var touchingHeated = getTouchingHeated(x, y, 1);
            if (touchingHeated <= 2 && getRandom(x, y) < (2 - touchingHeated) / 100) {
                if (nextIdGrid[y][x] == null) {
                    if (touchingHeated == 2) {
                        nextIdGrid[y][x] = BASALT;
                    }
                    else {
                        nextIdGrid[y][x] = STONE;
                    }
                }
                return;
            }
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextIdGrid[y1][x1] != null) {
                    return;
                }
                if (idGrid[y1][x1] == WATER && nextIdGrid[y][x] == null) {
                    if (y1 > y) {
                        if (getRandom(x, y) < 0.5) {
                            nextIdGrid[y1][x1] = BASALT;
                        }
                        else {
                            nextIdGrid[y1][x1] = STONE;
                        }
                        nextIdGrid[y][x] = STEAM;
                    }
                    else {
                        if (getRandom(x, y) < 0.5) {
                            nextIdGrid[y][x] = BASALT;
                        }
                        else {
                            nextIdGrid[y][x] = STONE;
                        }
                        nextIdGrid[y1][x1] = STEAM;
                    }
                }
                if (idGrid[y1][x1] == AIR && getRandom(x, y) < 0.1) {
                    nextIdGrid[y1][x1] = AIR;
                    nextFireGrid[y1][x1] = true;
                }
                if (pixels[idGrid[y1][x1]].flammability > 0 && getRandom(x, y) < pixels[idGrid[y1][x1]].flammability / 480) {
                    nextIdGrid[y1][x1] = idGrid[y1][x1];
                    nextFireGrid[y1][x1] = true;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[STONE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 2 && getRandom(x, y) < 0.1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = MAGMA;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[BASALT]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 3 && getRandom(x, y) < 0.1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = MAGMA;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[SNOW];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = WATER;
                }
                return;
            }
            if (getTouching(x, y, 1, WATER) >= 2) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = WATER;
                }
                return;
            }
            forEachTouching(x, y, 1, ASH, function(x1, y1) {
                if (nextIdGrid[y1][x1] == null) {
                    nextIdGrid[y1][x1] = SLUSH;
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[ICE][1];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    ctx.fillRect(j * 6, drawCallY[i] * 6 + 4, 2, 2);
                    ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 2, 2, 2);
                    ctx.fillRect(j * 6 + 4, drawCallY[i] * 6, 2, 2);
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[ICE][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[ICE][1];
            ctx.fillRect(0, 4, 2, 2);
            ctx.fillRect(2, 2, 2, 2);
            ctx.fillRect(4, 0, 2, 2);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = WATER;
                }
                return;
            }
            if (getTouching(x, y, 1, WATER) >= 2 && getRandom(x, y) < 0.1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = WATER;
                }
                return;
            }
            forEachTouching(x, y, 1, ASH, function(x1, y1) {
                if (nextIdGrid[y1][x1] == null) {
                    nextIdGrid[y1][x1] = SLUSH;
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[SLUSH]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (getTouchingHeated(x, y, 1) >= 1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = ASH;
                }
                return;
            }
            if (getTouching(x, y, 1, WATER) >= 2 && getRandom(x, y) < 0.1) {
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = ASH;
                }
                return;
            }
            forEachTouching(x, y, 1, ASH, function(x1, y1) {
                if (nextIdGrid[y1][x1] == null) {
                    nextIdGrid[y1][x1] = SLUSH;
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[SPRUCE_WOOD][1];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    ctx.fillRect(j * 6, drawCallY[i] * 6, 3, 6);
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[PUSHER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 3, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 3, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[PUSHER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[PUSHER][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            if (nextIdGrid[y][x] != null) {
                return;
            }
            if (isLocationInGrid(x, y, (rotationGrid[y][x] + 2) % 4, 1)) {
                var location = getLocation(x, y, (rotationGrid[y][x] + 2) % 4, 1);
                if (idGrid[location[1]][location[0]] == PUSHER && rotationGrid[location[1]][location[0]] == rotationGrid[y][x]) {
                    return;
                }
            }
            push(x, y, rotationGrid[y][x], gridSize);
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[PULLER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 3, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 3, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[PULLER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[PULLER][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            if (nextIdGrid[y][x] != null) {
                return;
            }
            pull(x, y, rotationGrid[y][x], gridSize);
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
        name: ["Driller Up", "Driller Right", "Driller Down", "Driller Left"],
        description: ["Pushes pixels upwards. Destroys pixels if it can't push.", "Pushes pixels rightwards. Destroys pixels if it can't push.", "Pushes pixels downwards. Destroys pixels if it can't push.", "Pushes pixels leftwards. Destroys pixels if it can't push."],
        type: "Mechanical Movement",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[DRILLER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 3, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 3, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[DRILLER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[DRILLER][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            if (nextIdGrid[y][x] != null) {
                return;
            }
            if (!isLocationInGrid(x, y, rotationGrid[y][x], 1)) {
                return;
            }
            if (isLocationInGrid(x, y, (rotationGrid[y][x] + 2) % 4, 1)) {
                var location = getLocation(x, y, (rotationGrid[y][x] + 2) % 4, 1);
                if (idGrid[location[1]][location[0]] == PUSHER && rotationGrid[location[1]][location[0]] == rotationGrid[y][x]) {
                    return;
                }
            }
            if (!push(x, y, rotationGrid[y][x], gridSize)) {
                var location = getLocation(x, y, rotationGrid[y][x], 1);
                if (nextIdGrid[location[1]][location[0]] != null) {
                    return;
                }
                var id = idGrid[location[1]][location[0]];
                var data = dataGrid[y][x];
                if (data >= pixels[id].blastResistance && pixels[id].blastResistance != 20) {
                    if (id == DELETER) {
                        nextIdGrid[y][x] = AIR;
                        nextRotationGrid[y][x] = 0;
                        nextDataGrid[y][x] = 0;
                        nextFireGrid[y][x] = false;
                    }
                    else if (id == MONSTER) {
                        nextIdGrid[y][x] = AIR;
                        nextRotationGrid[y][x] = 0;
                        nextDataGrid[y][x] = 0;
                        nextFireGrid[y][x] = false;
                        nextIdGrid[location[1]][location[0]] = AIR;
                        nextFireGrid[location[1]][location[0]] = false;
                    }
                    else if (id == PIXELITE_CRYSTAL) {
                        nextIdGrid[y][x] = AIR;
                        nextRotationGrid[y][x] = 0;
                        nextDataGrid[y][x] = 0;
                        nextFireGrid[y][x] = false;
                        if (dataGrid[location[1]][location[0]] == 0) {
                            nextIdGrid[location[1]][location[0]] = AIR;
                            nextFireGrid[location[1]][location[0]] = false;
                        }
                        else {
                            nextDataGrid[location[1]][location[0]] = dataGrid[location[1]][location[0]] - 1;
                            dataGrid[location[1]][location[0]] -= 1;
                        }
                    }
                    else {
                        nextIdGrid[location[1]][location[0]] = AIR;
                        nextRotationGrid[location[1]][location[0]] = 0;
                        nextDataGrid[location[1]][location[0]] = 0;
                        nextFireGrid[location[1]][location[0]] = false;
                    }
                    data = -1;
                }
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = DRILLER;
                    nextDataGrid[y][x] = data + 1;
                }
            }
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
        name: ["Penetrator Up", "Penetrator Right", "Penetrator Down", "Penetrator Left"],
        description: ["Can penetrate pixels upwards.", "Can penetrate pixels rightwards.", "Can penetrate pixels downwards.", "Can penetrate pixels leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[PENETRATOR][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 3, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 3, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[PENETRATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[PENETRATOR][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            if (nextIdGrid[y][x] != null) {
                return;
            }
            if (!isLocationInGrid(x, y, rotationGrid[y][x], 1)) {
                return;
            }
            var location = getLocation(x, y, rotationGrid[y][x], 1);
            if (nextIdGrid[location[1]][location[0]] != null) {
                return;
            }
            var id = idGrid[location[1]][location[0]];
            var rotation = rotationGrid[location[1]][location[0]];
            var data = dataGrid[location[1]][location[0]];
            if (id == PENETRATOR && rotation == rotationGrid[y][x]) {
                return;
            }
            if (!canMove(location[0], location[1], id, rotation, data, rotationGrid[y][x])) {
                if (id == DELETER) {
                    nextIdGrid[y][x] = AIR;
                    nextRotationGrid[y][x] = 0;
                    nextDataGrid[y][x] = 0;
                    nextFireGrid[y][x] = false;
                }
                else if (id == MONSTER) {
                    nextIdGrid[y][x] = AIR;
                    nextRotationGrid[y][x] = 0;
                    nextDataGrid[y][x] = 0;
                    nextFireGrid[y][x] = false;
                    nextIdGrid[location[1]][location[0]] = AIR;
                    nextFireGrid[location[1]][location[0]] = false;
                }
                else if (id == PIXELITE_CRYSTAL) {
                    nextIdGrid[y][x] = AIR;
                    nextRotationGrid[y][x] = 0;
                    nextDataGrid[y][x] = 0;
                    nextFireGrid[y][x] = false;
                    if (data == 0) {
                        nextIdGrid[location[1]][location[0]] = AIR;
                        nextFireGrid[location[1]][location[0]] = false;
                    }
                    else {
                        nextDataGrid[location[1]][location[0]] = data - 1;
                        dataGrid[location[1]][location[0]] -= 1;
                    }
                }
                return;
            }
            nextIdGrid[y][x] = id;
            nextRotationGrid[y][x] = rotation;
            nextDataGrid[y][x] = data;
            nextFireGrid[y][x] = fireGrid[location[1]][location[0]];
            nextIdGrid[location[1]][location[0]] = PENETRATOR;
            nextRotationGrid[location[1]][location[0]] = rotationGrid[y][x];
            nextFireGrid[location[1]][location[0]] = fireGrid[y][x];
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[COPIER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 4, 1);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 5, drawCallY[i] * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 4, drawCallY[i] * 6 + 1, 1, 4);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 5, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 4, 4, 1);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 1, 4);
                    }
                }
            }
            ctx.fillStyle = colors[COPIER][2];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    if (drawCallRotation[i] == 0) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 4, 2, 2);
                    }
                    else if (drawCallRotation[i] == 1) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 2, 2);
                    }
                    else if (drawCallRotation[i] == 2) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 2);
                    }
                    else if (drawCallRotation[i] == 3) {
                        ctx.fillRect(j * 6 + 4, drawCallY[i] * 6 + 2, 2, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[COPIER][0];
            ctx.fillRect(0, 0, 6, 6);
            if (rotation == 0) {
                ctx.fillStyle = colors[COPIER][1];
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 1);
                ctx.fillStyle = colors[COPIER][2];
                ctx.fillRect(2, 4, 2, 2);
            }
            else if (rotation == 1) {
                ctx.fillStyle = colors[COPIER][1];
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(4, 1, 1, 4);
                ctx.fillStyle = colors[COPIER][2];
                ctx.fillRect(0, 2, 2, 2);
            }
            else if (rotation == 2) {
                ctx.fillStyle = colors[COPIER][1];
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 4, 4, 1);
                ctx.fillStyle = colors[COPIER][2];
                ctx.fillRect(2, 0, 2, 2);
            }
            else if (rotation == 3) {
                ctx.fillStyle = colors[COPIER][1];
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 1, 4);
                ctx.fillStyle = colors[COPIER][2];
                ctx.fillRect(4, 2, 2, 2);
            }
        },
        update: function(x, y) {
            if (!isLocationInGrid(x, y, rotationGrid[y][x], 1) || !isLocationInGrid(x, y, (rotationGrid[y][x] + 2) % 4, 1)) {
                return;
            }
            var frontLocation = getLocation(x, y, rotationGrid[y][x], 1);
            if (nextIdGrid[frontLocation[1]][frontLocation[0]] != null) {
                return;
            }
            var frontId = idGrid[frontLocation[1]][frontLocation[0]];
            var backLocation = getLocation(x, y, (rotationGrid[y][x] + 2) % 4, 1);
            var backId = idGrid[backLocation[1]][backLocation[0]];
            if (!pixels[backId].cloneable) {
                return;
            }
            if (frontId == MONSTER) {
                nextIdGrid[frontLocation[1]][frontLocation[0]] = AIR;
                nextFireGrid[frontLocation[1]][frontLocation[0]] = false;
            }
            else if (frontId == PIXELITE_CRYSTAL) {
                if (dataGrid[frontLocation[1]][frontLocation[0]] == 0) {
                    nextIdGrid[frontLocation[1]][frontLocation[0]] = AIR;
                    nextFireGrid[frontLocation[1]][frontLocation[0]] = false;
                }
                else {
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = dataGrid[frontLocation[1]][frontLocation[0]] - 1;
                    dataGrid[frontLocation[1]][frontLocation[0]] -= 1;
                }
            }
            else if (frontId == AIR) {
                nextIdGrid[frontLocation[1]][frontLocation[0]] = backId;
                nextRotationGrid[frontLocation[1]][frontLocation[0]] = rotationGrid[backLocation[1]][backLocation[0]];
                if (Array.isArray(dataGrid[backLocation[1]][backLocation[0]])) {
                    var data = [];
                    data.length = dataGrid[backLocation[1]][backLocation[0]].length;
                    for (var i in dataGrid[backLocation[1]][backLocation[0]]) {
                        data[i] = dataGrid[backLocation[1]][backLocation[0]][i];
                    }
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = data;
                }
                else {
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = dataGrid[backLocation[1]][backLocation[0]];
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
        name: ["Converter Up", "Converter Right", "Converter Down", "Converter Left"],
        description: ["Converts the pixel above it to the pixel underneath it.", "Converts the pixel to the right of it to the pixel to the left of it.", "Converts the pixel underneath it to the pixel above it.", "Converts the pixel to the left of it to the pixel to the right of it."],
        type: "Mechanical Movement",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[CONVERTER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 4, 1);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 5, drawCallY[i] * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 4, drawCallY[i] * 6 + 1, 1, 4);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 5, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 4, 4, 1);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 1, 4);
                    }
                }
            }
            ctx.fillStyle = colors[CONVERTER][2];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    if (drawCallRotation[i] == 0) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 4, 2, 2);
                    }
                    else if (drawCallRotation[i] == 1) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 2, 2);
                    }
                    else if (drawCallRotation[i] == 2) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 2);
                    }
                    else if (drawCallRotation[i] == 3) {
                        ctx.fillRect(j * 6 + 4, drawCallY[i] * 6 + 2, 2, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[CONVERTER][0];
            ctx.fillRect(0, 0, 6, 6);
            if (rotation == 0) {
                ctx.fillStyle = colors[CONVERTER][1];
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 1);
                ctx.fillStyle = colors[CONVERTER][2];
                ctx.fillRect(2, 4, 2, 2);
            }
            else if (rotation == 1) {
                ctx.fillStyle = colors[CONVERTER][1];
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(4, 1, 1, 4);
                ctx.fillStyle = colors[CONVERTER][2];
                ctx.fillRect(0, 2, 2, 2);
            }
            else if (rotation == 2) {
                ctx.fillStyle = colors[CONVERTER][1];
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 4, 4, 1);
                ctx.fillStyle = colors[CONVERTER][2];
                ctx.fillRect(2, 0, 2, 2);
            }
            else if (rotation == 3) {
                ctx.fillStyle = colors[CONVERTER][1];
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 1, 4);
                ctx.fillStyle = colors[CONVERTER][2];
                ctx.fillRect(4, 2, 2, 2);
            }
        },
        update: function(x, y) {
            if (!isLocationInGrid(x, y, rotationGrid[y][x], 1) || !isLocationInGrid(x, y, (rotationGrid[y][x] + 2) % 4, 1)) {
                return;
            }
            var frontLocation = getLocation(x, y, rotationGrid[y][x], 1);
            if (nextIdGrid[frontLocation[1]][frontLocation[0]] != null) {
                return;
            }
            var frontId = idGrid[frontLocation[1]][frontLocation[0]];
            if (pixels[frontId].blastResistance == 20 || (frontId == SLIDER && rotationGrid[frontLocation[1]][frontLocation[0]] != rotationGrid[y][x] % 2)) {
                return;
            }
            var backLocation = getLocation(x, y, (rotationGrid[y][x] + 2) % 4, 1);
            var backId = idGrid[backLocation[1]][backLocation[0]];
            if (!pixels[backId].cloneable) {
                return;
            }
            if (frontId == MONSTER) {
                nextIdGrid[frontLocation[1]][frontLocation[0]] = AIR;
                nextFireGrid[frontLocation[1]][frontLocation[0]] = false;
            }
            else if (frontId == PIXELITE_CRYSTAL) {
                if (dataGrid[frontLocation[1]][frontLocation[0]] == 0) {
                    nextIdGrid[frontLocation[1]][frontLocation[0]] = AIR;
                    nextFireGrid[frontLocation[1]][frontLocation[0]] = false;
                }
                else {
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = dataGrid[frontLocation[1]][frontLocation[0]] - 1;
                    dataGrid[frontLocation[1]][frontLocation[0]] -= 1;
                }
            }
            else {
                nextIdGrid[frontLocation[1]][frontLocation[0]] = backId;
                nextRotationGrid[frontLocation[1]][frontLocation[0]] = rotationGrid[backLocation[1]][backLocation[0]];
                if (Array.isArray(dataGrid[backLocation[1]][backLocation[0]])) {
                    var data = [];
                    data.length = dataGrid[backLocation[1]][backLocation[0]].length;
                    for (var i in dataGrid[backLocation[1]][backLocation[0]]) {
                        data[i] = dataGrid[backLocation[1]][backLocation[0]][i];
                    }
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = data;
                }
                else {
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = dataGrid[backLocation[1]][backLocation[0]];
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
        blastResistance: 13,
    },
    {
        name: ["Cloner Up", "Cloner Right", "Cloner Down", "Cloner Left"],
        description: ["Clones pixels upwards.", "Clones pixels rightwards.", "Clones pixels downwards.", "Clones pixels leftwards."],
        type: "Mechanical Movement",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[CLONER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 4, 1);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 5, drawCallY[i] * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 4, drawCallY[i] * 6 + 1, 1, 4);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 5, 2, 1);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 4, 4, 1);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 1, 2);
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 1, 4);
                    }
                }
            }
            ctx.fillStyle = colors[CLONER][2];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    if (drawCallRotation[i] == 0) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 4, 2, 2);
                    }
                    else if (drawCallRotation[i] == 1) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 2, 2);
                    }
                    else if (drawCallRotation[i] == 2) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 2);
                    }
                    else if (drawCallRotation[i] == 3) {
                        ctx.fillRect(j * 6 + 4, drawCallY[i] * 6 + 2, 2, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[CLONER][0];
            ctx.fillRect(0, 0, 6, 6);
            if (rotation == 0) {
                ctx.fillStyle = colors[CLONER][1];
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 1);
                ctx.fillStyle = colors[CLONER][2];
                ctx.fillRect(2, 4, 2, 2);
            }
            else if (rotation == 1) {
                ctx.fillStyle = colors[CLONER][1];
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(4, 1, 1, 4);
                ctx.fillStyle = colors[CLONER][2];
                ctx.fillRect(0, 2, 2, 2);
            }
            else if (rotation == 2) {
                ctx.fillStyle = colors[CLONER][1];
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 4, 4, 1);
                ctx.fillStyle = colors[CLONER][2];
                ctx.fillRect(2, 0, 2, 2);
            }
            else if (rotation == 3) {
                ctx.fillStyle = colors[CLONER][1];
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 1, 4);
                ctx.fillStyle = colors[CLONER][2];
                ctx.fillRect(4, 2, 2, 2);
            }
        },
        update: function(x, y) {
            if (!isLocationInGrid(x, y, rotationGrid[y][x], 1) || !isLocationInGrid(x, y, (rotationGrid[y][x] + 2) % 4, 1)) {
                return;
            }
            var frontLocation = getLocation(x, y, rotationGrid[y][x], 1);
            if (nextIdGrid[frontLocation[1]][frontLocation[0]] != null) {
                return;
            }
            var frontId = idGrid[frontLocation[1]][frontLocation[0]];
            if (frontId == CLONER && rotationGrid[frontLocation[1]][frontLocation[0]] == rotationGrid[y][x]) {
                return;
            }
            if (pixels[frontId].pushable == false || frontId == DELETER || (frontId == SLIDER && rotationGrid[frontLocation[1]][frontLocation[0]] != rotationGrid[y][x] % 2) || (frontId == GOAL && targetGrid[frontLocation[1]][frontLocation[0]] == 1)) {
                return;
            }
            var backLocation = getLocation(x, y, (rotationGrid[y][x] + 2) % 4, 1);
            var backId = idGrid[backLocation[1]][backLocation[0]];
            if (!pixels[backId].cloneable) {
                return;
            }
            if (frontId == MONSTER) {
                nextIdGrid[frontLocation[1]][frontLocation[0]] = AIR;
                nextFireGrid[frontLocation[1]][frontLocation[0]] = false;
            }
            else if (frontId == PIXELITE_CRYSTAL) {
                if (dataGrid[frontLocation[1]][frontLocation[0]] == 0) {
                    nextIdGrid[frontLocation[1]][frontLocation[0]] = AIR;
                    nextFireGrid[frontLocation[1]][frontLocation[0]] = false;
                }
                else {
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = dataGrid[frontLocation[1]][frontLocation[0]] - 1;
                    dataGrid[frontLocation[1]][frontLocation[0]] -= 1;
                }
            }
            else if (frontId == AIR || push(frontLocation[0], frontLocation[1], rotationGrid[y][x], gridSize)) {
                nextIdGrid[frontLocation[1]][frontLocation[0]] = backId;
                nextRotationGrid[frontLocation[1]][frontLocation[0]] = rotationGrid[backLocation[1]][backLocation[0]];
                if (Array.isArray(dataGrid[backLocation[1]][backLocation[0]])) {
                    var data = [];
                    data.length = dataGrid[backLocation[1]][backLocation[0]].length;
                    for (var i in dataGrid[backLocation[1]][backLocation[0]]) {
                        data[i] = dataGrid[backLocation[1]][backLocation[0]][i];
                    }
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = data;
                }
                else {
                    nextDataGrid[frontLocation[1]][frontLocation[0]] = dataGrid[backLocation[1]][backLocation[0]];
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
        render: function(rotation, data, ctx) {
            if (rotation == 0) {
                ctx.fillStyle = colors[AIR];
                ctx.fillRect(0, 0, 6, 3);
                // ctx.fillStyle = colors[FAN][0];
                // ctx.fillRect(0, 3, 6, 3);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 2, 2, 1);
            }
            else if (rotation == 1) {
                ctx.fillStyle = colors[AIR];
                ctx.fillRect(3, 0, 3, 6);
                // ctx.fillStyle = colors[FAN][0];
                // ctx.fillRect(0, 0, 3, 6);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(3, 2, 1, 2);
            }
            else if (rotation == 2) {
                ctx.fillStyle = colors[AIR];
                ctx.fillRect(0, 3, 6, 3);
                // ctx.fillStyle = colors[FAN][0];
                // ctx.fillRect(0, 0, 6, 3);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 3, 2, 1);
            }
            else if (rotation == 3) {
                ctx.fillStyle = colors[AIR];
                ctx.fillRect(0, 0, 3, 6);
                // ctx.fillStyle = colors[FAN][0];
                // ctx.fillRect(3, 0, 3, 6);
                ctx.fillStyle = colors[FAN][3];
                ctx.fillRect(2, 2, 1, 2);
            }
            if (Math.floor(animationTick / 4) % 10 == 0 || Math.floor(animationTick / 4) % 10 == 4) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(2, 0, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(3, 0, 1, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 2, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 3, 2, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(3, 4, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(2, 4, 1, 2);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 3, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 2, 2, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 1 || Math.floor(animationTick / 4) % 10 == 3) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(1, 0, 2, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(3, 0, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 1, 2, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 3, 2, 2);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(3, 4, 2, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(1, 4, 2, 2);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 3, 2, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 1, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 2) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(2, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(3, 1, 1, 1);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(4, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(4, 3, 1, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(3, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(2, 4, 1, 1);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(1, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(1, 2, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 5 || Math.floor(animationTick / 4) % 10 == 9) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(3, 0, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(2, 0, 1, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 3, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 2, 2, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(2, 4, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(3, 4, 1, 2);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 2, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 3, 2, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 6 || Math.floor(animationTick / 4) % 10 == 8) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(3, 0, 2, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(1, 0, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 3, 2, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 1, 2, 2);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(1, 4, 2, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(3, 4, 2, 2);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 1, 2, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 3, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 7) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(3, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(2, 1, 1, 1);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(4, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(4, 2, 1, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(2, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(3, 4, 1, 1);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(1, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(1, 3, 1, 1);
                }
            }
            /*
            if (Math.floor(animationTick / 4) % 10 == 0 || Math.floor(animationTick / 4) % 10 == 4) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(2, 0, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(3, 0, 1, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 2, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 3, 2, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(3, 4, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(2, 4, 1, 2);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 3, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 2, 2, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 1 || Math.floor(animationTick / 4) % 10 == 3) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(1, 0, 1, 2);
                    ctx.fillRect(2, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 0, 1, 2);
                    ctx.fillRect(3, 1, 1, 1);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 1, 2, 1);
                    ctx.fillRect(4, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 2, 1);
                    ctx.fillRect(4, 3, 1, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 1, 2);
                    ctx.fillRect(3, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(1, 4, 1, 2);
                    ctx.fillRect(2, 4, 1, 1);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 4, 2, 1);
                    ctx.fillRect(1, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 1, 2, 1);
                    ctx.fillRect(1, 2, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 2) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(2, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(3, 1, 1, 1);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(4, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(4, 3, 1, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(3, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(2, 4, 1, 1);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(1, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(1, 2, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 5 || Math.floor(animationTick / 4) % 10 == 9) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(3, 0, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(2, 0, 1, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 3, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 2, 2, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(2, 4, 1, 2);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(3, 4, 1, 2);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 2, 2, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 3, 2, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 6 || Math.floor(animationTick / 4) % 10 == 8) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 0, 1, 2);
                    ctx.fillRect(3, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(1, 0, 1, 2);
                    ctx.fillRect(2, 1, 1, 1);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 2, 1);
                    ctx.fillRect(4, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 1, 2, 1);
                    ctx.fillRect(4, 2, 1, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(1, 4, 1, 2);
                    ctx.fillRect(2, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 1, 2);
                    ctx.fillRect(3, 4, 1, 1);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 1, 2, 1);
                    ctx.fillRect(1, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 4, 2, 1);
                    ctx.fillRect(1, 3, 1, 1);
                }
            }
            else if (Math.floor(animationTick / 4) % 10 == 7) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(3, 1, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(2, 1, 1, 1);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(4, 3, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillRect(4, 2, 1, 1);
                }
                else if (rotation == 2) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(2, 4, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillRect(3, 4, 1, 1);
                }
                else if (rotation == 3) {
                    ctx.fillStyle = colors[FAN][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillRect(1, 2, 1, 1);
                    ctx.fillStyle = colors[FAN][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillRect(1, 3, 1, 1);
                }
            }
            */
        },
        drawPreview: function(rotation, data, ctx) {
            if (rotation == 0) {
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
            else if (rotation == 1) {
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
            else if (rotation == 2) {
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
            else if (rotation == 3) {
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
            if (!isLocationInGrid(x, y, rotationGrid[y][x], 1)) {
                return;
            }
            var frontLocation = getLocation(x, y, rotationGrid[y][x], 1);
            if (nextIdGrid[frontLocation[1]][frontLocation[0]] != null) {
                return;
            }
            var frontId = idGrid[frontLocation[1]][frontLocation[0]];
            if (frontId == AIR || !canMove(frontLocation[0], frontLocation[1], frontId, rotationGrid[y][x])) {
                return;
            }
            push(frontLocation[0], frontLocation[1], rotationGrid[y][x], gridSize);
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
        render: function(rotation, data, ctx) {
            if (Math.floor(animationTick / 8) % 8 == 0) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 2, 2, 2);
                }
                else if (rotation == 1) {
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
                if (rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 4, 2, 2);
                }
                else if (rotation == 1) {
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
                if (rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(2, 4, 2, 2);
                }
                else if (rotation == 1) {
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
                if (rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 4, 2, 2);
                }
                else if (rotation == 1) {
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
                if (rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 2, 2, 2);
                }
                else if (rotation == 1) {
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
                if (rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(0, 0, 2, 2);
                }
                else if (rotation == 1) {
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
                if (rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(2, 0, 2, 2);
                }
                else if (rotation == 1) {
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
                if (rotation == 0) {
                    ctx.fillStyle = colors[ROTATOR][1];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][3];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[ROTATOR][4];
                    ctx.fillRect(4, 0, 2, 2);
                }
                else if (rotation == 1) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[ROTATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[ROTATOR][1];
            ctx.fillRect(0, 0, 2, 2);
            ctx.fillStyle = colors[ROTATOR][2];
            if (rotation == 0) {
                ctx.fillRect(0, 2, 2, 2);
            }
            else if (rotation == 1) {
                ctx.fillRect(2, 0, 2, 2);
            }
            ctx.fillStyle = colors[ROTATOR][3];
            ctx.fillRect(4, 4, 2, 2);
            ctx.fillStyle = colors[ROTATOR][4];
            if (rotation == 0) {
                ctx.fillRect(4, 2, 2, 2);
            }
            else if (rotation == 1) {
                ctx.fillRect(2, 4, 2, 2);
            }
        },
        update: function(x, y) {
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextIdGrid[y1][x1] == null && pixels[idGrid[y1][x1]].rotateable > 1 && idGrid[y1][x1] != ROTATOR && idGrid[y1][x1] != GRABBER_ROTATOR && idGrid[y1][x1] != DIRECTIONAL_ROTATOR) {
                    rotate(x1, y1);
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
        name: ["Grabber Rotator Clockwise", "Grabber Rotator Counterclockwise"],
        description: ["Grabs the 4 pixels around it and rotates them clockwise.", "Grabs the 4 pixels around it and rotates them counterclockwise."],
        type: "Mechanical Movement",
        drawBackground: 1,
        render: function(rotation, data, ctx) {
            if (Math.floor(animationTick / 8) % 8 == 0) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(4, 2, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(2, 4, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 1) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(4, 4, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(4, 4, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 2) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(2, 4, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(4, 2, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 3) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(0, 4, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(4, 0, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 4) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(0, 2, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(0, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(2, 0, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 5) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(0, 0, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(4, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(0, 0, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 6) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(2, 0, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(0, 2, 2, 2);
                }
            }
            else if (Math.floor(animationTick / 8) % 8 == 7) {
                if (rotation == 0) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(0, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(0, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(4, 2, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(4, 0, 2, 2);
                }
                else if (rotation == 1) {
                    ctx.fillStyle = colors[GRABBER_ROTATOR][1];
                    ctx.fillRect(2, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][2];
                    ctx.fillRect(4, 0, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][3];
                    ctx.fillRect(2, 4, 2, 2);
                    ctx.fillStyle = colors[GRABBER_ROTATOR][4];
                    ctx.fillRect(0, 4, 2, 2);
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[GRABBER_ROTATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[GRABBER_ROTATOR][1];
            ctx.fillRect(0, 0, 2, 2);
            ctx.fillStyle = colors[GRABBER_ROTATOR][2];
            if (rotation == 0) {
                ctx.fillRect(0, 2, 2, 2);
            }
            else if (rotation == 1) {
                ctx.fillRect(2, 0, 2, 2);
            }
            ctx.fillStyle = colors[GRABBER_ROTATOR][3];
            ctx.fillRect(4, 4, 2, 2);
            ctx.fillStyle = colors[GRABBER_ROTATOR][4];
            if (rotation == 0) {
                ctx.fillRect(4, 2, 2, 2);
            }
            else if (rotation == 1) {
                ctx.fillRect(2, 4, 2, 2);
            }
        },
        update: function(x, y) {
            if (x == 0 || x == gridSize - 1 || y == 0 || y == gridSize - 1) {
                return;
            }
            for (var i = 0; i < 4; i++) {
                var location = getLocation(x, y, i, 1);
                if (nextIdGrid[location[1]][location[0]] != null) {
                    return;
                }
            }
            for (var i = 0; i < 4; i++) {
                var location = getLocation(x, y, i, 1);
                if (pixels[idGrid[location[1]][location[0]]].pushable == false) {
                    continue;
                }
                if (idGrid[location[1]][location[0]] == GOAL && targetGrid[location[1]][location[0]] == 1) {
                    continue;
                }
                if (idGrid[location[1]][location[0]] == DELETER) {
                    continue;
                }
                var lastLocation = getLocation(x, y, (i + ((rotationGrid[y][x] == 0) ? 3 : 1)) % 4, 1);
                if (pixels[idGrid[lastLocation[1]][lastLocation[0]]].pushable == false) {
                    continue;
                }
                if (idGrid[lastLocation[1]][lastLocation[0]] == GOAL && targetGrid[lastLocation[1]][lastLocation[0]] == 1) {
                    continue;
                }
                if (idGrid[lastLocation[1]][lastLocation[0]] == DELETER || idGrid[lastLocation[1]][lastLocation[0]] == MONSTER || idGrid[lastLocation[1]][lastLocation[0]] == PIXELITE_CRYSTAL) {
                    continue;
                }
                if (idGrid[location[1]][location[0]] == MONSTER) {
                    if (idGrid[lastLocation[1]][lastLocation[0]] != AIR) {
                        nextIdGrid[location[1]][location[0]] = AIR;
                        nextFireGrid[location[1]][location[0]] = false;
                    }
                    continue;
                }
                if (idGrid[location[1]][location[0]] == PIXELITE_CRYSTAL) {
                    if (idGrid[lastLocation[1]][lastLocation[0]] != AIR) {
                        if (dataGrid[location[1]][location[0]] == 0) {
                            nextIdGrid[location[1]][location[0]] = AIR;
                            nextDataGrid[location[1]][location[0]] = 0;
                        }
                        else {
                            nextDataGrid[location[1]][location[0]] = dataGrid[location[1]][location[0]] - 1;
                            dataGrid[location[1]][location[0]] -= 1;
                        }
                    }
                    continue;
                }
                var rotation = rotationGrid[lastLocation[1]][lastLocation[0]];
                if (pixels[idGrid[lastLocation[1]][lastLocation[0]]].rotateable > 1 && idGrid[lastLocation[1]][lastLocation[0]] != ROTATOR && idGrid[lastLocation[1]][lastLocation[0]] != GRABBER_ROTATOR) {
                    rotation = (rotationGrid[lastLocation[1]][lastLocation[0]] + ((rotationGrid[y][x] == 0) ? 1 : 3)) % pixels[idGrid[lastLocation[1]][lastLocation[0]]].rotateable;
                }
                nextIdGrid[location[1]][location[0]] = idGrid[lastLocation[1]][lastLocation[0]];
                nextRotationGrid[location[1]][location[0]] = rotation;
                nextDataGrid[location[1]][location[0]] = dataGrid[lastLocation[1]][lastLocation[0]];
                nextFireGrid[location[1]][location[0]] = fireGrid[lastLocation[1]][lastLocation[0]];
            }
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[DIRECTIONAL_ROTATOR][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 3, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 3, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[DIRECTIONAL_ROTATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[DIRECTIONAL_ROTATOR][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            forAllTouching(x, y, 1, function(x1, y1) {
                if (nextIdGrid[y1][x1] == null && pixels[idGrid[y1][x1]].rotateable > 1 && idGrid[y1][x1] != ROTATOR && idGrid[y1][x1] != GRABBER_ROTATOR && idGrid[y1][x1] != DIRECTIONAL_ROTATOR) {
                    rotate(x1, y1);
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
        description: "Deletes pixels that are pushed into it.",
        type: "Mechanical Movement",
        drawBackground: 1,
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[DELETER][1];
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(1, 4, 1, 1);
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillRect(2, 2, 2, 2);
        },
        drawPreview: function(rotation, data, ctx) {
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
        name: ["Horizontal Slider", "Vertical Slider"],
        description: ["Can only be pushed and pulled horizontally.", "Can only be pushed and pulled vertically."],
        type: "Mechanical Movement",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[SLIDER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 6);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 6, 2);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[SLIDER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[SLIDER][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 6);
            }
            else if (rotation == 1) {
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
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[COLLAPSABLE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[COLLAPSABLE][2];
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillRect(3, 2, 1, 1);
            ctx.fillRect(2, 3, 1, 1);
            ctx.fillRect(1, 4, 1, 1);
        },
        drawPreview: function(rotation, data, ctx) {
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
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[GUNPOWDER]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouchingHeated(x, y, 1)) {
                explode(x, y, 4, 10, 20);
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = AIR;
                    nextFireGrid[y][x] = true;
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
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[DYNAMITE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[DYNAMITE][2];
            ctx.fillRect(2, 0, 2, 1);
            ctx.fillRect(0, 2, 1, 2);
            ctx.fillRect(2, 5, 2, 1);
            ctx.fillRect(5, 2, 1, 2);
        },
        drawPreview: function(rotation, data, ctx) {
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
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = AIR;
                    nextFireGrid[y][x] = true;
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
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[IGNITOR][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[IGNITOR][2];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 2);
            }
            else if (rotation == 1) {
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(3, 1, 2, 4);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 3, 4, 2);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 2, 4);
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[IGNITOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[IGNITOR][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[IGNITOR][2];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 1);
                ctx.fillRect(1, 1, 4, 2);
            }
            else if (rotation == 1) {
                ctx.fillRect(5, 2, 1, 2);
                ctx.fillRect(3, 1, 2, 4);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 5, 2, 1);
                ctx.fillRect(1, 3, 4, 2);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 1, 2);
                ctx.fillRect(1, 1, 2, 4);
            }
        },
        update: function(x, y) {
            if (isLocationInGrid(x, y, rotationGrid[y][x], 1)) {
                var location = getLocation(x, y, rotationGrid[y][x], 1);
                if (nextIdGrid[location[1]][location[0]] == null && fireGrid[location[1]][location[0]] == false) {
                    nextIdGrid[location[1]][location[0]] = idGrid[location[1]][location[0]];
                    nextFireGrid[location[1]][location[0]] = true;
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
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[LASER_EXPLOSIVE][1];
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillStyle = colors[LASER_EXPLOSIVE][2];
            ctx.fillRect(2, 0, 2, 1);
            ctx.fillRect(0, 2, 1, 2);
            ctx.fillRect(2, 5, 2, 1);
            ctx.fillRect(5, 2, 1, 2);
        },
        drawPreview: function(rotation, data, ctx) {
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
        // name: "10Pw Red Laser",
        // description: "This is a great idea... Explodes when lit on fire.",
        // name: ["Scanning Red Laser Up", "Scanning Red Laser Right", "Scanning Red Laser Down", "Scanning Red Laser Left"],
        name: ["500mw Red Laser Up", "500mw Red Laser Right", "500mw Red Laser Down", "500mw Red Laser Left"],
        description: "Fires a very weak laser beam capable of setting pixels on fire. Explodes when lit on fire.",
        // description: "Scans for the pixel behind it and removes it. Can scan through pixels. Explodes when lit on fire.",
        type: "Explosive Destruction",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[RED_LASER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 3, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 3, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
            }
            offscreenAboveCtx.fillStyle = colors[RED_LASER][3];
            for (var i in drawCallX1) {
                if (drawCallData[i] != 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        var x = j;
                        var y = drawCallY[i];
                        var direction = drawCallRotation[i];
                        for (var k = 0; k < drawCallData[i].length; k++) {
                            if (k != 0) {
                                direction = (direction + ((drawCallData[i][k] % 2 == 0) ? 1 : 3)) % 4;
                            }
                            var length = Math.floor(drawCallData[i][k] / 2);
                            if (direction == 0) {
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 4);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 5);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6 + 1);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 3, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 2, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 - 4);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6 - 5);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 + 1);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 2, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 3, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[RED_LASER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[RED_LASER][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            var fire = fireGrid[y][x];
            if (fire) {
                explode(x, y, 2, 5, 5);
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = AIR;
                    nextRotationGrid[y][x] = 0;
                    nextDataGrid[y][x] = 0;
                }
                return;
            }
            var path = laser(x, y, rotationGrid[y][x], function(x1, y1, direction) {
                if (nextIdGrid[y1][x1] != null) {
                    return false;
                }
                var id = idGrid[y1][x1];
                if (id == LASER_SCATTERER) {
                    return false;
                }
                if (id == LASER_TUNNEL) {
                    if (rotationGrid[y1][x1] == (direction + 1) % 2) {
                        return true;
                    }
                    return false;
                }
                if (id == LASER_EXPLOSIVE) {
                    explode(x1, y1, 5, 20, 20);
                    nextIdGrid[y1][x1] = AIR;
                    nextFireGrid[y1][x1] = true;
                    return true;
                }
                if (id == GLASS || id == REINFORCED_GLASS) {
                    return true;
                }
                if (id == PIXELITE_CRYSTAL) {
                    if (dataGrid[y1][x1] < 5) {
                        nextIdGrid[y1][x1] = AIR;
                        nextDataGrid[y1][x1] = 0;
                        return true;
                    }
                    else {
                        nextDataGrid[y1][x1] = dataGrid[y1][x1] - 5;
                        dataGrid[y1][x1] -= 5;
                        return false;
                    }
                }
                var setFire = fireGrid[y1][x1];
                if (getRandom(x, y) < pixels[id].flammability / 20) {
                    setFire = true;
                }
                if (pixels[id].blastResistance <= 5 && getRandom(x, y) < 0.05 - pixels[id].blastResistance / 480) {
                    nextIdGrid[y1][x1] = AIR;
                    nextRotationGrid[y1][x1] = 0;
                    nextDataGrid[y1][x1] = 0;
                    nextFireGrid[y1][x1] = setFire;
                    return true;
                }
                else if (setFire) {
                    if (x1 == x && y1 == y) {
                        fire = true;
                    }
                    else {
                        nextIdGrid[y1][x1] = id;
                        nextFireGrid[y1][x1] = setFire;
                    }
                }
                return false;
            });
            if (nextIdGrid[y][x] == null) {
                var redraw = false;
                if (dataGrid[y][x] == 0) {
                    redraw = true;
                }
                else if (dataGrid[y][x].length != path) {
                    redraw = true;
                }
                else {
                    for (var i = 0; i < path.length; i++) {
                        if (dataGrid[y][x][i] != path[i]) {
                            redraw = true;
                            break;
                        }
                    }
                }
                if (redraw) {
                    nextFireGrid[y][x] = fire;
                    nextDataGrid[y][x] = path;
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
        //     var path = laser(x, y, rotationGrid[y][x], function(x1, y1, direction) {
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
        //             nextGrid[y][x] = { id: RED_LASER, rotation: rotationGrid[y][x], onFire: onFire, data: path };
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
        name: ["1w Green Laser Up", "1w Green Laser Right", "1w Green Laser Down", "1w Green Laser Left"],
        description: "Fires a weak laser beam capable of destroying weak pixels and setting pixels on fire. Explodes when lit on fire.",
        type: "Explosive Destruction",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[GREEN_LASER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 3, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 3, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
            }
            offscreenAboveCtx.fillStyle = colors[GREEN_LASER][3];
            for (var i in drawCallX1) {
                if (drawCallData[i] != 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        var x = j;
                        var y = drawCallY[i];
                        var direction = drawCallRotation[i];
                        for (var k = 0; k < drawCallData[i].length; k++) {
                            if (k != 0) {
                                direction = (direction + ((drawCallData[i][k] % 2 == 0) ? 1 : 3)) % 4;
                            }
                            var length = Math.floor(drawCallData[i][k] / 2);
                            if (direction == 0) {
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 4);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 5);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6 + 1);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 3, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 2, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 - 4);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6 - 5);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 + 1);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 2, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 3, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[GREEN_LASER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[GREEN_LASER][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            var fire = fireGrid[y][x];
            if (fire) {
                explode(x, y, 2, 10, 10);
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = AIR;
                    nextRotationGrid[y][x] = 0;
                    nextDataGrid[y][x] = 0;
                }
                return;
            }
            var path = laser(x, y, rotationGrid[y][x], function(x1, y1, direction) {
                if (nextIdGrid[y1][x1] != null) {
                    return false;
                }
                var id = idGrid[y1][x1];
                if (id == LASER_SCATTERER) {
                    return false;
                }
                if (id == LASER_TUNNEL) {
                    if (rotationGrid[y1][x1] == (direction + 1) % 2) {
                        return true;
                    }
                    return false;
                }
                if (id == LASER_EXPLOSIVE) {
                    explode(x1, y1, 5, 20, 20);
                    nextIdGrid[y1][x1] = AIR;
                    nextFireGrid[y1][x1] = true;
                    return true;
                }
                if (id == GLASS || id == REINFORCED_GLASS) {
                    return true;
                }
                if (id == PIXELITE_CRYSTAL) {
                    if (dataGrid[y1][x1] < 10) {
                        nextIdGrid[y1][x1] = AIR;
                        nextDataGrid[y1][x1] = 0;
                        return true;
                    }
                    else {
                        nextDataGrid[y1][x1] = dataGrid[y1][x1] - 10;
                        dataGrid[y1][x1] -= 10;
                        return false;
                    }
                }
                var setFire = fireGrid[y1][x1];
                if (getRandom(x, y) < pixels[id].flammability / 120) {
                    setFire = true;
                }
                if (pixels[id].blastResistance <= 10 && getRandom(x, y) < 0.1 - pixels[id].blastResistance / 240) {
                    nextIdGrid[y1][x1] = AIR;
                    nextRotationGrid[y1][x1] = 0;
                    nextDataGrid[y1][x1] = 0;
                    nextFireGrid[y1][x1] = setFire;
                    return true;
                }
                else if (setFire) {
                    if (x1 == x && y1 == y) {
                        fire = true;
                    }
                    else {
                        nextIdGrid[y1][x1] = id;
                        nextFireGrid[y1][x1] = setFire;
                    }
                }
                return false;
            });
            if (nextIdGrid[y][x] == null) {
                var redraw = false;
                if (dataGrid[y][x] == 0) {
                    redraw = true;
                }
                else if (dataGrid[y][x].length != path) {
                    redraw = true;
                }
                else {
                    for (var i = 0; i < path.length; i++) {
                        if (dataGrid[y][x][i] != path[i]) {
                            redraw = true;
                            break;
                        }
                    }
                }
                if (redraw) {
                    nextFireGrid[y][x] = fire;
                    nextDataGrid[y][x] = path;
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[BLUE_LASER][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 3, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
                else if (drawCallRotation[i] == 2) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 3, 2, 3);
                    }
                }
                else if (drawCallRotation[i] == 3) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 3, 2);
                    }
                }
            }
            offscreenAboveCtx.fillStyle = colors[BLUE_LASER][3];
            for (var i in drawCallX1) {
                if (drawCallData[i] != 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        var x = j;
                        var y = drawCallY[i];
                        var direction = drawCallRotation[i];
                        for (var k = 0; k < drawCallData[i].length; k++) {
                            if (k != 0) {
                                direction = (direction + ((drawCallData[i][k] % 2 == 0) ? 1 : 3)) % 4;
                            }
                            var length = Math.floor(drawCallData[i][k] / 2);
                            if (direction == 0) {
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 4);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 1, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 1, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 5, 2, length * 6 - 5);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6 + 4, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 - length * 6, 2, length * 6 + 1);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 3, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 4, y * 6 + 2, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 6, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 3, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + length * 6 + 1, y * 6 + 2, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 5, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 - 4);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 4, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + 4, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 6, 2, length * 6 - 5);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 + 3, y * 6 + length * 6 + 1, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 + 2, y * 6 + 5, 2, length * 6 + 1);
                                        if (drawCallData[i][k] % 2 == 0) {
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
                                if (k != drawCallData[i].length - 1) {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 4, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 2, 1, 1);
                                        }
                                        else {
                                            offscreenAboveCtx.fillRect(x * 6 + 1, y * 6 + 3, 1, 1);
                                        }
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 5, y * 6 + 2, length * 6 - 5, 2);
                                    }
                                    if (drawCallData[i][k + 1] % 2 == 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 2, 1, 1);
                                    }
                                    else {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6 + 4, y * 6 + 3, 1, 1);
                                    }
                                }
                                else {
                                    if (k != 0) {
                                        offscreenAboveCtx.fillRect(x * 6 - length * 6, y * 6 + 2, length * 6 + 1, 2);
                                        if (drawCallData[i][k] % 2 == 0) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[BLUE_LASER][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[BLUE_LASER][1];
            if (rotation == 0) {
                ctx.fillRect(2, 0, 2, 3);
            }
            else if (rotation == 1) {
                ctx.fillRect(3, 2, 3, 2);
            }
            else if (rotation == 2) {
                ctx.fillRect(2, 3, 2, 3);
            }
            else if (rotation == 3) {
                ctx.fillRect(0, 2, 3, 2);
            }
        },
        update: function(x, y) {
            var fire = fireGrid[y][x];
            if (fire) {
                explode(x, y, 3, 20, 20);
                if (nextIdGrid[y][x] == null) {
                    nextIdGrid[y][x] = AIR;
                    nextRotationGrid[y][x] = 0;
                    nextDataGrid[y][x] = 0;
                }
                return;
            }
            var path = laser(x, y, rotationGrid[y][x], function(x1, y1, direction) {
                if (nextIdGrid[y1][x1] != null) {
                    return false;
                }
                var id = idGrid[y1][x1];
                if (id == LASER_SCATTERER) {
                    return false;
                }
                if (id == LASER_TUNNEL) {
                    if (rotationGrid[y1][x1] == (direction + 1) % 2) {
                        return true;
                    }
                    return false;
                }
                if (id == LASER_EXPLOSIVE) {
                    explode(x1, y1, 5, 20, 20);
                    nextIdGrid[y1][x1] = AIR;
                    nextFireGrid[y1][x1] = true;
                    return true;
                }
                if (id == GLASS || id == REINFORCED_GLASS) {
                    return true;
                }
                if (id == PIXELITE_CRYSTAL) {
                    if (dataGrid[y1][x1] < 20) {
                        nextIdGrid[y1][x1] = AIR;
                        nextDataGrid[y1][x1] = 0;
                        return true;
                    }
                    else {
                        nextDataGrid[y1][x1] = dataGrid[y1][x1] - 20;
                        dataGrid[y1][x1] -= 20;
                        return false;
                    }
                }
                var setFire = fireGrid[y1][x1];
                if (getRandom(x, y) < pixels[id].flammability / 20) {
                    setFire = true;
                }
                if (pixels[id].blastResistance <= 10 && getRandom(x, y) < 0.1 - pixels[id].blastResistance / 120) {
                    if (getRandom(x, y) < 0.25) {
                        explode(x1, y1, 2, 20, 5);
                    }
                    nextIdGrid[y1][x1] = AIR;
                    nextRotationGrid[y1][x1] = 0;
                    nextDataGrid[y1][x1] = 0;
                    nextFireGrid[y1][x1] = setFire;
                    return true;
                }
                else if (setFire) {
                    if (x1 == x && y1 == y) {
                        fire = true;
                    }
                    else {
                        nextIdGrid[y1][x1] = id;
                        nextFireGrid[y1][x1] = setFire;
                    }
                }
                return false;
            });
            if (nextIdGrid[y][x] == null) {
                var redraw = false;
                if (dataGrid[y][x] == 0) {
                    redraw = true;
                }
                else if (dataGrid[y][x].length != path) {
                    redraw = true;
                }
                else {
                    for (var i = 0; i < path.length; i++) {
                        if (dataGrid[y][x][i] != path[i]) {
                            redraw = true;
                            break;
                        }
                    }
                }
                if (redraw) {
                    nextFireGrid[y][x] = fire;
                    nextDataGrid[y][x] = path;
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
        name: "Mirror",
        description: "Reflects lasers.",
        type: "Explosive Destruction",
        drawBackground: 1,
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[MIRROR][1];
            if (rotation == 0) {
                ctx.fillRect(0, 0, 2, 2);
                ctx.fillRect(1, 1, 2, 2);
                ctx.fillRect(2, 2, 2, 2);
                ctx.fillRect(3, 3, 2, 2);
                ctx.fillRect(4, 4, 2, 2);
            }
            else if (rotation == 1) {
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
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[MIRROR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[MIRROR][1];
            if (rotation == 0) {
                ctx.fillRect(0, 0, 2, 2);
                ctx.fillRect(1, 1, 2, 2);
                ctx.fillRect(2, 2, 2, 2);
                ctx.fillRect(3, 3, 2, 2);
                ctx.fillRect(4, 4, 2, 2);
            }
            else if (rotation == 1) {
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[LASER_SCATTERER][1];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    ctx.fillRect(j * 6 + 1, drawCallY[i] * 6, 1, 6);
                    ctx.fillRect(j * 6 + 3, drawCallY[i] * 6, 1, 6);
                    ctx.fillRect(j * 6 + 5, drawCallY[i] * 6, 1, 6);
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
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
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            ctx.fillStyle = colors[LASER_TUNNEL][1];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 1, 6, 1);
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 5, 6, 1);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6, 1, 6);
                        ctx.fillRect(j * 6 + 5, drawCallY[i] * 6, 1, 6);
                    }
                }
            }
            ctx.fillStyle = colors[LASER_TUNNEL][2];
            for (var i in drawCallX1) {
                if (drawCallRotation[i] == 0) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6, drawCallY[i] * 6 + 2, 6, 2);
                    }
                }
                else if (drawCallRotation[i] == 1) {
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6, 2, 6);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[LASER_TUNNEL][0];
            ctx.fillRect(0, 0, 6, 6);
            if (rotation == 0) {
                ctx.fillStyle = colors[LASER_TUNNEL][1];
                ctx.fillRect(0, 1, 6, 1);
                ctx.fillRect(0, 5, 6, 1);
                ctx.fillStyle = colors[LASER_TUNNEL][2];
                ctx.fillRect(0, 2, 6, 2);
            }
            else if (rotation == 1) {
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
        name: "Red Sand",
        description: "An explosive, reddish powder. Very hydrophobic.",
        amountColor: "rgb(0, 0, 0)",
        type: "Explosive Destruction",
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[RED_SAND];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER) || isTouching(x, y, 1, MUD) || isTouching(x, y, 1, VINE) || isTouching(x, y, 1, MOSS) || isTouching(x, y, 1, STEAM) || isTouching(x, y, 1, SNOW) || isTouching(x, y, 1, ICE) || isTouching(x, y, 1, SLUSH) || isTouching(x, y, 1, IGNITOR)) {
                explode(x, y, 5, 20, 20);
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
        name: "Pink Sand",
        description: "Weird pink stuff that falls upwards.<br><i>Made with <a href='https://www.javascript.com/' target=_blank>Javascript</a></i>.",
        amountColor: "rgb(0, 0, 0)",
        type: "Explosive Destruction",
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[PINK_SAND];
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, SAND) || isTouching(x, y, 1, IGNITOR)) {
                explode(x, y, 40, 20, 20);
                return;
            }
            ascend(x, y, 1);
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
        name: "Spongy Rice",
        description: "Oh noes",
        amountColor: "rgb(0, 0, 0)",
        type: "Explosive Destruction",
        drawBackground: 2,
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colorToRGB(colors[SPONGY_RICE]);
            ctx.fillRect(0, 0, 6, 6);
        },
        update: function(x, y) {
            if (isTouching(x, y, 1, WATER) || isTouching(x, y, 1, MUD) || isTouching(x, y, 1, VINE) || isTouching(x, y, 1, MOSS) || isTouching(x, y, 1, STEAM) || isTouching(x, y, 1, SNOW) || isTouching(x, y, 1, ICE) || isTouching(x, y, 1, SLUSH)) {
                forEachTouching(x, y, 5, AIR, function(x1, y1) {
                    if (nextIdGrid[y1][x1] == null) {
                        if (getRandom(x, y) < 0.5) {
                            nextIdGrid[y1][x1] = WATER;
                        }
                        else {
                            nextIdGrid[y1][x1] = SPONGY_RICE;
                        }
                    }
                });
                forEachTouching(x, y, 5, WATER, function(x1, y1) {
                    if (nextIdGrid[y1][x1] == null) {
                        if (getRandom(x, y) < 0.5) {
                            nextIdGrid[y1][x1] = WATER;
                        }
                        else {
                            nextIdGrid[y1][x1] = SPONGY_RICE;
                        }
                    }
                });
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
        flammability: 20,
        blastResistance: 2,
    },
    {
        name: "",
        description: "Makes sounds when touched.",
        type: "Musical Notes",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            for (var i in drawCallX1) {
                if (Array.isArray(drawCallData[i])) {
                    ctx.fillStyle = colors[OSCILLATOR][Math.floor(drawCallData[i][0] / 37) * 2 + ((drawCallData[i][1] == 1) ? 4 : 3)];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 3, 4, 2);
                    }
                }
                else {
                    ctx.fillStyle = colors[OSCILLATOR][Math.floor(drawCallData[i] / 37) * 2 + 3];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 3, 4, 2);
                    }
                }
            }
            ctx.fillStyle = colors[OSCILLATOR][2];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 2, 2, 1);
                }
            }
            for (var i in drawCallX1) {
                if (Array.isArray(drawCallData[i])) {
                    ctx.fillStyle = colors[OSCILLATOR][drawCallData[i][0] % 37 + 13];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 4, 1);
                    }
                }
                else {
                    ctx.fillStyle = colors[OSCILLATOR][drawCallData[i] % 37 + 13];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 4, 1);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[OSCILLATOR][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[OSCILLATOR][Math.floor(data / 37) * 2 + 4];
            ctx.fillRect(1, 3, 4, 2);
            ctx.fillStyle = colors[OSCILLATOR][2];
            ctx.fillRect(2, 2, 2, 1);
            ctx.fillStyle = colors[OSCILLATOR][data % 37 + 13];
            ctx.fillRect(1, 1, 4, 1);
        },
        update: function(x, y) {
            var touching = false;
            forAllTouching(x, y, 1, function(x1, y1) {
                var id = idGrid[y1][x1];
                if (id != AIR && id != OSCILLATOR && id != OSCILLATOR_TUNER && id != DRUM) {
                    touching = true;
                }
            });
            var data = dataGrid[y][x];
            if (touching) {
                if (Array.isArray(data)) {
                    effects.oscillator.increase(Math.floor(data[0] / 37), data[0] % 37);
                }
                else {
                    effects.oscillator.increase(Math.floor(data / 37), data % 37);
                }
            }
            // else {
            //     if (Array.isArray(data)) {
            //         effects.oscillator.decrease(Math.floor(data[0] / 37), data[0] % 37);
            //     }
            //     else {
            //         effects.oscillator.decrease(Math.floor(data / 37), data % 37);
            //     }
            // }
            if (nextIdGrid[y][x] == null) {
                if (!Array.isArray(data)) {
                    nextIdGrid[y][x] = OSCILLATOR;
                    nextDataGrid[y][x] = [data, touching ? 1 : 0];
                }
                else if (data[1] != touching ? 1 : 0) {
                    nextIdGrid[y][x] = OSCILLATOR;
                    nextDataGrid[y][x] = [data[0], touching ? 1 : 0];
                }
            }
        },
        updateStage: 4,
        animationSpeed: 0,
        animationFrames: 1,
        dataFrames: 185,
        density: 3,
        pushable: true,
        rotateable: 1,
        cloneable: true,
        flammability: 0,
        blastResistance: 11,
    },
    {
        name: "Oscillator Tuner",
        description: "Tunes oscillators. (changing the frequency is 100% tuning it, even though all the oscillators are already in tune.)",
        type: "Musical Notes",
        drawBackground: 1,
        render: function(rotation, data, ctx) {
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
        drawPreview: function(rotation, data, ctx) {
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
                if (nextIdGrid[y1][x1] == null && idGrid[y1][x1] == OSCILLATOR) {
                    nextIdGrid[y1][x1] = OSCILLATOR;
                    var data = dataGrid[y1][x1];
                    if (Array.isArray(data)) {
                        nextDataGrid[y1][x1] = [Math.floor(data[0] / 37) * 37 + (data[0] % 37 + 1) % 36, data[1]];
                    }
                    else {
                        nextDataGrid[y1][x1] = Math.floor(data / 37) * 37 + (data % 37 + 1) % 36;
                    }
                }
                else if (nextIdGrid[y1][x1] == OSCILLATOR) {
                    var data = nextDataGrid[y1][x1];
                    if (Array.isArray(data)) {
                        nextDataGrid[y1][x1] = [Math.floor(data[0] / 37) * 37 + (data[0] % 37 + 1) % 36, data[1]];
                    }
                    else {
                        nextDataGrid[y1][x1] = Math.floor(data / 37) * 37 + (data % 37 + 1) % 36;
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
        flammability: 0,
        blastResistance: 11,
    },
    {
        name: [["Drum 1", "Drum 2", "Drum 3", "Drum 4", "Drum 5", "Drum 6", "Drum 7", "Drum 8", "Drum 9", "Drum 10", "Drum 11", "Drum 12"]],
        description: "Plays a funny drum sound that hurts your ears.",
        type: "Musical Notes",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            for (var i in drawCallX1) {
                if (Array.isArray(drawCallData[i])) {
                    ctx.fillStyle = colors[DRUM][(drawCallData[i][1] == 1 ? 2 : 1)];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 3, 4, 2);
                    }
                }
                else {
                    ctx.fillStyle = colors[DRUM][1];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 3, 4, 2);
                    }
                }
            }
            for (var i in drawCallX1) {
                if (Array.isArray(drawCallData[i])) {
                    ctx.fillStyle = colors[DRUM][(drawCallData[i][1] == 1 ? 4 : 3)];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 2, 2, 1);
                    }
                }
                else {
                    ctx.fillStyle = colors[DRUM][3];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 2, drawCallY[i] * 6 + 2, 2, 1);
                    }
                }
            }
            for (var i in drawCallX1) {
                if (Array.isArray(drawCallData[i])) {
                    ctx.fillStyle = colors[DRUM][drawCallData[i][0] + 5];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 4, 1);
                    }
                }
                else {
                    ctx.fillStyle = colors[DRUM][drawCallData[i] + 5];
                    for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                        ctx.fillRect(j * 6 + 1, drawCallY[i] * 6 + 1, 4, 1);
                    }
                }
            }
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[DRUM][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[DRUM][2];
            ctx.fillRect(1, 3, 4, 2);
            ctx.fillStyle = colors[DRUM][4];
            ctx.fillRect(2, 2, 2, 1);
            ctx.fillStyle = colors[DRUM][data + 5];
            ctx.fillRect(1, 1, 4, 1);
        },
        update: function(x, y) {
            var touching = false;
            forAllTouching(x, y, 1, function(x1, y1) {
                var id = idGrid[y1][x1];
                if (id != AIR && id != OSCILLATOR && id != OSCILLATOR_TUNER && id != DRUM) {
                    touching = true;
                }
            });
            var data = dataGrid[y][x];
            if (touching) {
                if (Array.isArray(data)) {
                    if (data[1] == 0) {
                        effects[`drum${(data[0] + 1)}`].play();
                    }
                }
                else {
                    effects[`drum${(data + 1)}`].play();
                }
            }
            if (nextIdGrid[y][x] == null) {
                if (!Array.isArray(data)) {
                    nextIdGrid[y][x] = DRUM;
                    nextDataGrid[y][x] = [data, touching ? 1 : 0];
                }
                else if (data[1] != touching ? 1 : 0) {
                    nextIdGrid[y][x] = DRUM;
                    nextDataGrid[y][x] = [data[0], touching ? 1 : 0];
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
        flammability: 0,
        blastResistance: 11,
    },
    {
        name: "Allow Placement",
        description: "Allows placement and removal of pixels in puzzles.",
        type: "Puzzle Construction",
        drawBackground: 0,
        drawPreview: function(rotation, data, ctx) {
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
        description: "Restricts placement and removal of pixels in puzzles.",
        type: "Puzzle Construction",
        drawBackground: 0,
        render: function(rotation, data, ctx) {
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
        drawPreview: function(rotation, data, ctx) {
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
        description: "Must be pushed into the target to finish the puzzle.",
        type: "Puzzle Construction",
        drawBackground: 1,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            offscreenAboveCtx.fillStyle = colors[GOAL][2];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    offscreenAboveCtx.fillRect(j * 6 - colors[GOAL][3] * 6, drawCallY[i] * 6 - colors[GOAL][3] * 6, 6 + colors[GOAL][3] * 12, 6 + colors[GOAL][3] * 12);
                }
            }
        },
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[GOAL][1];
            ctx.fillRect(1, 1, 4, 4);
        },
        drawPreview: function(rotation, data, ctx) {
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
        type: "Puzzle Construction",
        drawBackground: 0,
        draw: function(drawCallX1, drawCallX2, drawCallY, drawCallRotation, drawCallData, ctx) {
            offscreenAboveCtx.fillStyle = colors[TARGET][1];
            for (var i in drawCallX1) {
                for (var j = drawCallX1[i]; j < drawCallX2[i]; j++) {
                    offscreenAboveCtx.fillRect(j * 6 - colors[TARGET][2] * 6, drawCallY[i] * 6 - colors[TARGET][2] * 6, 6 + colors[TARGET][2] * 12, 6 + colors[TARGET][2] * 12);
                }
            }
        },
        render: function(rotation, data, ctx) {
            ctx.fillStyle = colors[TARGET][0];
            ctx.fillRect(0, 0, 6, 1);
            ctx.fillRect(0, 1, 1, 5);
            ctx.fillRect(1, 5, 5, 1);
            ctx.fillRect(5, 1, 1, 4);
        },
        drawPreview: function(rotation, data, ctx) {
            ctx.fillStyle = colors[TARGET][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colors[AIR];
            ctx.fillRect(1, 1, 4, 4);
        },
        update: function(x, y) {
        },
        updateStage: -1,
        animationSpeed: 1,
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
        description: "Can be destroyed with any pixel. All monsters need to be destroyed to finish the puzzle.",
        type: "Puzzle Construction",
        drawBackground: 1,
        render: function(rotation, data, ctx) {
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
        drawPreview: function(rotation, data, ctx) {
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
                if (idGrid[y + 1][x] != MONSTER) {
                    if (pixels[idGrid[y + 1][x]].density == -1) {
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
    {
        name: [["Pixelite Crystal (1)", "Pixelite Crystal (3)", "Pixelite Crystal (5)", "Pixelite Crystal (10)", "Pixelite Crystal (25)", "Pixelite Crystal (50)", "Pixelite Crystal (100)", "Pixelite Crystal (200)", "Pixelite Crystal (500)", "Pixelite Crystal (1000)"]],
        description: [["Can be destroyed with any pixel. Requires 1 hit to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 3 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 5 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 10 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 25 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 50 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 100 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 200 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 500 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!", "Can be destroyed with any pixel. Requires 1000 hits to destroy. Destroy all Pixelite Crystals to win Vault Wars!"]],
        type: "Multiplayer Madness",
        drawBackground: 1,
        render: function(rotation, data, ctx) {
            var transparencyFactor = data / 10 + 0.1;
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][1], 0.5 * transparencyFactor);
            ctx.fillRect(1, 0, 2, 1);
            ctx.fillRect(0, 1, 1, 2);
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][2], 0.5 * transparencyFactor);
            ctx.fillRect(3, 0, 2, 1);
            ctx.fillRect(5, 1, 1, 2);
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][3], 0.5 * transparencyFactor);
            ctx.fillRect(3, 5, 2, 1);
            ctx.fillRect(5, 3, 1, 2);
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][4], 0.5 * transparencyFactor);
            ctx.fillRect(1, 5, 2, 1);
            ctx.fillRect(0, 3, 1, 2);
            ctx.fillRect(1, 4, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][1], 0.75 * transparencyFactor);
            ctx.fillRect(0, 0, 1, 1);
            ctx.fillRect(2, 1, 1, 1);
            ctx.fillRect(1, 2, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][2], 0.75 * transparencyFactor);
            ctx.fillRect(5, 0, 1, 1);
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][3], 0.75 * transparencyFactor);
            ctx.fillRect(5, 5, 1, 1);
            ctx.fillRect(3, 4, 1, 1);
            ctx.fillRect(4, 3, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][4], 0.75 * transparencyFactor);
            ctx.fillRect(0, 5, 1, 1);
            ctx.fillRect(2, 4, 1, 1);
            ctx.fillRect(1, 3, 1, 1);
        },
        drawPreview: function(rotation, data, ctx) {
            var transparencyFactor = data / 10 + 0.1;
            ctx.fillStyle = colors[PIXELITE_CRYSTAL][0];
            ctx.fillRect(0, 0, 6, 6);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][1], 0.5 * transparencyFactor);
            ctx.fillRect(1, 0, 2, 1);
            ctx.fillRect(0, 1, 1, 2);
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][2], 0.5 * transparencyFactor);
            ctx.fillRect(3, 0, 2, 1);
            ctx.fillRect(5, 1, 1, 2);
            ctx.fillRect(4, 1, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][3], 0.5 * transparencyFactor);
            ctx.fillRect(3, 5, 2, 1);
            ctx.fillRect(5, 3, 1, 2);
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][4], 0.5 * transparencyFactor);
            ctx.fillRect(1, 5, 2, 1);
            ctx.fillRect(0, 3, 1, 2);
            ctx.fillRect(1, 4, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][1], 0.75 * transparencyFactor);
            ctx.fillRect(0, 0, 1, 1);
            ctx.fillRect(2, 1, 1, 1);
            ctx.fillRect(1, 2, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][2], 0.75 * transparencyFactor);
            ctx.fillRect(5, 0, 1, 1);
            ctx.fillRect(3, 1, 1, 1);
            ctx.fillRect(4, 2, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][3], 0.75 * transparencyFactor);
            ctx.fillRect(5, 5, 1, 1);
            ctx.fillRect(3, 4, 1, 1);
            ctx.fillRect(4, 3, 1, 1);
            ctx.fillStyle = colorToRGBTransparent(colors[PIXELITE_CRYSTAL][4], 0.75 * transparencyFactor);
            ctx.fillRect(0, 5, 1, 1);
            ctx.fillRect(2, 4, 1, 1);
            ctx.fillRect(1, 3, 1, 1);
        },
        update: function(x, y) {

        },
        updateStage: 1,
        animationSpeed: 2,
        animationFrames: 48,
        dataFrames: 10,
        density: -1,
        pushable: true,
        rotateable: 1,
        cloneable: false,
        flammability: 0,
        blastResistance: 2,
    },
];

for (var i = 0; i < pixelIds.length; i++) {
    eval(`${pixelIds[i]}=${i};`);
}

var oscillatorNames = [[]];
var oscillatorDescriptions = [[]];
var oscillatorTypes = ["Square", "Triangle", "Sawtooth", "Sine", "Custom 1"];
var oscillatorNotes = ["A3", "A#3/Bb3", "B3", "C4", "C#4/Db4", "D4", "D#4/Eb4", "E4", "F4", "F#4/Gb4", "G4", "G#4/Ab4", "A4", "A#4/Bb4", "B4", "C5", "C#5/Db5", "D5", "D#5/Eb5", "E5", "F5", "F#5/Gb5", "G5", "G#5/Ab5", "A5", "A#5/Bb5", "B5", "C6", "C#6/Db6", "D6", "D#6/Eb6", "E6", "F6", "F#6/Gb6", "G6", "G#6/Ab6", "A6"];

for (var i in oscillatorTypes) {
    for (var j in oscillatorNotes) {
        oscillatorNames[0].push(`${oscillatorTypes[i]} Oscillator ${oscillatorNotes[j]}`);
        oscillatorDescriptions[0].push(`Plays a funny ${oscillatorTypes[i]}  ${oscillatorNotes[j]} note that hurts your ears.`);
    }
}

pixels[OSCILLATOR].name = oscillatorNames;
pixels[OSCILLATOR].description = oscillatorDescriptions;

var pixsimToGame = [];
var gameToPixsim = [];
var pixsimToRotation = [];
for (var i = 0, j = 0; i < pixels.length; i++) {
    gameToPixsim.push(j);
    if (pixels[i].rotateable > 1) {
        for (var k = 0; k < pixels[i].rotateable; k++, j++) {
            pixsimToGame.push(i);
            pixsimToRotation.push(k);
        }
    } else {
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