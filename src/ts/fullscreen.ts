import { Query } from "./query";

let isFullScreen = false;

const enableFullScreenButton = Query(".btn-fullscreen");
const startButton = Query(".btn-start");
const stopButton = Query(".btn-stop");

enableFullScreenButton.addEventListener("click", () => {
    if (isFullScreen) {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document["webkitExitFullscreen"])
            document["webkitExitFullscreen"]();
        else if (document["mozCancelFullScreen"]) {
            document["mozCancelFullScreen"]();
        }
    }
    else {
        if (document.fullscreenEnabled)
            Query(".view.playing").requestFullscreen();
        else if (document["webkitFullscreenEnabled"])
            Query(".view.playing")["webkitRequestFullscreen"]();
        else if (document["mozFullScreenEnabled"])
            Query(".view.playing")["mozRequestFullScreen"]();
    }
});

function fullScreenChanged() {
    enableFullScreenButton.classList.toggle("disabled");
    isFullScreen = !isFullScreen;
}

["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange"].forEach(type =>
    document.addEventListener(type, fullScreenChanged));

let cursorHidingTimeout: number;
function revealOnMouseMove() {
    clearTimeout(cursorHidingTimeout);
    enableFullScreenButton.classList.remove("disabled");
    document.body.style.cursor = "default";

    cursorHidingTimeout = setTimeout(() => {
        if (isFullScreen) {
            document.body.style.cursor = "none";
            enableFullScreenButton.classList.add("disabled");
        }
    }, 1500);
}
document.addEventListener("mousemove", revealOnMouseMove);

startButton.addEventListener("click", () => enableFullScreenButton.classList.remove("disabled"));

stopButton.addEventListener("click", () => enableFullScreenButton.classList.add("disabled"));
