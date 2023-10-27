

window.addEventListener("DOMContentLoaded", function() {
    // document.getElementById("menuTitle").style.animation = "1s ease 3s menuTitleShift";
    setTimeout(function() {
        document.getElementById("menuTitle").style.transition = "1000ms ease transform";
        document.getElementById("menuTitle").style.transform = "translateY(-15vh)";
    }, 2000);
    setTimeout(function() {
        var menuTitleUp = true;
        document.getElementById("menuTitle").style.transition = "3000ms cubic-bezier(0.5, 0, 0.5, 1) transform";
        document.getElementById("menuTitle").style.transform = "translateY(-13vh)";
        setInterval(function() {
            menuTitleUp = !menuTitleUp;
            if (menuTitleUp) {
                document.getElementById("menuTitle").style.transform = "translateY(-13vh)";
            }
            else {
                document.getElementById("menuTitle").style.transform = "translateY(-15vh)";
            }
        }, 3000);
    }, 3000);
    document.getElementById("menuLogo").style.animation = "menuLogo 1s 1, menuLogoGlow 3s ease infinite";
    // document.getElementById("menuLogoSP").style.animation = "menuLogoSP 1s 1";
    // document.getElementById("menuLogoText").style.animation = "menuLogoText 1s 1";
    // document.getElementById("menuLogoPeriodicTitle").style.animation = "menuLogoPeriodicTitle 1s 1";
    // document.getElementById("menuLogoPeriodicText").style.animation = "menuLogoPeriodicText 1s 1";
    // document.getElementById("menuLogoPeriodicNumber").style.animation = "menuLogoPeriodicNumber 1s 1";
    setTimeout(function() {
        document.getElementById("menuTitleBlue").style.animation = "0.5s 1 menuTitleTextSlide";
    }, 1000);
    setTimeout(function() {
        document.getElementById("menuTitlePixel").style.animation = "0.5s 1 menuTitleTextSlide";
    }, 1200);
    setTimeout(function() {
        document.getElementById("menuTitleSimulator").style.animation = "0.5s 1 menuTitleTextSlide";
    }, 1400);
    document.getElementById("sandboxButton").style.animation = "menuButton 4s 1";
    document.getElementById("puzzlesButton").style.animation = "menuButton 4.5s 1";
    document.getElementById("multiplayerButton").style.animation = "menuButton 5s 1";
});

var drawMenuCanvas = async function() {
    var font = new FontFace("Source Code Pro", "url(/fonts/SourceCodePro.ttf)");
    await font.load();
    menuCanvas.width = 600;
    menuCanvas.height = 600;

    var menuCtx = menuCanvas.getContext("2d");

    menuCtx.fillStyle = "rgb(50, 50, 255)"
    menuCtx.fillRect(0, 0, 600, 600);

    menuCtx.lineWidth = 150;

    menuCtx.textBaseline = "top";
    menuCtx.textAlign = "left";

    menuCtx.shadowColor = "white";

    menuCtx.font = "600 100px Source Code Pro";

    menuCtx.shadowBlur = 0;
    menuCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    menuCtx.fillText("SP", 462.5 - 5, 5 + 5);
    menuCtx.shadowBlur = 20;
    menuCtx.fillStyle = "#ffffff";
    menuCtx.fillText("SP", 462.5, 5);

    // menuCtx.fillText("SP", 462.5, -10);

    menuCtx.font = "600 75px Source Code Pro";

    menuCtx.shadowBlur = 0;
    menuCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    menuCtx.fillText("309", 15 - 5, 5 + 5);
    menuCtx.shadowBlur = 15;
    menuCtx.fillStyle = "#ffffff";
    menuCtx.fillText("309", 15, 5);

    menuCtx.textAlign = "center";
    menuCtx.font = "600 250px Source Code Pro";

    menuCtx.shadowBlur = 0;
    menuCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    menuCtx.fillText("BP", 300 - 10, 180 + 10);
    menuCtx.shadowBlur = 60;
    menuCtx.fillStyle = "#ffffff";
    menuCtx.fillText("BP", 300, 180);

    menuCtx.font = "600 90px Source Code Pro";

    menuCtx.shadowBlur = 0;
    menuCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    menuCtx.fillText("Blue Pixel", 300 - 5, 500 + 5);
    menuCtx.shadowBlur = 25;
    menuCtx.fillStyle = "#ffffff";
    menuCtx.fillText("Blue Pixel", 300, 500);

    

    // menuCtx.font = "600 175px Source Code Pro";
    // menuCtx.shadowBlur = 50;
    // menuCtx.fillText("Blue", 10, 287.5);
    // menuCtx.fillText("Pixel", 10, 437.5);
};

drawMenuCanvas();