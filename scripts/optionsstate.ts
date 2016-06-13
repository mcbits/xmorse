/// <reference path="common.ts"/>

class OptionsState
{
	constructor(game: Phaser.Game) { }

	preload()
	{
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	}

	create()
	{
		let titleText = game.add.text(game.world.centerX, 50, "Options", Menu.titleStyle);
		titleText.anchor.setTo(0.5);

		let menuGroup = game.add.group();
		menuGroup.position.setTo(game.world.centerX, game.world.centerY);

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
