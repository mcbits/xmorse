/// <reference path="common.ts"/>
/// <reference path="morse.ts"/>

module Play
{
	let bg: Phaser.TileSprite;
	let ground: Phaser.TileSprite;
	let platforms: Phaser.Group;
	let player: Phaser.Sprite;
	let enemies: Phaser.Sprite;
	let ship: Phaser.Sprite;

	let patternGroup: Phaser.Group;
	let bgGroup: Phaser.Group;

	let isKeyDown = false;
	let keyDownTime: number = 0;
	let keyUpTime: number = 0;
	let patternParts: string[];
	let patternProgress: string[];
	let currentChar: Phaser.Text;
	let ch: string;
	let pat: string;

	let score: number = 0;
	
	function whileKeyDown()
	{
		isKeyDown = true;
		keyUpTime = 0;
		if (keyDownTime == 0) {
			keyDownTime = Date.now();
			player.position.y = 256;
		}
	}

	function whileKeyUp()
	{
		isKeyDown = false;
		if (keyDownTime > 0) {
			keyUpTime = Date.now();
			finishShot();
			keyDownTime = 0;
			player.position.y = game.world.height - 128;
		}
	}

	function finishShot()
	{
		let duration = keyUpTime - keyDownTime;
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

	function matchPart(el: string): boolean
	{
		if (el == patternParts[0]) {
			patternParts.shift();
			patternGroup.removeChildAt(0);
			patternProgress.push(el);
			console.log(el, patternParts)
			return true;
		}

		return false;
	}

	function clearPattern()
	{
		patternProgress.splice(0, patternProgress.length);
		patternParts = pat.split("");
		patternGroup.removeAll();
	}

	function drawCharacter()
	{
		if (currentChar != null)
			currentChar.destroy();

		currentChar = game.add.text(game.world.width * .75, game.world.height * .25, ch, { fontSize: "128px" });
		currentChar.anchor.setTo(0.5);
	}

	function newPattern()
	{
		[ch, pat] = MorseCode.getRandom();

		clearPattern();

		drawCharacter();

		drawPatternParts();
	}

	function drawPatternParts()
	{
		let pos = 0;
		for (let i = 0; i < patternParts.length; ++i) {
			if (patternParts[i] == "-") {
				let dah = game.add.sprite(pos, 0, "dah");
				dah.anchor.setTo(0, 0.5);
				patternGroup.add(dah);
				pos += 80;
			}
			else if (patternParts[i] == ".") {
				let dit = game.add.sprite(pos, 0, "dit");
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

	function resetPattern()
	{
		console.log("resetPattern");
		clearPattern();
		drawPatternParts();
	}

	function die()
	{
		game.state.start("GameOver");
	}


	export class State implements IGameState
	{
		constructor(game: Phaser.Game) { }

		preload()
		{
			game.load.image("ship", "img/playerShip1_blue.png");
			game.load.image("shroom", "img/colored_shroom.png");
			game.load.image("dit", "img/dit.png");
			game.load.image("dah", "img/dah.png");
			game.load.atlasXML("player", "img/spritesheet_players.png", "img/spritesheet_players.xml");
			game.load.atlasXML("ground", "img/spritesheet_ground.png", "img/spritesheet_ground.xml");

			patternProgress = [];
		}

		create()
		{
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
		}

		update()
		{
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
		}
	}
}
