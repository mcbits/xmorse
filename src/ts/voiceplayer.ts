import { CharacterInfo } from "./morsetable";
import { Listen, VOICE_DONE, VOICE_ENABLED } from "./events";
import { Audio, MasterGain } from "./audiocontext";
import { NowPlaying } from "./timing";

// Wire up audio
const voiceGain = Audio.createGain();
voiceGain.gain.value = 0.85;
voiceGain.connect(MasterGain);

const audioBuffers: { [char: string]: AudioBuffer } = {};

let voiceEnabled = true;

export function PlayVoice(char: string): void {
    if (NowPlaying) {
        if (!voiceEnabled) {
            document.dispatchEvent(new Event(VOICE_DONE));
            return;
        }

        const buffer = audioBuffers[char];
        if (typeof buffer !== "undefined") {
            const audioSource = Audio.createBufferSource();
            audioSource.addEventListener("ended", () => document.dispatchEvent(new Event(VOICE_DONE)));
            audioSource.buffer = buffer;
            audioSource.connect(voiceGain);
            audioSource.start(0);
        }
    }
}

export function PreloadVoice(charDef: CharacterInfo, callback?: Function): void {
    if (!voiceEnabled || audioBuffers.hasOwnProperty(charDef.name)) {
        if (typeof callback === "function")
            callback();

        return;
    }

    const request = new XMLHttpRequest();

    const audioDownloaded = (evt: Event) => {
        const response = request.response;
        Audio.decodeAudioData(
            response,
            (buffer: AudioBuffer) => {
                audioBuffers[charDef.name] = buffer;
                if (typeof callback === "function")
                    callback();
            },
            (err: DOMException) => console.log("Error loading audio source: ", err));
    }

    request.open("GET", "/audio/" + charDef.fileName, true);
    request.responseType = "arraybuffer";
    request.addEventListener("load", audioDownloaded);

    request.send();
}

Listen(VOICE_ENABLED, (value: boolean) => voiceEnabled = value);
