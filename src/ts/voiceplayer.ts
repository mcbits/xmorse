import { CharacterInfo } from "./morsetable";
import { Listen, VOICE_DONE, VOICE_ENABLED } from "./events";
import { Audio, MasterGain } from "./audiocontext";
import { NowPlaying } from "./timing";
import { Load } from "./xhr";

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

export async function PreloadVoice(charDef: CharacterInfo, callback?: Function): Promise<void> {
    if (!voiceEnabled || audioBuffers.hasOwnProperty(charDef.name)) {
        if (typeof callback === "function")
            callback();

        return;
    }

    const response = await Load("/audio/" + charDef.fileName, "arraybuffer");

    Audio.decodeAudioData(
        response,
        (buffer: AudioBuffer) => {
            audioBuffers[charDef.name] = buffer;

            if (typeof callback === "function")
                callback();
        },
        (err: DOMException) => console.log("Error loading audio source: ", err));
}

Listen(VOICE_ENABLED, (value: boolean) => voiceEnabled = value);
