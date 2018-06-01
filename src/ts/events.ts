function Notify(name: string, value: any)
{
	document.dispatchEvent(new CustomEvent(name, { detail: value }));
}

function Listen<T>(name: string, handler: (value?: T) => any)
{
	document.addEventListener(name, (evt: CustomEvent) => handler(evt.detail));
}

const EMIT_LETTER = "emit_letter";
const EMIT_OUTPUT = "emit_output";
const PATTERN_START = "patternStart";
const PATTERN_STOP = "patternStop";
const CMD_PAUSE = "cmd_pause";
const CMD_START = "cmd_start";
const CMD_STORY = "cmd_story";
const CMD_STOP = "cmd_stop";
const SET_SPACING = "set_spacing";
const SET_FLASHING_ENABLED = "set_flashing";
const SET_LETTERS = "set_letters";
const SET_NOW_PLAYING = "set_nowPlaying";
const SET_NUMBERS = "set_numbers";
const SET_PITCH = "set_pitch";
const SET_SYMBOLS = "set_symbols";
const SET_TEXT_BUFFER = "set_textBuffer";
const SET_UNIT_TIME = "set_unitTime";
const SET_VOICE = "set_voice";
const SET_VOLUME = "set_volume";
const SET_WPM = "set_wpm";
const UI_SPACING = "ui_spacing";
const UI_FLASHING = "ui_flashing";
const UI_LETTERS = "ui_letters";
const UI_NOW_PLAYING = "ui_nowPlaying";
const UI_NUMBERS = "ui_numbers";
const UI_PITCH = "ui_pitch";
const UI_SYMBOLS = "ui_symbols";
const UI_TEXT_BUFFER = "ui_textBuffer";
const UI_VOICE = "ui_voice";
const UI_VOLUME = "ui_volume";
const UI_WPM = "ui_wpm";
const VIEW_HOME = "view_home";
const VIEW_SETTINGS = "view_settings";
const VIEW_PLAYING = "view_player";
const VIEW_STORIES = "view_stories";
const VIEW_TEXT = "view_text";
const EMIT_VOICE_DONE = "emit_voiceDone";
const WATCH = "watch";
