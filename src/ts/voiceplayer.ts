/// <reference path="morsetable.ts"/>
/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="timing.ts"/>
/// <reference path="xhr.ts"/>

namespace VoicePlayer {
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

	function voiceLoaded(char: Morse.Char): void {
		const playNow = playWhenDone;
		playWhenDone = false;

		if (playNow)
			PlayVoice(char);
	}

	function decodeResponse(char: Morse.Char, callback: (_: Morse.Char) => void): (_: ArrayBuffer) => void {
		return function (response: ArrayBuffer): void {
			AudioCtx.decodeAudioData(
				response,
				function (buffer: AudioBuffer) {
					audioBuffers[char.name] = buffer;
					loading[char.name] = false;
					loaded[char.name] = true;

					callback(char);
				},
				(err: DOMException) => console.log("Error loading audio source: ", err));
		};
	}

	function loadVoice(char: Morse.Char): void {
		if (loaded[char.name])
			voiceLoaded(char);
		else {
			loading[char.name] = true;
			Xhr.Load("/snd/" + Morse.fileName(char), "arraybuffer", decodeResponse(char, voiceLoaded));
		}
	}

	export function PreloadVoice(char: Morse.Char): void {
		if (voiceEnabled && !loaded[char.name] && loading[char.name])
			loadVoice(char);
	}

	export function PlayVoice(char: Morse.Char): void {
		if (Timing.NowPlaying) {
			if (!voiceEnabled)
				Notify(VOICE_DONE, char);
			else if (loading[char.name])
				playWhenDone = true;
			else if (!loaded[char.name]) {
				playWhenDone = true;
				loadVoice(char);
			}
			else {
				const buffer = audioBuffers[char.name];
				const audioSource = AudioCtx.createBufferSource();
				audioSource.addEventListener("ended", () => Notify(VOICE_DONE, char));
				audioSource.buffer = buffer;
				audioSource.connect(voiceGain);
				audioSource.start(0);
			}
		}
	}

	Listen(SET_VOICE, (value: boolean) => voiceEnabled = value);
}
