/// <reference path="events.ts"/>

namespace Timing
{
	export let NowPlaying: boolean;
	export let UnitTime: number;
	export let DitUnits = 1;
	export let DahUnits = 3;
	export let SampleRate = 48000;
	export let Ramp = 0.01;

	// With 60 seconds per minute and 50 units in "PARIS":
	//     UnitTime in seconds = 60 / (WPM * 50)
	// This simplifies to 1.2 / WPM.
	export function SetWpm(value: number)
	{
		UnitTime = 1.2 / value;
		TonePlayer.InitializeBuffers();
	}
}
