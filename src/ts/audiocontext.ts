export const Audio: AudioContext = new (AudioContext || window["webkitAudioContext"])();

export const MasterGain = Audio.createGain();
MasterGain.gain.value = 0.5;
MasterGain.connect(Audio.destination);
