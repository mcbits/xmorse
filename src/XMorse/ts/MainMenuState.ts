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
			this.backgroundImage = this.add.sprite(0, 0, "xmorse");
			const widthScale = this.game.width / this.backgroundImage.width;
			const heightScale = this.game.height / this.backgroundImage.height;
			this.backgroundImage.scale.setTo(widthScale, heightScale);

			this.music = this.game.add.audio("IntroMusic", 1, true);
			this.music.play();

			var optionStyle = { font: "30pt Helvetica", fill: "#ffffff", align: "left" };
			var txt = this.game.add.text(450, 248, "Start", optionStyle);
			txt.inputEnabled = true;
			txt.events.onInputUp.add(() =>
			{
				this.music.stop();
				this.game.state.start("PlayState");
			});
			txt.events.onInputOver.add(target => target.fill = "#ffff99");
			txt.events.onInputOut.add(target => target.fill = "#ffffff");
		}
	}
}
