import { PasteBuffer } from "pasteBuffer";
import { TonePlayer } from "toneplayer";
import { VoicePlayer } from "voiceplayer";
import { ui, pasteBuffer } from "controls";
import * as Morse from "morsetable";

class Player
{
	private playing: boolean;
	private voiceEnabled: boolean;

	constructor(private readonly tonePlayer: TonePlayer, private readonly voicePlayer: VoicePlayer, private pasteBuffer: PasteBuffer)
	{
		console.log("Construct Player");
		document.addEventListener("voicedone", this.VoiceComplete);
	}

	PlayNextPattern = async (): Promise<void> =>
	{
		// Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
		let [text, morseChar] = this.pasteBuffer.Next();

		if (this.voiceEnabled)
			this.voicePlayer.Preload(morseChar);

		// If there is unplayable text, send it to the output buffer.
		if (text !== morseChar.name)
		{
			ui.DrawPattern(" ");
			ui.EmitCharacter("");
			ui.OutputString(text.substr(0, text.length - 1));
		}

		this.tonePlayer.PlayPattern(morseChar);
	}

	async Start(): Promise<void>
	{
		if (!this.playing)
		{
			this.playing = true;
			await this.PlayNextPattern();
		}
	}

	Pause()
	{
		this.playing = false;
	}

	Stop(): void
	{
		this.playing = false;
		this.tonePlayer.Stop();
		this.voicePlayer.Stop();
	}

	VoiceComplete = async () =>
	{
		if (this.playing)
			await this.PlayNextPattern();
	}

	PatternComplete = async (char: Morse.Char) =>
	{
		if (this.playing)
		{
			if (this.voiceEnabled)
				await this.voicePlayer.PlayVoice(char);
			else
				await this.PlayNextPattern();
		}
	}

	EnableVoice(value: boolean)
	{
		this.voiceEnabled = value;
	}
}

export const player = new Player(new TonePlayer(), new VoicePlayer(), pasteBuffer);
