export function Notify(name: string, value: any) {
    document.dispatchEvent(new CustomEvent(name, { detail: value }));
}

export function Listen<T>(name: string, handler: (value?: T) => any) {
    document.addEventListener(name, (evt: CustomEvent) => handler(evt.detail));
}

export const CHAR_SPACING = "charSpacing";
export const LETTER = "letter";
export const LETTERS_ENABLED = "lettersEnabled";
export const NOW_PLAYING = "nowPlaying";
export const NUMBERS_ENABLED = "numbersEnabled";
export const OUTPUT = "output";
export const PATTERN_COMPLETE = "patternComplete";
export const PITCH = "pitch";
export const START = "start";
export const STORY = "book";
export const STOP = "stop";
export const TONE_OFF = "toneOff";
export const TONE_ON = "toneOn";
export const VOICE_DONE = "voiceDone";
export const VOICE_LOADED = "voiceLoaded";
export const VOICE_ENABLED = "voiceEnabled";
export const VOLUME = "volume";
export const SYMBOLS_ENABLED = "symbolsEnabled";
export const TEXT_BUFFER = "textBuffer";
export const WPM = "wpm";
