const AudioCtx: AudioContext = new AudioContext();
const MasterGain = AudioCtx.createGain();
MasterGain.gain.value = 0.5;
MasterGain.connect(AudioCtx.destination);
