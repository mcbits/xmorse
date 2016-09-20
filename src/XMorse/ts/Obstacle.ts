namespace XMorse 
{
	export class Obstacle
	{
		game: Phaser.Game;
		sprite: Phaser.Sprite;

		constructor(game: Phaser.Game)
		{
			this.game = game;
			this.sprite = this.game.add.sprite(this.game.world.centerX / .75, this.game.world.centerY / .65, "sign");
			this.sprite.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
			this.sprite.body.collideWorldBounds = true;
			this.sprite.animations.add("spin", [0, 1, 2, 3], 12, true);
			this.sprite.animations.play("spin");
		}

		update()
		{
			this.sprite.body.velocity.x = -150;
			this.sprite.body.velocity.y = 2000;
		}
	}
}
