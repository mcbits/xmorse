import * as Morse from "./morsetable";
import { Handle, WPM, CHAR_SPACING, NOW_PLAYING, VOICE_DONE } from "./events";

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export class VoicePlayer {
    private nowPlaying: boolean;
    private charSpacing: number;
    private unitTime: number;

    public audioSources: { [char: string]: AudioBuffer } = {};
    public voiceGain = this.audioCtx.createGain();

    constructor(private audioCtx: AudioContext) {
        this.voiceGain.gain.value = 0.85;

        Handle(WPM, (value: number) => this.unitTime = 1.2 / value * 1000);
        Handle(CHAR_SPACING, (value: number) => this.charSpacing = value);
        Handle(NOW_PLAYING, (value: boolean) => this.nowPlaying = value);
    }

    public playVoice = async (char: string): Promise<void> => {
        if (this.nowPlaying) {
            await delay(this.unitTime * this.charSpacing);
            const buffer = this.audioSources[char];
            if (typeof buffer !== "undefined") {
                const audioSource = this.audioCtx.createBufferSource();
                audioSource.addEventListener("ended", () => document.dispatchEvent(new Event(VOICE_DONE)));
                audioSource.buffer = buffer;
                audioSource.connect(this.voiceGain);
                audioSource.start(0);
            }
        }
    }

    public loadAudio = (charDef: Morse.CharacterInfo) => {
        let request: XMLHttpRequest;

        const audioDownloaded = (evt: Event) => {
            const response = request.response;
            this.audioCtx.decodeAudioData(
                response,
                (buffer: AudioBuffer) => {
                    this.audioSources[charDef.name] = buffer;
                    this.playVoice(charDef.name);
                },
                (err: DOMException) => console.log("Error loading audio source: ", err));
        }

        if (typeof this.audioSources[charDef.name] !== "undefined") {
            this.playVoice(charDef.name);
            return this.audioSources[charDef.name];
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
