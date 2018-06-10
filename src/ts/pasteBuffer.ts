import * as UI from "./controls";
import * as Player from "./player";
import * as Settings from "./settings";
import * as Morse from "./morsetable";
import { QueryId } from "query";

class PasteBuffer
{
	private textBuffer = "";
	private textBufferIndex = -1;

	constructor(private el: HTMLTextAreaElement)
	{
	}

	ResetPosition()
	{
		this.textBufferIndex = this.textBuffer.length > 0 ? 0 : -1;
	}

	SetTextBuffer(text: string)
	{
		UI.StopPlaying();
		UI.ClearOutput();
		this.textBuffer = text.toUpperCase().trim() + "\n";
		this.ResetPosition();
	}

	async LoadBook(href: string): Promise<void>
	{
		UI.StopPlaying();

		const response = await fetch(href, { method: "GET" });
		const value = await response.text();

		UI.SetPasteTextBoxValue(value);
		this.SetTextBuffer(value);
		UI.StartPlaying();
	}

	Next(): [string, Morse.Char]
	{
		if (this.textBuffer.length > 0)
		{
			const startingIndex = this.textBufferIndex;
			let text = "";

			do
			{
				text += this.textBuffer[this.textBufferIndex];
				const morseChar = Morse.GetCharacter(this.textBuffer[this.textBufferIndex]);

				// Increment and wrap around if necessary
				++this.textBufferIndex;
				if (this.textBufferIndex === this.textBuffer.length)
					this.textBufferIndex = 0;

				if (morseChar)
					return [text, morseChar];
			}
			while (this.textBufferIndex !== startingIndex);

			return ["", null];
		}

		const char = Morse.RandomCharacter();

		return [char.name, char];
	}
}

export const pasteBuffer = new PasteBuffer(QueryId<HTMLTextAreaElement>("pasteText"));
