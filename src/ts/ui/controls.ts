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
		startBtn.disabled = false;
		pauseBtn.disabled = true;
		stopBtn.disabled = true;
	});

	Listen(START, () => {
		Notify(WATCH, null);
		startBtn.disabled = true;
		pauseBtn.disabled = false;
		stopBtn.disabled = false;
	});

	Listen(STOP, () => {
		location.hash = "";
		outputBuffer.innerHTML = "";
		letterElement.innerHTML = "";
		startBtn.disabled = false;
		pauseBtn.disabled = true;
		stopBtn.disabled = true;
	});

	///

	Listen(LETTER,
		(value: string) => letterElement.innerHTML = value);

	Listen(OUTPUT,
		(value: string) => {
			outputBuffer.innerHTML += value;
			outputBuffer.scrollTop = outputBuffer.scrollHeight;
		});

	Listen(PATTERN_START,
		(pattern: string) => {
			const patternEl = document.querySelector(".view.playing .pattern");

			for (let i = 0; i < pattern.length; ++i) {
				const el = document.createElement("span");
				el.classList.add("element");

				if (pattern[i] === ".")
					el.classList.add("dit");
				else if (pattern[i] === "-")
					el.classList.add("dah");
				else if (pattern[i] === "")
					el.classList.add("charSpace");
				else if (pattern[i] === " ")
					el.classList.add("wordSpace");

				patternEl.appendChild(el);
			}
		});

	Listen(PATTERN_STOP,
		(char: Morse.Char) => {
			outputBuffer.innerHTML += char == null ? " " : char.name;
			outputBuffer.scrollTop = outputBuffer.scrollHeight;
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
