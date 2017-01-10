export function Notify(name: string, value: any) {
    document.dispatchEvent(new CustomEvent(name, { detail: value }));
}

export function Listen<T>(name: string, handler: (value?: T) => any) {
    document.addEventListener(name, (evt: CustomEvent) => handler(evt.detail));
}

export const CHAR_SPACING = "charSpacing";
export const FLASHING_ENABLED = "flashingEnabled";
export const HOME = "home";
export const LETTER = "letter";
export const LETTERS_ENABLED = "lettersEnabled";
export const MANUAL_CHAR_SPACING = "manual_charSpacing";
export const MANUAL_FLASHING_ENABLED = "manual_flashingEnabled";
export const MANUAL_LETTERS_ENABLED = "manual_lettersEnabled";
export const MANUAL_NUMBERS_ENABLED = "manual_numbersEnabled";
export const MANUAL_PITCH = "manual_pitch";
export const MANUAL_SYMBOLS_ENABLED = "manual_symbolsEnabled";
export const MANUAL_TEXT_BUFFER = "manual_textBuffer";
export const MANUAL_VOICE_ENABLED = "manual_voiceEnabled";
export const MANUAL_VOLUME = "manual_volume";
export const MANUAL_WPM = "manual_wpm";
export const NOW_PLAYING = "nowPlaying";
export const NUMBERS_ENABLED = "numbersEnabled";
export const OPTIONS = "options";
export const OUTPUT = "output";
export const PATTERN_COMPLETE = "patternComplete";
export const PAUSE = "pause";
export const PITCH = "pitch";
export const START = "start";
export const STORY = "book";
export const STOP = "stop";
export const SYMBOLS_ENABLED = "symbolsEnabled";
export const TEXT_BUFFER = "textBuffer";
export const TONE_OFF = "toneOff";
export const TONE_ON = "toneOn";
export const VOICE_DONE = "voiceDone";
export const VOICE_LOADED = "voiceLoaded";
export const VOICE_ENABLED = "voiceEnabled";
export const VOLUME = "volume";
export const WATCH = "watch";
export const WPM = "wpm";
