/// <reference path="events.ts"/>

namespace Timing
{
	export let NowPlaying: boolean;
	export let CharSpacing: number = 1;
	export let UnitTime: number;
	export let DitUnits = 1;
	export let DahUnits = 3;
	export let SampleRate = 48000;
	export let Ramp = 0.01;

	Listen(SET_NOW_PLAYING, (value: boolean) => NowPlaying = value);
	// With 60 seconds per minute and 50 units in "PARIS":
	//     UnitTime in seconds = 60 / (WPM * 50)
	// This simplifies to 1.2 / WPM.
	Listen(SET_WPM, (value: number) => (UnitTime = 1.2 / value) && Notify(SET_UNIT_TIME, UnitTime));
	Listen(SET_SPACING, (value: number) => CharSpacing = value);
}
