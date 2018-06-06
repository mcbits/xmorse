/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>

namespace TonePlayer
{
	const ditUnits = 1;
	const dahUnits = 3;
	const sampleRate = 48000;

	let ditBuffer: AudioBuffer;
	let dahBuffer: AudioBuffer;
	let charSpaceBuffer: AudioBuffer;
	let wordSpaceBuffer: AudioBuffer;
	let currentBufferSource: AudioBufferSourceNode;
	let ramp = 0.01;
	let frequency = 650;
	let charSpacing: number = 2;
	let unitTime: number;

	function addToneToBuffer(units: number, samplesPerUnit: number, data: Float32Array, initialSample: number): void
	{
		const omega = 2 * Math.PI * frequency / sampleRate;

		// Number of audio samples in the ramp up/down periods.
		const rampSamples = Math.min(Math.ceil(ramp * sampleRate), samplesPerUnit);

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
			total += (pattern[i] === "." ? ditUnits : dahUnits) + ditUnits;
		}

		return total;
	}

	function createCharacterBuffer(char: Morse.Char): AudioBuffer
	{
		const pattern = char.pattern;

		// Number of dit-length units in the pattern.
		const units = countUnitsInPattern(pattern);

		// Number of audio samples per Morse code unit of time.
		const samplesPerUnit = Math.ceil(unitTime * sampleRate);

		// Number of audio samples in the ramp up/down periods.
		const rampSamples = Math.min(Math.ceil(ramp * sampleRate), samplesPerUnit);

		// Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
		const soundSamples = Math.ceil(samplesPerUnit * units);

		// Total samples in the clip. This is the "on" time + ramp-down time + any remaining silence.
		const totalSamples = Math.ceil(samplesPerUnit * units + (samplesPerUnit * charSpacing));

		const buffer = AudioCtx.createBuffer(1, totalSamples, sampleRate);

		const data = buffer.getChannelData(0);

		let pos = 0;

		for (let i = 0; i < pattern.length; ++i)
		{
			switch (pattern[i])
			{
				case ".":
					addToneToBuffer(ditUnits, samplesPerUnit, data, pos);
					pos += samplesPerUnit * (ditUnits + ditUnits);
					break;
				case "-":
					addToneToBuffer(dahUnits, samplesPerUnit, data, pos);
					pos += samplesPerUnit * (dahUnits + ditUnits);
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
		const charSpaceTime = unitTime * sampleRate * charSpacing;

		emptyChar.toneAudioBuffer = AudioCtx.createBuffer(1, charSpaceTime, sampleRate);
		spaceChar.toneAudioBuffer = AudioCtx.createBuffer(1, charSpaceTime * 3, sampleRate);
	}

	export function SetFrequency(value: number)
	{
		frequency = value;
		InitializeBuffers();
	}

	export function SetCharSpacing(value: number)
	{
		charSpacing = value;
		InitializeBuffers();
	}

	// With 60 seconds per minute and 50 units in "PARIS":
	//     UnitTime in seconds = 60 / (WPM * 50)
	// This simplifies to 1.2 / WPM.
	export function SetWpm(value: number)
	{
		unitTime = 1.2 / value;
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
		currentBufferSource.connect(ToneGain);
		currentBufferSource.buffer = char.toneAudioBuffer;
		currentBufferSource.addEventListener("ended", () =>
		{
			Player.PatternComplete(char);
			UI.PatternComplete(char);
		});
		currentBufferSource.start();
	}
}
