import * as Player from "./player";
import * as TextLoader from "./text";
import * as FullScreen from "./fullscreen";
import * as Morse from "./morsetable";
import { AudioCtx } from "./audiocontext";
import { Query, QueryId, QueryAll } from "./query";

const homeBtn = Query<HTMLElement>(".btn-home");
const startBtns = QueryAll<HTMLElement>(".btn-start");
const startBtn = Query<HTMLButtonElement>(".btn-start");
const pauseBtn = Query<HTMLButtonElement>(".btn-pause");
const stopBtn = Query<HTMLButtonElement>(".btn-stop");
const gearBtn = Query<HTMLButtonElement>(".btn-gear");
const letterElement = Query(".letter");
const outputBuffer = Query(".outputBuffer");
const storyLinks = QueryAll(".story a");
const patternEl = Query<HTMLElement>(".view.playing .pattern");

let playState = "stopped";

export function ClearOutput()
{
	outputBuffer.innerHTML = "";
}

export function StartPlaying()
{
	if (AudioCtx.state === "suspended")
		AudioCtx.resume();

	startBtn.disabled = true;
	pauseBtn.disabled = false;
	stopBtn.disabled = false;
	startBtn.style.display = "none";
	pauseBtn.style.display = "initial";
	playState = "started";
	location.hash = "#playing";
	Player.StartPlaying();
}

export function PausePlaying()
{
	playState = "paused";
	startBtn.disabled = false;
	pauseBtn.disabled = true;
	stopBtn.disabled = false;
	pauseBtn.style.display = "none";
	startBtn.style.display = "initial";
	Player.StopPlaying();
}

export function StopPlaying()
{
	playState = "stopped";
	outputBuffer.innerHTML = "";
	letterElement.innerHTML = "";
	patternEl.innerHTML = "";
	startBtn.disabled = false;
	pauseBtn.disabled = true;
	stopBtn.disabled = true;
	pauseBtn.style.display = "none";
	startBtn.style.display = "initial";
	Player.StopPlaying();
	FullScreen.StopPlaying();
	TextLoader.ResetPosition();
}

export function EmitCharacter(char: string)
{
	letterElement.innerHTML = char;
}

export function OutputString(value: string)
{
	outputBuffer.innerHTML += value;
	outputBuffer.scrollTop = outputBuffer.scrollHeight;
}

export function OutputChar(char: Morse.Char)
{
	OutputString(char == null ? " " : char.name);
}

export function DrawPattern(pattern: string)
{
	function make(className: string): HTMLElement
	{
		const el = document.createElement("span");
		el.classList.add("element");
		el.classList.add(className);
		return el;
	}

	patternEl.appendChild(make("charSpace"));

	for (let i = 0; i < pattern.length; ++i)
	{
		let el: HTMLElement;

		if (pattern[i] === ".")
			el = make("dit");
		else if (pattern[i] === "-")
			el = make("dah");
		else if (pattern[i] === " ")
			el = make("wordSpace");

		patternEl.appendChild(el);
	}
}

export function Initialize()
{
	for (let i = 0; i < startBtns.length; ++i)
	{
		startBtns[i].addEventListener("click", () => StartPlaying());
	}

	pauseBtn.addEventListener("click", () => PausePlaying());

	stopBtn.addEventListener("click", () => StopPlaying());

	gearBtn.addEventListener("click", () => location.hash = "settings");

	for (let i = 0; i < storyLinks.length; ++i)
	{
		const storyLink = storyLinks[i];
		storyLink.addEventListener("click", (evt: MouseEvent) =>
		{
			evt.preventDefault();
			const anchor = <HTMLAnchorElement>evt.target;
			const href = anchor.href;
			TextLoader.LoadBook(href);
		});
	}
}
