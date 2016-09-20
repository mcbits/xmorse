/// <reference path="typings/phaser/phaser.d.ts"/>
namespace XMorse
{
	export class Game
	{
		game: Phaser.Game;

		constructor()
		{
			const conf: Phaser.IGameConfig = {
				width: 800,
				height: 480,
				antialias: true,
				enableDebug: true,
				forceSetTimeOut: false,
				parent: "game",
				physicsConfig: Phaser.Physics.ARCADE,
				preserveDrawingBuffer: true,
				renderer: Phaser.CANVAS,
				resolution: 1,
				//seed: "",
				state: <Phaser.State>{ create: this.create, preload: this.preload },
				transparent: false
			};
			this.game = new Phaser.Game(conf);
		}

		preload()
		{
			const load = this.game.load;

			load.image("xmorse", "assets/images/xmorse.png");
			load.image("swamp", "assets/images/swamp.png");
			load.image("desert", "assets/images/desert.png");

			load.spritesheet("idle", "assets/images/player-idle.png", 499, 750);
			load.spritesheet("run", "assets/images/player-run.png", 500, 800);
			load.spritesheet("jump", "assets/images/player-jump.png", 490, 845);
			load.spritesheet("land", "assets/images/player-land.png", 559, 764);
			load.spritesheet("sign", "assets/images/sign.png", 100, 100);

			load.audio("IntroMusic", ["assets/music/intro.mp3"]);
		}

		create()
		{
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

			this.game.state.add("PlayState", new XMorse.PlayState(this.game), false);
			this.game.state.add("MainMenuState", new XMorse.MainMenuState(this.game), true);
		}
	}
}

document.addEventListener("DOMContentLoaded", () =>
{
	const game = new XMorse.Game();
});
