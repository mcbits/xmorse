import * as Morse from "./morsetable";
import { AudioCtx, VoiceGain } from "./audiocontext";

function voiceDone()
{
	document.dispatchEvent(new CustomEvent("voicedone"));
}

export class VoicePlayer
{
	// For caching audio files as they're loaded
	private readonly audioBuffers: { [charName: string]: AudioBuffer } = {};
	private loadingPromise: Promise<[Morse.Char, AudioBuffer]>;
	private audioSource: AudioBufferSourceNode;

	constructor()
	{
	}

	private async loadVoice(char: Morse.Char): Promise<[Morse.Char, AudioBuffer]>
	{
		try
		{
			const response = await fetch("/snd/" + char.voiceFileName, { method: "GET" });

			if (response.status === 200 || response.status === 304)
			{
				const arrayBuffer = await response.arrayBuffer();
				return [char, await AudioCtx.decodeAudioData(arrayBuffer)];
			}
			else
				throw "Failed to fetch audio.";
		}
		catch (err)
		{
			console.error("Error deocding audio source: ", err);
		}
	}

	Preload(char: Morse.Char)
	{
		if (!this.audioBuffers[char.name] && char && char.voiceFileName)
			this.loadingPromise = this.loadVoice(char);
	}

	Stop()
	{
		if (this.audioSource)
		{
			this.audioSource.removeEventListener("ended", voiceDone);
			this.audioSource = undefined;
		}
	}

	async PlayVoice(char: Morse.Char): Promise<void>
	{
		if (!char || !char.voiceFileName)
			voiceDone()
		else
		{
			if (this.loadingPromise)
			{
				const [loadedChar, loadedBuffer] = await this.loadingPromise;
				this.audioBuffers[loadedChar.name] = loadedBuffer;
				this.loadingPromise = undefined;
			}

			const audioBuffer = this.audioBuffers[char.name];

			if (audioBuffer)
			{
				this.audioSource = AudioCtx.createBufferSource();
				this.audioSource.addEventListener("ended", voiceDone);
				this.audioSource.buffer = audioBuffer;
				this.audioSource.connect(VoiceGain);
				this.audioSource.start(0);
			}
			else
			{
				voiceDone();
			}
		}
	}
}
