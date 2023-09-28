var inPuzzleSelect = false;

var showGameScreen = async function() {
    if (inTransition) {
        return;
    }
    inTransition = true;
    document.getElementById("menuTitleContainer").style.transform = "translateY(-50vh)";
    document.getElementById("multiplayerButton").style.animation = "500ms ease menuButtonHide";
    setTimeout(function() {
        document.getElementById("puzzlesButton").style.animation = "500ms ease menuButtonHide";
        // document.getElementById("puzzlesButton").style.transform = "translate(-50%, 60vh)";
    }, 200);
    setTimeout(function() {
        document.getElementById("sandboxButton").style.animation = "500ms ease menuButtonHide";
        // document.getElementById("sandboxButton").style.transform = "translate(-50%, 60vh)";
    }, 400);
    setTimeout(function() {
        document.getElementById("multiplayerButton").style.animation = "none";
        document.getElementById("multiplayerButton").style.transform = "translate(-50%, 50vh)";
        // document.getElementById("sandboxButton").style.transform = "translate(-50%, 60vh)";
    }, 500);
    setTimeout(function() {
        document.getElementById("puzzlesButton").style.animation = "none";
        document.getElementById("puzzlesButton").style.transform = "translate(-50%, 50vh)";
        // document.getElementById("sandboxButton").style.transform = "translate(-50%, 60vh)";
    }, 700);
    setTimeout(function() {
        document.getElementById("sandboxButton").style.animation = "none";
        document.getElementById("sandboxButton").style.transform = "translate(-50%, 50vh)";
        document.getElementById("menuScreen").style.opacity = 0;
        document.getElementById("menuScreen").style.pointerEvents = "none";
        document.getElementById("gameScreen").style.display = "inline";
    }, 900);
    setTimeout(function() {
        inTransition = false;
        document.getElementById("menuTitleContainer").style.transform = "translateY(0vh)";
        document.getElementById("multiplayerButton").style.transform = "translateX(-50%)";
        document.getElementById("puzzlesButton").style.transform = "translateX(-50%)";
        document.getElementById("sandboxButton").style.transform = "translateX(-50%)";
        document.getElementById("menuScreen").style.visibility = "hidden";
        document.getElementById("menuScreen").style.opacity = 1;
        document.getElementById("menuScreen").style.pointerEvents = "all";
    }, 3000);
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, 900);
    });
    // await transition();
};
var showMenuScreen = async function() {
    storeGrid();
    await transition();
    gameState = 0;
    document.getElementById("menuScreen").style.visibility = "visible";
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("winScreen").style.opacity = 0;
    document.getElementById("winScreen").style.pointerEvents = "none";
    document.getElementById("multiplayerScreen").style.display = "none";
};
var showWinScreen = function() {
    inTransition = true;
    if (puzzles[currentGroup].puzzles[currentPuzzle + 1] != null) {
        document.getElementById("winNext").style.display = "inline-block";
    }
    else {
        document.getElementById("winNext").style.display = "none";
    }
    effects.win.activated = true;
    document.getElementById("winScreen").style.opacity = 1;
    document.getElementById("winScreen").style.pointerEvents = "all";
    document.getElementById("winTitle").style.transform = "translateY(0px)";
    document.getElementById("winReset").style.transform = "translateY(0px)";
    document.getElementById("winNext").style.transform = "translateY(0px)";
    document.getElementById("winMenu").style.transform = "translateY(0px)";
};
var hideWinScreen = function() {
    inTransition = false;
    document.getElementById("winScreen").style.opacity = 0;
    document.getElementById("winScreen").style.pointerEvents = "none";
    document.getElementById("winTitle").style.transform = "translateY(calc(-30vh - 20px))";
    document.getElementById("winReset").style.transform = "translateY(calc(-30vh - 20px))";
    document.getElementById("winNext").style.transform = "translateY(calc(-30vh - 20px))";
    document.getElementById("winMenu").style.transform = "translateY(calc(-30vh - 20px))";
};

document.getElementById("sandboxButton").addEventListener("click", async function() {
    if (inPuzzleSelect) {
        return;
    }
    await showGameScreen();
    gameState = 1;
    var sandboxTools = document.getElementsByClassName("sandboxTool");
    for (var i = 0; i < sandboxTools.length; i++) {
        sandboxTools[i].style.display = "initial";
    }
    var puzzleTools = document.getElementsByClassName("puzzleTool");
    for (var i = 0; i < puzzleTools.length; i++) {
        puzzleTools[i].style.display = "none";
    }
    var gameTools = document.getElementsByClassName("gameTool");
    for (var i = 0; i < gameTools.length; i++) {
        gameTools[i].style.display = "none";
    }
    brush.setInventory([]);
    brush.resetPixel();
    gridSize = 100;
    camera.resetZoom();
    fetchGrid();
    resizeCanvas();
    resetGrid();
});
document.getElementById("puzzlesButton").addEventListener("click", function() {
    document.getElementById("puzzleSelect").style.visibility = "visible";
    document.getElementById("puzzleSelect").style.transform = "translate(-50%, 0px)";
    inPuzzleSelect = true;
});
document.getElementById("puzzleSelectCancelButton").addEventListener("click", function() {
    document.getElementById("puzzleSelect").style.transform = "translate(-50%, -85vh)";
    setTimeout(function() {
        if (document.getElementById("puzzleSelect").style.transform == "translate(-50%, -85vh)") {
            document.getElementById("puzzleSelect").style.visibility = "hidden";
        }
        inPuzzleSelect = false;
    }, 500);
});

var updateControlButtons = function() {
    document.getElementById("runButton").style.backgroundColor = runState == 1 ? "#ff0000" : "#00ff00";
    document.getElementById("playRunButton").style.display = runState == 1 ? "none" : "inline";
    document.getElementById("pauseRunButton").style.display = runState == 1 ? "inline" : "none";
    document.getElementById("simulateButton").style.backgroundColor = runState == 2 ? "#ff0000" : "#00ff00";
    document.getElementById("playSimulateButton").style.display = runState == 2 ? "none" : "inline";
    document.getElementById("pauseSimulateButton").style.display = runState == 2 ? "inline" : "none";
    document.getElementById("slowmodeButton").style.backgroundColor = runState == 3 ? "#ff0000" : "#00ff00";
    document.getElementById("playSlowmodeButton").style.display = runState == 3 ? "none" : "inline";
    document.getElementById("pauseSlowmodeButton").style.display = runState == 3 ? "inline" : "none";
    document.getElementById("stepButton").disabled = runState != 0;
    document.getElementById("resetButton").disabled = lastGrid == null;
};

updateControlButtons();

document.getElementById("runButton").addEventListener("click", function() {
    runState = runState == 1 ? 0 : 1;
    updateControlButtons();
});
document.getElementById("stepButton").addEventListener("click", function() {
    runState = 1;
    updateGrid();
    frames.pop();
    runState = 0;
    updateControlButtons();
});
document.getElementById("simulateButton").addEventListener("click", function() {
    runState = runState == 2 ? 0 : 2;
    updateControlButtons();
});
document.getElementById("slowmodeButton").addEventListener("click", function() {
    runState = runState == 3 ? 0 : 3;
    updateControlButtons();
});
document.getElementById("resetButton").addEventListener("click", async function() {
    if (await promptQuestion("Are you sure you want to reset?", "This will delete your current simulation.")) {
        idGrid = lastGrid.idGrid;
        rotationGrid = lastGrid.rotationGrid;
        dataGrid = lastGrid.dataGrid;
        fireGrid = lastGrid.fireGrid;
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                nextIdGrid[i][j] = null;
                nextRotationGrid[i][j] = null;
                nextDataGrid[i][j] = null;
                nextFireGrid[i][j] = null;
            }
        }
        resetGrid();
        runState = 0;
        updateControlButtons();
    }
});
document.getElementById("downloadButton").addEventListener("click", async function() {
    var name = await promptText("Pick a file name:", "");
    if (name == false) {
        return;
    }
    var link = document.createElement("a");
    link.download = name + ".pixel";
    var file = new Blob([btoa(generateGrid())], { type: "text/plain" });
    var href = URL.createObjectURL(file);
    link.href = href;
    link.target = "_blank";
    link.click();
    URL.revokeObjectURL(link);
});
document.getElementById("uploadButton").addEventListener("click", async function() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".pixel";
    input.click();
    input.oninput = function() {
        if (input.files.length == 0) {
            return;
        }
        var reader = new FileReader();
        reader.onload = async function(event) {
            if (await promptQuestion("Are you sure?", "This will delete your current simulation.")) {
                await transition();
                var saveCode = atob(event.target.result);
                if (gameState == 1) {
                    loadGrid(saveCode);
                    resetGrid();
                }
                else {
                    loadPuzzleGrid(saveCode);
                }
            }
        };
        reader.readAsText(input.files[0]);
    };
});
document.getElementById("screenshotButton").addEventListener("click", async function() {
    var name = await promptText("Pick a file name:", "");
    if (name == false) {
        return;
    }
    var link = document.createElement("a");
    link.download = name + ".png";
    link.href = canvas.toDataURL("image/png");
    link.target = "_blank";
    link.click();
    URL.revokeObjectURL(link);
});
document.getElementById("restartButton").addEventListener("click", async function() {
    if (gameState == 1) {
        if (await promptQuestion("Are you sure you want to delete everything?", "This will delete your current simulation.")) {
            await transition();
            createGrid();
            resetGrid();
            runState = 0;
            updateControlButtons();
        }
    }
    else if (gameState == 2) {
        if (await promptQuestion("Are you sure you want to restart?", "Your solution will be deleted.")) {
            await transition();
            loadPuzzleGrid(1);
        }
    }
});
document.getElementById("menuButton").addEventListener("click", async function() {
    if (await promptQuestion("Are you sure?", "This will delete your current simulation.")) {
        showMenuScreen();
    }
});
document.getElementById("copyButton").addEventListener("click", async function() {
    navigator.clipboard.writeText(generateGrid());
    promptNotification("Copied save code!", "");
});
document.getElementById("pasteButton").addEventListener("click", async function() {
    var saveCode = await navigator.clipboard.readText();
    if (await promptQuestion("Are you sure?", "This will delete your current simulation.")) {
        await transition();
        if (gameState == 1) {
            loadGrid(saveCode);
            resetGrid();
        }
        else {
            loadPuzzleGrid(saveCode);
        }
    }
});
document.getElementById("changeGridSizeButton").addEventListener("click", async function() {
    var newGridSize = await promptNumber("Enter the new grid size", "");
    if (newGridSize == false) {
        return;
    }
    inTransition = true;
    await new Promise(p => setTimeout(p, 500));
    if (await promptQuestion("Are you sure you want to resize the grid?", "This will delete your current simulation.")) {
        await transition();
        gridSize = newGridSize;
        createGrid();
        resizeCanvas();
        resetGrid();
    }
});
document.getElementById("setInitialStateButton").addEventListener("click", async function() {
    if (await promptQuestion("Are you sure?", "This will delete your current initial state.")) {
        resetGrid();
        lastGrid = {
            idGrid: JSON.parse(JSON.stringify(idGrid)),
            rotationGrid: JSON.parse(JSON.stringify(rotationGrid)),
            dataGrid: JSON.parse(JSON.stringify(dataGrid)),
            fireGrid: JSON.parse(JSON.stringify(fireGrid)),
        };
        updateControlButtons();
    }
});
document.getElementById("winReset").addEventListener("click", async function() {
    idGrid = lastGrid.idGrid;
    rotationGrid = lastGrid.rotationGrid;
    dataGrid = lastGrid.dataGrid;
    fireGrid = lastGrid.fireGrid;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            nextIdGrid[i][j] = null;
            nextRotationGrid[i][j] = null;
            nextDataGrid[i][j] = null;
            nextFireGrid[i][j] = null;
        }
    }
    resetGrid();
    runState = 0;
    updateControlButtons();
    hideWinScreen();
});
document.getElementById("winNext").addEventListener("click", async function() {
    storeGrid();
    hideWinScreen();
    loadPuzzle(currentGroup, currentPuzzle + 1);
});
document.getElementById("winMenu").addEventListener("click", async function() {
    hideWinScreen();
    showMenuScreen();
});