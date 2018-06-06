/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="timing.ts"/>

namespace TonePlayer
{
	let T = Timing;

	let ditBuffer: AudioBuffer;
	let dahBuffer: AudioBuffer;
	let charSpaceBuffer: AudioBuffer;
	let wordSpaceBuffer: AudioBuffer;
	let currentBufferSource: AudioBufferSourceNode;
	const ramp = 0.0;

	export let Frequency = 650;
	export let CharSpacing: number = 2;

	function addToneToBuffer(units: number, samplesPerUnit: number, data: Float32Array, initialSample: number): void
	{
		const omega = 2 * Math.PI * Frequency / Timing.SampleRate;

		// Number of audio samples in the ramp up/down periods.
		const rampSamples = Math.min(Math.ceil(Timing.Ramp * Timing.SampleRate), samplesPerUnit);

		// Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
		const soundSamples = Math.ceil(samplesPerUnit * units);

		// Ramp up
		for (let t = initialSample, rampPos = 0; t < initialSample + rampSamples; ++t, ++rampPos)
		{
			data[t] = Math.sin(omega * t) * (rampPos / rampSamples);
		}

		// Main sine wave
		for (let t = initialSample + rampSamples; t < initialSample + soundSamples - rampSamples; ++t)
		{
			data[t] = Math.sin(omega * t);
		}

		// Ramp down
		for (let t = initialSample + soundSamples - rampSamples, rampPos = rampSamples; t < initialSample + soundSamples; ++t, --rampPos)
		{
			data[t] = Math.sin(omega * t) * (rampPos / rampSamples);
		}
	}

	// Normally dit and dah are 10 and 1110 in binary, which are 2 and 4 units.
	function countUnitsInPattern(pattern: string): number
	{
		let total = 0;

		for (let i = 0; i < pattern.length; ++i)
		{
			total += (pattern[i] === "." ? Timing.DitUnits : Timing.DahUnits) + Timing.DitUnits;
		}

		return total;
	}

	function createCharacterBuffer(char: Morse.Char): AudioBuffer
	{
		const pattern = char.pattern;

		// Number of dit-length units in the pattern.
		const units = countUnitsInPattern(pattern);

		// Number of audio samples per Morse code unit of time.
		const samplesPerUnit = Math.ceil(Timing.UnitTime * Timing.SampleRate);

		// Number of audio samples in the ramp up/down periods.
		const rampSamples = Math.min(Math.ceil(Timing.Ramp * Timing.SampleRate), samplesPerUnit);

		// Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
		const soundSamples = Math.ceil(samplesPerUnit * units);

		// Total samples in the clip. This is the "on" time + ramp-down time + any remaining silence.
		const totalSamples = Math.ceil(samplesPerUnit * units + (samplesPerUnit * CharSpacing));

		const buffer = AudioCtx.createBuffer(1, totalSamples, Timing.SampleRate);

		const data = buffer.getChannelData(0);

		let pos = 0;

		for (let i = 0; i < pattern.length; ++i)
		{
			switch (pattern[i])
			{
				case ".":
					addToneToBuffer(Timing.DitUnits, samplesPerUnit, data, pos);
					pos += samplesPerUnit * (Timing.DitUnits + Timing.DitUnits);
					break;
				case "-":
					addToneToBuffer(Timing.DahUnits, samplesPerUnit, data, pos);
					pos += samplesPerUnit * (Timing.DahUnits + Timing.DitUnits);
					break;
			}
		}

		return buffer;
	}

	export function InitializeBuffers()
	{
		const allCharacters = Morse.AllCharacters();

		for (let i = 0; i < allCharacters.length; ++i)
		{
			const char = allCharacters[i];
			const buffer = createCharacterBuffer(char);

			char.toneAudioBuffer = buffer;
		}

		const emptyChar = Morse.GetCharacter("");
		const spaceChar = Morse.GetCharacter(" ");
		const charSpaceTime = Timing.UnitTime * Timing.SampleRate * CharSpacing;

		emptyChar.toneAudioBuffer = AudioCtx.createBuffer(1, charSpaceTime, Timing.SampleRate);
		spaceChar.toneAudioBuffer = AudioCtx.createBuffer(1, charSpaceTime * 3, Timing.SampleRate);
	}

	export function SetFrequency(value: number)
	{
		Frequency = value;
		InitializeBuffers();
	}

	export function SetCharSpacing(value: number)
	{
		CharSpacing = value;
		InitializeBuffers();
	}

	export function StopPlaying()
	{
		if (currentBufferSource)
			currentBufferSource.stop();
	}

	export function PlayPattern(char: Morse.Char): void
	{
		UI.EmitCharacter(char.name);
		UI.DrawPattern(char.pattern);

		currentBufferSource = AudioCtx.createBufferSource();
		currentBufferSource.connect(MasterGain);
		currentBufferSource.buffer = char.toneAudioBuffer;
		currentBufferSource.addEventListener("ended", () => Notify("patternend", char));
		currentBufferSource.start();
	}
}
