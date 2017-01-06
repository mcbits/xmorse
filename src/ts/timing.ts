import { Handle, NOW_PLAYING, WPM, CHAR_SPACING } from "./events";

export let nowPlaying: boolean;
export let unitTime: number;
export let charSpacing: number;

Handle(NOW_PLAYING, (value: boolean) => nowPlaying = value);
Handle(WPM, (value: number) => unitTime = 1.2 / value * 1000);
Handle(CHAR_SPACING, (value: number) => charSpacing = value);
