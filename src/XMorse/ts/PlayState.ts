namespace XMorse
{
	export class PlayState extends Phaser.State
	{
		game: Phaser.Game;
		background: Phaser.TileSprite;
		player: Player;
		jumptimer: number;
		cursors: Phaser.CursorKeys;
		obstacles: Obstacle[];

		constructor(game: Phaser.Game)
		{
			super();
			this.game = game;
			this.obstacles = [];
		}

		preload(): void
		{
		}

		create(): void
		{
			this.game.physics.startSystem(Phaser.Physics.ARCADE);

			this.background = this.game.add.tileSprite(0, 0, 800, 480, "swamp");
			const scale = this.game.height / 400;
			this.background.tileScale.set(scale, scale);

			this.player = new Player(this.game);
			this.player.create();
		}

		update(): void
		{
			if (this.obstacles.length < 1)
			{
				this.obstacles.push(new Obstacle(this.game));
			}

			this.background.tilePosition.x -= 3;

			for (let o = 0; o < this.obstacles.length; ++o)
			{
				this.obstacles[o].update();
			}

			this.player.update();
		}
	}
}
