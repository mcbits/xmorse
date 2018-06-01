/// <reference path="morsetable.ts"/>
/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="timing.ts"/>

namespace VoicePlayer
{
	// For caching audio files as they're loaded
	const audioBuffers: { [char: string]: AudioBuffer } = {};

	// Wire up audio
	const voiceGain = AudioCtx.createGain();
	voiceGain.gain.value = 0.85;
	voiceGain.connect(MasterGain);

	let voiceEnabled = false;
	let loading: { [_: string]: boolean } = {};
	let loaded: { [_: string]: boolean } = {};
	let playWhenDone = false;

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
						Notify(EMIT_VOICE_DONE, char);
					}
				})
				.catch(reason => console.error(reason));
		}
	}

	export function PreloadVoice(char: Morse.Char): void
	{
		if (voiceEnabled && !loaded[char.name] && loading[char.name])
			loadVoice(char);
	}

	export function PlayVoice(char: Morse.Char): void
	{
		if (Timing.NowPlaying)
		{
			if (!voiceEnabled || Morse.fileName(char) === undefined)
				Notify(EMIT_VOICE_DONE, char);
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
				audioSource.addEventListener("ended", () => Notify(EMIT_VOICE_DONE, char));
				audioSource.buffer = buffer;
				audioSource.connect(voiceGain);
				audioSource.start(0);
			}
		}
	}

	Listen(SET_VOICE, (value: boolean) => voiceEnabled = value);
}
