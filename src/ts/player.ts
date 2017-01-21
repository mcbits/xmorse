/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="toneplayer.ts"/>
/// <reference path="voiceplayer.ts"/>
/// <reference path="text.ts"/>
/// <reference path="timing.ts"/>

namespace Player {
	let NowPlaying = Timing.NowPlaying;
	let UnitTime = Timing.UnitTime;
	let CharSpacing = Timing.CharSpacing;

	function playNextPattern(): void {
		if (NowPlaying) {
			// Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
			const nextCharacter = TextLoader.Next();

			if (nextCharacter[1]) {
				let sleepTime = 0;

				// If there is unplayable text, send it to the output buffer and delay for one word-break.
				if (nextCharacter[0] !== nextCharacter[1].name) {
					Notify(OUTPUT, nextCharacter[0].substr(0, nextCharacter[0].length - 1));

					// A 7/3 factor comes from character spaces being 3 units and word spaces being 7 units.
					sleepTime = UnitTime * CharSpacing * (7 / 3);
				}

				setTimeout(() => {
					const currentCharacter = nextCharacter[1];
					VoicePlayer.PreloadVoice(currentCharacter);
					TonePlayer.PlayPattern(currentCharacter);
				}, sleepTime);
			}
			else {
				Notify(PATTERN_START, "");
				Notify(PATTERN_STOP, null);
			}
		}
	}

	function updateVolume(value: number): void {
		MasterGain.gain.setTargetAtTime(value, AudioCtx.currentTime, 0.01);
	}

	function startPlaying(): void {
		if (!NowPlaying) {
			Notify(NOW_PLAYING, true);
			setTimeout(playNextPattern, 500);
		}
	}

	function stopPlaying(): void {
		Notify(NOW_PLAYING, false);
	}

	function patternComplete(char: Morse.Char): void {
		if (NowPlaying) {
			if (char == null) {
				setTimeout(playNextPattern, UnitTime * CharSpacing);
			}
			else {
				Notify(LETTER, char.name);

				// playNextPattern() will be called by VOICE_DONE (which is
				// triggered whether the voice is currently enabled or not).
				setTimeout(() => VoicePlayer.PlayVoice(char), UnitTime * CharSpacing);
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
