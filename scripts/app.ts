/// <reference path="common.ts"/>

let app = (() =>
{
	let innerWidth = window.innerWidth;
	let innerHeight = window.innerHeight;
	let gameRatio = innerWidth / innerHeight;

	function checkLanding(player: Phaser.Sprite, ground: Phaser.Sprite)
	{
	}

	function preload()
	{
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	}

	document.addEventListener("DOMContentLoaded", (event) =>
	{
		//game = new Phaser.Game(Math.ceil(720 * gameRatio), 720, Phaser.CANVAS);
		game = new Phaser.Game(1280, 720, Phaser.CANVAS, {preload: preload});

		game.state.add("MainMenu", MainMenuState);
		game.state.add("Options", OptionsState);
		game.state.add("Play", Play.State);
		game.state.add("GameOver", GameOverState);
		game.state.start("MainMenu");
	});
})();
