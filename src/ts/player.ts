/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="toneplayer.ts"/>
/// <reference path="text.ts"/>
/// <reference path="timing.ts"/>

namespace Player {
	const T = Timing;
	const voiceLoader = new Xhr.AudioLoader("/snd/", SET_VOICE, VOICE_DONE);
	const toneLoader = new Xhr.AudioLoader("/snd/10/650/", SET_VOICE, PATTERN_STOP);

	function playNextPattern(): void {
		if (!T.NowPlaying)
			return;

		// Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
		const [junkText, curChar] = TextLoader.Next();

		if (curChar != null) {
			let sleepTime = 0;

			// If there is unplayable text, send it to the output buffer and delay for one word-break.
			if (junkText !== curChar.name) {
				Notify(OUTPUT, junkText.substr(0, junkText.length - 1));
				Notify(PATTERN_START, " ");
				Notify(LETTER, "");

				// A 7/3 factor comes from character spaces being 3 units and word spaces being 7 units.
				sleepTime = T.UnitTime * T.CharSpacing * (7 / 3);
			}

			setTimeout(() => {
				voiceLoader.Preload(curChar);
				toneLoader.Preload(curChar);
				toneLoader.Play(curChar);
				//TonePlayer.PlayPattern(curChar);
			}, sleepTime);
		}
		else {
			Notify(PATTERN_START, "");
			Notify(PATTERN_STOP, null);
		}
	}

	function updateVolume(value: number): void {
		MasterGain.gain.setTargetAtTime(value, AudioCtx.currentTime, 0.01);
	}

	function startPlaying(): void {
		if (!T.NowPlaying) {
			Notify(NOW_PLAYING, true);
			setTimeout(playNextPattern, 500);
		}
	}

	function stopPlaying(): void {
		Notify(NOW_PLAYING, false);
	}

	function patternComplete(char: Morse.Char): void {
		if (T.NowPlaying) {
			if (char == null) {
				setTimeout(playNextPattern, T.UnitTime * T.CharSpacing);
			}
			else {
				Notify(LETTER, char.name);

				// playNextPattern() will be called by VOICE_DONE (which is
				// triggered whether the voice is currently enabled or not).
				//setTimeout(() => VoicePlayer.PlayVoice(char), T.UnitTime * T.CharSpacing);
				setTimeout(() => voiceLoader.Play(char), T.UnitTime * T.CharSpacing);
			}
		}
	}

	Listen(VOICE_DONE, playNextPattern);
	Listen(PAUSE, stopPlaying);
	Listen(STOP, stopPlaying);
	Listen(START, startPlaying);
	Listen(PATTERN_STOP, patternComplete);
	Listen(SET_VOLUME, updateVolume);
}
