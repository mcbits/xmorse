/// <reference path="../events.ts"/>

namespace Settings
{
	const resetSettingsButton = QueryId("resetSettings");

	// Settings text labels
	const volumeText = Query<HTMLInputElement>(".volumeText");
	const charWPMText = Query<HTMLInputElement>(".charWPMText");
	const pitchText = Query<HTMLInputElement>(".pitchText");
	const charSpacingText = Query<HTMLInputElement>(".charSpacingText");

	// Settings inputs
	const settingsUI = {
		volume: QueryId<HTMLInputElement>("volume"),
		charWPM: QueryId<HTMLInputElement>("charWPM"),
		pitch: QueryId<HTMLInputElement>("pitch"),
		charSpacing: QueryId<HTMLInputElement>("charSpacing"),
		voiceEnabled: QueryId<HTMLInputElement>("voiceEnabled"),
		pasteTextBox: QueryId<HTMLTextAreaElement>("pasteText"),
		lettersEnabled: QueryId<HTMLInputElement>("lettersEnabled"),
		numbersEnabled: QueryId<HTMLInputElement>("numbersEnabled"),
		symbolsEnabled: QueryId<HTMLInputElement>("symbolsEnabled")
	};

	const defaults = {
		charSpacing: 2,
		lettersEnabled: true,
		numbersEnabled: false,
		pitch: 650,
		symbolsEnabled: false,
		voiceEnabled: true,
		volume: 0.40,
		wpm: 10
	};

	settingsUI.volume.addEventListener("input", () =>
	{
		const value = parseFloat(settingsUI.volume.value);
		localStorage.setItem("volume", value.toString());
		setVolume(value);
	});

	settingsUI.charWPM.addEventListener("input", () =>
	{
		const value = parseInt(settingsUI.charWPM.value);
		localStorage.setItem("wpm", value.toString());
		setWpm(value);
	});

	settingsUI.charSpacing.addEventListener("input", () =>
	{
		const value = parseInt(settingsUI.charSpacing.value);
		localStorage.setItem("charSpacing", value.toString());
		setCharSpacing(value);
	});

	settingsUI.pitch.addEventListener("input", () =>
	{
		const value = parseInt(settingsUI.pitch.value);
		localStorage.setItem("pitch", value.toString());
		setPitch(value);
	});

	settingsUI.pasteTextBox.addEventListener("input", () =>
	{
		const value = settingsUI.pasteTextBox.value;
		localStorage.setItem("textBuffer", value.toString());
		SetTextBuffer(value);
	});

	settingsUI.voiceEnabled.addEventListener("change", () =>
	{
		const value = settingsUI.voiceEnabled.checked;
		localStorage.setItem("voiceEnabled", value.toString());
		VoicePlayer.SetEnabled(value);
	});

	settingsUI.lettersEnabled.addEventListener("change", () =>
	{
		localStorage.setItem("lettersEnabled", settingsUI.lettersEnabled.checked.toString());
		Morse.SetLetters(settingsUI.lettersEnabled.checked);
		settingsUI.lettersEnabled.checked = settingsUI.lettersEnabled.checked;
	});

	settingsUI.numbersEnabled.addEventListener("change", () =>
	{
		const numbersEnabled = settingsUI.numbersEnabled.checked;
		localStorage.setItem("numbersEnabled", numbersEnabled.toString());
		setNumbersEnabled(numbersEnabled);
	});

	settingsUI.symbolsEnabled.addEventListener("change", () =>
	{
		localStorage.setItem("symbolsEnabled", settingsUI.symbolsEnabled.checked.toString());
		settingsUI.symbolsEnabled.checked = settingsUI.symbolsEnabled.checked;
		Morse.SetSymbols(settingsUI.symbolsEnabled.checked);
	});

	resetSettingsButton.addEventListener("click", () =>
	{
		localStorage.setItem("charSpacing", defaults.charSpacing.toString());
		setCharSpacing(defaults.charSpacing);

		localStorage.setItem("lettersEnabled", defaults.lettersEnabled.toString());
		setLettersEnabled(defaults.lettersEnabled);

		localStorage.setItem("numbersEnabled", defaults.numbersEnabled.toString());
		setNumbersEnabled(defaults.numbersEnabled);

		localStorage.setItem("pitch", defaults.pitch.toString());
		setPitch(defaults.pitch);

		localStorage.setItem("symbolsEnabled", defaults.symbolsEnabled.toString());
		setSymbolsEnabled(defaults.symbolsEnabled);

		localStorage.setItem("voiceEnabled", defaults.voiceEnabled.toString());
		setVoiceEnabled(defaults.voiceEnabled);

		localStorage.setItem("volume", defaults.volume.toString());
		setVolume(defaults.volume);

		localStorage.setItem("wpm", defaults.wpm.toString());
		setWpm(defaults.wpm);
	});

	export function SetTextBuffer(value: string)
	{
		TextLoader.SetTextBuffer(value);
		settingsUI.pasteTextBox.value = value;
	}

	function setVolume(value: number)
	{
		MasterGain.gain.setTargetAtTime(value, AudioCtx.currentTime, 0.01);
		volumeText.value = Math.floor(value * 100).toString();
		settingsUI.volume.value = value.toString();
	}

	function setWpm(value: number)
	{
		TonePlayer.SetWpm(value);
		charWPMText.value = value.toString();
		settingsUI.charWPM.value = value.toString();
	}

	function setPitch(value: number)
	{
		TonePlayer.SetFrequency(value);
		pitchText.value = value.toString();
		settingsUI.pitch.value = value.toString();
	}

	function setCharSpacing(value: number)
	{
		TonePlayer.SetCharSpacing(value);
		charSpacingText.value = value.toString();
		settingsUI.charSpacing.value = value.toString();
	}

	function setVoiceEnabled(value: boolean)
	{
		VoicePlayer.SetEnabled(value);
		settingsUI.voiceEnabled.checked = value;
	}

	function setLettersEnabled(value: boolean)
	{
		Morse.SetLetters(value);
		settingsUI.lettersEnabled.checked = value;
	}

	function setNumbersEnabled(value: boolean)
	{
		Morse.SetNumbers(value);
		settingsUI.numbersEnabled.checked = value;
	}

	function setSymbolsEnabled(value: boolean)
	{
		Morse.SetSymbols(value);
		settingsUI.symbolsEnabled.checked = value;
	}

	document.addEventListener("DOMContentLoaded", () =>
	{
		const volumeStorage = localStorage.getItem("volume");
		const volume = volumeStorage == null
			? defaults.volume
			: parseFloat(volumeStorage);
		setVolume(volume);

		const wpmStorage = localStorage.getItem("wpm");
		const wpm = wpmStorage == null
			? defaults.wpm
			: parseInt(wpmStorage);
		setWpm(wpm);

		const pitchStorage = localStorage.getItem("pitch");
		const pitch = pitchStorage == null
			? defaults.pitch
			: parseInt(pitchStorage);
		setPitch(pitch);

		const charSpacingStorage = localStorage.getItem("charSpacing");
		const charSpacing = charSpacingStorage == null
			? defaults.charSpacing
			: parseInt(charSpacingStorage);
		setCharSpacing(charSpacing);

		const voiceEnabledStorage = localStorage.getItem("voiceEnabled");
		const voiceEnabled = voiceEnabledStorage == null
			? defaults.voiceEnabled
			: voiceEnabledStorage === "true";
		setVoiceEnabled(voiceEnabled);

		const lettersEnabledStorage = localStorage.getItem("lettersEnabled");
		const lettersEnabled = lettersEnabledStorage == null
			? defaults.lettersEnabled
			: lettersEnabledStorage === "true";
		setLettersEnabled(lettersEnabled);

		const numbersEnabledStorage = localStorage.getItem("numbersEnabled");
		const numbersEnabled = numbersEnabledStorage == null
			? defaults.numbersEnabled
			: numbersEnabledStorage === "true";
		setNumbersEnabled(numbersEnabled);

		const symbolsEnabledStorage = localStorage.getItem("symbolsEnabled");
		const symbolsEnabled = symbolsEnabledStorage == null
			? defaults.symbolsEnabled
			: symbolsEnabledStorage === "true";
		setSymbolsEnabled(symbolsEnabled);
	});
}
