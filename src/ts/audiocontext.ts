export const AudioCtx: AudioContext = new AudioContext();

// Wire up audio

export const MasterGain = AudioCtx.createGain();
MasterGain.gain.value = 0.5;
MasterGain.connect(AudioCtx.destination);

export const VoiceGain = AudioCtx.createGain();
VoiceGain.gain.value = 0.80;
VoiceGain.connect(MasterGain);

export const ToneGain = AudioCtx.createGain();
ToneGain.gain.value = 1;
ToneGain.connect(MasterGain);
