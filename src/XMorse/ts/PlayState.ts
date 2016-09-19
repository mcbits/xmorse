namespace XMorse
{
	export class PlayState extends Phaser.State
	{
		game: Phaser.Game;
		background: Phaser.TileSprite;
		player: Phaser.Sprite;
		jumptimer: number;
		cursors: Phaser.CursorKeys;

		constructor(game: Phaser.Game)
		{
			super();
			this.game = game;
		}

		preload(): void
		{
		}

		create(): void
		{
			this.game.physics.startSystem(Phaser.Physics.ARCADE);

			this.background = this.game.add.tileSprite(0, 0, 800, 400, "swamp");

			this.player = this.game.add.sprite(this.game.world.centerX / 2, this.game.world.centerY, "run");
			this.player.anchor.setTo(0.5, 0.5);
			this.player.scale.setTo(0.125);
			this.player.animations.add("jump", [0], 1, true);
			this.player.animations.add("idle", [0, 1], 2, true);
			this.player.animations.add("run", [0, 1, 2, 3, 4, 5], 12, true);
			this.player.animations.play("run");

			this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

			this.player.body.collideWorldBounds = true;
		}

		update(): void
		{
			this.background.tilePosition.x -= 10;
			if (this.game.input.activePointer.isDown)
			{
				this.player.animations.play("jump");
				this.player.body.velocity.y = -550;
			}
			else
			{
				this.player.animations.play("run");
				const body = <Phaser.Physics.Arcade.Body>this.player.body;
				body.velocity.y = 2000;
			}
		}
	}
}
