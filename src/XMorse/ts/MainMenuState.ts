namespace XMorse
{
	export class MainMenuState extends Phaser.State
	{
		game: Phaser.Game;
		music: Phaser.Sound;
		backgroundImage: Phaser.Sprite;

		constructor(game: Phaser.Game)
		{
			super();
			this.game = game;
		}

		create()
		{
			this.createBackground();
			this.createMusic();
			this.createStartButton();
		}

		private createBackground()
		{
			this.backgroundImage = this.add.sprite(0, 0, "xmorse");
			const widthScale = this.game.width / this.backgroundImage.width;
			const heightScale = this.game.height / this.backgroundImage.height;
			this.backgroundImage.scale.setTo(widthScale, heightScale);
		}

		private createMusic()
		{
			this.music = this.game.add.audio("IntroMusic", 1, true);
			this.music.play();
		}

		private createStartButton()
		{
			var startText = this.game.add.text(450, 300, "Start", {
				font: "30pt Helvetica",
				fill: "#ffffff",
				align: "left"
			});

			startText.inputEnabled = true;

			startText.events.onInputOver.add(target => target.fill = "#ffff99");

			startText.events.onInputOut.add(target => target.fill = "#ffffff");

			startText.events.onInputUp.add(() =>
			{
				this.music.stop();
				this.game.state.start("PlayState");
			});
		}
	}
}
