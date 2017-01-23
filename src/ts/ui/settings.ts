/// <reference path="../events.ts"/>

namespace Settings {
	const resetSettingsButton = QueryId("resetSettings");

	// Settings text labels
	const volumeText = Query<HTMLInputElement>(".volumeText");
	const charWPMText = Query<HTMLInputElement>(".charWPMText");
	const pitchText = Query<HTMLInputElement>(".pitchText");
	const charSpacingText = Query<HTMLInputElement>(".charSpacingText");

	// Settings inputs
	export const userSet = {
		volume: QueryId<HTMLInputElement>("volume"),
		charWPM: QueryId<HTMLInputElement>("charWPM"),
		pitch: QueryId<HTMLInputElement>("pitch"),
		charSpacing: QueryId<HTMLInputElement>("charSpacing"),
		voiceEnabled: QueryId<HTMLInputElement>("voiceEnabled"),
		pasteTextBox: QueryId<HTMLTextAreaElement>("pasteText"),
		flashingEnabled: QueryId<HTMLInputElement>("flashingEnabled"),
		lettersEnabled: QueryId<HTMLInputElement>("lettersEnabled"),
		numbersEnabled: QueryId<HTMLInputElement>("numbersEnabled"),
		symbolsEnabled: QueryId<HTMLInputElement>("symbolsEnabled")
	};

	const defaults = {
		charSpacing: 12,
		flashingEnabled: false,
		lettersEnabled: true,
		numbersEnabled: false,
		pitch: 650,
		symbolsEnabled: false,
		voiceEnabled: true,
		volume: 0.40,
		wpm: 15
	};

	function Adjust(name: string, value: any) {
		Notify(name.replace(/^set_/, "ui_"), value.toString());
		Notify(name, value);
	}

	userSet.volume.addEventListener("input",
		() => Adjust(SET_VOLUME, parseFloat(userSet.volume.value)));

	userSet.charWPM.addEventListener("input",
		() => Adjust(SET_WPM, parseInt(userSet.charWPM.value)));

	userSet.charSpacing.addEventListener("input",
		() => Adjust(SET_SPACING, parseInt(userSet.charSpacing.value)));

	userSet.pitch.addEventListener("input",
		() => Adjust(SET_PITCH, parseInt(userSet.pitch.value)));

	userSet.pasteTextBox.addEventListener("input",
		() => Adjust(SET_TEXT_BUFFER, userSet.pasteTextBox.value));

	userSet.voiceEnabled.addEventListener("change",
		() => Adjust(SET_VOICE, userSet.voiceEnabled.checked));

	userSet.flashingEnabled.addEventListener("change",
		() => Adjust(SET_FLASHING_ENABLED, userSet.flashingEnabled.checked));

	userSet.lettersEnabled.addEventListener("change",
		() => Adjust(SET_LETTERS, userSet.lettersEnabled.checked));

	userSet.numbersEnabled.addEventListener("change",
		() => Adjust(SET_NUMBERS, userSet.numbersEnabled.checked));

	userSet.symbolsEnabled.addEventListener("change",
		() => Adjust(SET_SYMBOLS, userSet.symbolsEnabled.checked));

	resetSettingsButton.addEventListener("click",
		() => {
			Adjust(SET_SPACING, defaults.charSpacing);
			Adjust(SET_FLASHING_ENABLED, defaults.flashingEnabled);
			Adjust(SET_LETTERS, defaults.lettersEnabled);
			Adjust(SET_NUMBERS, defaults.numbersEnabled);
			Adjust(SET_PITCH, defaults.pitch);
			Adjust(SET_SYMBOLS, defaults.symbolsEnabled);
			Adjust(SET_VOICE, defaults.voiceEnabled);
			Adjust(SET_VOLUME, defaults.volume);
			Adjust(SET_WPM, defaults.wpm);
		});

	// Update UI in response to settings changes

	Listen(SET_SPACING,
		(value: number) => {
			charSpacingText.value = value.toString();
			userSet.charSpacing.value = value.toString();
		});

	Listen(SET_FLASHING_ENABLED,
		(value: boolean) => userSet.flashingEnabled.checked = value);

	Listen(SET_LETTERS,
		(value: boolean) => userSet.lettersEnabled.checked = value);

	Listen(SET_NUMBERS,
		(value: boolean) => userSet.numbersEnabled.checked = value);

	Listen(SET_PITCH,
		(value: number) => {
			pitchText.value = value.toString();
			userSet.pitch.value = value.toString();
		});

	Listen(SET_SYMBOLS,
		(value: boolean) => userSet.symbolsEnabled.checked = value);

	Listen(SET_TEXT_BUFFER,
		(value: string) => userSet.pasteTextBox.value = value);

	Listen(SET_VOICE,
		(value: boolean) => userSet.voiceEnabled.checked = value);

	Listen(SET_VOLUME,
		(value: number) => {
			volumeText.value = Math.floor(value * 100).toString();
			userSet.volume.value = value.toString();
		});

	Listen(SET_WPM,
		(value: number) => {
			charWPMText.value = value.toString();
			userSet.charWPM.value = value.toString();
		});

	document.addEventListener("DOMContentLoaded", () => {
		// Trigger events to initialize state
		Notify(SET_VOLUME, localStorage.getItem("volume") || defaults.volume);
		Notify(SET_WPM, localStorage.getItem("wpm") || defaults.wpm);
		Notify(SET_SPACING, localStorage.getItem("charSpacing") || defaults.charSpacing);
		Notify(SET_PITCH, localStorage.getItem("pitch") || defaults.pitch);

		const voiceEnabledStorage = localStorage.getItem("voiceEnabled");
		if (voiceEnabledStorage == null)
			Notify(SET_VOICE, defaults.voiceEnabled);
		else
			Notify(SET_VOICE, voiceEnabledStorage === "true");

		const flashingEnabledStorage = localStorage.getItem("flashingEnabled");
		if (flashingEnabledStorage == null)
			Notify(SET_FLASHING_ENABLED, defaults.flashingEnabled);
		else
			Notify(SET_FLASHING_ENABLED, flashingEnabledStorage === "true");

		const lettersEnabledStorage = localStorage.getItem("lettersEnabled");
		if (lettersEnabledStorage == null)
			Notify(SET_LETTERS, defaults.lettersEnabled);
		else
			Notify(SET_LETTERS, lettersEnabledStorage === "true");

		const numbersEnabledStorage = localStorage.getItem("numbersEnabled");
		if (numbersEnabledStorage == null)
			Notify(SET_NUMBERS, defaults.numbersEnabled);
		else
			Notify(SET_NUMBERS, numbersEnabledStorage === "true");

		const symbolsEnabledStorage = localStorage.getItem("symbolsEnabled");
		if (symbolsEnabledStorage == null)
			Notify(SET_SYMBOLS, defaults.symbolsEnabled);
		else
			Notify(SET_SYMBOLS, symbolsEnabledStorage === "true");
	});
}
