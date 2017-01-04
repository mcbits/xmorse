import * as Morse from "./morsetable";

export class MorseParams {
    private started = false;

    public wpm = 18;
    public charSpacing = 25;
    public unitTime = () => 1.2 / this.wpm * 1000;
    public currentCharacter: Morse.CharacterInfo = null;
    public pitch = 700;

    constructor() {
        document.addEventListener("wpmchange", (evt: CustomEvent) => this.wpm = evt.detail);
        document.addEventListener("charspacingchange", (evt: CustomEvent) => this.charSpacing = evt.detail);
        document.addEventListener("pitchchange", (evt: CustomEvent) => this.pitch = evt.detail);
    }

    public nowPlaying(value?: boolean): boolean {
        if (typeof value !== "undefined")
            this.started = value;

        return this.started;
    }
}
