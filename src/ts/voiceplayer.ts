import * as Morse from "./morsetable";
import { MorseParams } from "./morseparams";

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export class VoicePlayer {
    public audioSources: { [char: string]: AudioBuffer } = {};
    public voiceGain = this.audioCtx.createGain();

    constructor(private audioCtx: AudioContext, private params: MorseParams) {
        this.voiceGain.gain.value = 0.85;
    }

    public playVoice = async (): Promise<void> => {
        if (this.params.nowPlaying()) {
            await delay(this.params.unitTime() * this.params.charSpacing);
            const char = this.params.currentCharacter.name;
            const buffer = this.audioSources[char];
            if (typeof buffer !== "undefined") {
                const audioSource = this.audioCtx.createBufferSource();
                audioSource.addEventListener("ended", () => document.dispatchEvent(new Event("voicedoneplaying")));
                audioSource.buffer = buffer;
                audioSource.connect(this.voiceGain);
                audioSource.start(0);
            }
        }
    }

    public loadAudio = (charDef: Morse.CharacterInfo) => {
        const audioLoadedEvent = new Event("audioloaded");
        const char = charDef.name;
        let request: XMLHttpRequest;

        const audioDownloaded = (evt: Event) => {
            const response = request.response;
            this.audioCtx.decodeAudioData(
                response,
                (buffer: AudioBuffer) => {
                    this.audioSources[char] = buffer;
                    document.dispatchEvent(audioLoadedEvent);
                },
                (err: DOMException) => console.log("Error loading audio source: ", err));
        }

        if (typeof this.audioSources[char] !== "undefined") {
            document.dispatchEvent(audioLoadedEvent);
            return this.audioSources[char];
        }
        else {
            request = new XMLHttpRequest();

            request.open("GET", "/audio/" + charDef.fileName, true);
            request.responseType = "arraybuffer";
            request.addEventListener("load", audioDownloaded);

            request.send();
        }
    }
}
