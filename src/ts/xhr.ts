namespace Xhr {
	export function Load<T>(url: string, responseType: XMLHttpRequestResponseType, success: (_: T) => void): void {
		const request = new XMLHttpRequest();
		request.responseType = responseType;
		request.onload = () => {
			if (request.status === 200)
				success(request.response);
			else
				console.log("Sever request failed: ", request);
		};
		request.onerror = () => { console.log("Server request failed: ", request); };
		request.open("GET", url);
		request.send();
	}

	export class AudioLoader {
		// For caching audio files as they're loaded
		private audioBuffers: { [char: string]: AudioBuffer } = {};

		private loading: { [_: string]: boolean } = {};

		private loaded: { [_: string]: boolean } = {};

		private playWhenDone = false;

		private voiceEnabled = false;

		private voiceGain: GainNode;

		private basePath = "";

		/**
		 * Creates an instance of AudioLoader.
		 * @param {string} basePath Must end in "/". Path to the directory containing the audio files.
		 * 
		 * @memberOf AudioLoader
		 */
		constructor(basePath: string) {
			this.basePath = basePath;

			// Wire up audio
			this.voiceGain = AudioCtx.createGain();
			this.voiceGain.gain.value = 0.85;
			this.voiceGain.connect(MasterGain);

			// TODO: Move this to a better place so different events can be used.
			Listen(SET_VOICE, (value: boolean) => this.voiceEnabled = value);
		}

		public Preload(char: Morse.Char): void {
			if (this.voiceEnabled && !this.loaded[char.name] && this.loading[char.name])
				this.loadAudio(char);
		}

		public Play(char: Morse.Char): void {
			if (!Timing.NowPlaying)
				return;

			if (!this.voiceEnabled)
				Notify(VOICE_DONE, char);
			else if (this.loading[char.name])
				this.playWhenDone = true;
			else if (!this.loaded[char.name]) {
				this.playWhenDone = true;
				this.loadAudio(char);
			}
			else {
				const buffer = this.audioBuffers[char.name];
				const audioSource = AudioCtx.createBufferSource();
				audioSource.addEventListener("ended", () => Notify(VOICE_DONE, char));
				audioSource.buffer = buffer;
				audioSource.connect(this.voiceGain);
				audioSource.start(0);
			}
		}

		loadAudio = (char: Morse.Char): void => {
			if (this.loaded[char.name])
				this.audioLoaded(char);
			else {
				this.loading[char.name] = true;
				Xhr.Load(this.basePath + Morse.fileName(char), "arraybuffer", this.decodeResponse(char, this.audioLoaded));
			}
		}

		audioLoaded = (char: Morse.Char): void => {
			const play = this.playWhenDone;
			this.playWhenDone = false;

			if (play)
				this.Play(char);
		}

		decodeResponse = (char: Morse.Char, callback: (_: Morse.Char) => void): (_: ArrayBuffer) => void => {
			return (response: ArrayBuffer): void => {
				AudioCtx.decodeAudioData(
					response,
					(buffer: AudioBuffer) => {
						this.audioBuffers[char.name] = buffer;
						this.loading[char.name] = false;
						this.loaded[char.name] = true;

						callback(char);
					},
					(err: DOMException) => console.log("Error loading audio source: ", err));
			};
		}
	}
}
