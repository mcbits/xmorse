/// <reference path="../events.ts"/>
/// <reference path="../morsetable.ts"/>
/// <reference path="../query.ts"/>

namespace UI {
	const homeBtn = Query<HTMLElement>(".btn-home");
	const startBtns = QueryAll<HTMLElement>(".btn-start");
	const startBtn = Query<HTMLButtonElement>(".btn-start");
	const pauseBtn = Query<HTMLButtonElement>(".btn-pause");
	const stopBtn = Query<HTMLButtonElement>(".btn-stop");
	const letterElement = Query(".letter");
	const outputBuffer = Query(".outputBuffer");
	const storyLinks = QueryAll(".story a");
	const patternEl = Query<HTMLElement>(".view.playing .pattern");

	let playState = "stopped";

	pauseBtn.addEventListener("click",
		() => Notify(PAUSE, null));

	for (let i = 0; i < startBtns.length; ++i) {
		startBtns[i].addEventListener("click",
			() => Notify(START, null));
	}

	stopBtn.addEventListener("click",
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
		playState = "paused";
		startBtn.disabled = false;
		pauseBtn.disabled = true;
		stopBtn.disabled = true;
	});

	Listen(START, () => {
		playState = "started";
		Notify(WATCH, null);
		startBtn.disabled = true;
		pauseBtn.disabled = false;
		stopBtn.disabled = false;
	});

	Listen(STOP, () => {
		playState = "stopped";
		location.hash = "";
		outputBuffer.innerHTML = "";
		letterElement.innerHTML = "";
		patternEl.innerHTML = "";
		startBtn.disabled = false;
		pauseBtn.disabled = true;
		stopBtn.disabled = true;
	});

	Listen(LETTER,
		(value: string) => letterElement.innerHTML = value);

	Listen(OUTPUT,
		(value: string) => {
			outputBuffer.innerHTML += value;
			outputBuffer.scrollTop = outputBuffer.scrollHeight;
		});

	Listen(PATTERN_START,
		(pattern: string) => {
			function make(className: string): HTMLElement {
				const el = document.createElement("span");
				el.classList.add("element");
				el.classList.add(className);
				return el;
			}

			for (let i = 0; i < pattern.length; ++i) {
				let el: HTMLElement;

				if (pattern[i] === ".")
					el = make("dit");
				else if (pattern[i] === "-")
					el = make("dah");
				else if (pattern[i] === " ")
					el = make("wordSpace");

				patternEl.appendChild(el);
			}

			patternEl.appendChild(make("charSpace"));
		});

	Listen(PATTERN_STOP,
		(char: Morse.Char) => {
			if (playState !== "stopped") {
				outputBuffer.innerHTML += char == null ? " " : char.name;
				outputBuffer.scrollTop = outputBuffer.scrollHeight;
			}
		});

	Listen(OSC_OFF,
		() => Query("body").classList.remove("toneOn"));

	Listen(OSC_ON,
		() => {
			if (Settings.userSet.flashingEnabled.checked)
				Query("body").classList.add("toneOn");
		});

	Listen(WATCH,
		() => location.hash = "#playing");
}
