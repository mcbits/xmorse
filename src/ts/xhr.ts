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
		private _audioBuffers: { [char: string]: AudioBuffer } = {};

		private _loading: { [_: string]: boolean } = {};

		private _loaded: { [_: string]: boolean } = {};

		private _playWhenDone = false;

		private _enabled = false;

		private _gain: GainNode;

		private _basePath = "";

		private _donePlayingEvent = null;

		/**
		 * Creates an instance of AudioLoader.
		 * @param {string} basePath Must end in "/". Path to the directory containing the audio files.
		 * @param {string} enabledEvent 
		 * 
		 * @memberof AudioLoader
		 */
		constructor(basePath: string, enabledEvent: string, donePlayingEvent: string) {
			this._basePath = basePath;

			this._donePlayingEvent = donePlayingEvent;

			// Wire up audio
			this._gain = AudioCtx.createGain();
			this._gain.gain.value = 0.85;
			this._gain.connect(MasterGain);

			// TODO: Move this to a better place so different events can be used.
			Listen(enabledEvent, (value: boolean) => this._enabled = value);
		}

		public Preload(char: Morse.Char): void {
			if (this._enabled && !this._loaded[char.name] && !this._loading[char.name])
				this.loadAudio(char);
		}

		public Play(char: Morse.Char): void {
			if (!Timing.NowPlaying)
				return;

			if (!this._enabled)
				Notify(this._donePlayingEvent, char);
			else if (this._loading[char.name])
				this._playWhenDone = true;
			else if (!this._loaded[char.name]) {
				this._playWhenDone = true;
				this.loadAudio(char);
			}
			else {
				const buffer = this._audioBuffers[char.name];
				const audioSource = AudioCtx.createBufferSource();
				audioSource.addEventListener("ended", () => Notify(this._donePlayingEvent, char));
				audioSource.buffer = buffer;
				audioSource.connect(this._gain);
				audioSource.start(0);
			}
		}

		private loadAudio = (char: Morse.Char): void => {
			if (this._loaded[char.name])
				this.audioLoaded(char);
			else {
				this._loading[char.name] = true;
				Xhr.Load(this._basePath + Morse.fileName(char), "arraybuffer", this.decodeResponse(char, this.audioLoaded));
			}
		}

		private audioLoaded = (char: Morse.Char): void => {
			const play = this._playWhenDone;
			this._playWhenDone = false;

			if (play)
				this.Play(char);
		}

		private decodeResponse = (char: Morse.Char, callback: (_: Morse.Char) => void): (_: ArrayBuffer) => void => {
			return (response: ArrayBuffer): void => {
				AudioCtx.decodeAudioData(
					response,
					(buffer: AudioBuffer) => {
						this._audioBuffers[char.name] = buffer;
						this._loading[char.name] = false;
						this._loaded[char.name] = true;

						callback(char);
					},
					(err: DOMException) => console.log("Error loading audio source: ", err));
			};
		}
	}
}
