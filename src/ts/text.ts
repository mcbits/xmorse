import * as UI from "./controls";
import * as Player from "./player";
import * as Settings from "./settings";
import * as Morse from "./morsetable";

let textBuffer = "";
let textBufferIndex = -1;

export function ResetPosition()
{
	textBufferIndex = textBuffer.length > 0 ? 0 : -1;
}

export function SetTextBuffer(text: string)
{
	UI.StopPlaying();
	UI.ClearOutput();
	textBuffer = text.toUpperCase().trim() + "\n";
	ResetPosition();
}

export function LoadBook(href: string): void
{
	UI.SetPlayState("stopped");
	Player.StopPlaying();

	fetch(href, { method: "GET" }).then(response =>
		response.text().then(value =>
		{
			Settings.SetTextBuffer(value);
			Player.StartPlaying();
		}));
}

export function Next(): [string, Morse.Char]
{
	if (textBuffer.length > 0)
	{
		const startingIndex = textBufferIndex;
		let text = "";

		do
		{
			text += textBuffer[textBufferIndex];
			const morseChar = Morse.GetCharacter(textBuffer[textBufferIndex]);

			// Increment and wrap around if necessary
			++textBufferIndex;
			if (textBufferIndex === textBuffer.length)
				textBufferIndex = 0;

			if (morseChar)
				return [text, morseChar];
		}
		while (textBufferIndex !== startingIndex);

		return ["", null];
	}

	const char = Morse.RandomCharacter();

	return [char.name, char];
}
