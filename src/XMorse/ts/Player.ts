namespace XMorse
{
	export class Player
	{
		game: Phaser.Game;
		sprite: Phaser.Sprite;

		constructor(game: Phaser.Game)
		{
			this.game = game;
		}

		preload()
		{
		}

		create() 
		{
			this.sprite = this.game.add.sprite(this.game.world.centerX / 2, this.game.world.centerY, "run");
			this.sprite.anchor.setTo(0.5, 0.5);
			this.sprite.scale.setTo(0.125);
			this.sprite.animations.add("jump", [0], 1, true);
			this.sprite.animations.add("idle", [0, 1], 2, true);
			this.sprite.animations.add("run", [0, 1, 2, 3, 4, 5], 12, true);
			this.sprite.animations.play("run");
			this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
			this.sprite.body.collideWorldBounds = true;
		}

		update()
		{
			if (this.game.input.activePointer.isDown)
			{
				this.sprite.animations.play("jump");
				this.sprite.body.velocity.y = -550;
			}
			else
			{
				this.sprite.animations.play("run");
				const body = <Phaser.Physics.Arcade.Body>this.sprite.body;
				body.velocity.y = 2000;
			}
		}
	}
}
