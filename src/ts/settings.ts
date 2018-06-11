import { ToneGenerator } from "tonegenerator";
import { voicePlayer } from "voiceplayer";
import * as Morse from "morsetable";
import { AudioCtx, MasterGain } from "audiocontext";
import { Query, QueryId } from "query";

export function Initialize()
{
	console.log("Initialize Settings");

	const toneGenerator = new ToneGenerator();
	const resetSettingsButton = QueryId("resetSettings");

	// Settings text labels
	const volumeText = Query<HTMLInputElement>(".volumeText");
	const charWPMText = Query<HTMLInputElement>(".charWPMText");
	const pitchText = Query<HTMLInputElement>(".pitchText");
	const charSpacingText = Query<HTMLInputElement>(".charSpacingText");

	// Settings inputs
	const volumeInput = QueryId<HTMLInputElement>("volume");
	const charWPMInput = QueryId<HTMLInputElement>("charWPM");
	const pitchInput = QueryId<HTMLInputElement>("pitch");
	const charSpacingInput = QueryId<HTMLInputElement>("charSpacing");
	const voiceEnabledInput = QueryId<HTMLInputElement>("voiceEnabled");
	const lettersEnabledInput = QueryId<HTMLInputElement>("lettersEnabled");
	const numbersEnabledInput = QueryId<HTMLInputElement>("numbersEnabled");
	const symbolsEnabledInput = QueryId<HTMLInputElement>("symbolsEnabled");

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

	function setVolume(value: number)
	{
		MasterGain.gain.setTargetAtTime(value, AudioCtx.currentTime, 0.01);
		volumeText.value = Math.floor(value * 100).toString();
		volumeInput.value = value.toString();
	}

	function setWpm(value: number)
	{
		toneGenerator.SetWpm(value);
		charWPMText.value = value.toString();
		charWPMInput.value = value.toString();
	}

	function setPitch(value: number)
	{
		toneGenerator.SetFrequency(value);
		pitchText.value = value.toString();
		pitchInput.value = value.toString();
	}

	function setCharSpacing(value: number)
	{
		toneGenerator.SetCharSpacing(value);
		charSpacingText.value = value.toString();
		charSpacingInput.value = value.toString();
	}

	function setVoiceEnabled(value: boolean)
	{
		voicePlayer.Enable(value);
		voiceEnabledInput.checked = value;
	}

	function setLettersEnabled(value: boolean)
	{
		Morse.SetLetters(value);
		lettersEnabledInput.checked = value;
	}

	function setNumbersEnabled(value: boolean)
	{
		Morse.SetNumbers(value);
		numbersEnabledInput.checked = value;
	}

	function setSymbolsEnabled(value: boolean)
	{
		Morse.SetSymbols(value);
		symbolsEnabledInput.checked = value;
	}

	volumeInput.addEventListener("input", () =>
	{
		const value = parseFloat(volumeInput.value);
		localStorage.setItem("volume", value.toString());
		setVolume(value);
	});

	charWPMInput.addEventListener("input", () =>
	{
		const value = parseInt(charWPMInput.value);
		localStorage.setItem("wpm", value.toString());
		setWpm(value);
	});

	charSpacingInput.addEventListener("input", () =>
	{
		const value = parseInt(charSpacingInput.value);
		localStorage.setItem("charSpacing", value.toString());
		setCharSpacing(value);
	});

	pitchInput.addEventListener("input", () =>
	{
		const value = parseInt(pitchInput.value);
		localStorage.setItem("pitch", value.toString());
		setPitch(value);
	});

	voiceEnabledInput.addEventListener("change", () =>
	{
		const value = voiceEnabledInput.checked;
		localStorage.setItem("voiceEnabled", value.toString());
		voicePlayer.Enable(value);
	});

	lettersEnabledInput.addEventListener("change", () =>
	{
		localStorage.setItem("lettersEnabled", lettersEnabledInput.checked.toString());
		setLettersEnabled(lettersEnabledInput.checked);
	});

	numbersEnabledInput.addEventListener("change", () =>
	{
		localStorage.setItem("numbersEnabled", numbersEnabledInput.checked.toString());
		setNumbersEnabled(numbersEnabledInput.checked);
	});

	symbolsEnabledInput.addEventListener("change", () =>
	{
		localStorage.setItem("symbolsEnabled", symbolsEnabledInput.checked.toString());
		setSymbolsEnabled(symbolsEnabledInput.checked);
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
}
