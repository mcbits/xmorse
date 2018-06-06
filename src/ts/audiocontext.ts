const AudioCtx: AudioContext = new AudioContext();

// Wire up audio

const MasterGain = AudioCtx.createGain();
MasterGain.gain.value = 0.5;
MasterGain.connect(AudioCtx.destination);

const VoiceGain = AudioCtx.createGain();
VoiceGain.gain.value = 0.80;
VoiceGain.connect(MasterGain);

const ToneGain = AudioCtx.createGain();
ToneGain.gain.value = 1;
ToneGain.connect(MasterGain);
