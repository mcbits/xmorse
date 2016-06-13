var game;
var Menu;
(function (Menu) {
    Menu.textStyle = {
        font: "65px Arial",
        fill: "#ffffff",
        align: "center"
    };
    Menu.titleStyle = {
        font: "80px Arial",
        fill: "#444477",
        align: "center"
    };
    Menu.spacing = 45;
    function playClicked() {
        game.state.start("Play");
    }
    Menu.playClicked = playClicked;
    function optionsClicked() {
        game.state.start("Options");
    }
    Menu.optionsClicked = optionsClicked;
    function mainMenuClicked() {
        game.state.start("MainMenu");
    }
    Menu.mainMenuClicked = mainMenuClicked;
})(Menu || (Menu = {}));
var Speed = (function () {
    function SpeedObject() {
        var base = 50;
        Object.defineProperty(this, "dit", {
            get: function () { return base * 1; },
            set: function (value) { return base = value; }
        });
        Object.defineProperty(this, "dah", {
            get: function () { return base * 4; },
            set: function (value) { return base = value / 4; }
        });
    }
    return new SpeedObject();
})();
var app = (function () {
    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;
    var gameRatio = innerWidth / innerHeight;
    function checkLanding(player, ground) {
    }
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    document.addEventListener("DOMContentLoaded", function (event) {
        game = new Phaser.Game(1280, 720, Phaser.CANVAS, { preload: preload });
        game.state.add("MainMenu", MainMenuState);
        game.state.add("Options", OptionsState);
        game.state.add("Play", Play.State);
        game.state.add("GameOver", GameOverState);
        game.state.start("MainMenu");
    });
})();
var GameOverState = (function () {
    function GameOverState(game) {
    }
    GameOverState.prototype.preload = function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    GameOverState.prototype.create = function () {
        var titleText = game.add.text(game.world.centerX, 50, "Game Over", Menu.titleStyle);
        titleText.anchor.setTo(0.5);
        var menuGroup = game.add.group();
        menuGroup.position.setTo(game.world.centerX, game.world.centerY);
        var restartText = game.add.text(0, -Menu.spacing, "Play again", Menu.textStyle);
        restartText.anchor.set(0.5);
        restartText.inputEnabled = true;
        restartText.events.onInputUp.add(Menu.playClicked);
        menuGroup.add(restartText);
        var mainMenuText = game.add.text(0, Menu.spacing, "Main menu", Menu.textStyle);
        mainMenuText.anchor.set(0.5);
        mainMenuText.inputEnabled = true;
        mainMenuText.events.onInputUp.add(Menu.mainMenuClicked);
        menuGroup.add(mainMenuText);
    };
    GameOverState.prototype.update = function () {
    };
    GameOverState.prototype.render = function () {
    };
    GameOverState.prototype.shutdown = function () {
    };
    return GameOverState;
}());
var MainMenuState = (function () {
    function MainMenuState(game) {
    }
    MainMenuState.prototype.preload = function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    MainMenuState.prototype.create = function () {
        var titleText = game.add.text(game.world.centerX, 50, "X Morse", Menu.titleStyle);
        titleText.anchor.setTo(0.5);
        var menuGroup = game.add.group();
        menuGroup.position.setTo(game.world.centerX, game.world.centerY);
        var playText = game.add.text(0, -Menu.spacing, "Play", Menu.textStyle);
        playText.anchor.set(0.5);
        playText.inputEnabled = true;
        playText.events.onInputUp.add(Menu.playClicked);
        menuGroup.add(playText);
        var optionsText = game.add.text(0, Menu.spacing, "Options", Menu.textStyle);
        optionsText.anchor.set(0.5);
        optionsText.inputEnabled = true;
        optionsText.events.onInputUp.add(Menu.optionsClicked);
        menuGroup.add(optionsText);
    };
    MainMenuState.prototype.update = function () {
    };
    MainMenuState.prototype.render = function () {
    };
    MainMenuState.prototype.shutdown = function () {
    };
    return MainMenuState;
}());
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
var OptionsState = (function () {
    function OptionsState(game) {
    }
    OptionsState.prototype.preload = function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    OptionsState.prototype.create = function () {
        var titleText = game.add.text(game.world.centerX, 50, "Options", Menu.titleStyle);
        titleText.anchor.setTo(0.5);
        var menuGroup = game.add.group();
        menuGroup.position.setTo(game.world.centerX, game.world.centerY);
        var mainMenuText = game.add.text(0, Menu.spacing, "Main menu", Menu.textStyle);
        mainMenuText.anchor.set(0.5);
        mainMenuText.inputEnabled = true;
        mainMenuText.events.onInputUp.add(Menu.mainMenuClicked);
        menuGroup.add(mainMenuText);
    };
    OptionsState.prototype.update = function () {
    };
    OptionsState.prototype.render = function () {
    };
    OptionsState.prototype.shutdown = function () {
    };
    return OptionsState;
}());
var Play;
(function (Play) {
    var bg;
    var ground;
    var platforms;
    var player;
    var enemies;
    var ship;
    var patternGroup;
    var bgGroup;
    var isKeyDown = false;
    var keyDownTime = 0;
    var keyUpTime = 0;
    var patternParts;
    var patternProgress;
    var currentChar;
    var ch;
    var pat;
    var score = 0;
    function whileKeyDown() {
        isKeyDown = true;
        keyUpTime = 0;
        if (keyDownTime == 0) {
            keyDownTime = Date.now();
            player.position.y = 256;
        }
    }
    function whileKeyUp() {
        isKeyDown = false;
        if (keyDownTime > 0) {
            keyUpTime = Date.now();
            finishShot();
            keyDownTime = 0;
            player.position.y = game.world.height - 128;
        }
    }
    function finishShot() {
        var duration = keyUpTime - keyDownTime;
        console.log("duration: ", duration);
        if (duration > Speed.dah) {
            if (duration > Speed.dah * 2)
                resetPattern();
            else if (!matchPart("-"))
                resetPattern();
        }
        else if (duration > Speed.dit) {
            if (duration > Speed.dah - Speed.dit)
                resetPattern();
            else if (!matchPart("."))
                resetPattern;
        }
        else
            resetPattern();
        if (patternParts.length === 0) {
            score += 1;
            newPattern();
        }
    }
    function matchPart(el) {
        if (el == patternParts[0]) {
            patternParts.shift();
            patternGroup.removeChildAt(0);
            patternProgress.push(el);
            console.log(el, patternParts);
            return true;
        }
        return false;
    }
    function clearPattern() {
        patternProgress.splice(0, patternProgress.length);
        patternParts = pat.split("");
        patternGroup.removeAll();
    }
    function drawCharacter() {
        if (currentChar != null)
            currentChar.destroy();
        currentChar = game.add.text(game.world.width * .75, game.world.height * .25, ch, { fontSize: "128px" });
        currentChar.anchor.setTo(0.5);
    }
    function newPattern() {
        _a = MorseCode.getRandom(), ch = _a[0], pat = _a[1];
        clearPattern();
        drawCharacter();
        drawPatternParts();
        var _a;
    }
    function drawPatternParts() {
        var pos = 0;
        for (var i = 0; i < patternParts.length; ++i) {
            if (patternParts[i] == "-") {
                var dah = game.add.sprite(pos, 0, "dah");
                dah.anchor.setTo(0, 0.5);
                patternGroup.add(dah);
                pos += 80;
            }
            else if (patternParts[i] == ".") {
                var dit = game.add.sprite(pos, 0, "dit");
                dit.anchor.setTo(0, 0.5);
                patternGroup.add(dit);
                pos += 48;
            }
            else {
                pos += 16;
            }
        }
        patternGroup.position.setTo(game.world.width, game.world.height / 2);
    }
    function resetPattern() {
        console.log("resetPattern");
        clearPattern();
        drawPatternParts();
    }
    function die() {
        game.state.start("GameOver");
    }
    var State = (function () {
        function State(game) {
        }
        State.prototype.preload = function () {
            game.load.image("ship", "img/playerShip1_blue.png");
            game.load.image("shroom", "img/colored_shroom.png");
            game.load.image("dit", "img/dit.png");
            game.load.image("dah", "img/dah.png");
            game.load.atlasXML("player", "img/spritesheet_players.png", "img/spritesheet_players.xml");
            game.load.atlasXML("ground", "img/spritesheet_ground.png", "img/spritesheet_ground.xml");
            patternProgress = [];
        };
        State.prototype.create = function () {
            bgGroup = game.add.group();
            patternGroup = game.add.group();
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.setTo(0, 2000);
            bg = game.add.tileSprite(0, 0, 1280, 720, "shroom");
            bgGroup.add(bg);
            ship = game.add.sprite(game.width / 3, game.world.height - 256, "ship");
            player = game.add.sprite(game.width / 5, game.world.height - 256, "player");
            player.animations.add("walking", Phaser.Animation.generateFrameNames("alienBeige_walk", 1, 2, ".png"), 5, true);
            player.animations.play("walking");
            player.anchor.setTo(0, 1);
            ground = game.add.tileSprite(0, game.world.height - 128, 1280, 128, "ground", 1);
            game.physics.enable(ground, Phaser.Physics.ARCADE);
            ground.body.collideWorldBounds = true;
            ground.body.allowGravity = false;
            ground.body.immovable = true;
            ground.body.moves = false;
            newPattern();
        };
        State.prototype.update = function () {
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                whileKeyDown();
            }
            else {
                whileKeyUp();
            }
            bg.tilePosition.x -= 1;
            ground.tilePosition.x -= 5;
            patternGroup.position.x -= 3;
            if (patternGroup.position.x < game.world.width / 5) {
                die();
            }
        };
        return State;
    }());
    Play.State = State;
})(Play || (Play = {}));
//# sourceMappingURL=site.js.map