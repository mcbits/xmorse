/// <reference path="../events.ts"/>
/// <reference path="../morsetable.ts"/>
/// <reference path="../query.ts"/>

namespace UI
{
	const homeBtn = Query<HTMLElement>(".btn-home");
	const startBtns = QueryAll<HTMLElement>(".btn-start");
	const startBtn = Query<HTMLButtonElement>(".btn-start");
	const pauseBtn = Query<HTMLButtonElement>(".btn-pause");
	const stopBtn = Query<HTMLButtonElement>(".btn-stop");
	const letterElement = Query(".letter");
	const outputBuffer = Query(".outputBuffer");
	const storyLinks = QueryAll(".story a");
	const patternEl = Query<HTMLElement>(".view.playing .pattern");

	export let playState = "stopped";

	for (let i = 0; i < startBtns.length; ++i)
	{
		startBtns[i].addEventListener("click", () => Player.StartPlaying());
	}

	pauseBtn.addEventListener("click", () => UI.PausePlaying());

	stopBtn.addEventListener("click", () => UI.StopPlaying());

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
		playState = "started";
		location.hash = "#playing";
	}

	export function PausePlaying()
	{
		playState = "paused";
		startBtn.disabled = false;
		pauseBtn.disabled = true;
		stopBtn.disabled = true;
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
		Player.StopPlaying();
		FullScreen.StopPlaying();
		TextLoader.ResetPosition();
	}

	export function EmitCharacter(char: string)
	{
		letterElement.innerHTML = char;
	}

	export function EmitOutput(value: string)
	{
		outputBuffer.innerHTML += value;
		outputBuffer.scrollTop = outputBuffer.scrollHeight;
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

	export function PatternComplete(char: Morse.Char)
	{
		if (playState !== "stopped")
		{
			outputBuffer.innerHTML += char == null ? " " : char.name;
			outputBuffer.scrollTop = outputBuffer.scrollHeight;
		}
	}
}
