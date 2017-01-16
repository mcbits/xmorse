import { Query } from "./query";

const fullScreenButton = Query(".btn-fullscreen");
const startButton = Query(".btn-start");
const stopButton = Query(".btn-stop");
const playingView = document.body.parentElement;
const controls = Query(".controls");
const menu = Query(".menu");
const sidebar = Query(".sidebar");


let isFullScreen = false;
let hideControlsInterval: number;
let lastActivity = Date.now();
let hideControlsMS = 2000;
let controlsVisible = false;
let cursorVisible = false;

function exitFullScreen() {
    fullScreenButton.textContent = "Full screen";

    if (document.exitFullscreen)
        document.exitFullscreen();
    else if (document["webkitExitFullscreen"])
        document["webkitExitFullscreen"]();
    else if (document["mozCancelFullScreen"])
        document["mozCancelFullScreen"]();
}

function enterFullScreen() {
    fullScreenButton.textContent = "Exit full screen";

    if (document.fullscreenEnabled)
        playingView.requestFullscreen();
    else if (document["webkitFullscreenEnabled"])
        playingView["webkitRequestFullscreen"]();
    else if (document["mozFullScreenEnabled"])
        playingView["mozRequestFullScreen"]();
}

function toggleFullScreen() {
    if (isFullScreen)
        exitFullScreen();
    else
        enterFullScreen();
}

function fullScreenChanged() {
    isFullScreen = !isFullScreen;
    lastActivity = Date.now();
}

function markTime() {
    lastActivity = Date.now();
}

function hideOrReveal() {
    if (isFullScreen && Date.now() - lastActivity > hideControlsMS) {
        hideControls();
        hideCursor();
        return;
    }
    else {
        showControls();
        showCursor();
    }
}

function hideCursor() {
    if (cursorVisible)
        playingView.style.cursor = "none";

    cursorVisible = false;
}

function showCursor() {
    if (!cursorVisible)
        playingView.style.cursor = "default";

    cursorVisible = true;
}

function hideControls() {
    if (controlsVisible) {
        fullScreenButton.classList.add("disabled");
        controls.classList.add("disabled");
        menu.classList.add("disabled");
        sidebar.classList.add("disabled");
    }

    controlsVisible = false;
}

function showControls() {
    if (!controlsVisible) {
        fullScreenButton.classList.remove("disabled");
        controls.classList.remove("disabled");
        menu.classList.remove("disabled");
        sidebar.classList.remove("disabled");
    }

    controlsVisible = true;
}

function start() {
    document.addEventListener("mousemove", markTime);
    hideControlsInterval = setInterval(hideOrReveal, 200);
}

function stop() {
    clearInterval(hideControlsInterval);
    document.removeEventListener("mousemove", markTime);
    showCursor();
    showControls();
    if (isFullScreen)
        exitFullScreen();
}

startButton.addEventListener("click", start);

stopButton.addEventListener("click", stop);

if (document.fullscreenEnabled)
    document.addEventListener("fullscreenchange", fullScreenChanged);
else if (document["webkitFullscreenEnabled"])
    document.addEventListener("webkitfullscreenchange", fullScreenChanged);
else if (document["mozFullScreenEnabled"])
    document.addEventListener("mozfullscreenchange", fullScreenChanged);

fullScreenButton.addEventListener("click", toggleFullScreen);
