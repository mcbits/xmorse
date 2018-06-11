import { player } from "player";
import * as Morse from "./morsetable";
import { AudioCtx, VoiceGain } from "./audiocontext";

class VoicePlayer
{
	// For caching audio files as they're loaded
	private readonly audioBuffers: { [charName: string]: AudioBuffer } = {};

	private enabled = false;
	private loadingPromise: Promise<void>;

	private async loadVoice(char: Morse.Char): Promise<void>
	{
		try
		{
			const response = await fetch("/snd/" + Morse.fileName(char), { method: "GET" });

			if (response.status === 200 || response.status === 304)
			{
				const arrayBuffer = await response.arrayBuffer();
				this.audioBuffers[char.name] = await AudioCtx.decodeAudioData(arrayBuffer);
			}
			else
				throw "Failed to fetch audio.";

		}
		catch (err)
		{
			console.error("Error deocding audio source: ", err);
		}
	}

	Enable(value: boolean)
	{
		this.enabled = value;
	}

	async Preload(char: Morse.Char): Promise<void>
	{
		if (this.enabled && !this.audioBuffers[char.name] && !this.loadingPromise)
			this.loadingPromise = this.loadVoice(char);
	}

	async PlayVoice(char: Morse.Char): Promise<void>
	{
		if (!this.enabled || !char || !Morse.fileName(char))
			await player.PlayNextPattern();
		else
		{
			if (this.loadingPromise)
			{
				await this.loadingPromise;
				this.loadingPromise = undefined;
			}

			const audioBuffer = this.audioBuffers[char.name];

			if (audioBuffer)
			{
				const audioSource = AudioCtx.createBufferSource();
				audioSource.addEventListener("ended", player.PlayNextPattern);
				audioSource.buffer = audioBuffer;
				audioSource.connect(VoiceGain);
				audioSource.start(0);
			}
			else
			{
				await player.PlayNextPattern();
			}
		}
	}
}

export const voicePlayer = new VoicePlayer();
