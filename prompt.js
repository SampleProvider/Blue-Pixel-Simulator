var showPrompt = function() {
    inTransition = true;
    document.getElementById("promptContainer").style.opacity = "1";
    document.getElementById("promptContainer").style.pointerEvents = "all";
    document.getElementById("prompt").style.transform = "translate(-50%, -50%)";
    document.getElementById("promptInput").style.display = "none";
    document.getElementById("promptMessage").style.display = "none";
    document.getElementById("promptError").style.display = "none";
    document.getElementById("promptOk").style.display = "none";
    document.getElementById("promptYes").style.display = "none";
    document.getElementById("promptYes").disabled = false;
    document.getElementById("promptYes").innerHTML = "YES";
    document.getElementById("promptNo").style.display = "none";
    document.getElementById("promptNo").innerHTML = "NO";
};
var hidePrompt = function() {
    inTransition = false;
    document.getElementById("promptContainer").style.opacity = "0";
    document.getElementById("promptContainer").style.pointerEvents = "none";
    document.getElementById("prompt").style.transform = "";
};
hidePrompt();

var promptNotification = function(title, message) {
    showPrompt();
    document.getElementById("promptOk").style.display = "inline";
    document.getElementById("promptTitle").innerHTML = title;
    document.getElementById("promptMessage").style.display = "inline";
    document.getElementById("promptMessage").innerHTML = message;
    return new Promise(function(resolve, reject) {
        document.getElementById("promptOk").addEventListener("click", function() {
            hidePrompt();
            resolve(true);
        });
    });
};
var promptError = function(title, error) {
    showPrompt();
    document.getElementById("promptOk").style.display = "inline";
    document.getElementById("promptTitle").innerHTML = title;
    document.getElementById("promptError").style.display = "inline";
    document.getElementById("promptError").innerHTML = error;
    return new Promise(function(resolve, reject) {
        document.getElementById("promptOk").addEventListener("click", function() {
            hidePrompt();
            resolve(true);
        });
    });
};
var promptQuestion = function(title, message) {
    showPrompt();
    document.getElementById("promptYes").style.display = "inline";
    document.getElementById("promptNo").style.display = "inline";
    document.getElementById("promptTitle").innerHTML = title;
    document.getElementById("promptMessage").style.display = "inline";
    document.getElementById("promptMessage").innerHTML = message;
    return new Promise(function(resolve, reject) {
        document.getElementById("promptYes").addEventListener("click", function() {
            hidePrompt();
            resolve(true);
        });
        document.getElementById("promptNo").addEventListener("click", function() {
            hidePrompt();
            resolve(false);
        });
    });
};
var promptText = function(title, message) {
    showPrompt();
    document.getElementById("promptInput").style.display = "inline-block";
    document.getElementById("promptInput").type = "text";
    document.getElementById("promptInput").value = "";
    document.getElementById("promptYes").style.display = "inline";
    document.getElementById("promptYes").style.backgroundColor = "#00ff00";
    document.getElementById("promptYes").disabled = true;
    document.getElementById("promptYes").innerHTML = "OK";
    document.getElementById("promptNo").style.display = "inline";
    document.getElementById("promptNo").innerHTML = "CANCEL";
    document.getElementById("promptTitle").innerHTML = title;
    document.getElementById("promptMessage").style.display = "inline";
    document.getElementById("promptMessage").innerHTML = message;
    document.getElementById("promptInput").addEventListener("input", function() {
        if (document.getElementById("promptInput").value.length > 0) {
            document.getElementById("promptYes").disabled = false;
        }
        else {
            document.getElementById("promptYes").disabled = true;
        }
    });
    return new Promise(function(resolve, reject) {
        document.getElementById("promptYes").addEventListener("click", function() {
            hidePrompt();
            resolve(document.getElementById("promptInput").value);
        });
        document.getElementById("promptNo").addEventListener("click", function() {
            hidePrompt();
            resolve(false);
        });
    });
};
var promptNumber = function(title, message) {
    showPrompt();
    document.getElementById("promptInput").style.display = "inline-block";
    document.getElementById("promptInput").type = "number";
    document.getElementById("promptInput").value = "";
    document.getElementById("promptYes").style.display = "inline";
    document.getElementById("promptYes").style.backgroundColor = "#00ff00";
    document.getElementById("promptYes").disabled = true;
    document.getElementById("promptYes").innerHTML = "OK";
    document.getElementById("promptNo").style.display = "inline";
    document.getElementById("promptNo").innerHTML = "CANCEL";
    document.getElementById("promptTitle").innerHTML = title;
    document.getElementById("promptMessage").style.display = "inline";
    document.getElementById("promptMessage").innerHTML = message;
    document.getElementById("promptInput").addEventListener("input", function() {
        if (document.getElementById("promptInput").value.length > 0) {
            document.getElementById("promptYes").disabled = false;
        }
        else {
            document.getElementById("promptYes").disabled = true;
        }
    });
    return new Promise(function(resolve, reject) {
        document.getElementById("promptYes").addEventListener("click", function() {
            hidePrompt();
            resolve(parseInt(document.getElementById("promptInput").value, 10));
        });
        document.getElementById("promptNo").addEventListener("click", function() {
            hidePrompt();
            resolve(false);
        });
    });
};