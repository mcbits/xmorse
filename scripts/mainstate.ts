/// <reference path="common.ts"/>

class MainMenuState implements IGameState
{
	constructor(game: Phaser.Game) { }

	public preload()
	{
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	}

	create()
	{
		let titleText = game.add.text(game.world.centerX, 50, "X Morse", Menu.titleStyle);
		titleText.anchor.setTo(0.5);

		let menuGroup = game.add.group();
		menuGroup.position.setTo(game.world.centerX, game.world.centerY);

		let playText = game.add.text(0, -Menu.spacing, "Play", Menu.textStyle);
		playText.anchor.set(0.5);
		playText.inputEnabled = true;
		playText.events.onInputUp.add(Menu.playClicked);
		menuGroup.add(playText);

		let optionsText = game.add.text(0, Menu.spacing, "Options", Menu.textStyle);
		optionsText.anchor.set(0.5);
		optionsText.inputEnabled = true;
		optionsText.events.onInputUp.add(Menu.optionsClicked);
		menuGroup.add(optionsText);
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
