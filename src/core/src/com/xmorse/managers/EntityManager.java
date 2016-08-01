package com.xmorse.managers;

import com.badlogic.ashley.core.Engine;
import com.badlogic.ashley.core.Entity;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.xmorse.Time;
import com.xmorse.components.PlayerComponent;
import com.xmorse.components.PositionComponent;
import com.xmorse.components.RenderableComponent;
import com.xmorse.components.SpriteComponent;
import com.xmorse.components.VelocityComponent;
import com.xmorse.systems.MovementSystem;
import com.xmorse.systems.RenderSystem;

public class EntityManager
{
	private final Engine _engine;

	public EntityManager(Engine engine, SpriteBatch batch, OrthographicCamera camera)
	{
		_engine = engine;

		engine.addSystem(new MovementSystem());
		engine.addSystem(new RenderSystem(batch));

		Entity player = new Entity();
		player.add(new PlayerComponent());
		player.add(new PositionComponent(400, 50));
		player.add(new VelocityComponent(0, 0));
		player.add(new SpriteComponent(new Texture("PNG/playerShip1_blue.png")));
		player.add(new RenderableComponent());

		engine.addEntity(player);
	}

	public void update()
	{
		_engine.update((float) Time.time);
	}
}
