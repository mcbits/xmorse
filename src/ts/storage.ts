/// <reference path="events.ts"/>

namespace LocalStorage {
	Listen(UI_SPACING,
		(value: string) => localStorage.setItem("charSpacing", value));

	Listen(UI_FLASHING,
		(value: boolean) => localStorage.setItem("flashingEnabled", value.toString()));

	Listen(UI_LETTERS,
		(value: boolean) => localStorage.setItem("lettersEnabled", value.toString()));

	Listen(UI_NUMBERS,
		(value: boolean) => localStorage.setItem("numbersEnabled", value.toString()));

	Listen(UI_PITCH,
		(value: string) => localStorage.setItem("pitch", value));

	Listen(UI_SYMBOLS,
		(value: boolean) => localStorage.setItem("symbolsEnabled", value.toString()));

	Listen(UI_TEXT_BUFFER,
		(value: boolean) => localStorage.setItem("textBuffer", value.toString()));

	Listen(UI_VOICE,
		(value: boolean) => localStorage.setItem("voiceEnabled", value.toString()));

	Listen(UI_VOLUME,
		(value: string) => { console.log("set volume: ", value); localStorage.setItem("volume", value) });

	Listen(UI_WPM,
		(value: string) => localStorage.setItem("wpm", value));
}
