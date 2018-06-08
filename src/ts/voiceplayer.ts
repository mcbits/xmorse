import * as Player from "./player";
import * as Morse from "./morsetable";
import { AudioCtx, VoiceGain } from "./audiocontext";

// For caching audio files as they're loaded
const audioBuffers: { [char: string]: AudioBuffer } = {};

let loading: { [_: string]: boolean } = {};
let loaded: { [_: string]: boolean } = {};
let playWhenDone = false;
let enabled = false;

function voiceLoaded(char: Morse.Char): void
{
	const playNow = playWhenDone;
	playWhenDone = false;

	if (playNow)
		PlayVoice(char);
}

function loadVoice(char: Morse.Char): void
{
	if (loaded[char.name])
		voiceLoaded(char);
	else
	{
		loading[char.name] = true;
		fetch("/snd/" + Morse.fileName(char), { method: "GET" })
			.then(response =>
			{
				if (response.status === 200)
					response.arrayBuffer()
						.then(arrayBuffer =>
						{
							AudioCtx.decodeAudioData(
								arrayBuffer,
								function (audioBuffer: AudioBuffer)
								{
									audioBuffers[char.name] = audioBuffer;
									loading[char.name] = false;
									loaded[char.name] = true;

									voiceLoaded(char);
								},
								(err: DOMException) => console.error("Error decoding audio source: ", err));
						});
				else
				{
					console.error("Failed to load voice for char: ", char);
					loading[char.name] = false;
					playWhenDone = false;
					Player.PlayNextPattern();
				}
			})
			.catch(reason => console.error(reason));
	}
}

export function SetEnabled(value: boolean)
{
	enabled = value;
}

export function Cancel()
{
	playWhenDone = false;
}

export function PreloadVoice(char: Morse.Char): void
{
	if (enabled && !loaded[char.name] && loading[char.name])
		loadVoice(char);
}

export function PlayVoice(char: Morse.Char): void
{
	if (!enabled || char == null || Morse.fileName(char) === undefined)
		Player.PlayNextPattern();
	else if (loading[char.name])
		playWhenDone = true;
	else if (!loaded[char.name])
	{
		playWhenDone = true;
		loadVoice(char);
	}
	else
	{
		const buffer = audioBuffers[char.name];
		const audioSource = AudioCtx.createBufferSource();
		audioSource.addEventListener("ended", Player.PlayNextPattern);
		audioSource.buffer = buffer;
		audioSource.connect(VoiceGain);
		audioSource.start(0);
	}
}
