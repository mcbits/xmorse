var MorseCode;
(function (MorseCode) {
    var _dotMS = 250;
    var _dashMS = _dotMS * 3;
    var _pauseMS = _dotMS * 1;
    var _startTimestamp = 0;
    var _resolveTimeout = null;
    var _sequence = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
    var patterns = [
        ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..",
        ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.",
        "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..",
        "-----", ".----", "..---", "...--", "....-",
        ".....", "-....", "--...", "---..", "----."
    ];
    var toChar = {};
    var toPattern = {};
    for (var i = 0; i < chars.length; ++i) {
        toChar[patterns[i]] = chars[i];
        toPattern[chars[i]] = patterns[i];
    }
    function getRandom() {
        var index = Math.floor(Math.random() * patterns.length);
        return [chars[index], patterns[index]];
    }
    MorseCode.getRandom = getRandom;
    function getPattern(ch) {
        return toPattern[ch];
    }
    MorseCode.getPattern = getPattern;
    function getAlphabet() {
        var characterSet = [];
        for (var pattern in toChar) {
            characterSet.push({
                sequence: pattern,
                character: toChar[pattern]
            });
        }
        characterSet.sort(function (a, b) { return (a.character <= b.character ? -1 : 1); });
        return characterSet;
    }
    function resolvePartial() {
        var potentialCharacters = [];
        for (var pattern in toChar) {
            if (pattern.indexOf(_sequence) === 0) {
                potentialCharacters.push(toChar[pattern]);
            }
        }
        return potentialCharacters.sort();
    }
    function lookupLetter() {
        var letter = toChar[_sequence];
        _sequence = "";
        MorseCode.onSequenceChanged(_sequence);
        if (letter != null && MorseCode.onMatch != null) {
            MorseCode.onMatch(letter);
        }
    }
    function startPress() {
        if (_startTimestamp > 0)
            return;
        clearTimeout(_resolveTimeout);
        _startTimestamp = Date.now();
    }
    MorseCode.startPress = startPress;
    function stopPress() {
        var toneLength = Date.now() - _startTimestamp;
        _startTimestamp = 0;
        _sequence += toneLength <= _dotMS ? "." : "-";
        var candidates = resolvePartial();
        MorseCode.onSequenceChanged(_sequence);
        _resolveTimeout = setTimeout(lookupLetter, _pauseMS * 2);
    }
    MorseCode.stopPress = stopPress;
})(MorseCode || (MorseCode = {}));
;
