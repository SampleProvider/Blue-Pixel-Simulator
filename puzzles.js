var currentGroup;
var currentPuzzle;

var loadPuzzle = async function(group, puzzle) {
    if (inPuzzleSelect) {
        var sandboxTools = document.getElementsByClassName("sandboxTool");
        for (var i = 0; i < sandboxTools.length; i++) {
            sandboxTools[i].style.display = "none";
        }
        var puzzleTools = document.getElementsByClassName("puzzleTool");
        for (var i = 0; i < puzzleTools.length; i++) {
            puzzleTools[i].style.display = "";
        }
        var gameTools = document.getElementsByClassName("gameTool");
        for (var i = 0; i < gameTools.length; i++) {
            gameTools[i].style.display = "none";
        }
        document.getElementById("puzzleSelect").style.transform = "translate(-50%, -85vh)";
        await showGameScreen();
        document.getElementById("puzzleSelect").style.visibility = "hidden";
        inPuzzleSelect = false;
    }
    else {
        await transition();
    }
    currentGroup = group;
    currentPuzzle = puzzle;
    loadPuzzleGrid(0);
    document.getElementById("puzzleTitle").innerHTML = `${group + 1}-${puzzle + 1}: ${puzzles[group].puzzles[puzzle].name}`;
    document.getElementById("puzzleDescription").innerHTML = puzzles[group].puzzles[puzzle].description;
    document.getElementById("sidebar").scrollTop = 0;
};
var loadPuzzleGrid = function(saveCode) {
    gameState = 1;
    loadGrid(puzzles[currentGroup].puzzles[currentPuzzle].saveCode);
    gameState = 2;
    brush.setInventory(puzzles[currentGroup].puzzles[currentPuzzle].inventory);
    if (saveCode == 0) {
        fetchGrid();
    }
    else if (saveCode != 1) {
        loadGrid(saveCode);
    }
    brush.resetPixel();
    resizeCanvas();
    camera.resetZoom();
    resetGrid();
};

// 1-2: gravitational forces
// 1-3: mudslide
// 1-4: under the bridge
// 1-5: forest fire
// 1-6: abandoned mine
// 1-7: rafting
// 1-8: floating islands
// 1-9: rafting revisited (plants)
// 1-10: the floor is lava
// 1-11: rafting revisited 2 (sponge with lava)
// 1-12: snowed in
// 1-13: rafting revisited 3 (ice)
// 1-14: rafting revisited 4 (lava)
// 1-15: 
// 1-8: basalt castle
// 1-9: ash invasion
// 1-11: hot air balloons

var puzzles = [
    {
        name: "A Pixel World",
        puzzles: [
            {
                name: "Blue Pixel Simulator",
                description: "Welcome to <b style='color: #6666ff'>Blue Pixel Simulator</b>! <b style='color: #6666ff'>Blue Pixel Simulator</b> is a sandbox/puzzle/multiplayer strategy game where you can simulate interactions of different <b>pixels</b>. <b>Pixels</b> are placed in a square grid, which you can see on the left side of your screen. Each square of the grid we will call <b>tiles</b>. Even though they are called <b>pixels</b>, a <b>pixel</b> is not actually just 1 solid color, and may be made of many. In puzzles, the goal is to destroy all the <b>monsters</b> (red <b>pixels</b>), and push all the <b>goals</b> (gold <b>pixels</b>) into the <b>targets</b> (cyan <b>pixels</b>). Various methods to do this will be shown in later puzzles. Don't worry about it for now.<br><br>There is no set difficulty curve to these puzzles, so feel free to skip puzzles. These puzzles are not meant to be solved easily, and your solutions are saved if you leave the tab.<br><br>The sidebar is on the right side of your screen. The top is the puzzle description, which you are reading right now. Underneath it, is the <b>Pixel Picker</b>. Here, you can see the pixels you have to beat a puzzle. Click on a pixel in the <b>Pixel Picker</b> to select it. Underneath the <b>Pixel Picker</b> is the pixel description, which gives you a description of the pixel, what it does, and various statistics about the pixel, like its <b>density</b>, <b>blast resistance</b>, and how <b>flammable</b> it is. At the very bottom are the control and navigation buttons. The buttons in the first row, from left to right, are <b>Run</b>, <b>Step</b>, <b>Simulate</b>, and <b>Reset</b>. In the second row are <b>Download</b>, <b>Upload</b>, <b>Restart</b>, and <b>Menu</b>. The rest are pretty self-explanatory.<br><br><b>Controls:</b><br><b>Left Click</b>: Place Pixels.<br><b>Right Click</b>: Remove Pixels.<br><b>Middle Click</b>: Pick Pixel. (Selects the pixel underneath the cursor.)<br><b>Scroll</b> or <b>Up/Down Arrows</b>: Change Click Size.<br><b>Alt+Click</b>: Line Brush<br><b>Ctrl+Scroll</b>: Zoom In/Out<br><b>W-A-S-D</b>: Move Camera.<br><b>Shift+Click</b>: Select Region. Use <b>Right Click</b> to cancel.<br><b>Ctrl+C</b>: Copy.<br><b>Ctrl+X</b>: Cut.<br><b>Ctrl+V</b>: Paste.<br><b>Q/E</b>: Rotate Selection<br><b>F/G</b>: Flip Selection<br>Click <b>Run</b> to continue.",
                inventory: {},
                saveCode: "20;AIR-4h:LEAF-3:AIR-g:LEAF-5:AIR-f:LEAF-2:OAK_WOOD:LEAF-2:AIR-g:LEAF:OAK_WOOD:LEAF:AIR-h:OAK_WOOD:AIR-j:OAK_WOOD:AIR-h:SAND:GRASS:DIRT:GRASS:AIR-f:MONSTER:SAND:DIRT-2:MUD:WATER-e:SAND-2:DIRT-4:MUD-6:WATER-7:MUD:SAND:DIRT-b:MUD-7:DIRT-18:0-b4:0-b4:0-b4:1-b4:0-b4:",
            },
            {
                name: "Gravitational Forces",
                description: "Most <b>pixels</b> in <b style='color: #6666ff'>Blue Pixel Simulator</b> follow gravity. Dirt, sand, and water all will fall downwards, and some are more stable than others. Dirt and grass fall downwards unless there are at least 4 pixels touching them. Sand falls and likes to make hills. Water will always try to reach the lowest elevation.<br><br><b>Placing Pixels</b>: The shaded square is where the pixel will be placed. In sandbox mode, you can place and remove <b>pixels</b> anywhere and also while the simulation is running. In puzzles, you have a limited amount of <b>pixels</b>, and may not place or remove once the simulation has started. Clicking <b>Reset</b> will reset the simulation back to before it started. In puzzles, you can only place and remove on the lighter <b>tiles</b>.<br><br><b>Destroying Monsters</b>: If a <b>pixel</b> falls onto a <b>monster</b>, both the falling <b>pixel</b> and the monster get disintegrated. Using the given <b>pixels</b>, place them on the lighter <b>tiles</b> and destroy all the <b>monsters</b> to win!",
                inventory: {
                    DIRT: [[2]],
                    GRASS: [[1]],
                    SAND: [[5]],
                    WATER: [[1]],
                },
                saveCode: "40;AIR-k0:LEAF-2:AIR-4:LEAF-3:AIR-r:LEAF-3:AIR:LEAF-3:AIR-2:LEAF-5:AIR-3:LEAF-3:AIR-b:LEAF-3:AIR-5:LEAF-5:OAK_WOOD:LEAF-2:AIR-2:LEAF-2:OAK_WOOD:LEAF-2:AIR-2:LEAF-5:AIR-9:LEAF-5:AIR-4:LEAF-2:OAK_WOOD:LEAF-2:OAK_WOOD:LEAF:AIR-4:LEAF:OAK_WOOD:LEAF:AIR-3:LEAF-2:OAK_WOOD:LEAF-2:AIR-9:LEAF-2:OAK_WOOD:LEAF-2:AIR-5:LEAF:OAK_WOOD:LEAF:AIR:OAK_WOOD:AIR-6:OAK_WOOD:AIR-5:LEAF:OAK_WOOD:LEAF:AIR-b:LEAF:OAK_WOOD:LEAF:AIR-7:OAK_WOOD:AIR-2:OAK_WOOD:AIR-6:OAK_WOOD:AIR-6:OAK_WOOD:AIR-d:OAK_WOOD:AIR-8:OAK_WOOD:AIR-2:OAK_WOOD:AIR-5:OAK_WOOD:AIR-7:OAK_WOOD:AIR-e:OAK_WOOD:AIR-7:OAK_WOOD:AIR-2:OAK_WOOD:AIR-3:MONSTER:AIR:OAK_WOOD:AIR-7:OAK_WOOD:AIR-e:OAK_WOOD:AIR-8:OAK_WOOD:AIR:OAK_WOOD:AIR-2:GRASS:DIRT:GRASS:DIRT:GRASS-5:AIR-2:OAK_WOOD:AIR-6:MONSTER:AIR-7:OAK_WOOD:MONSTER:AIR-3:MONSTER:GRASS-3:DIRT:GRASS:DIRT:MONSTER:GRASS:DIRT-9:GRASS:MONSTER:DIRT:GRASS:MONSTER:GRASS-4:DIRT:GRASS-6:MONSTER:DIRT:MONSTER:GRASS-3:DIRT-8a:STONE-c:DIRT-f:STONE:DIRT-4:STONE-q:DIRT-6:STONE-3g:0-18g:0-18g:0-18g:0-k0:1-9:0-r:1-ng:0-18g:",
            },
            {
                name: "Mudslide",
                description: "Oh no! There are 5 <b>monsters</b> and you only have 4 <b>pixels</b>! Don't you just hate when you are given an impossible puzzle? Wait, that dirt cliff doesn't look very stable though... maybe you could turn it into mud...",
                inventory: {
                    SAND: [[1]],
                    WATER: [[3]],
                },
                saveCode: "40;AIR-gv:LEAF:AIR-w:SAND-4:AIR-2:LEAF:OAK_WOOD:AIR:LEAF:AIR-u:DIRT-2:SAND-4:AIR-2:OAK_WOOD:LEAF:AIR-u:DIRT-5:SAND-2:AIR:OAK_WOOD:AIR-s:LEAF-2:AIR:DIRT-7:SAND:OAK_WOOD:AIR-r:LEAF:OAK_WOOD:AIR-2:DIRT-9:SAND:AIR-s:OAK_WOOD:AIR:DIRT-b:AIR-r:OAK_WOOD:SAND:DIRT-c:AIR-p:SAND-2:DIRT-e:AIR-n:DIRT-h:AIR-m:DIRT-i:AIR-l:DIRT-k:AIR-k:DIRT-l:AIR-i:DIRT-m:AIR-i:DIRT-m:AIR-i:DIRT-n:AIR-g:DIRT-p:AIR-4:MONSTER:AIR:MONSTER:AIR-6:DIRT-a:STONE-2:DIRT-h:AIR:MONSTER:OAK_WOOD-4:MONSTER:AIR:MONSTER:DIRT-a:STONE-9:DIRT-d:OAK_WOOD:DIRT-h:STONE-a:DIRT-t:STONE-d:DIRT-q:STONE-g:DIRT-o:STONE-h:DIRT-l:STONE-k:DIRT-h:STONE-q:DIRT-9:STONE-e:0-18g:0-18g:0-18g:0-gv:1:0-w:1-4:0-2:1-2:0:1:0-u:1-a:0-u:1-a:0-r:1-nf:0-18g:",
            },
            {
                name: "Under The Bridge",
                description: "Look at this cool bridge! Oh, it's so high up! I would hate to have to go down there. Wait, is there a <b>monster</b> hiding in that corner? Well, I'm not going down, so I guess it's your job to destroy it.",
                inventory: {
                    DIRT: [[8]],
                    SAND: [[12]],
                },
                saveCode: "40;AIR-3f:LEAF-3:AIR-10:LEAF-5:AIR-s:LEAF-3:AIR-4:LEAF-2:OAK_WOOD:LEAF-2:AIR-r:LEAF-5:AIR-4:LEAF:OAK_WOOD:LEAF:AIR-s:LEAF-2:OAK_WOOD:LEAF-2:AIR-5:OAK_WOOD:AIR-a:OAK_WOOD:AIR-9:OAK_WOOD:AIR-9:LEAF:OAK_WOOD:LEAF:AIR-6:OAK_WOOD:AIR-9:OAK_WOOD-3:AIR-7:OAK_WOOD-3:AIR-9:OAK_WOOD:AIR-6:OAK_WOOD:AIR-9:OAK_WOOD:AIR:OAK_WOOD:AIR:OAK_WOOD-2:AIR-3:OAK_WOOD-2:AIR:OAK_WOOD:AIR:OAK_WOOD:AIR-7:OAK_WOOD:AIR-7:OAK_WOOD:AIR-7:OAK_WOOD-2:AIR-2:OAK_WOOD:AIR-3:OAK_WOOD-3:AIR-3:OAK_WOOD:AIR-2:OAK_WOOD-2:AIR-5:OAK_WOOD:AIR-4:GRASS-3:DIRT:GRASS-3:AIR-2:OAK_WOOD-2:AIR-4:OAK_WOOD:AIR-9:OAK_WOOD:AIR-4:OAK_WOOD-2:AIR-3:OAK_WOOD:AIR-4:DIRT-7:GRASS:OAK_WOOD-p:GRASS-2:DIRT:GRASS-3:AIR:DIRT-b:AIR-j:DIRT-9:GRASS:DIRT-b:AIR-j:STONE:DIRT-j:STONE:AIR-j:STONE-2:DIRT-h:STONE:AIR-l:STONE:DIRT-g:STONE-2:AIR-l:STONE-2:DIRT-f:STONE:AIR-n:STONE:DIRT-e:STONE-2:AIR-n:STONE:DIRT-e:STONE-2:AIR-n:STONE-2:DIRT-c:STONE-3:AIR-n:STONE-2:DIRT-c:STONE-2:AIR-o:STONE-3:DIRT-b:STONE-2:AIR-p:STONE-2:DIRT-b:STONE-2:AIR-p:STONE-2:DIRT-b:STONE-2:AIR-p:STONE:DIRT-c:STONE:MONSTER:AIR-p:STONE:DIRT-d:STONE:WATER-p:STONE-2:DIRT-5:STONE:DIRT-6:STONE-2:WATER-n:STONE-5:DIRT-2:STONE-5:DIRT-2:STONE-4:WATER-m:STONE-j:WATER-k:STONE-l:WATER-i:STONE-m:WATER-h:STONE-o:WATER-f:STONE-r:WATER-8:STONE-61:0-18g:0-18g:0-18g:0-3f:1-3:0-10:1-5:0-s:1-3:0-4:1-5:0-r:1-5:0-4:1-3:0-s:1-5:0-5:1:0-u:1-3:0-6:1:0-9:1:0-b:1:0-9:1:0-6:1:0-9:1-2:0-b:1-2:0-7:1:0-7:1:0-7:1-4:0-b:1-4:0-5:1:0-4:1-7:0-2:1-6:0-b:1-6:0-3:1:0-4:1-f:0-b:1-d:0:1-u0:0-18g:",
            },
            {
                name: "Forest Fire",
                description: "Looks like the <b>monsters</b> are evolving! They have built houses to protect them from falling <b>pixels</b>! I guess there's only one way to break in. Let's burn the houses down!",
                inventory: {
                    LAVA: [[1]],
                },
                saveCode: "40;AIR-k2:LEAF-3:AIR-v:LEAF-3:AIR-2:LEAF-5:AIR-a:LEAF-3:AIR-g:LEAF-5:AIR:LEAF-2:OAK_WOOD:LEAF-2:AIR-9:LEAF-5:AIR-f:LEAF-2:OAK_WOOD:LEAF-2:AIR-2:LEAF:OAK_WOOD:LEAF:AIR-3:OAK_WOOD-3:AIR-4:LEAF-2:OAK_WOOD:LEAF-2:AIR-4:OAK_WOOD-5:AIR-7:LEAF:OAK_WOOD:LEAF:AIR-4:OAK_WOOD:AIR-3:OAK_WOOD-2:AIR:OAK_WOOD-2:AIR-4:LEAF:OAK_WOOD:LEAF:AIR-4:OAK_WOOD-2:AIR-3:OAK_WOOD-2:AIR-7:OAK_WOOD:AIR-5:OAK_WOOD:AIR-2:OAK_WOOD-2:AIR-3:OAK_WOOD-2:AIR-4:OAK_WOOD:AIR-4:OAK_WOOD-2:AIR-5:OAK_WOOD-2:AIR-6:OAK_WOOD:AIR-4:OAK_WOOD:AIR-4:OAK_WOOD:AIR-3:OAK_WOOD:AIR-4:OAK_WOOD:AIR-6:OAK_WOOD:AIR-5:OAK_WOOD:AIR-7:OAK_WOOD:AIR-4:OAK_WOOD:AIR-4:OAK_WOOD:AIR:MONSTER-2:OAK_WOOD:AIR-4:OAK_WOOD:AIR-6:OAK_WOOD:AIR-5:OAK_WOOD:AIR-7:OAK_WOOD:AIR-2:GRASS-2:DIRT:GRASS-4:OAK_WOOD-5:GRASS-2:AIR-2:OAK_WOOD:AIR-6:OAK_WOOD:MONSTER:AIR-2:MONSTER:AIR:OAK_WOOD:AIR-3:GRASS-4:DIRT:GRASS-2:DIRT-e:GRASS-2:DIRT:GRASS-6:OAK_WOOD-7:GRASS-3:DIRT-6v:STONE-5:DIRT-x:STONE-b:DIRT-a:STONE-8:DIRT-a:STONE-4j:0-18g:0-18g:0-18g:0-k0:1-5:0-v:1-ng:0-18g:",
            },
            {
                name: "Abandoned Mine",
                description: "Look! There are <b>monsters</b> mining here for precious resources! They seem pretty safe down there, it's a shame they built their mineshaft out of oak wood.<br><br>When <b>fire</b> burns <b>pixels</b>, it can transform them into different <b>pixels</b>. Water transforms into <b>steam</b>, and most flammable pixels will turn into <b>ash</b>.",
                inventory: {
                    SAND: [[1]],
                    WATER: [[5]],
                    OAK_WOOD: [[15]],
                    LEAF: [[4]],
                },
                saveCode: "40;AIR-49:OAK_WOOD-2:AIR-11:OAK_WOOD-4:AIR-29:GRASS-3:AIR-v:GRASS:OAK_WOOD:AIR-2:OAK_WOOD:GRASS:DIRT-3:AIR-t:GRASS-2:DIRT:OAK_WOOD:AIR-2:OAK_WOOD:DIRT-4:AIR-r:GRASS-2:DIRT-3:OAK_WOOD:AIR-2:OAK_WOOD:DIRT-4:AIR-p:GRASS-2:DIRT-5:OAK_WOOD:AIR-2:OAK_WOOD:DIRT-4:AIR-o:GRASS:DIRT-7:OAK_WOOD:AIR-2:OAK_WOOD:DIRT-4:AIR-n:GRASS:DIRT-8:OAK_WOOD:AIR-2:OAK_WOOD:DIRT:STONE-3:AIR-m:GRASS:DIRT-9:OAK_WOOD:AIR-2:OAK_WOOD:STONE-4:AIR-l:GRASS:DIRT-a:OAK_WOOD:AIR-2:OAK_WOOD:STONE-4:AIR-l:DIRT-a:STONE:OAK_WOOD:AIR-2:OAK_WOOD:STONE-4:AIR-l:DIRT-9:STONE-2:OAK_WOOD:AIR-2:OAK_WOOD:STONE-4:AIR-k:GRASS:DIRT-8:OAK_WOOD-4:AIR-2:OAK_WOOD-5:AIR-k:DIRT-7:STONE-2:OAK_WOOD:AIR-u:DIRT-6:STONE-3:OAK_WOOD:MONSTER:AIR-6:MONSTER:AIR:MONSTER:AIR-j:GRASS:DIRT-6:STONE-3:OAK_WOOD-4:AIR-2:OAK_WOOD-5:AIR-j:DIRT-6:STONE-7:OAK_WOOD:AIR-2:OAK_WOOD:STONE-4:AIR-i:GRASS:DIRT-6:STONE-7:OAK_WOOD:AIR-2:OAK_WOOD:STONE:BASALT-3:AIR-f:STONE:GRASS-2:DIRT-7:STONE-7:OAK_WOOD:AIR-2:OAK_WOOD:BASALT-4:STONE:AIR-c:STONE-2:DIRT-9:STONE-8:OAK_WOOD:AIR-2:OAK_WOOD:BASALT-4:STONE:BASALT:LAVA-a:BASALT:STONE-2:DIRT-8:STONE-2:OAK_WOOD-8:AIR-2:OAK_WOOD-5:STONE-2:BASALT-2:LAVA-7:BASALT-2:STONE:DIRT-8:STONE-3:OAK_WOOD:AIR-e:DIRT:STONE-2:BASALT-2:LAVA-6:BASALT:STONE:DIRT-7:STONE-5:OAK_WOOD:AIR:MONSTER:AIR-5:MONSTER:AIR-5:MONSTER:DIRT-2:STONE-3:BASALT-2:LAVA-3:BASALT:STONE-2:DIRT-5:STONE-7:OAK_WOOD-5:AIR-2:OAK_WOOD-4:AIR-2:OAK_WOOD-2:DIRT-4:STONE-2:BASALT-4:STONE-2:DIRT-5:STONE-c:OAK_WOOD:AIR-2:OAK_WOOD:BASALT-2:OAK_WOOD:AIR-2:OAK_WOOD:BASALT:DIRT-6:STONE-4:DIRT-5:STONE-e:OAK_WOOD:AIR-2:OAK_WOOD:BASALT-2:OAK_WOOD:AIR-2:OAK_WOOD:BASALT:DIRT-e:STONE-f:OAK_WOOD:AIR-2:OAK_WOOD:BASALT-2:OAK_WOOD:AIR-2:OAK_WOOD:BASALT:DIRT-d:STONE-g:OAK_WOOD:AIR-2:OAK_WOOD:BASALT-2:OAK_WOOD:AIR-2:OAK_WOOD:BASALT:DIRT-c:STONE-d:OAK_WOOD-5:AIR-2:OAK_WOOD:BASALT-2:OAK_WOOD:AIR-2:OAK_WOOD-2:DIRT-8:STONE-h:OAK_WOOD:AIR-6:OAK_WOOD:BASALT-2:OAK_WOOD:AIR-4:DIRT-2:STONE-n:OAK_WOOD:AIR-2:MONSTER:AIR-2:MONSTER:OAK_WOOD:BASALT-2:OAK_WOOD:AIR-2:MONSTER:AIR:STONE-p:OAK_WOOD-8:BASALT-2:OAK_WOOD:AIR-2:OAK_WOOD-2:STONE-q:BASALT-9:OAK_WOOD:AIR-2:OAK_WOOD:BASALT:STONE-p:BASALT-a:OAK_WOOD:AIR-2:OAK_WOOD:BASALT:STONE-k:BASALT-f:OAK_WOOD:AIR-2:OAK_WOOD:BASALT:0-18g:0-18g:0-18g:0-49:1-2:0-11:1-4:0-29:1-3:0-v:1-9:0-t:1-b:0-r:1-xp:0-18g:",
            },
            {
                name: "Rafting",
                description: "The <b>monsters</b> have built a raft and sailed to sea! Try to destroy them while they are still on their raft! Oh, and that <b>ash</b> you have, it will harden when touching water.",
                inventory: {
                    SAND: [[1]],
                    WATER: [[7]],
                    OAK_WOOD: [[5]],
                    ASH: [[8]],
                },
                saveCode: "40;AIR-t4:MONSTER:AIR:MONSTER-2:AIR-3:MONSTER:AIR-w:OAK_WOOD-9:AIR-n:WATER-8:OAK_WOOD-9:WATER-cv:0-18g:0-18g:0-18g:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-m8:0-18g:",
            },
            {
                name: "Floating Islands",
                description: "Whew! It sure is nice to take a break for a while and visit the <b>Aether</b>! Good luck destroying the <b>monsters</b> with this limited set of <b>pixels</b>!",
                inventory: {
                    DIRT: [[6]],
                    SAND: [[5]],
                    OAK_WOOD: [[4]],
                },
                saveCode: "40;AIR-h:LEAF-5:AIR-z:LEAF-2:OAK_WOOD:LEAF-2:AIR-10:LEAF:OAK_WOOD:LEAF:AIR-12:OAK_WOOD:AIR-12:OAK_WOOD:AIR-13:OAK_WOOD:GRASS-2:AIR-y:GRASS-3:DIRT-3:GRASS:AIR-x:STONE:DIRT-6:GRASS:AIR-w:STONE-2:DIRT-6:AIR-y:STONE-2:DIRT-2:STONE-2:AIR-j:LEAF-3:AIR-d:STONE-4:AIR-9:LEAF-3:AIR-7:LEAF-5:AIR-a:STONE:AIR:STONE-3:AIR-9:LEAF-5:AIR-6:LEAF-2:OAK_WOOD:LEAF-2:AIR-a:STONE:AIR-2:STONE-2:AIR:STONE:AIR-7:LEAF-2:OAK_WOOD:LEAF-2:AIR-7:LEAF:OAK_WOOD:LEAF:AIR-e:STONE:AIR-b:LEAF:OAK_WOOD:LEAF:AIR-9:OAK_WOOD:AIR-s:OAK_WOOD:AIR-a:OAK_WOOD:AIR-e:STONE:AIR-c:OAK_WOOD:AIR-8:MONSTER-2:AIR:OAK_WOOD:AIR-q:MONSTER:OAK_WOOD:AIR-8:GRASS-3:DIRT:GRASS-2:AIR:MONSTER:AIR-j:GRASS-4:DIRT:MONSTER:SAND:WATER-6:DIRT-6:GRASS-5:AIR-c:GRASS-4:DIRT-6:SAND-3:WATER-4:STONE-2:DIRT-9:AIR-4:MONSTER:LEAF-3:AIR-4:DIRT-b:SAND-6:AIR:STONE-4:DIRT-5:STONE:AIR-4:LEAF-5:AIR-3:STONE:DIRT-f:SAND:AIR-3:STONE-3:DIRT-2:STONE-2:AIR-5:LEAF-2:OAK_WOOD:LEAF-2:AIR-4:STONE-3:DIRT-6:STONE-4:DIRT-3:AIR-4:STONE-2:DIRT:STONE-2:AIR-7:LEAF:OAK_WOOD:LEAF:AIR-7:STONE-2:DIRT-4:STONE-6:DIRT-2:AIR-2:STONE:AIR:STONE-4:AIR-9:OAK_WOOD:AIR-6:STONE:AIR-2:STONE-2:DIRT:STONE-4:AIR-2:STONE-2:DIRT:STONE:AIR-2:STONE:AIR-2:STONE-3:AIR-a:OAK_WOOD:AIR-5:STONE:AIR-2:STONE-6:AIR-4:STONE-3:AIR-5:STONE-2:AIR-2:STONE:AIR-8:OAK_WOOD:AIR-6:STONE:AIR-2:STONE-3:AIR-3:STONE:AIR-2:STONE-2:AIR-7:STONE:AIR-8:GRASS-3:DIRT:GRASS:AIR:MONSTER:AIR-7:STONE-2:AIR-2:STONE-2:AIR-3:STONE:AIR-5:STONE:AIR-a:STONE:DIRT-4:GRASS-2:AIR-5:STONE:AIR:STONE:AIR-8:STONE:AIR-8:STONE:AIR-8:STONE:DIRT-4:STONE:AIR-7:STONE:AIR-6:STONE:AIR-j:STONE:DIRT-3:STONE:AIR-a:STONE:AIR-7:STONE:AIR-g:STONE-2:DIRT:STONE:AIR-3:STONE:AIR-4:STONE:AIR-s:STONE-3:AIR:MONSTER:STONE:AIR-w:STONE:AIR:STONE-2:AIR-2:STONE:AIR-10:STONE:AIR-11:STONE:AIR-16:STONE:AIR-50:0-18g:0-18g:0-18g:0-h:1-5:0-z:1-5:0-10:1-3:0-12:1:0-12:1:0-13:1-3:0-y:1-7:0-x:1-8:0-w:1-8:0-w:1-8:0-h:1-5:0-a:1-8:0-8:1-w:0-7:1-ve:0-18g:",
            },
            {
                name: "Rafting Revisited",
                description: "Oh no! The <b>monsters</b> reinforced their raft with stone and a cabin! This might be a tough one, just remember that the <b>moss</b> you have will grow on ash and stone.",
                inventory: {
                    OAK_WOOD: [[6]],
                    MOSS: [[1]],
                    ASH: [[35]],
                    STONE: [[3]],
                },
                saveCode: "40;AIR-qy:STONE-5:AIR-y:STONE-3:AIR:STONE-3:AIR-x:MONSTER:STONE:AIR:MONSTER-2:STONE:AIR:MONSTER:AIR-v:STONE-9:AIR-n:WATER-8:STONE-9:WATER-cv:0-18g:0-18g:0-18g:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-m8:0-18g:",
            },
            {
                name: "Canyon Climb",
                description: "Oh no! Looks like we're stuck down here in a canyon, and all the <b>monsters</b> have escaped! How do we get up there? Maybe if there was something we could burn with that lava...",
                inventory: {
                    VINE: [[2]],
                    GLASS: [[5]],
                },
                saveCode: "40;AIR-3x:LEAF-3:AIR-c:LEAF-3:AIR-l:LEAF-5:AIR-a:LEAF-5:AIR-k:LEAF-2:OAK_WOOD:LEAF-2:AIR-3:OAK_WOOD-5:AIR-2:LEAF-2:OAK_WOOD:LEAF-2:AIR-l:LEAF:OAK_WOOD:LEAF:AIR-3:OAK_WOOD-7:AIR-2:LEAF:OAK_WOOD:LEAF:AIR-n:OAK_WOOD:AIR-3:OAK_WOOD-3:AIR-3:OAK_WOOD-3:AIR-2:OAK_WOOD:AIR-n:OAK_WOOD:AIR-5:OAK_WOOD:AIR-5:OAK_WOOD:AIR-3:OAK_WOOD:AIR-n:OAK_WOOD:AIR-5:OAK_WOOD:AIR-3:MONSTER:AIR:OAK_WOOD:AIR-3:OAK_WOOD:AIR-k:GRASS-2:AIR:OAK_WOOD:AIR:GRASS-4:OAK_WOOD:MONSTER:AIR:MONSTER-2:AIR:OAK_WOOD:AIR-2:GRASS:DIRT:GRASS-2:AIR-f:STONE-2:GRASS:DIRT-2:GRASS:DIRT:GRASS:DIRT-4:OAK_WOOD-7:GRASS-2:DIRT-4:AIR-g:STONE-2:DIRT-m:AIR-g:STONE-4:DIRT-k:AIR-h:STONE-5:DIRT-i:AIR-i:STONE-5:DIRT-h:AIR-j:STONE-5:DIRT-g:AIR-k:STONE-5:DIRT-f:AIR-k:STONE-6:DIRT-e:AIR-l:STONE-5:DIRT-e:AIR-l:STONE-6:DIRT-d:AIR-m:STONE-5:DIRT-d:AIR-n:STONE-5:DIRT-c:AIR-n:STONE-6:DIRT-b:AIR-n:STONE-6:DIRT-b:AIR-n:STONE-6:DIRT-b:AIR-9:BASALT-2:AIR-d:STONE-6:DIRT-a:AIR-a:BASALT-2:AIR-b:ASH:STONE-6:DIRT-a:BASALT:AIR-9:BASALT-2:CONCRETE:ASH-3:AIR-4:ASH-4:STONE-8:DIRT-8:BASALT-2:LAVA-8:BASALT-2:STONE-2:CONCRETE:ASH-6:CONCRETE-2:STONE-b:DIRT-6:STONE:BASALT-3:LAVA-5:BASALT-3:STONE-4:CONCRETE-5:STONE-g:DIRT:STONE-5:BASALT-2:LAVA-4:BASALT-2:STONE-x:BASALT-6:STONE-11:BASALT-2:STONE-3p:BASALT-b:STONE-7:BASALT-3:STONE-e:BASALT-m:STONE:BASALT-8:STONE-6:BASALT-1u:0-18g:0-18g:0-18g:1-or:0-c:1-s:0-c:1-s:0-c:1-s:0-c:1-s:0-d:1-s:0-b:1-x:0-4:1-cs:0-18g:",
            },
            {
                name: "The Floor Is Lava",
                description: "Aaa! The floor is lava! Oh, sneaky. That monster hid in a cave to escape from the lava. How can we get the water over the lava? Oh, by the way, that <b>glass</b> you have is very heat resistant.",
                inventory: {
                    SAND: [[6]],
                    OAK_WOOD: [[3]],
                    GLASS: [[32]],
                    BASALT: [[2]],
                },
                saveCode: "40;AIR-oh:BASALT-2:AIR-11:BASALT-5:AIR-z:BASALT-2:AIR-2:BASALT-2:AIR-y:BASALT:AIR-12:WATER:BASALT:MONSTER:BASALT-4:AIR-6:BASALT-5:AIR-5:BASALT-5:AIR-8:BASALT-c:LAVA-6:BASALT-3:LAVA-7:BASALT-3:LAVA-8:BASALT-d:LAVA-r:BASALT-e:LAVA-p:BASALT-g:LAVA-m:BASALT-j:LAVA-j:BASALT-o:LAVA-f:BASALT-r:LAVA-9:BASALT-74:0-18g:0-18g:0-18g:0-m8:1-m8:0-18g:",
            },
            {
                name: "Rafting Revisited 2",
                description: "Is this even a raft? It's more like a submarine! At least we have <b>sponges</b> now. Look, if you lose that sponge, I'm going to be so mad. Those sponges can suck up NaN™ pixels of water! It cost me $49,999™! No, it's not my fault I had to buy later, you took too long to solve these puzzles!",
                inventory: {
                    OAK_WOOD: [[5]],
                    MOSS: [[1]],
                    SPONGE: [[1]],
                    GLASS: [[2]],
                    LAVA: [[1]],
                    ASH: [[25]],
                    CONCRETE_POWDER: [[75]],
                    BASALT: [[15]],
                },
                saveCode: "40;AIR-t8:OAK_WOOD-2:AIR-12:OAK_WOOD:AIR-r:WATER-c:OAK_WOOD:WATER-13:OAK_WOOD:WATER-10:OAK_WOOD-7:WATER-w:OAK_WOOD-2:BASALT-5:OAK_WOOD-2:WATER-v:OAK_WOOD:BASALT-2:AIR-3:BASALT-2:OAK_WOOD:WATER-v:OAK_WOOD:BASALT-2:AIR:MONSTER-2:BASALT-2:OAK_WOOD:WATER-v:OAK_WOOD-2:BASALT-5:OAK_WOOD-2:WATER-w:OAK_WOOD-7:WATER-54:0-18g:0-18g:0-18g:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-m8:0-18g:",
            },
            {
                name: "Snowed In",
                description: "Cool! It snowed! Snow melts easily with enough water or lava. It can be a good way to protect your wooden house. It seems like this is what the <b>monsters</b> living here have done. Is there any way in?",
                inventory: {
                    OAK_WOOD: [[2]],
                    WATER: [[8]],
                    LAVA: [[1]],
                },
                saveCode: "40;AIR-e5:LEAF:AIR-12:LEAF:SPRUCE_WOOD:LEAF:AIR-12:SPRUCE_WOOD:AIR-11:LEAF-2:SPRUCE_WOOD:LEAF-2:AIR-10:LEAF:SPRUCE_WOOD:LEAF:AIR-z:LEAF-3:SPRUCE_WOOD:LEAF-3:AIR-y:LEAF-2:SPRUCE_WOOD:LEAF-2:AIR-x:LEAF-4:SPRUCE_WOOD:LEAF-4:AIR-w:LEAF-3:SPRUCE_WOOD:LEAF-3:AIR-v:LEAF-5:SPRUCE_WOOD:LEAF-5:AIR-c:SNOW-7:AIR-d:LEAF-2:SPRUCE_WOOD:LEAF-2:AIR-e:SNOW:SPRUCE_WOOD-7:SNOW:AIR-5:SNOW-2:AIR-7:SPRUCE_WOOD:AIR-g:SPRUCE_WOOD-2:AIR-5:SPRUCE_WOOD-2:AIR-5:SPRUCE_WOOD-2:SNOW-2:AIR-5:SPRUCE_WOOD:AIR-3:SNOW-7:AIR-7:SPRUCE_WOOD:AIR-5:SPRUCE_WOOD:AIR-2:SNOW-4:AIR:SPRUCE_WOOD-3:SNOW-4:AIR:SPRUCE_WOOD:AIR:SNOW-9:AIR-4:SNOW-3:SPRUCE_WOOD:AIR-5:SPRUCE_WOOD:SNOW-7:SPRUCE_WOOD:AIR-2:SPRUCE_WOOD-2:SNOW-3:SPRUCE_WOOD:SNOW-3:DIRT-7:AIR-2:SNOW-5:SPRUCE_WOOD:MONSTER:AIR:MONSTER-2:AIR:SPRUCE_WOOD:SNOW-2:DIRT-4:SNOW:SPRUCE_WOOD:AIR-2:SPRUCE_WOOD:SNOW:DIRT-e:SNOW-4:DIRT-3:SPRUCE_WOOD-7:DIRT-q:SNOW-2:DIRT-6a:STONE-9:DIRT-p:STONE-n:DIRT-c:STONE-3z:0-18g:0-18g:0-18g:0-e5:1:0-12:1-3:0-12:1:0-a:1-rs:0-18g:",
            },
            {
                name: "Rafting Revisited 3",
                description: "Brr... It's chilly here! The lake the <b>monsters</b> usually go through froze! We need to destroy them before they escape their raft! That lava will definitely be useful, just don't make it hit the ice.",
                inventory: {
                    SAND: [[6]],
                    MUD: [[1]],
                    DRIED_MUD: [[6]],
                    LAVA: [[1]],
                },
                saveCode: "40;AIR-pv:OAK_WOOD-3:AIR-z:OAK_WOOD-7:AIR-y:OAK_WOOD:AIR-3:OAK_WOOD:AIR-y:MONSTER:OAK_WOOD:MONSTER-2:AIR:OAK_WOOD:MONSTER:AIR-w:OAK_WOOD-9:AIR-n:ICE-8:OAK_WOOD-9:ICE-cv:0-18g:0-18g:0-18g:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-m8:0-18g:",
            },
            {
                name: "Rafting Revisited 4",
                description: "Oh no! Seems like the <b>monsters</b> have built a basalt raft to sail on a pool of lava! This should be similar to Rafting Revisited, except how do we get the moss over the lava?",
                inventory: {
                    OAK_WOOD: [[8]],
                    SAND: [[8]],
                    WATER: [[32]],
                    DRIED_MUD: [[32]],
                    MOSS: [[1]],
                    CONCRETE_POWDER: [[40]],
                    STONE: [[32]],
                },
                saveCode: "40;AIR-px:MONSTER:AIR-10:BASALT-5:AIR-y:BASALT-3:AIR:BASALT-3:AIR-w:MONSTER:AIR:BASALT:MONSTER:AIR:MONSTER:BASALT:MONSTER:AIR-w:BASALT-9:AIR-n:LAVA-8:BASALT-9:LAVA-cv:0-18g:0-18g:0-18g:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-k:0-k:1-m8:0-18g:",
            },
        ],
    },
    {
        name: "Mechanical Movement",
        puzzles: [
            {
                name: "Pushy Pushers",
                description: "Well, this puzzle name is kinda redundant... I couldn't think of a better name. Anyways, these <b>pushers</b> will push anything in their path, ignoring gravity! They can only be stopped by <b>obsidian</b>.",
                inventory: {
                    OBSIDIAN: [[1]],
                    PUSHER: [[1], [5], [7], [4]],
                },
                saveCode: "40;OBSIDIAN:AIR-2:OBSIDIAN-12:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-11:WATER:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN-u:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:SAND:AIR-3:OBSIDIAN:AIR-e:OBSIDIAN:AIR-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:SAND-2:AIR-2:OBSIDIAN:AIR-e:OBSIDIAN:AIR-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:SAND-4:OBSIDIAN:AIR-e:OBSIDIAN:AIR-7:OBSIDIAN-2:AIR-a:OAK_WOOD-6:AIR-e:OBSIDIAN:AIR-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:AIR-4:OBSIDIAN-b:AIR-4:OBSIDIAN:WATER-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:AIR-4:OBSIDIAN:AIR-4:OBSIDIAN:AIR-4:OBSIDIAN:AIR-4:OBSIDIAN:WATER-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:AIR-9:OAK_WOOD:AIR-3:MONSTER:OBSIDIAN:AIR-4:OBSIDIAN:WATER-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:AIR-9:OAK_WOOD:AIR-3:MONSTER:OBSIDIAN:AIR-4:OBSIDIAN:WATER-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:AIR-4:OBSIDIAN:AIR-4:OBSIDIAN:SAND:AIR-2:OAK_WOOD:OBSIDIAN:AIR-4:OBSIDIAN:WATER-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:AIR-4:OBSIDIAN-2:AIR-2:OBSIDIAN-3:AIR-2:OBSIDIAN-2:AIR-4:OBSIDIAN:WATER-7:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-7:OBSIDIAN:AIR-4:OBSIDIAN:AIR-4:OBSIDIAN:AIR-4:OBSIDIAN:AIR-4:OBSIDIAN:WATER-7:OBSIDIAN-2:AIR-a:OBSIDIAN:AIR-4:OBSIDIAN:AIR-e:OBSIDIAN:WATER-7:OBSIDIAN-2:AIR-9:SAND:OBSIDIAN:AIR-4:OBSIDIAN:AIR-e:OBSIDIAN:SAND-2:WATER-5:OBSIDIAN-2:AIR-5:SAND:AIR:SAND-3:OBSIDIAN:AIR-4:OBSIDIAN:AIR-2:MONSTER:AIR:OBSIDIAN:AIR:MONSTER:AIR:MONSTER:OBSIDIAN:AIR-4:OBSIDIAN:SAND-3:WATER-4:OBSIDIAN-2:AIR-2:OBSIDIAN-9:AIR-4:OBSIDIAN-b:AIR-4:OBSIDIAN-5:OAK_WOOD-3:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-5:OBSIDIAN-3:AIR-4:OBSIDIAN-b:AIR-4:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-5:OBSIDIAN:AIR-p:OBSIDIAN:AIR-3:OBSIDIAN-2:MONSTER:AIR:OBSIDIAN:AIR-5:OBSIDIAN:AIR-8:SAND:AIR-g:OBSIDIAN:AIR-3:OBSIDIAN-2:MONSTER-2:OBSIDIAN:AIR-5:OBSIDIAN:AIR:MONSTER:AIR-5:SAND-3:AIR-f:OBSIDIAN:AIR-3:OBSIDIAN-5:AIR-5:OBSIDIAN-3:AIR-4:OBSIDIAN-b:AIR-4:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN:AIR-z:OBSIDIAN:AIR-3:OBSIDIAN:AIR-j:SAND-2:AIR-e:OBSIDIAN:AIR-3:OBSIDIAN:AIR:MONSTER:AIR-4:MONSTER-2:AIR-9:SAND-5:AIR-d:OBSIDIAN:AIR-3:OBSIDIAN-d:AIR-4:OBSIDIAN-k:AIR-3:OBSIDIAN-2:AIR-a:OBSIDIAN:AIR-4:OBSIDIAN:AIR-m:OBSIDIAN-2:AIR-a:OBSIDIAN:AIR-4:OBSIDIAN:AIR-m:OBSIDIAN-2:AIR-8:MONSTER:AIR:OBSIDIAN:AIR-4:OBSIDIAN:AIR-m:OBSIDIAN-2:AIR-5:OBSIDIAN-6:AIR-4:OBSIDIAN:AIR-3:OBSIDIAN-l:AIR-5:OBSIDIAN:AIR-4:OBSIDIAN:AIR:MONSTER:AIR-2:OBSIDIAN:AIR-k:MONSTER:AIR:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR:MONSTER:AIR-2:OBSIDIAN:MONSTER-2:AIR-2:OBSIDIAN:AIR-j:MONSTER-3:OBSIDIAN-2:AIR-7:MONSTER:AIR-2:OBSIDIAN:MONSTER-4:OBSIDIAN:AIR-h:MONSTER-5:OBSIDIAN-15:0-18g:0-18g:0-18g:1-15:0-12:1-2:0-12:1-2:0-11:1-3:0-2:1-1i:0-e:1-q:0-e:1-q:0-e:1-q:0-e:1-1u:0-4:1:0-4:1-v:0-4:1:0-3:1-w:0-4:1:0-3:1-w:0-4:1-2:0-2:1-x:0-2:1-11:0-4:1-10:0-4:1-10:0-4:1-10:0-2:1:0:1-53:0-5:1-z:0-5:1-7:0-j:1-9:0-5:1-7:0-2:1:0-g:1-9:0-5:1-7:0:1-3:0-f:1-9:0-5:1-i:0-4:1:0-3:1-l:0-j:1-l:0-3:1-2:0-e:1-l:0:1-5:0-d:1-1a:0-4:1-10:0-4:1-10:0-4:1-10:0-4:1-10:0-4:1-10:0-4:1-10:0-4:1-23:0-18g:",
            },
            {
                name: "Spinny Rotator",
                description: "These <b>gray</b> and <b>cyan</b> pixels can rotate their surrounding pixels. The animated rotators rotate clockwise or counterclockwise based on their animation, while the other ones rotate all pixels to face the same direction as them. Keep in mind that rotators update before pushers, this can be useful for calculating where the pusher will go.",
                inventory: {
                    OAK_WOOD: [[1]],
                    PUSHER: [[9], [-1], [-1], [-1]],
                    ROTATOR: [[1], [2]],
                    DIRECTIONAL_ROTATOR: [[2], [-1], [-1], [-1]],
                },
                saveCode: "40;OBSIDIAN-15:AIR:DIRECTIONAL_ROTATOR:AIR-y:DIRECTIONAL_ROTATOR:AIR:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-3:OBSIDIAN-w:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-4:DIRECTIONAL_ROTATOR:AIR-k:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-2:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-q:OBSIDIAN:MONSTER:AIR:MONSTER:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-g:OBSIDIAN-8:AIR-2:OBSIDIAN-3:ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-g:OBSIDIAN:DIRECTIONAL_ROTATOR:AIR-c:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-g:OBSIDIAN:AIR-d:MONSTER:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-g:OBSIDIAN:AIR-2:OBSIDIAN-5:AIR-2:OBSIDIAN-3:ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-g:OBSIDIAN:AIR-2:OBSIDIAN:AIR-9:MONSTER:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-g:OBSIDIAN:AIR-2:OBSIDIAN:DIRECTIONAL_ROTATOR:AIR-8:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-b:DIRECTIONAL_ROTATOR:AIR-4:OBSIDIAN:AIR-2:OBSIDIAN-5:AIR-2:OBSIDIAN-5:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-g:OBSIDIAN:AIR-2:OBSIDIAN:AIR-2:ROTATOR:OBSIDIAN:AIR-2:OBSIDIAN:AIR-2:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:ROTATOR:OBSIDIAN-2:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR:OBSIDIAN-6:AIR-2:OBSIDIAN:AIR-a:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:DIRECTIONAL_ROTATOR:AIR-8:OBSIDIAN:AIR:MONSTER:AIR-7:OBSIDIAN:AIR-3:OBSIDIAN:AIR-2:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-9:OBSIDIAN:AIR:OBSIDIAN:AIR-7:OBSIDIAN:AIR-3:OBSIDIAN:AIR-2:OBSIDIAN:ROTATOR:AIR-2:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-9:OBSIDIAN:AIR:MONSTER:AIR-7:OBSIDIAN:ROTATOR:AIR-5:MONSTER:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-4:OBSIDIAN-3:AIR-2:OBSIDIAN:AIR:OBSIDIAN:AIR:OBSIDIAN:AIR-5:OBSIDIAN:AIR-3:PUSHER:AIR-2:MONSTER:AIR:DIRECTIONAL_ROTATOR:AIR:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-4:OBSIDIAN:ROTATOR:OBSIDIAN:AIR-2:OBSIDIAN:AIR:OBSIDIAN:AIR:ROTATOR:AIR-5:OBSIDIAN:AIR:ROTATOR:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-2:OBSIDIAN:ROTATOR:AIR-2:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-4:OBSIDIAN:AIR-4:OBSIDIAN-3:AIR-2:OBSIDIAN-a:AIR-2:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-4:OBSIDIAN:STONE:OBSIDIAN:AIR:ROTATOR:DIRECTIONAL_ROTATOR:AIR-7:ROTATOR:AIR-8:OBSIDIAN:AIR-2:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-4:OBSIDIAN:STONE:OBSIDIAN:AIR-2:OBSIDIAN:AIR-g:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:ROTATOR:AIR-2:DIRECTIONAL_ROTATOR:OBSIDIAN:STONE:OBSIDIAN:AIR-2:OBSIDIAN:AIR-g:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN-6:OAK_WOOD:OBSIDIAN-4:AIR-4:OBSIDIAN:AIR-b:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:STONE-5:OAK_WOOD:STONE-3:OBSIDIAN:AIR-4:OBSIDIAN:AIR-b:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:STONE-5:OAK_WOOD:STONE:MOSS:STONE:OBSIDIAN:AIR-4:OBSIDIAN:AIR-b:OBSIDIAN-5:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:STONE-5:OAK_WOOD:STONE-3:OBSIDIAN:AIR-4:OBSIDIAN:AIR-2:DIRECTIONAL_ROTATOR:AIR-5:OBSIDIAN:DIRECTIONAL_ROTATOR:AIR-4:PUSHER:AIR-4:OBSIDIAN-2:AIR-3:OBSIDIAN:BASALT-3:OBSIDIAN-2:OAK_WOOD:OBSIDIAN-4:AIR-4:OBSIDIAN:AIR-2:OBSIDIAN:AIR-5:OBSIDIAN:ROTATOR:AIR-3:PUSHER:AIR-5:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN:AIR:OAK_WOOD:AIR-8:OBSIDIAN:AIR-2:OBSIDIAN:AIR-5:OBSIDIAN:AIR-3:PUSHER:AIR-6:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN:AIR-a:OBSIDIAN:AIR-2:OBSIDIAN:AIR-5:OBSIDIAN:AIR-2:OBSIDIAN:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-3:OBSIDIAN:AIR-a:OBSIDIAN:AIR-2:OBSIDIAN-7:AIR-2:OBSIDIAN:AIR-2:MONSTER:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:MONSTER-2:AIR:OBSIDIAN:MONSTER:AIR-9:OBSIDIAN:AIR-b:OBSIDIAN:AIR:MONSTER-2:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:MONSTER-3:OBSIDIAN:MONSTER:AIR-7:ROTATOR:AIR:OBSIDIAN:DIRECTIONAL_ROTATOR:AIR-9:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR:MONSTER-2:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN-s:OAK_WOOD-3:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-y:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-y:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-2:DIRECTIONAL_ROTATOR:AIR-9:MONSTER:AIR-l:OBSIDIAN:AIR-3:OBSIDIAN-x:AIR-3:OBSIDIAN-5:0-16:2:0-y:3:0-3m:2-2:0-k:3:0-3:3:0-27:1:0-r:1:0-4i:1:0-8:3:0-l:3:0-13:3:0-a:1:0-6:3:0-d:3:0-4:2:0-v:1:0-27:1:0-1q:2:0-4:3:0-g:1:0-f:1-2:0-h:2-2:0-4:2:1:0-15:2-2:0-5:1-2:0-1t:3:0-3w:1:0-w:1:0-a:3-2:0-y:1:0:3-4:0-a:2-3:0:2:0:2-4:0-g:3-2:0:3:0-a:2-3:0:2-6:0-u:2-3:0:2-6:0-f:3:0-j:2-5:0-z:2-5:0-9:2:0-5:3:0-2j:1:0-14:1:0-24:0-18g:0-18g:1-5u:0-6:1-x:0-7:1-x:0-7:1-x:0-7:1-x:0-7:1-x:0-7:1-x:0-7:1-x:0-7:1-x:0-7:1-x:0-7:1-13:0:1-13:0:1:0-7:1-v:0:1:0-7:1-v:0:1:0-7:1-v:0:1:0:1:0-5:1-v:0:1:0:1:0-5:1-4o:0-3:1-11:0-3:1-11:0-3:1-s:0-5:1-z:0-5:1-z:0-5:1-z:0-5:1-z:0-5:1-5o:0-3:1:0-3:1-x:0-3:1:0-3:1-x:0-3:1:0-3:1:0-9:1-v:0-18g:",
            },
            {
                name: "Minigame Area",
                description: "Look at how many tasks you have to do to destroy all the <b>monsters</b>! I wonder if an optimal solution for all the minigames is needed... Hopefully you have enough pixels. Those <b>green</b> pixels are called <b>pullers</b>, they pull pixels behind them. Oh, and they can't push, so they just stop if they hit anything.",
                inventory: {
                    OAK_WOOD: [[17]],
                    PUSHER: [[10], [5], [2], [3]],
                    PULLER: [[-1], [3], [3], [5]],
                    DIRECTIONAL_ROTATOR: [[-1], [1], [2], [1]],
                },
                saveCode: "40;OBSIDIAN-15:AIR-4:MONSTER:OBSIDIAN:AIR-5:OBSIDIAN:AIR-q:OBSIDIAN-2:MONSTER:AIR-2:MONSTER-2:OBSIDIAN:WATER-5:OBSIDIAN:GRASS-2:AIR-m:OAK_WOOD:WATER:OBSIDIAN-2:MONSTER-2:AIR:MONSTER-2:OBSIDIAN:WATER-5:OBSIDIAN:DIRT-2:GRASS-2:AIR-c:OBSIDIAN:AIR:OBSIDIAN-a:OAK_WOOD-5:OBSIDIAN:OAK_WOOD-5:OBSIDIAN-8:AIR-9:OBSIDIAN:AIR-9:OBSIDIAN-2:AIR-d:STONE:AIR-3:STONE:OBSIDIAN:AIR-9:OBSIDIAN-7:AIR-2:SAND:OBSIDIAN-2:AIR-d:STONE:LAVA-3:STONE:OBSIDIAN:AIR-9:OBSIDIAN:AIR-5:OBSIDIAN:MONSTER:SAND-2:OBSIDIAN-2:AIR-2:DIRECTIONAL_ROTATOR:AIR-a:STONE:LAVA-3:STONE:OBSIDIAN:AIR-9:OBSIDIAN:AIR-5:OBSIDIAN-6:MOSS:AIR-c:STONE-5:OBSIDIAN:AIR-9:OBSIDIAN:AIR-5:OBSIDIAN:AIR:DIRECTIONAL_ROTATOR:AIR:OBSIDIAN-8:AIR-c:OBSIDIAN:AIR-9:OBSIDIAN:AIR-5:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-3:OBSIDIAN:AIR-e:OBSIDIAN:AIR-9:OBSIDIAN:AIR-5:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-2:OBSIDIAN:AIR-f:OBSIDIAN:AIR-f:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR:OBSIDIAN:AIR-g:OBSIDIAN:AIR-f:OBSIDIAN:AIR-3:OBSIDIAN-3:AIR-h:OBSIDIAN:AIR-f:OBSIDIAN:AIR-2:PUSHER:OBSIDIAN-2:AIR-i:OBSIDIAN:AIR-f:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-i:OBSIDIAN:AIR-f:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-i:OBSIDIAN:AIR-9:OBSIDIAN:AIR-5:OBSIDIAN:AIR-3:OBSIDIAN-2:AIR-i:OBSIDIAN:SAND-2:AIR-5:SAND:AIR:OBSIDIAN:AIR-5:OBSIDIAN:MONSTER:DIRECTIONAL_ROTATOR:AIR:OBSIDIAN-2:AIR-i:OBSIDIAN:SAND-3:MONSTER:AIR:SAND-4:OBSIDIAN:AIR-4:OBSIDIAN-4:AIR:OBSIDIAN-2:AIR-i:OBSIDIAN:SAND-9:OBSIDIAN:AIR-4:OBSIDIAN:AIR-3:ROTATOR:OBSIDIAN-2:AIR-i:OBSIDIAN:SAND-9:OBSIDIAN:AIR-9:OBSIDIAN-2:AIR-i:OBSIDIAN-b:AIR-9:OBSIDIAN-2:AIR-i:OBSIDIAN-3:DIRECTIONAL_ROTATOR-5:OBSIDIAN-3:AIR-9:OBSIDIAN-4:AIR-d:OBSIDIAN-6:AIR-5:OBSIDIAN-e:DIRECTIONAL_ROTATOR:AIR-7:PUSHER:AIR-7:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-a:OBSIDIAN:AIR-4:MONSTER:OBSIDIAN:WATER-3:OBSIDIAN-2:DIRECTIONAL_ROTATOR:AIR-6:PUSHER:AIR-8:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-a:OBSIDIAN:AIR-2:MONSTER-3:OBSIDIAN:WATER-3:OBSIDIAN-2:DIRECTIONAL_ROTATOR:AIR-5:PUSHER:AIR-9:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-a:OBSIDIAN:AIR:OBSIDIAN-5:WATER-3:OBSIDIAN-2:DIRECTIONAL_ROTATOR:AIR-4:PUSHER:AIR-a:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN-5:AIR-2:OBSIDIAN:AIR-5:OBSIDIAN:WATER-3:OBSIDIAN-2:DIRECTIONAL_ROTATOR:AIR-3:PUSHER:AIR-b:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN:AIR-6:OBSIDIAN-5:AIR:OBSIDIAN:WATER-3:OBSIDIAN-2:DIRECTIONAL_ROTATOR:AIR-2:PUSHER:AIR-c:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-3:OBSIDIAN:MONSTER:AIR-4:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR-5:OBSIDIAN:WATER-3:OBSIDIAN-4:AIR-d:OBSIDIAN-3:AIR-3:OBSIDIAN-8:AIR:OBSIDIAN-5:STONE-3:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:BASALT-3:AIR-8:BASALT-3:AIR-o:OBSIDIAN-4:BASALT-3:AIR-5:BASALT-5:OBSIDIAN-3:AIR-a:OBSIDIAN:AIR-9:OBSIDIAN-2:BASALT-h:OBSIDIAN:AIR-a:STONE:GLASS-9:OBSIDIAN-2:BASALT-2:MONSTER:BASALT-2:MONSTER:BASALT-8:MONSTER:BASALT-2:OBSIDIAN:AIR-a:OBSIDIAN:AIR-9:OBSIDIAN-2:BASALT-7:MONSTER:BASALT-3:MONSTER:BASALT-5:OBSIDIAN:AIR-a:OBSIDIAN:LAVA-9:OBSIDIAN-2:BASALT-h:OBSIDIAN:AIR-a:OBSIDIAN:LAVA-9:OBSIDIAN-15:0-7v:1:0-21:2:0-c8:1:0-2v:2-5:0-1i:1:0-7:1:0-7:3:0-n:1:0-6:1:0-8:3:0-n:1:0-5:1:0-9:3:0-n:1:0-4:1:0-a:3:0-n:1:0-3:1:0-b:3:0-n:1:0-2:1:0-c:3:0-a:3:0-bf:0-18g:0-18g:1-1o:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-15:0-5:1-z:0-5:1-z:0-5:1-c:0-7:1-g:0-5:1-a:0-9:1-g:0-5:1-a:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-a5:0-a:1-u:0-a:1-u:0-a:1-u:0-a:1-u:0-a:1-u:0-a:1-u:0-a:1-u:0-a:1-1f:0-18g:",
            },
            {
                name: "Labyrinth Escape",
                description: "Oh no! You're trapped in a labyrinth! These yellow animated pixels are <b>goal</b> pixels, which can be pushed. You must get the <b>goal</b> to the cyan <b>target</b> pixel. Once the <b>goal</b> is on the <b>target</b>, it becomes immovable. The yellow pixels with a line through them are sliders, they can only be pushed or pulled in that direction.",
                inventory: {
                    OAK_WOOD: [[2]],
                    PUSHER: [[3], [2], [1], [1]],
                    DIRECTIONAL_ROTATOR: [[1], [1], [1], [-1]],
                    SLIDER: [[5], [4]],
                },
                saveCode: "40;OBSIDIAN-15:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-5:OBSIDIAN-m:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-g:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-k:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-k:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-k:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-k:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-k:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-e:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-e:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-e:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-e:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-4:GOAL:AIR-9:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-e:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-e:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-e:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-e:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-a:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-q:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-q:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-q:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-q:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-q:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-5:OBSIDIAN-g:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-2:AIR-w:OBSIDIAN:AIR-5:OBSIDIAN-15:0-18g:0-18g:0-18g:1-15:0-5:1-s:0-5:1-2:0-5:1-s:0-5:1-2:0-5:1-s:0-5:1-2:0-5:1-s:0-5:1-2:0-5:1-s:0-5:1-1c:0-5:1-z:0-5:1-z:0-5:1-z:0-5:1-z:0-5:1-2o:0-5:1-z:0-5:1-z:0-5:1-z:0-5:1-z:0-5:1-k:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-4:1:0-4:1-v:0-9:1-v:0-9:1-v:0-9:1-v:0-9:1-1t:0-5:1-a:0-5:1-k:0-5:1-a:0-5:1-k:0-5:1-a:0-5:1-k:0-5:1-a:0-5:1-k:0-5:1-a:0-5:1-1i:0-5:1-m:0-5:1-8:0-5:1-m:0-5:1-8:0-5:1-m:0-5:1-8:0-5:1-m:0-5:1-8:0-5:1-m:0-5:1-1b:0-150:1:0-3f:",
            },
            {
                name: "Shopping Mall",
                description: "Look at how many pushers and pullers they have here! The doors seem to be locked though. Wait, look at that <b>monster</b> in the top right. If we push the goal into the target, it blocks off the path to the <b>monster</b>! How do we destroy it?",
                inventory: {
                    OAK_WOOD: [[8]],
                    PUSHER: [[1], [-1], [2], [-1]],
                    PULLER: [[-1], [-1], [1], [4]],
                    ROTATOR: [[10], [4]],
                    DIRECTIONAL_ROTATOR: [[4], [4], [4], [4]],
                    SLIDER: [[-1], [1]],
                },
                saveCode: "40;OBSIDIAN-15:AIR-11:MONSTER:OBSIDIAN-2:AIR:OBSIDIAN-w:AIR:OBSIDIAN-6:AIR-b:PUSHER-m:AIR:PUSHER-2:AIR-2:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR:DIRECTIONAL_ROTATOR:OBSIDIAN-v:GOAL:OBSIDIAN:DIRECTIONAL_ROTATOR:OBSIDIAN:AIR:OBSIDIAN-2:ROTATOR:OBSIDIAN:AIR-2:OBSIDIAN:LAVA-q:OBSIDIAN-2:PUSHER:OBSIDIAN-3:AIR:OBSIDIAN-2:OAK_WOOD:AIR-3:OBSIDIAN:LAVA-q:OBSIDIAN-6:AIR:OBSIDIAN-2:AIR-4:OBSIDIAN:LAVA-q:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR-4:OBSIDIAN-q:BASALT:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-2:AIR-12:OBSIDIAN-y:AIR-6:OBSIDIAN-2:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR:PULLER-5:AIR:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-6:OBSIDIAN-3:SLIDER-5:OBSIDIAN-3:SLIDER-5:OBSIDIAN-3:SLIDER-5:OBSIDIAN-3:SLIDER-5:OBSIDIAN-2:AIR-6:OBSIDIAN:AIR-13:OBSIDIAN:AIR-13:OBSIDIAN:AIR-13:OBSIDIAN:AIR-13:OBSIDIAN-3:SLIDER-5:OBSIDIAN-3:SLIDER-5:OBSIDIAN-3:SLIDER-5:OBSIDIAN-3:SLIDER-5:OBSIDIAN-2:AIR-6:OBSIDIAN-2:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR-6:OBSIDIAN-2:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:MONSTER-2:AIR-4:OBSIDIAN-2:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:AIR:PUSHER-5:AIR:OBSIDIAN:MONSTER-3:AIR:MONSTER-2:OBSIDIAN-2:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:AIR-7:OBSIDIAN:MONSTER-6:OBSIDIAN-15:0-3o:2-m:0:2-2:0-2:3:0-10:2:0-4:1:0-gw:1-5:0-3:2-5:0-3:3-5:0-j:1-5:0-3:2-5:0-3:3-5:0-j:1-5:0-3:2-5:0-3:3-5:0-j:1-5:0-3:2-5:0-3:3-5:0-j:1-5:0-3:2-5:0-3:3-5:0-1f:1-5:0-3:1-5:0-3:1-5:0-3:1-5:0-4r:1-5:0-3:1-5:0-3:1-5:0-3:1-5:0-1n:1-5:0-3:2-5:0-3:3-5:0-j:1-5:0-3:2-5:0-3:3-5:0-j:1-5:0-3:2-5:0-3:3-5:0-j:1-5:0-3:2-5:0-3:3-5:0-j:1-5:0-3:2-5:0-3:3-5:0-2h:0-18g:0-18g:1-4a:0:1-1c:0-2:1-11:0-3:1-10:0-4:1-s:0-6:1-2:0-4:1-s:0-6:1-2:0-12:1-2:0-12:1-2:0-12:1-2:0-12:1-2:0-12:1-2:0-12:1-2:0-12:1-2:0-12:1-2:0-12:1-ax:0-7:1-x:0-7:1-x:0-7:1-x:0-7:1-a1:0-22:1:0-16d:",
            },
        ]
    },
];

var puzzleSelectButtons = document.getElementById("puzzleSelectButtons");

for (let i in puzzles) {
    title = document.createElement("h2");
    title.innerHTML = puzzles[i].name;
    title.classList.add("puzzleSelectTitle");
    puzzleSelectButtons.appendChild(title);
    let counter = 0;
    let group = document.createElement("div");
    group.classList.add("puzzleSelectGroup");
    puzzleSelectButtons.appendChild(group);
    for (let j in puzzles[i].puzzles) {
        puzzles[i].puzzles[j].saveCode = version + ";" + puzzles[i].puzzles[j].saveCode;
        const button = document.createElement("button");
        button.classList.add("puzzleSelectButton");
        button.innerHTML = parseInt(j, 10) + 1;
        button.addEventListener("click", function() {
            loadPuzzle(parseInt(i, 10), parseInt(j, 10));
        });
        group.appendChild(button);
        for (let k in puzzles[i].puzzles[j].inventory) {
            puzzles[i].puzzles[j].inventory[eval(k)] = puzzles[i].puzzles[j].inventory[k];
            delete puzzles[i].puzzles[j].inventory[k];
        }
        counter++;
        if (counter % 5 == 0) {
            group.appendChild(document.createElement("br"));
        }
    }
}