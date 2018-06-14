import { AudioCtx } from "./audiocontext";
import * as Morse from "./morsetable";

const ditUnits = 1;
const dahUnits = 3;
const sampleRate = 48000;
const ramp = 0.01;

// We consider dit and dah to be 10 and 1110 in binary, which are 2 and 4 units.
function countUnitsInPattern(pattern: string): number
{
	let total = 0;

	for (let i = 0; i < pattern.length; ++i)
	{
		total += (pattern[i] === "." ? ditUnits : dahUnits) + ditUnits;
	}

	return total;
}

function addToneToBuffer(frequency: number, units: number, samplesPerUnit: number, initialSample: number, data: Float32Array): void
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

function createCharacterBuffer(frequency: number, unitTime: number, charSpacing: number, char: Morse.Char): AudioBuffer
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
				addToneToBuffer(frequency, ditUnits, samplesPerUnit, pos, data);
				pos += samplesPerUnit * (ditUnits + ditUnits);
				break;
			case "-":
				addToneToBuffer(frequency, dahUnits, samplesPerUnit, pos, data);
				pos += samplesPerUnit * (dahUnits + ditUnits);
				break;
		}
	}

	return buffer;
}

function generateBuffers(frequency: number, unitTime: number, charSpacing: number)
{
	Morse.allCharacters.forEach(char => char.toneAudioBuffer = createCharacterBuffer(frequency, unitTime, charSpacing, char));

	const charSpaceTime = unitTime * sampleRate * charSpacing;

	Morse.GetCharacter("").toneAudioBuffer = AudioCtx.createBuffer(1, charSpaceTime, sampleRate);
	Morse.GetCharacter(" ").toneAudioBuffer = AudioCtx.createBuffer(1, charSpaceTime * 3, sampleRate);
}

export class ToneGenerator
{
	private frequency = 650;
	private charSpacing: number = 2;
	private unitTime: number;

	SetFrequency(value: number)
	{
		this.frequency = value;
		generateBuffers(this.frequency, this.unitTime, this.charSpacing);
	}

	SetCharSpacing(value: number)
	{
		this.charSpacing = value;
		generateBuffers(this.frequency, this.unitTime, this.charSpacing);
	}

	// With 60 seconds per minute and 50 units in "PARIS":
	//     UnitTime in seconds = 60 / (WPM * 50)
	// This simplifies to 1.2 / WPM.
	SetWpm(value: number)
	{
		this.unitTime = 1.2 / value;
		generateBuffers(this.frequency, this.unitTime, this.charSpacing);
	}
}
