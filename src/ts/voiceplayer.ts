import { CharacterInfo } from "./morsetable";
import { Handle, WPM, CHAR_SPACING, NOW_PLAYING, VOICE_DONE } from "./events";
import { Audio, MasterGain } from "./audiocontext";

// Wire up audio
const voiceGain = Audio.createGain();
voiceGain.gain.value = 0.85;
voiceGain.connect(MasterGain);

const audioSources: { [char: string]: AudioBuffer } = {};

let nowPlaying: boolean;
let charSpacing: number;
let unitTime: number;

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

async function playVoice(char: string): Promise<void> {
    await delay(unitTime * charSpacing);

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

export function loadAudio(charDef: CharacterInfo) {
    let request: XMLHttpRequest;

    const audioDownloaded = (evt: Event) => {
        const response = request.response;
        Audio.decodeAudioData(
            response,
            (buffer: AudioBuffer) => {
                audioSources[charDef.name] = buffer;
                playVoice(charDef.name);
            },
            (err: DOMException) => console.log("Error loading audio source: ", err));
    }

    if (typeof audioSources[charDef.name] !== "undefined") {
        playVoice(charDef.name);
        return audioSources[charDef.name];
    }
    else {
        request = new XMLHttpRequest();

        request.open("GET", "/audio/" + charDef.fileName, true);
        request.responseType = "arraybuffer";
        request.addEventListener("load", audioDownloaded);

        request.send();
    }
}

Handle(WPM, (value: number) => unitTime = 1.2 / value * 1000);
Handle(CHAR_SPACING, (value: number) => charSpacing = value);
Handle(NOW_PLAYING, (value: boolean) => nowPlaying = value);
