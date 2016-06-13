/// <reference path="typings/phaser/phaser.d.ts"/>
/// <reference path="typings/lodash/lodash.d.ts"/>

interface IGameState
{
	preload?;
	create?;
	update?;
	render?;
	shutdown?;
}

let game: Phaser.Game;

module Menu
{
	export let textStyle = {
		font: "65px Arial",
		fill: "#ffffff",
		align: "center"
	};

	export let titleStyle = {
		font: "80px Arial",
		fill: "#444477",
		align: "center"
	};

	export let spacing = 45;

	export function playClicked()
	{
		game.state.start("Play");
	}

	export function optionsClicked()
	{
		game.state.start("Options");
	}

	export function mainMenuClicked()
	{
		game.state.start("MainMenu");
	}
}

let Speed = (() =>
{

	function SpeedObject()
	{
		var base = 50;

		Object.defineProperty(this, "dit", {
			get: () => base * 1,
			set: (value) => base = value
		});
		Object.defineProperty(this, "dah", {
			get: () => base * 4,
			set: (value) => base = value / 4
		});
	}

	return new SpeedObject();
})(); 









