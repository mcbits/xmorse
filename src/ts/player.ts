/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="toneplayer.ts"/>
/// <reference path="voiceplayer.ts"/>
/// <reference path="text.ts"/>
/// <reference path="timing.ts"/>

namespace Player
{
	export function playNextPattern(): void
	{
		if (Timing.NowPlaying)
		{
			// Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
			let [text, morseChar] = TextLoader.Next() || [" ", Morse.GetCharacter(" ")];

			if (morseChar)
			{
				let sleepTime = 0;

				// If there is unplayable text, send it to the output buffer and delay for one word-break.
				if (text !== morseChar.name)
				{
					UI.EmitOutput(text.substr(0, text.length - 1));
					UI.DrawPattern(" ");
					UI.EmitCharacter("");
				}

				setTimeout(() =>
				{
					VoicePlayer.PreloadVoice(morseChar);
					TonePlayer.PlayPattern(morseChar);
				}, sleepTime);
			}
			else
			{
				UI.DrawPattern("");
				Notify("patternend", null);
			}
		}
	}

	export function StartPlaying(): void
	{
		if (!Timing.NowPlaying)
		{
			Timing.NowPlaying = true;
			setTimeout(playNextPattern, 500);
		}
	}

	export function StopPlaying(): void
	{
		Timing.NowPlaying = false;
		TonePlayer.StopPlaying();
	}

	function patternComplete(char: Morse.Char): void
	{
		if (Timing.NowPlaying)
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

	Listen("patternend", patternComplete);
}
