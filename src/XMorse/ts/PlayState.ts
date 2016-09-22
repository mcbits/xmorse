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
			this.game.physics.arcade.enableBody(this.background);

			this.player = new Player(this.game);
			this.player.create();
		}

		update(): void
		{
			this.background.tilePosition.x -= 3;

			if (this.obstacles.length < 1)
			{
				this.obstacles.push(new Obstacle(this.game));
			}

			for (let o = 0; o < this.obstacles.length; ++o)
			{
				const obstacle = this.obstacles[o];
				this.physics.arcade.collide(this.player.sprite, obstacle.sprite, this.hitObstacle, null, this);
				obstacle.update();
				if (obstacle.sprite.position.x < 0)
				{
					obstacle.sprite.kill();
					this.obstacles.splice(o, 1);
				}
			}

			this.player.update();

		}

		hitObstacle()
		{
			this.obstacles.splice(0, this.obstacles.length);
			this.game.state.start("MainMenuState");
		}
	}
}
