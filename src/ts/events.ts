export function Trigger(name: string, value: any) {
    document.dispatchEvent(new CustomEvent(name, { detail: value }));
}

export function Handle<T>(name: string, handler: (value?: T) => any) {
    document.addEventListener(name, (evt: CustomEvent) => handler(evt.detail));
}

export const WPM = "wpm";
export const STOP = "stop";
export const START = "start";
export const PITCH = "pitch";
export const VOLUME = "volume";
export const LETTER = "letter";
export const VOICE_DONE = "voiceDone";
export const NOW_PLAYING = "nowPlaying";
export const TEXT_BUFFER = "textBuffer";
export const CHAR_SPACING = "charSpacing";
export const VOICE_ENABLED = "voiceEnabled";
export const LETTERS_ENABLED = "lettersEnabled";
export const NUMBERS_ENABLED = "numbersEnabled";
export const SYMBOLS_ENABLED = "symbolsEnabled";
export const PATTERN_COMPLETE = "patternComplete";
