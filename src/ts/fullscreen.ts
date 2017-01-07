import { Query } from "./query";

const fullScreenButton = Query(".btn-fullscreen");
const startButton = Query(".btn-start");
const stopButton = Query(".btn-stop");
const playingView = Query<HTMLElement>(".view.playing");

let isFullScreen = false;
let hideControlsInterval: number;
let lastActivity = Date.now();
let hideControlsMS = 2000;
let controlsVisible = false;
let cursorVisible = false;

function changeFullScreen() {
    if (isFullScreen) {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document["webkitExitFullscreen"])
            document["webkitExitFullscreen"]();
        else if (document["mozCancelFullScreen"])
            document["mozCancelFullScreen"]();
    }
    else {
        if (document.fullscreenEnabled)
            playingView.requestFullscreen();
        else if (document["webkitFullscreenEnabled"])
            playingView["webkitRequestFullscreen"]();
        else if (document["mozFullScreenEnabled"])
            playingView["mozRequestFullScreen"]();
    }
}

function fullScreenChanged() {
    isFullScreen = !isFullScreen;
    lastActivity = Date.now();
}

function markTime() {
    lastActivity = Date.now();
}

function hideOrReveal() {
    if (Date.now() - lastActivity > hideControlsMS) {
        hideControls();
        if (isFullScreen)
            hideCursor();
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
    if (controlsVisible)
        fullScreenButton.classList.add("disabled");

    controlsVisible = false;
}

function showControls() {
    if (!controlsVisible)
        fullScreenButton.classList.remove("disabled");

    controlsVisible = true;
}

function start() {
    showControls();
    document.addEventListener("mousemove", markTime);
    hideControlsInterval = setInterval(hideOrReveal, 200);
}

function stop() {
    clearInterval(hideControlsInterval);
    document.removeEventListener("mousemove", markTime);
    showCursor();
    hideControls();
}

startButton.addEventListener("click", start);

stopButton.addEventListener("click", stop);

if (document.fullscreenEnabled)
    document.addEventListener("fullscreenchange", fullScreenChanged);
else if (document["webkitFullscreenEnabled"])
    document.addEventListener("webkitfullscreenchange", fullScreenChanged);
else if (document["mozFullScreenEnabled"])
    document.addEventListener("mozfullscreenchange", fullScreenChanged);

fullScreenButton.addEventListener("click", changeFullScreen);
