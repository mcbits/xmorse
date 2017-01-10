import {
    Listen,
    MANUAL_CHAR_SPACING,
    MANUAL_FLASHING_ENABLED,
    MANUAL_LETTERS_ENABLED,
    MANUAL_NUMBERS_ENABLED,
    MANUAL_PITCH,
    MANUAL_SYMBOLS_ENABLED,
    MANUAL_TEXT_BUFFER,
    MANUAL_VOICE_ENABLED,
    MANUAL_VOLUME,
    MANUAL_WPM
} from "./events";

Listen(MANUAL_CHAR_SPACING,
    (value: string) => {
        localStorage.setItem("charSpacing", value);
    });

Listen(MANUAL_FLASHING_ENABLED,
    (value: boolean) => {
        localStorage.setItem("flashingEnabled", value.toString());
    });

Listen(MANUAL_LETTERS_ENABLED,
    (value: boolean) => {
        localStorage.setItem("lettersEnabled", value.toString());
    });

Listen(MANUAL_NUMBERS_ENABLED,
    (value: boolean) => {
        localStorage.setItem("numbersEnabled", value.toString());
    });

Listen(MANUAL_PITCH,
    (value: string) => {
        localStorage.setItem("pitch", value);
    });

Listen(MANUAL_SYMBOLS_ENABLED,
    (value: boolean) => {
        localStorage.setItem("symbolsEnabled", value.toString());
    });

Listen(MANUAL_TEXT_BUFFER,
    (value: boolean) => localStorage.setItem("textBuffer", value.toString()));

Listen(MANUAL_VOICE_ENABLED, (value: boolean) => {
    localStorage.setItem("voiceEnabled", value.toString());
});

Listen(MANUAL_VOLUME,
    (value: string) => localStorage.setItem("volume", value));

Listen(MANUAL_WPM,
    (value: string) => localStorage.setItem("wpm", value));
