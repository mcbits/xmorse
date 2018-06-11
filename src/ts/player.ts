import * as UI from "controls";
import { pasteBuffer } from "pasteBuffer";
import { TonePlayer } from "toneplayer";
import { voicePlayer } from "voiceplayer";
import * as Morse from "morsetable";

class Player
{
	private playing: boolean;

	constructor(private readonly tonePlayer: TonePlayer) { }

	PlayNextPattern = async (): Promise<void> =>
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

				voicePlayer.Preload(morseChar);
				this.tonePlayer.PlayPattern(morseChar);
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
		this.tonePlayer.Stop();
	}

	async PatternComplete(char: Morse.Char): Promise<void>
	{
		if (this.playing)
		{
			// PlayNextPattern() will be called when done.
			await voicePlayer.PlayVoice(char);
		}
	}
}

export const player = new Player(new TonePlayer());
