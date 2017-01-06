import { CharacterInfo } from "./morsetable";
import { Handle, VOICE_DONE } from "./events";
import { Audio, MasterGain } from "./audiocontext";
import { nowPlaying } from "./timing";

// Wire up audio
const voiceGain = Audio.createGain();
voiceGain.gain.value = 0.85;
voiceGain.connect(MasterGain);

const audioSources: { [char: string]: AudioBuffer } = {};

export function PlayVoice(char: string): void {
    //await delay(unitTime * charSpacing);

    if (nowPlaying) {
        const buffer = audioSources[char];
        if (typeof buffer !== "undefined") {
            const audioSource = Audio.createBufferSource();
            audioSource.addEventListener("ended", () => document.dispatchEvent(new Event(VOICE_DONE)));
            audioSource.buffer = buffer;
            audioSource.connect(voiceGain);
            audioSource.start(0);
        }
    }
}

export function IsVoiceLoaded(char: string): boolean {
    return audioSources.hasOwnProperty(char);
}

export function LoadVoice(charDef: CharacterInfo, callback?: Function): void {
    let request: XMLHttpRequest;

    const audioDownloaded = (evt: Event) => {
        const response = request.response;
        Audio.decodeAudioData(
            response,
            (buffer: AudioBuffer) => {
                audioSources[charDef.name] = buffer;
                if (typeof callback === "function")
                    callback();
            },
            (err: DOMException) => console.log("Error loading audio source: ", err));
    }

    if (typeof audioSources[charDef.name] === "undefined") {
        request = new XMLHttpRequest();

        request.open("GET", "/audio/" + charDef.fileName, true);
        request.responseType = "arraybuffer";
        request.addEventListener("load", audioDownloaded);

        request.send();
    }
}
