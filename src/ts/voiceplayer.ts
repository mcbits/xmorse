import { CharacterInfo } from "./morsetable";
import { Listen, Notify, VOICE_DONE, VOICE_ENABLED, VOICE_LOADED } from "./events";
import { Audio, MasterGain } from "./audiocontext";
import { NowPlaying } from "./timing";
import { Load } from "./xhr";

// Wire up audio
const voiceGain = Audio.createGain();
voiceGain.gain.value = 0.85;
voiceGain.connect(MasterGain);

const audioBuffers: { [char: string]: AudioBuffer } = {};

let voiceEnabled = true;
let loading = <string[]>[];
let loaded = <string[]>[];
let playWhenDone = false;

async function LoadVoice(char: CharacterInfo, playImmediately: boolean): Promise<void> {
    playWhenDone = playImmediately;

    if (loaded.indexOf(char.name) > -1) {
        Notify(VOICE_LOADED, char);
        return;
    }

    const response = await Load("/audio/" + char.fileName, "arraybuffer");

    Audio.decodeAudioData(
        response,
        function (buffer: AudioBuffer) {
            audioBuffers[char.name] = buffer;

            // Remove character from loading list
            const loadingIndex = loading.indexOf(char.name);
            if (loadingIndex > -1)
                loading.splice(loadingIndex, 1);

            // Add character to loaded list
            if (loaded.indexOf(char.name) < 0)
                loaded.push(char.name);

            Notify(VOICE_LOADED, char);
        },
        (err: DOMException) => console.log("Error loading audio source: ", err));
}

export function PreloadVoice(char: CharacterInfo) {
    if (voiceEnabled && loaded.indexOf(char.name) < 0 && loading.indexOf(char.name) < 0) {
        loading.push(char.name);
        LoadVoice(char, false);
    }
}

export async function PlayVoice(char: CharacterInfo): Promise<void> {
    if (!NowPlaying)
        return;

    if (!voiceEnabled) {
        document.dispatchEvent(new Event(VOICE_DONE));
        return;
    }

    if (loading.indexOf(char.name) > -1) {
        playWhenDone = true;
    }
    else if (loaded.indexOf(char.name) < 0) {
        await LoadVoice(char, true);
    }
    else {
        const buffer = audioBuffers[char.name];
        const audioSource = Audio.createBufferSource();
        audioSource.addEventListener("ended", () => document.dispatchEvent(new Event(VOICE_DONE)));
        audioSource.buffer = buffer;
        audioSource.connect(voiceGain);
        audioSource.start(0);
    }
}

Listen(VOICE_ENABLED, (value: boolean) => voiceEnabled = value);
Listen(VOICE_LOADED, (value: CharacterInfo) => {
    if (playWhenDone)
        PlayVoice(value);
    playWhenDone = false;
});
