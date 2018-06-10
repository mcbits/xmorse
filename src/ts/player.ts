import * as UI from "./controls";
import { pasteBuffer } from "pasteBuffer";
import * as TonePlayer from "./toneplayer";
import * as VoicePlayer from "./voiceplayer";
import * as Morse from "./morsetable";

class Player
{
	private playing: boolean;

	async PlayNextPattern(): Promise<void>
	{
		if (this.playing)
		{
			// Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
			let [text, morseChar] = pasteBuffer.Next() || [" ", Morse.GetCharacter(" ")];

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
				await this.PlayNextPattern();
			}
		}
	}

	async StartPlaying(): Promise<void>
	{
		if (!this.playing)
		{
			this.playing = true;
			await this.PlayNextPattern();
		}
	}

	StopPlaying(): void
	{
		this.playing = false;
		TonePlayer.StopPlaying();
	}

	async PatternComplete(char: Morse.Char): Promise<void>
	{
		if (this.playing)
		{
			// PlayNextPattern() will be called when done.
			await VoicePlayer.PlayVoice(char);
		}
	}
}

export const player = new Player();
