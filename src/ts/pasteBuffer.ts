import { ui } from "controls";
import * as Player from "./player";
import * as Settings from "./settings";
import * as Morse from "./morsetable";
import { QueryId } from "query";

export class PasteBuffer
{
	private textBuffer = "";
	private textBufferIndex = -1;

	ResetPosition()
	{
		this.textBufferIndex = this.textBuffer.length > 0 ? 0 : -1;
	}

	SetTextBuffer(text: string)
	{
		if (text)
		{
			text = text.toUpperCase().trim() + "\n";
			if (text != this.textBuffer)
			{
				this.textBuffer = text;
				this.ResetPosition();
			}
		}
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

			return ["", Morse.GetCharacter("")];
		}

		const char = Morse.RandomCharacter();

		return [char.name, char];
	}
}
