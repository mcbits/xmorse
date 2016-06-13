/// <reference path="common.ts"/>

class GameOverState
{
	constructor(game: Phaser.Game) { }

	preload()
	{
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	}

	create()
	{
		let titleText = game.add.text(game.world.centerX, 50, "Game Over", Menu.titleStyle);
		titleText.anchor.setTo(0.5);

		let menuGroup = game.add.group();
		menuGroup.position.setTo(game.world.centerX, game.world.centerY);

		let restartText = game.add.text(0, -Menu.spacing, "Play again", Menu.textStyle);
		restartText.anchor.set(0.5);
		restartText.inputEnabled = true;
		restartText.events.onInputUp.add(Menu.playClicked);
		menuGroup.add(restartText);

		let mainMenuText = game.add.text(0, Menu.spacing, "Main menu", Menu.textStyle);
		mainMenuText.anchor.set(0.5);
		mainMenuText.inputEnabled = true;
		mainMenuText.events.onInputUp.add(Menu.mainMenuClicked);
		menuGroup.add(mainMenuText);
	}

	update()
	{
	}

	render()
	{
	}

	shutdown()
	{
	}
}
