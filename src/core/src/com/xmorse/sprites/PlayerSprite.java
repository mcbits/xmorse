package com.xmorse.sprites;

import com.badlogic.gdx.graphics.g2d.Sprite;
import com.badlogic.gdx.physics.box2d.Body;
import com.badlogic.gdx.physics.box2d.BodyDef;
import com.badlogic.gdx.physics.box2d.CircleShape;
import com.badlogic.gdx.physics.box2d.FixtureDef;
import com.badlogic.gdx.physics.box2d.World;
import com.xmorse.util.Static;

public class PlayerSprite extends Sprite
{
	public World world;
	public Body b2body;

	public PlayerSprite(World world)
	{
		this.world = world;
		definePlayer();
	}

	public void definePlayer() {
		BodyDef bdef = new BodyDef();
		{
			float scaledPosX = 32 / Static.PPM;
			float scaledPosY = 32 / Static.PPM;
			bdef.position.set(scaledPosX, scaledPosY);
		}
		bdef.type = BodyDef.BodyType.DynamicBody;
		b2body = world.createBody(bdef);

		FixtureDef fdef = new FixtureDef();
		CircleShape shape = new CircleShape();
		{
			float scaledRadius = 5 / Static.PPM;
			shape.setRadius(scaledRadius);
		}
		fdef.shape = shape;

		b2body.createFixture(fdef);
	}
}
