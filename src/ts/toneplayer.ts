/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="timing.ts"/>
namespace CharBufferCache
{
	let cache = {};

	export function Add(char: string, buffer: AudioBuffer)
	{
		cache[char] = buffer;
	}

	export function Get(char: string)
	{
		return cache[char];
	}

	export function Clear()
	{
		cache = {};
	}
}

namespace TonePlayer
{
	let T = Timing;

	let Freq = 500;
	let ditBuffer: AudioBuffer;
	let dahBuffer: AudioBuffer;
	let charSpaceBuffer: AudioBuffer;
	let wordSpaceBuffer: AudioBuffer;
	const ramp = 0.0;

	function initializeBuffers()
	{
		CharBufferCache.Clear();
		const allCharacters = Morse.AllCharacters();
		for (let i = 0; i < allCharacters.length; ++i)
		{
			const char = allCharacters[i];
			const buffer = createCharacterBuffer(char);
			CharBufferCache.Add(char.name, buffer);
		}

		// Empty character
		CharBufferCache.Add("", AudioCtx.createBuffer(1, Timing.UnitTime * 2 * Timing.SampleRate, Timing.SampleRate));

		// Space character
		CharBufferCache.Add(" ", AudioCtx.createBuffer(1, Timing.UnitTime * 4 * Timing.SampleRate, Timing.SampleRate));
	}

	function addToneToBuffer(units: number, samplesPerUnit: number, data: Float32Array, initialSample: number): void
	{
		const omega = 2 * Math.PI * Freq / Timing.SampleRate;

		// Number of audio samples in the ramp up/down periods.
		const rampSamples = Math.min(Math.ceil(Timing.Ramp * Timing.SampleRate), samplesPerUnit);

		// Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
		const soundSamples = Math.ceil(samplesPerUnit * units);

		for (let t = initialSample, rampPos = 0; t < initialSample + rampSamples; ++t, ++rampPos)
		{
			data[t] = Math.sin(omega * t) * (rampPos / rampSamples);
		}

		for (let t = initialSample + rampSamples; t < initialSample + soundSamples - rampSamples; ++t)
		{
			data[t] = Math.sin(omega * t);
		}

		for (let t = initialSample + soundSamples - rampSamples, rampPos = rampSamples; t < initialSample + soundSamples; ++t, --rampPos)
		{
			data[t] = Math.sin(omega * t) * (rampPos / rampSamples);
		}
	}

	function countUnitsInPattern(pattern: string): number
	{
		let total = 0;

		for (let i = 0; i < pattern.length; ++i)
		{
			switch (pattern[i])
			{
				case ".":
					total += 2;
					break;
				case "-":
					total += 4;
					break;
			}
		}

		return total;
	}

	function createCharacterBuffer(char: Morse.Char): AudioBuffer
	{
		const pattern = char.pattern;

		// Number of audio samples per Morse code unit of time.
		const samplesPerUnit = Math.ceil(Timing.UnitTime * Timing.SampleRate);

		// Number of audio samples in the ramp up/down periods.
		const rampSamples = Math.min(Math.ceil(Timing.Ramp * Timing.SampleRate), samplesPerUnit);

		const units = countUnitsInPattern(pattern);

		// Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
		const soundSamples = Math.ceil(samplesPerUnit * units);

		// Total samples in the clip. This is the "on" time + ramp-down time + any remaining silence.
		const totalSamples = Math.ceil(samplesPerUnit * units + (samplesPerUnit * Timing.CharSpacing));

		const buffer = AudioCtx.createBuffer(1, totalSamples, Timing.SampleRate);
		const data = buffer.getChannelData(0);

		let pos = 0;

		for (let i = 0; i < pattern.length; ++i)
		{
			switch (pattern[i])
			{
				case ".":
					addToneToBuffer(1, samplesPerUnit, data, pos);
					pos += 2 * samplesPerUnit;
					break;
				case "-":
					addToneToBuffer(3, samplesPerUnit, data, pos);
					pos += 4 * samplesPerUnit;
					break;
			}
		}

		return buffer;
	}

	export function PlayPattern(char: Morse.Char): void
	{
		Notify(EMIT_LETTER, char.name);
		Notify(PATTERN_START, char.pattern);

		// const charTones = char.pattern.split("");

		// playCharTone(char, charTones, ditBuffer, dahBuffer);

		const src = AudioCtx.createBufferSource();
		src.connect(MasterGain);
		src.buffer = CharBufferCache.Get(char.name);
		src.addEventListener("ended", () => Notify(PATTERN_STOP, char));
		src.start();
	}

	Listen(SET_PITCH, (value: number) => { Freq = value; initializeBuffers(); });
	Listen(SET_UNIT_TIME, (value: number) => initializeBuffers());
	Listen(SET_SPACING, (value: number) => initializeBuffers());
}
