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

				VoicePlayer.PreloadVoice(morseChar);
				TonePlayer.PlayPattern(morseChar);
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
			UI.StartPlaying();
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
			// PlayNextPattern() will be called by VOICE_DONE (which is
			// triggered whether the voice is currently enabled or not).
			VoicePlayer.PlayVoice(char);
		}
	}
}
