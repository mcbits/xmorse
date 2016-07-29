package com.xmorse.managers;

import com.badlogic.ashley.core.Engine;
import com.badlogic.ashley.core.Entity;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.xmorse.components.PositionComponent;
import com.xmorse.components.RenderableComponent;
import com.xmorse.components.SpriteComponent;
import com.xmorse.components.VelocityComponent;
import com.xmorse.Time;
import com.xmorse.systems.MovementSystem;
import com.xmorse.systems.RenderSystem;

public class EntityManager
{
	private Engine engine;

	public EntityManager(Engine engine, SpriteBatch batch, OrthographicCamera camera)
	{
		this.engine = engine;

		MovementSystem cms = new MovementSystem();
		engine.addSystem(cms);
		RenderSystem rs = new RenderSystem(batch);
		engine.addSystem(rs);

		Entity player = new Entity();
		player.add(new PositionComponent(400, 50))
			.add(new VelocityComponent(0, 0))
			.add(new SpriteComponent(new Texture("PNG/playerShip1_blue.png")))
			.add(new RenderableComponent());

		engine.addEntity(player);
	}

	public void update() {
		engine.update((float) Time.time);
	}
}
