import { Listen, NOW_PLAYING, WPM, CHAR_SPACING } from "./events";

export let NowPlaying: boolean;
export let UnitTime: number;
export let CharSpacing: number;

Listen(NOW_PLAYING, (value: boolean) => NowPlaying = value);
Listen(WPM, (value: number) => UnitTime = 1.2 / value * 1000);
Listen(CHAR_SPACING, (value: number) => CharSpacing = value);
