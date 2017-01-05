import {
    Trigger, Handle,
    NOW_PLAYING, WPM, CHAR_SPACING, PATTERN_COMPLETE, VOLUME, LETTER,
    VOICE_ENABLED, VOICE_DONE, START, STOP, TEXT_BUFFER
} from "./events";
import { Audio, MasterGain } from "./audiocontext";
import { CharacterInfo, GetCharacter, RandomCharacter } from "./morsetable";
import { playPattern } from "./toneplayer";
import { loadAudio } from "./voiceplayer";

// State
let nowPlaying: boolean;
let charSpacing: number;
let unitTime: number;
let currentCharacter: CharacterInfo = null;
let voiceEnabled = true;
let textBuffer = "";
let textBufferIndex = 0;

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

async function playNextPattern(): Promise<void> {
    if (nowPlaying) {
        if (textBuffer.length > 0) {
            if (textBufferIndex >= textBuffer.length)
                textBufferIndex = 0;
            currentCharacter = GetCharacter(textBuffer[textBufferIndex]);
        }
        else {
            currentCharacter = RandomCharacter();
        }

        await delay(unitTime * charSpacing);

        await playPattern(currentCharacter);
    }
}

function updateVolume(value: number) {
    MasterGain.gain.setTargetAtTime(value, Audio.currentTime, 0.01);
}

async function startPlaying() {
    Trigger(NOW_PLAYING, true);
    await playNextPattern();
}

function stopPlaying() {
    Trigger(NOW_PLAYING, false);
}

function updateTextBuffer(text: string) {
    textBuffer = text;
    textBufferIndex = 0;
}

function patternComplete(char: CharacterInfo) {
    if (textBuffer.length > 0) {
        ++textBufferIndex;

        if (textBufferIndex === textBuffer.length)
            textBufferIndex = 0;
    }

    if (currentCharacter != null) {
        Trigger(LETTER, char.name);

        if (nowPlaying) {
            if (voiceEnabled)
                loadAudio(char);
            else
                playNextPattern();
        }
    }
    else {
        playNextPattern();
    }
}

Handle(NOW_PLAYING, (value: boolean) => nowPlaying = value);
Handle(WPM, (value: number) => unitTime = 1.2 / value * 1000);
Handle(CHAR_SPACING, (value: number) => charSpacing = value);
Handle(VOICE_DONE, playNextPattern);
Handle(STOP, stopPlaying);
Handle(START, startPlaying);
Handle(PATTERN_COMPLETE, patternComplete);
Handle(VOLUME, updateVolume);
Handle(TEXT_BUFFER, updateTextBuffer);
Handle(VOICE_ENABLED, (value: boolean) => voiceEnabled = value);
