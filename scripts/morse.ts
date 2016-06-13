/**
 * 
 */
module MorseCode
{
	export let onMatch: Function;
	export let onSequenceChanged: Function;

	// Duration of a dit in milliseconds.
	let _dotMS = 250;
	
	// Duration of a dah in milliseconds. Usually 3x the dit.
	let _dashMS = _dotMS * 3;
	
	// The pause duration. This is the time between letters, usually 1x that of the dot.
	let _pauseMS = _dotMS * 1;

	// Store the date/time for the keydown.
	let _startTimestamp: number = 0;

	// Keep a timer for post-key resolution for characters.
	let _resolveTimeout = null;

	// The current, transient sequence being evaluated.
	let _sequence = "";
	
	// Map Morse code characters to text.
	let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
	let patterns = [
		".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..",
		".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.",
		"...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..",
		"-----", ".----", "..---", "...--", "....-",
		".....", "-....", "--...", "---..", "----."
	];
	let toChar = {};
	let toPattern = {};
	for (let i = 0; i < chars.length; ++i) {
		toChar[patterns[i]] = chars[i];
		toPattern[chars[i]] = patterns[i];
	}

	export function getRandom(): string[]
	{
		let index = Math.floor(Math.random() * patterns.length);
		return [chars[index], patterns[index]];
	}

	export function getPattern(ch: string): string
	{
		return toPattern[ch];
	}

	// Gets the alpha-numeric character set as an array of sequence-character pairs.
	function getAlphabet(): any[]
	{
		let characterSet = [];

		// Loop over the patterns to map them to a character set item.
		for (let pattern in toChar) {
			characterSet.push({
				sequence: pattern,
				character: toChar[pattern]
			});
		}

		// Sort the character set alphabetically.
		characterSet.sort((a, b) => (a.character <= b.character ? -1 : 1));

		return characterSet;
	}

	// Gets partial matches with the current sequence.
	function resolvePartial(): string[]
	{
		let potentialCharacters = [];

		// Add characters whose pattern begins with our current sequence.
		for (let pattern in toChar) {
			if (pattern.indexOf(_sequence) === 0) {
				potentialCharacters.push(toChar[pattern]);
			}
		}

		return potentialCharacters.sort();
	}

	// Gets the alpha-numeric charater repsented by the current sequence. Also resets the internal sequence value.
	function lookupLetter()
	{
		// Try to get the character respresented by the current sequence.
		let letter = toChar[_sequence];
		_sequence = "";
		onSequenceChanged(_sequence);

		if (letter != null && onMatch != null) {
			onMatch(letter);
		}
	}

	// Bind to any key click to indicate an interaction with the interpreter.
	export function startPress()
	{
		if (_startTimestamp > 0)
			return;

		clearTimeout(_resolveTimeout);
		_startTimestamp = Date.now();
	}

	export function stopPress()
	{
		let toneLength = Date.now() - _startTimestamp;

		// Clear the key down date so subsequent key press events can be processed.
		_startTimestamp = 0;

		// Check if the duration indicates a dot or a dash. Add the value to the current sequence.
		_sequence += toneLength <= _dotMS ? "." : "-";

		// Display the candidate characters for the current sequence.
		let candidates = resolvePartial();
		onSequenceChanged(_sequence);

		// Now that the key has been pressed, we need to wait a bit to see if we need to resolve the
		// current sequence (if the user doesn't interact with the interpreter, we will resolve).
		_resolveTimeout = setTimeout(lookupLetter, _pauseMS * 2);
	}
};
