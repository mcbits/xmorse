import { Handle, NOW_PLAYING, WPM, CHAR_SPACING } from "./events";

export let NowPlaying: boolean;
export let UnitTime: number;
export let CharSpacing: number;

Handle(NOW_PLAYING, (value: boolean) => NowPlaying = value);
Handle(WPM, (value: number) => UnitTime = 1.2 / value * 1000);
Handle(CHAR_SPACING, (value: number) => CharSpacing = value);
