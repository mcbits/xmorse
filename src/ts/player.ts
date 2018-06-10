import * as UI from "./controls";
import * as TextLoader from "./text";
import * as TonePlayer from "./toneplayer";
import * as VoicePlayer from "./voiceplayer";
import * as Morse from "./morsetable";

let nowPlaying: boolean;

export async function PlayNextPattern(): Promise<void>
{
	if (nowPlaying)
	{
		// Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
		let [text, morseChar] = TextLoader.Next() || [" ", Morse.GetCharacter(" ")];

		if (morseChar)
		{
			// If there is unplayable text, send it to the output buffer and delay for one word-break.
			if (text !== morseChar.name)
			{
				UI.OutputString(text.substr(0, text.length - 1));
				UI.DrawPattern(" ");
				UI.EmitCharacter("");
			}

			VoicePlayer.Preload(morseChar);
			TonePlayer.PlayPattern(morseChar);
		}
		else
		{
			await PlayNextPattern();
		}
	}
}

export async function StartPlaying(): Promise<void>
{
	if (!nowPlaying)
	{
		nowPlaying = true;
		await PlayNextPattern();
	}
}

export function StopPlaying(): void
{
	nowPlaying = false;
	TonePlayer.StopPlaying();
}

export async function PatternComplete(char: Morse.Char): Promise<void>
{
	if (nowPlaying)
	{
		// PlayNextPattern() will be called when done.
		await VoicePlayer.PlayVoice(char);
	}
	else
	{
		StopPlaying();
	}
}
