import * as UI from "./controls";
import { player } from "player";
import * as Morse from "./morsetable";
import { AudioCtx, ToneGain } from "./audiocontext";

export class TonePlayer
{
	private currentChar: Morse.Char;
	private currentBufferSource: AudioBufferSourceNode;

	Stop()
	{
		this.currentBufferSource.removeEventListener("ended", this.patternEnded);
		this.currentBufferSource.stop(0);
	}

	private patternEnded = (): Promise<void> =>
	{
		UI.OutputChar(this.currentChar);

		return player.PatternComplete(this.currentChar);
	}

	PlayPattern(char: Morse.Char): void
	{
		this.currentChar = char;

		UI.EmitCharacter(char.name);
		UI.DrawPattern(char.pattern);

		this.currentBufferSource = AudioCtx.createBufferSource();
		this.currentBufferSource.connect(ToneGain);
		this.currentBufferSource.buffer = char.toneAudioBuffer;
		this.currentBufferSource.addEventListener("ended", this.patternEnded);
		this.currentBufferSource.start();
	}
}
