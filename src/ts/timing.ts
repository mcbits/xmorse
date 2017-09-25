/// <reference path="events.ts"/>

namespace Timing
{
	export let NowPlaying: boolean;
	export let UnitTime: number;
	export let CharSpacing: number;

	Listen(NOW_PLAYING, (value: boolean) => NowPlaying = value);
	Listen(SET_WPM, (value: number) => UnitTime = 1.2 / value * 1000);
	Listen(SET_SPACING, (value: number) => CharSpacing = value);
}
