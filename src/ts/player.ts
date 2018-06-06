/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="toneplayer.ts"/>
/// <reference path="voiceplayer.ts"/>
/// <reference path="text.ts"/>

namespace Player
{
	let nowPlaying: boolean;

	export function PlayNextPattern(): void
	{
		if (nowPlaying)
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
				Player.PatternComplete(null);
				UI.PatternComplete(null);
			}
		}
	}

	export function StartPlaying(): void
	{
		if (!nowPlaying)
		{
			nowPlaying = true;
			setTimeout(PlayNextPattern, 500);
		}
	}

	export function StopPlaying(): void
	{
		nowPlaying = false;
		VoicePlayer.Cancel();
		TonePlayer.StopPlaying();
	}

	export function PatternComplete(char: Morse.Char): void
	{
		if (nowPlaying)
		{
			if (char == null)
			{
				PlayNextPattern();
			}
			else
			{
				// playNextPattern() will be called by VOICE_DONE (which is
				// triggered whether the voice is currently enabled or not).
				VoicePlayer.PlayVoice(char);
			}
		}
	}
}
