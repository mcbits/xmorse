import {
    Notify, Listen,
    PATTERN_COMPLETE, VOLUME, LETTER, NOW_PLAYING,
    VOICE_DONE, PAUSE, START, STOP, OUTPUT
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
            if (nextCharacter[0] !== nextCharacter[1].name) {
                Notify(OUTPUT, nextCharacter[0].substr(0, nextCharacter[0].length - 1));

                // A 7/3 factor comes from character spaces being 3 units and word spaces being 7 units.
                // But we've already waited 1 character space, so subtract 3/3 from that.
                await Sleep(UnitTime * CharSpacing * (4 / 3));
            }

            const currentCharacter = nextCharacter[1];

            PreloadVoice(currentCharacter);

            await PlayPattern(currentCharacter);
        }
        else
            Notify(PATTERN_COMPLETE, null);
    }
}

function updateVolume(value: number) {
    MasterGain.gain.setTargetAtTime(value, Audio.currentTime, 0.01);
}

async function startPlaying() {
    if (!NowPlaying) {
        Notify(NOW_PLAYING, true);
        await Sleep(500);
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

            // playNextPattern() will be called by VOICE_DONE (which is
            // triggered whether the voice is currently enabled or not).
            await PlayVoice(char);
        }
    }
}

Listen(VOICE_DONE, playNextPattern);
Listen(PAUSE, stopPlaying);
Listen(STOP, stopPlaying);
Listen(START, startPlaying);
Listen(PATTERN_COMPLETE, patternComplete);
Listen(VOLUME, updateVolume);
