import {
    Notify, Listen,
    PATTERN_COMPLETE, VOLUME, LETTER, NOW_PLAYING,
    VOICE_DONE, START, STOP, OUTPUT
} from "./events";
import { Sleep } from "./sleep";
import { Audio, MasterGain } from "./audiocontext";
import { CharacterInfo } from "./morsetable";
import { PlayPattern } from "./toneplayer";
import { PreloadVoice, PlayVoice } from "./voiceplayer";
import { Next } from "./text";
import { UnitTime, CharSpacing, NowPlaying } from "./timing";

async function playNextPattern(): Promise<void> {
    if (NowPlaying) {
        // Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
        const nextCharacter = Next();

        if (nextCharacter[1]) {
            // If there is unplayable text, send it to the output buffer and delay for one word-break.
            if (nextCharacter[0] != nextCharacter[1].name) {
                Notify(OUTPUT, nextCharacter[0].substr(0, nextCharacter[0].length - 1));

                // The 7/3 factor comes from character spaces being 3 units and word spaces being 7 units.
                await Sleep(UnitTime * CharSpacing * (7 / 3));
            }

            const currentCharacter = nextCharacter[1];

            PreloadVoice(currentCharacter);

            await PlayPattern(currentCharacter);
        }
        else
            Notify(PATTERN_COMPLETE, null);

        await Sleep(UnitTime * CharSpacing);
    }
}

function updateVolume(value: number) {
    MasterGain.gain.setTargetAtTime(value, Audio.currentTime, 0.01);
}

async function startPlaying() {
    if (!NowPlaying) {
        Notify(NOW_PLAYING, true);
        await playNextPattern();
    }
}

function stopPlaying() {
    Notify(NOW_PLAYING, false);
}

async function patternComplete(char: CharacterInfo) {
    if (NowPlaying) {
        if (char == null) {
            await Sleep(UnitTime * CharSpacing);

            playNextPattern();
        }
        else {
            Notify(LETTER, char.name);

            await Sleep(UnitTime * CharSpacing);

            // Sometimes the voice won't be loaded. Usually this will be when the user changes
            // the checkbox after a pattern starts, so the voice-load wasn't already triggered.
            // In that case, load the voice now.
            // 
            // No need to call playNextPattern(), as it will be called by VOICE_DONE (which is
            // triggered whether the voice is enabled or not).
            //
            // TODO: It's also possible that the voice wasn't loaded because the user's
            // connection is very slow. Here, reloading just makes it worse. Need to keep track
            // of progress in the voice loader to differentiate between "never loaded" and
            // "still loading".
            PreloadVoice(char, () => PlayVoice(char.name));
        }
    }
}

Listen(VOICE_DONE, playNextPattern);
Listen(STOP, stopPlaying);
Listen(START, startPlaying);
Listen(PATTERN_COMPLETE, patternComplete);
Listen(VOLUME, updateVolume);
