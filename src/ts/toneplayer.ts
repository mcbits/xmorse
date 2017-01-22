/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="timing.ts"/>

namespace TonePlayer {
	let T = Timing;

	const firefoxAntiClickDelay = navigator.userAgent.indexOf("irefox") !== -1 ? 0.05 : 0;
	const oscillatorVolume = 0.9;
	const ramp = 0.004;

	// Wire up audio parts.
	// Oscillator frequency will be initialized by UI.
	const oscillator = AudioCtx.createOscillator();
	const oscillatorGain = AudioCtx.createGain();
	oscillatorGain.gain.setValueAtTime(0, AudioCtx.currentTime);
	oscillator.connect(oscillatorGain);
	oscillatorGain.connect(MasterGain);
	oscillator.start(0);

	function on() {
		oscillatorGain.gain.setTargetAtTime(oscillatorVolume, AudioCtx.currentTime + firefoxAntiClickDelay, ramp);
		Notify(OSC_ON, null);
	}

	function off() {
		oscillatorGain.gain.setTargetAtTime(0, AudioCtx.currentTime + firefoxAntiClickDelay, ramp);
		Notify(OSC_OFF, null);
	}

	export function PlayPattern(char: Morse.Char): void {
		Notify(PATTERN_START, char.pattern);
		Notify(LETTER, "");

		let pos = 0;

		for (let i = 0; i < char.pattern.length; ++i) {
			const toneDuration = char.pattern[i] === "." ? 1 : 3;
			setTimeout(on, pos);
			pos += T.UnitTime * toneDuration;
			setTimeout(off, pos);

			pos += T.UnitTime;
		}

		setTimeout(() => Notify(PATTERN_STOP, char), pos - T.UnitTime);
	}

	Listen(SET_PITCH, (value: number) => oscillator.frequency.value = value);
}
