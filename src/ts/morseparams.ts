import * as Morse from "./morsetable";

export class MorseParams {
    private started = false;
    private paused = false;

    public wpm = 18;
    public charSpacing = 25;
    public unitTime = () => 1.2 / this.wpm * 1000;
    public currentCharacter: Morse.CharacterInfo = null;
    public pitch = 700;

    constructor(public letterElement: HTMLElement) {
    }

    public updateWPM = (value: number) => {
        this.wpm = value;
    }

    public updateCharSpacing = (value: number) => {
        this.charSpacing = value;
    }

    public updatePitch = (value: number) => {
        this.pitch = value;
        document.dispatchEvent(new Event("pitchchanged"));
    }

    public nowPlaying(): boolean {
        return this.started && !this.paused;
    }

    public start() {
        this.started = true;
        this.paused = false;
    }

    public stop() {
        this.started = false;
        this.paused = false;
    }

    public pause() {
        this.paused = true;
    }
}
