
var loadingScreenTips = ["Multiplayer is not finished, why are you even going here", "Terrain pixels like dirt and stone can be effective as a quick defense.", "SPAARK", "pls give mooney?"];
var showLoadingScreen = function() {
    inTransition = true;
    document.getElementById("loadingText").innerHTML = loadingScreenTips[Math.floor(Math.random() * loadingScreenTips.length)];
    document.getElementById("loadingScreen").style.visibility = "visible";
    document.getElementById("loadingScreen").style.opacity = 1;
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, 500);
    });
};
var hideLoadingScreen = function() {
    document.getElementById("loadingScreen").style.visibility = "visible";
    document.getElementById("loadingScreen").style.opacity = 0;
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            inTransition = false;
            document.getElementById("loadingScreen").style.visibility = "hidden";
            resolve();
        }, 500);
    });
};
document.getElementById("multiplayerButton").addEventListener("click", async function() {
    if (inPuzzleSelect) {
        return;
    }
    await showLoadingScreen();
    document.getElementById("menuScreen").style.visibility = "hidden";
    await new Promise(p => setTimeout(p, 500));
    document.getElementById("multiplayerScreen").style.display = "inline-block";
    changeTab(0);
    currentGameMode = 0;
    displayGameMode();
    await hideLoadingScreen();
});

var showAccount = function(createAccount) {
    document.getElementById("accountContainer").style.opacity = "1";
    document.getElementById("accountContainer").style.pointerEvents = "all";
    document.getElementById("accountPrompt").style.transform = "translate(-50%, -50%)";
    document.getElementById("accountUsername").value = "";
    document.getElementById("accountPassword").value = "";
    document.getElementById("accountYes").disabled = true;
    if (createAccount) {
        document.getElementById("accountTitle").innerHTML = "Create a Blue Pixel Simulator Account";
        document.getElementById("accountMessage").innerHTML = "Your username and password must be between 3 and 20 characters long.";
        document.getElementById("accountPasswordConfirmText").style.display = "block";
        document.getElementById("accountPasswordConfirm").value = "";
        document.getElementById("accountYes").innerHTML = "SIGN UP";
        var checkValidAccount = function() {
            var username = document.getElementById("accountUsername").value;
            var password = document.getElementById("accountPassword").value;
            var passwordConfirm = document.getElementById("accountPasswordConfirm").value;
            if (username.length < 3 || username.length > 20 || password.length < 3 || password.length > 20 || passwordConfirm.length < 3 || passwordConfirm.length > 20 || password != passwordConfirm) {
                document.getElementById("accountYes").disabled = true;
                return;
            }
            var validCharacters = "abcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+[]{}|:,.<>/?";
            for (var i = 0; i < username.length; i++) {
                if (!validCharacters.includes(username[i])) {
                    document.getElementById("accountYes").disabled = true;
                    return;
                }
            }
            for (var i = 0; i < password.length; i++) {
                if (!validCharacters.includes(password[i])) {
                    document.getElementById("accountYes").disabled = true;
                    return;
                }
            }
            document.getElementById("accountYes").disabled = false;
        };
        document.getElementById("accountUsername").addEventListener("input", checkValidAccount);
        document.getElementById("accountPassword").addEventListener("input", checkValidAccount);
        document.getElementById("accountPasswordConfirm").addEventListener("input", checkValidAccount);
        document.getElementById("accountCancel").addEventListener("click", hideAccount);
    }
    else {
        document.getElementById("accountTitle").innerHTML = "Login with a Blue Pixel Simulator Account";
        document.getElementById("accountMessage").innerHTML = "Welcome back!";
        document.getElementById("accountPasswordConfirmText").style.display = "none";
        document.getElementById("accountYes").innerHTML = "SIGN IN";
        var checkValidAccount = function() {
            var username = document.getElementById("accountUsername").value;
            var password = document.getElementById("accountPassword").value;
            if (username.length < 3 || username.length > 20 || password.length < 3 || password.length > 20) {
                document.getElementById("accountYes").disabled = true;
                return;
            }
            var validCharacters = "abcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+[]{}|:,.<>/?";
            for (var i = 0; i < username.length; i++) {
                if (!validCharacters.includes(username[i])) {
                    document.getElementById("accountYes").disabled = true;
                    return;
                }
            }
            for (var i = 0; i < password.length; i++) {
                if (!validCharacters.includes(password[i])) {
                    document.getElementById("accountYes").disabled = true;
                    return;
                }
            }
            document.getElementById("accountYes").disabled = false;
        };
        document.getElementById("accountUsername").addEventListener("input", checkValidAccount);
        document.getElementById("accountPassword").addEventListener("input", checkValidAccount);
        document.getElementById("accountCancel").addEventListener("click", hideAccount);
    }
};
var hideAccount = function() {
    document.getElementById("accountContainer").style.opacity = "";
    document.getElementById("accountContainer").style.pointerEvents = "";
    document.getElementById("accountPrompt").style.transform = "";
};

document.getElementById("multiplayerAccountSignIn").addEventListener("click", async function() {
    showAccount(false);
});
document.getElementById("multiplayerAccountCreateAccount").addEventListener("click", async function() {
    showAccount(true);
});
document.getElementById("multiplayerAccountMenu").addEventListener("click", async function() {
    showMenuScreen();
});

var currentTab = 0;

var changeTab = function(newTab) {
    if (currentTab == 0) {
        document.getElementById("multiplayerGamesButton").style.borderBottom = "2px solid white";
        document.getElementById("activeGames").style.display = "none";
        document.getElementById("createGame").style.display = "none";
    }
    else if (currentTab == 1) {
        document.getElementById("multiplayerPuzzlesButton").style.borderBottom = "2px solid white";
        document.getElementById("multiplayerPuzzles").style.display = "none";
    }
    else if (currentTab == 2) {
        document.getElementById("multiplayerLeaderboardButton").style.borderBottom = "2px solid white";
        document.getElementById("multiplayerLeaderboard").style.display = "none";
    }
    if (newTab == 0) {
        document.getElementById("multiplayerGamesButton").style.borderBottom = "2px solid #333333";
        document.getElementById("activeGames").style.display = "block";
        document.getElementById("createGame").style.display = "block";
    }
    else if (newTab == 1) {
        document.getElementById("multiplayerPuzzlesButton").style.borderBottom = "2px solid #333333";
        document.getElementById("multiplayerPuzzles").style.display = "block";
    }
    else if (newTab == 2) {
        document.getElementById("multiplayerLeaderboardButton").style.borderBottom = "2px solid #333333";
        document.getElementById("multiplayerLeaderboard").style.display = "block";
    }
    currentTab = newTab;
};
changeTab(0);
document.getElementById("multiplayerGamesButton").addEventListener("click", async function() {
    changeTab(0);
});
document.getElementById("multiplayerPuzzlesButton").addEventListener("click", async function() {
    changeTab(1);
});
document.getElementById("multiplayerLeaderboardButton").addEventListener("click", async function() {
    changeTab(2);
});

var viewGame = async function() {
    await showLoadingScreen();
    document.getElementById("multiplayerScreen").style.visibility = "hidden";
    await new Promise(p => setTimeout(p, 500));
    document.getElementById("gameScreen").style.display = "inline-block";
    gameState = 4;
    var sandboxTools = document.getElementsByClassName("sandboxTool");
    for (var i = 0; i < sandboxTools.length; i++) {
        sandboxTools[i].style.display = "none";
    }
    var puzzleTools = document.getElementsByClassName("puzzleTool");
    for (var i = 0; i < puzzleTools.length; i++) {
        puzzleTools[i].style.display = "none";
    }
    var gameTools = document.getElementsByClassName("gameTool");
    for (var i = 0; i < gameTools.length; i++) {
        gameTools[i].style.display = "initial";
    }
    camera.resetZoom();
    await hideLoadingScreen();
};

var gameModes = [
    {
        name: "Vault Wars",
        description: "Use color pumps to extract color from color wells. Use color to place pixels. Build a vault to defend your pixelite crystal and destroy the opponent's pixelite crystal!",
    },
    {
        name: "Resource Race",
        description: "get resources i think?? idk",
    },
    {
        name: "Music Battles",
        description: "Play funny C6 sawtooth notes to hurt your opponent's ears.",
    },
];
var currentGameMode = 0;

var displayGameMode = function() {
    document.getElementById("currentGameMode").children[0].innerHTML = gameModes[currentGameMode].name;
    document.getElementById("createGameModeDescription").innerHTML = gameModes[currentGameMode].description;
};
displayGameMode();

document.getElementById("backGameMode").addEventListener("click", async function() {
    currentGameMode = (currentGameMode + gameModes.length - 1) % gameModes.length;
    displayGameMode();
});
document.getElementById("nextGameMode").addEventListener("click", async function() {
    currentGameMode = (currentGameMode + 1) % gameModes.length;
    displayGameMode();
});

var publicGame = false;
document.getElementById("publicGameSlider").addEventListener("click", async function() {
    publicGame = !publicGame;
    if (publicGame) {
        document.getElementById("publicGameSlider").classList.add("toggleSliderActive");
    }
    else {
        document.getElementById("publicGameSlider").classList.remove("toggleSliderActive");
    }
});

var allowSpectators = false;
document.getElementById("allowSpectatorsSlider").addEventListener("click", async function() {
    allowSpectators = !allowSpectators;
    if (allowSpectators) {
        document.getElementById("allowSpectatorsSlider").classList.add("toggleSliderActive");
    }
    else {
        document.getElementById("allowSpectatorsSlider").classList.remove("toggleSliderActive");
    }
});

var ranked = false;
document.getElementById("rankedSlider").addEventListener("click", async function() {
    ranked = !ranked;
    if (ranked) {
        document.getElementById("rankedSlider").classList.add("toggleSliderActive");
    }
    else {
        document.getElementById("rankedSlider").classList.remove("toggleSliderActive");
    }
});