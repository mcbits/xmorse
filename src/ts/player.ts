import {
    Trigger, Handle,
    PATTERN_COMPLETE, VOLUME, LETTER, NOW_PLAYING,
    VOICE_ENABLED, VOICE_DONE, START, STOP, TEXT_BUFFER, BOOK, OUTPUT
} from "./events";
import { Sleep } from "./sleep";
import { Audio, MasterGain } from "./audiocontext";
import { CharacterInfo, GetCharacter, RandomCharacter } from "./morsetable";
import { PlayPattern } from "./toneplayer";
import { LoadVoice, IsVoiceLoaded, PlayVoice } from "./voiceplayer";
import { Next } from "./text";
import { unitTime, charSpacing, nowPlaying } from "./timing";

let voiceEnabled = true;

async function playNextPattern(): Promise<void> {
    if (nowPlaying) {
        // Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
        const nextCharacter = Next();

        if (nextCharacter[1]) {
            // If there is unplayable text, send it to the output buffer and delay for one word-break.
            if (nextCharacter[0] != nextCharacter[1].name) {
                Trigger(OUTPUT, nextCharacter[0].substr(0, nextCharacter[0].length - 1));

                // The 7/3 factor comes from character spaces being 3 units and word spaces being 7 units.
                await Sleep(unitTime * charSpacing * (7 / 3));
            }

            const currentCharacter = nextCharacter[1];

            if (voiceEnabled && !IsVoiceLoaded(currentCharacter.name))
                LoadVoice(currentCharacter);

            await PlayPattern(currentCharacter);
        }
        else
            Trigger(PATTERN_COMPLETE, null);

        await Sleep(unitTime * charSpacing);
    }
}

function updateVolume(value: number) {
    MasterGain.gain.setTargetAtTime(value, Audio.currentTime, 0.01);
}

async function startPlaying() {
    if (!nowPlaying) {
        Trigger(NOW_PLAYING, true);
        await playNextPattern();
    }
}

function stopPlaying() {
    Trigger(NOW_PLAYING, false);
}

async function patternComplete(char: CharacterInfo) {
    if (char != null) {
        Trigger(LETTER, char.name);

        if (nowPlaying) {
            await Sleep(unitTime * charSpacing);

            if (voiceEnabled) {
                // Sometimes the voice won't be loaded. Usually this will be when the user changes
                // the checkbox after a pattern starts, so the voice-load wasn't already triggered.
                // In that case, load the voice now.
                //
                // TODO: It's also possible that the voice wasn't loaded because the user's
                // connection is very slow. Here, reloading just makes it worse. Need to keep track
                // of progress in the voice loader to differentiate between "never loaded" and
                // "still loading".
                if (IsVoiceLoaded(char.name))
                    PlayVoice(char.name);
                else
                    LoadVoice(char, () => PlayVoice(char.name));
            }
            else
                playNextPattern();
        }
    }
    else {
        await Sleep(unitTime * charSpacing);

        playNextPattern();
    }
}

function loadBook(href: string) {
    let request = new XMLHttpRequest();

    function bookDownloaded(evt: ProgressEvent) {
        const response = request.response;
        Trigger(TEXT_BUFFER, response);
        Trigger(START, null);
    }

    request.open("GET", href);
    request.responseType = "text";
    request.addEventListener("load", bookDownloaded);
    request.send();
}

Handle(VOICE_DONE, playNextPattern);
Handle(STOP, stopPlaying);
Handle(START, startPlaying);
Handle(PATTERN_COMPLETE, patternComplete);
Handle(VOLUME, updateVolume);
Handle(VOICE_ENABLED, (value: boolean) => voiceEnabled = value);
Handle(BOOK, loadBook)
