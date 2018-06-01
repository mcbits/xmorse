/// <reference path="events.ts"/>
/// <reference path="morsetable.ts"/>

namespace TextLoader
{
	let textBuffer = "";
	let textBufferIndex = -1;

	function resetPosition()
	{
		textBufferIndex = textBuffer.length > 0 ? 0 : -1;
	}

	function updateTextBuffer(text: string)
	{
		textBuffer = text.toUpperCase() + "\n";
		resetPosition();
	}

	function loadBook(href: string): void
	{
		fetch(href, { method: "GET" })
			.then(response => response.text()
				.then(value =>
				{
					Notify(CMD_CLEAR_OUTPUT, null);
					setTimeout(() => {
						Notify(SET_TEXT_BUFFER, value);
						Notify(CMD_START, null);
					}, 500);
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

	Listen(SET_TEXT_BUFFER, updateTextBuffer);
	Listen(CMD_STORY, loadBook);
	Listen(CMD_STOP, resetPosition);
}
