/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="toneplayer.ts"/>
/// <reference path="voiceplayer.ts"/>
/// <reference path="text.ts"/>
/// <reference path="timing.ts"/>

namespace Player
{
	const T = Timing;

	function playNextPattern(): void
	{
		if (T.NowPlaying)
		{
			// Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
			let [text, morseChar] = TextLoader.Next() || [" ", {name: " ", pattern: ""}];

			if (morseChar)
			{
				let sleepTime = 0;

				// If there is unplayable text, send it to the output buffer and delay for one word-break.
				if (text !== morseChar.name)
				{
					Notify(EMIT_OUTPUT, text.substr(0, text.length - 1));
					Notify(PATTERN_START, " ");
					Notify(EMIT_LETTER, "");
				}

				setTimeout(() =>
				{
					VoicePlayer.PreloadVoice(morseChar);
					TonePlayer.PlayPattern(morseChar);
				}, sleepTime);
			}
			else
			{
				Notify(PATTERN_START, "");
				Notify(PATTERN_STOP, null);
			}
		}
	}

	function updateVolume(value: number): void
	{
		MasterGain.gain.setTargetAtTime(value, AudioCtx.currentTime, 0.01);
	}

	function startPlaying(): void
	{
		if (!T.NowPlaying)
		{
			Notify(SET_NOW_PLAYING, true);
			setTimeout(playNextPattern, 500);
		}
	}

	function stopPlaying(): void
	{
		Notify(SET_NOW_PLAYING, false);
	}

	function patternComplete(char: Morse.Char): void
	{
		if (T.NowPlaying)
		{
			if (char == null)
			{
				playNextPattern();
			}
			else
			{
				// playNextPattern() will be called by VOICE_DONE (which is
				// triggered whether the voice is currently enabled or not).
				VoicePlayer.PlayVoice(char);
			}
		}
	}

	Listen(EMIT_VOICE_DONE, playNextPattern);
	Listen(CMD_PAUSE, stopPlaying);
	Listen(CMD_STOP, stopPlaying);
	Listen(CMD_START, startPlaying);
	Listen(PATTERN_STOP, patternComplete);
	Listen(SET_VOLUME, updateVolume);
}
