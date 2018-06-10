import * as Player from "./player";
import * as Morse from "./morsetable";
import { AudioCtx, VoiceGain } from "./audiocontext";

// For caching audio files as they're loaded
const audioBuffers: { [charName: string]: AudioBuffer } = {};

let enabled = false;
let loadingPromise: Promise<void>;

async function loadVoice(char: Morse.Char): Promise<void>
{
	try
	{
		const response = await fetch("/snd/" + Morse.fileName(char), { method: "GET" });

		if (response.status === 200 || response.status === 304)
		{
			const arrayBuffer = await response.arrayBuffer();
			audioBuffers[char.name] = await AudioCtx.decodeAudioData(arrayBuffer);
		}
		else
			throw "Failed to fetch audio.";

	}
	catch (err)
	{
		console.error("Error deocding audio source: ", err);
	}
}

export function Enable(value: boolean)
{
	enabled = value;
}

export async function Preload(char: Morse.Char): Promise<void>
{
	if (enabled && !audioBuffers[char.name] && !loadingPromise)
		loadingPromise = loadVoice(char);
}

export async function PlayVoice(char: Morse.Char): Promise<void>
{
	if (!enabled || !char || !Morse.fileName(char))
		await Player.PlayNextPattern();
	else
	{
		if (loadingPromise)
		{
			await loadingPromise;
			loadingPromise = undefined;
		}

		const audioBuffer = audioBuffers[char.name];

		if (audioBuffer)
		{
			const audioSource = AudioCtx.createBufferSource();
			audioSource.addEventListener("ended", Player.PlayNextPattern);
			audioSource.buffer = audioBuffer;
			audioSource.connect(VoiceGain);
			audioSource.start(0);
		}
		else
		{
			Player.PlayNextPattern();
		}
	}
}
