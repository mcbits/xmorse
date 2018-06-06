function Notify(name: string, value: any)
{
	document.dispatchEvent(new CustomEvent(name, { detail: value }));
}

function Listen<T>(name: string, handler: (value?: T) => any)
{
	document.addEventListener(name, (evt: CustomEvent) => handler(evt.detail));
}

const VIEW_HOME = "view_home";
const VIEW_SETTINGS = "view_settings";
const VIEW_PLAYING = "view_player";
const VIEW_STORIES = "view_stories";
const VIEW_TEXT = "view_text";
