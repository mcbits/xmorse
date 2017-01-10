import {
    Notify, Listen,
    WPM, VOLUME, CHAR_SPACING, FLASHING_ENABLED, HOME, PITCH, LETTERS_ENABLED, NUMBERS_ENABLED,
    MANUAL_VOICE_ENABLED,
    SYMBOLS_ENABLED, LETTER, PATTERN_COMPLETE, VOICE_ENABLED, PAUSE, WATCH, START, STOP,
    OPTIONS, OUTPUT, STORY, TEXT_BUFFER, TONE_OFF, TONE_ON
} from "./events";
import { CharacterInfo } from "./morsetable";
import { Query, QueryId, QueryAll } from "./query";

// Page elements
const home = Query<HTMLElement>(".btn-home");
const start = Query<HTMLButtonElement>(".btn-start");
const pause = Query<HTMLButtonElement>(".btn-pause");
const stop = Query<HTMLButtonElement>(".btn-stop");
const watch = Query(".btn-watch");
const options = Query(".btn-options");
const paste = Query(".btn-paste");
const stories = Query(".btn-stories");
const letterElement = Query(".letter");
const outputBuffer = Query(".outputBuffer");
const storyLinks = QueryAll(".story a");
const siteName = Query(".siteName");
const resetSettingsButton = QueryId("resetSettings");

// Settings text labels
const volumeText = Query<HTMLInputElement>(".volumeText");
const charWPMText = Query<HTMLInputElement>(".charWPMText");
const pitchText = Query<HTMLInputElement>(".pitchText");
const charSpacingText = Query<HTMLInputElement>(".charSpacingText");

// Settings inputs
const userSet = {
    volume: QueryId<HTMLInputElement>("volume"),
    charWPM: QueryId<HTMLInputElement>("charWPM"),
    pitch: QueryId<HTMLInputElement>("pitch"),
    charSpacing: QueryId<HTMLInputElement>("charSpacing"),
    voiceEnabled: QueryId<HTMLInputElement>("voiceEnabled"),
    pasteTextBox: QueryId<HTMLTextAreaElement>("pasteText"),
    flashingEnabled: QueryId<HTMLInputElement>("flashingEnabled"),
    lettersEnabled: QueryId<HTMLInputElement>("lettersEnabled"),
    numbersEnabled: QueryId<HTMLInputElement>("numbersEnabled"),
    symbolsEnabled: QueryId<HTMLInputElement>("symbolsEnabled")
};

const defaults = {
    charSpacing: 15,
    flashingEnabled: false,
    lettersEnabled: true,
    numbersEnabled: false,
    pitch: 650,
    symbolsEnabled: false,
    voiceEnabled: true,
    volume: 0.40,
    wpm: 12
};

function view(selector: string, menuItem: Element) {
    const views = QueryAll(".view");

    for (let i = 0; i < views.length; ++i) {
        const view = views[i];
        if (!view.classList.contains("disabled"))
            view.classList.add("disabled");
    }

    const viewToShow = Query(selector);
    viewToShow.classList.remove("disabled");

    // Highlight the menu item
    const controls = QueryAll("nav.controls .btn");
    for (let i = 0; i < controls.length; ++i) {
        const control = controls[i];
        control.classList.remove("active");
    }
    menuItem.classList.add("active");
}

function Adjust(name: string, value: any) {
    Notify("manual_" + name, value.toString());
    Notify(name, value);
}

userSet.volume.addEventListener("input",
    () => Adjust(VOLUME, parseFloat(userSet.volume.value)));

userSet.charWPM.addEventListener("input",
    () => Adjust(WPM, parseInt(userSet.charWPM.value)));

userSet.charSpacing.addEventListener("input",
    () => Adjust(CHAR_SPACING, parseInt(userSet.charSpacing.value)));

userSet.pitch.addEventListener("input",
    () => Adjust(PITCH, parseInt(userSet.pitch.value)));

userSet.pasteTextBox.addEventListener("input",
    () => Adjust(TEXT_BUFFER, userSet.pasteTextBox.value));

userSet.voiceEnabled.addEventListener("change",
    () => Adjust(VOICE_ENABLED, userSet.voiceEnabled.checked));

userSet.flashingEnabled.addEventListener("change",
    () => Adjust(FLASHING_ENABLED, userSet.flashingEnabled.checked));

userSet.lettersEnabled.addEventListener("change",
    () => Adjust(LETTERS_ENABLED, userSet.lettersEnabled.checked));

userSet.numbersEnabled.addEventListener("change",
    () => Adjust(NUMBERS_ENABLED, userSet.numbersEnabled.checked));

userSet.symbolsEnabled.addEventListener("change",
    () => Adjust(SYMBOLS_ENABLED, userSet.symbolsEnabled.checked));

///

siteName.addEventListener("click",
    () => Notify(HOME, null));

home.addEventListener("click",
    () => Notify(HOME, null));

watch.addEventListener("click",
    () => Notify(WATCH, null));

options.addEventListener("click",
    () => Notify(OPTIONS, null));

paste.addEventListener("click",
    () => view(".paste", paste));

stories.addEventListener("click",
    () => view(".stories", stories));

resetSettingsButton.addEventListener("click",
    () => {
        Adjust(CHAR_SPACING, defaults.charSpacing);
        Adjust(FLASHING_ENABLED, defaults.flashingEnabled);
        Adjust(LETTERS_ENABLED, defaults.lettersEnabled);
        Adjust(NUMBERS_ENABLED, defaults.numbersEnabled);
        Adjust(PITCH, defaults.pitch);
        Adjust(SYMBOLS_ENABLED, defaults.symbolsEnabled);
        Adjust(VOICE_ENABLED, defaults.voiceEnabled);
        Adjust(VOLUME, defaults.volume);
        Adjust(WPM, defaults.wpm);
    });

///

pause.addEventListener("click",
    () => Notify(PAUSE, null));

start.addEventListener("click",
    () => Notify(START, null));

stop.addEventListener("click",
    () => Notify(STOP, null));

for (let i = 0; i < storyLinks.length; ++i) {
    const storyLink = storyLinks[i];
    storyLink.addEventListener("click", (evt: MouseEvent) => {
        evt.preventDefault();
        const anchor = <HTMLAnchorElement>evt.target;
        const href = anchor.href;
        Notify(STORY, href);
    });
}

Listen(PAUSE, () => {
    Notify(WATCH, null);
    start.disabled = false;
    pause.disabled = true;
    stop.disabled = true;
});

Listen(START, () => {
    Notify(WATCH, null);
    start.disabled = true;
    pause.disabled = false;
    stop.disabled = false;
});

Listen(STOP, () => {
    Notify(HOME, null);
    outputBuffer.innerHTML = "";
    letterElement.innerHTML = "";
    start.disabled = false;
    pause.disabled = true;
    stop.disabled = true;
});

// Update UI in response to settings changes

Listen(CHAR_SPACING,
    (value: number) => {
        charSpacingText.value = value.toString();
        userSet.charSpacing.value = value.toString();
    });

Listen(FLASHING_ENABLED,
    (value: boolean) => userSet.flashingEnabled.checked = value);

Listen(LETTERS_ENABLED,
    (value: boolean) => userSet.lettersEnabled.checked = value);

Listen(NUMBERS_ENABLED,
    (value: boolean) => userSet.numbersEnabled.checked = value);

Listen(PITCH,
    (value: number) => {
        pitchText.value = value.toString();
        userSet.pitch.value = value.toString();
    });

Listen(SYMBOLS_ENABLED,
    (value: boolean) => userSet.symbolsEnabled.checked = value);

Listen(TEXT_BUFFER,
    (value: string) => userSet.pasteTextBox.value = value);

Listen(VOICE_ENABLED,
    (value: boolean) => userSet.voiceEnabled.checked = value);

Listen(VOLUME,
    (value: number) => {
        volumeText.value = Math.floor(value * 100).toString();
        userSet.volume.value = value.toString();
    });

Listen(WPM,
    (value: number) => {
        charWPMText.value = value.toString();
        userSet.charWPM.value = value.toString();
    });

///

Listen(LETTER,
    (value: string) => letterElement.innerHTML = value);

Listen(HOME,
    () => view(".home", Query(".btn-home")));

Listen(OPTIONS,
    () => view(".options", options));

Listen(OUTPUT,
    (value: string) => {
        outputBuffer.innerHTML += value;
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    });

Listen(PATTERN_COMPLETE,
    (char: CharacterInfo) => {
        outputBuffer.innerHTML += char == null ? " " : char.name;
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    });

Listen(TONE_OFF,
    () => Query("body").classList.remove("toneOn"));

Listen(TONE_ON,
    () => {
        if (userSet.flashingEnabled.checked)
            Query("body").classList.add("toneOn");
    });

Listen(WATCH,
    () => {
        view(".view.playing", watch);
    });

///

document.addEventListener("DOMContentLoaded", () => {
    // // Trigger events to initialize state
    Notify(VOLUME, localStorage.getItem("volume") || defaults.volume);
    Notify(WPM, localStorage.getItem("wpm") || defaults.wpm);
    Notify(CHAR_SPACING, localStorage.getItem("charSpacing") || defaults.charSpacing);
    Notify(PITCH, localStorage.getItem("pitch") || defaults.pitch);

    const voiceEnabledStorage = localStorage.getItem("voiceEnabled");
    if (voiceEnabledStorage == null)
        Notify(VOICE_ENABLED, defaults.voiceEnabled);
    else
        Notify(VOICE_ENABLED, voiceEnabledStorage === "true");

    const flashingEnabledStorage = localStorage.getItem("flashingEnabled");
    if (flashingEnabledStorage == null)
        Notify(FLASHING_ENABLED, defaults.flashingEnabled);
    else
        Notify(FLASHING_ENABLED, flashingEnabledStorage === "true");

    const lettersEnabledStorage = localStorage.getItem("lettersEnabled");
    if (lettersEnabledStorage == null)
        Notify(LETTERS_ENABLED, defaults.lettersEnabled);
    else
        Notify(LETTERS_ENABLED, lettersEnabledStorage === "true");

    const numbersEnabledStorage = localStorage.getItem("numbersEnabled");
    if (numbersEnabledStorage == null)
        Notify(NUMBERS_ENABLED, defaults.numbersEnabled);
    else
        Notify(NUMBERS_ENABLED, numbersEnabledStorage === "true");

    const symbolsEnabledStorage = localStorage.getItem("symbolsEnabled");
    if (symbolsEnabledStorage == null)
        Notify(SYMBOLS_ENABLED, defaults.symbolsEnabled);
    else
        Notify(SYMBOLS_ENABLED, symbolsEnabledStorage === "true");
});
