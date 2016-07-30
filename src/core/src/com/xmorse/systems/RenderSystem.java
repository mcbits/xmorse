package com.xmorse.systems;

import com.badlogic.ashley.core.ComponentMapper;
import com.badlogic.ashley.core.Engine;
import com.badlogic.ashley.core.Entity;
import com.badlogic.ashley.core.EntitySystem;
import com.badlogic.ashley.core.Family;
import com.badlogic.ashley.utils.ImmutableArray;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.xmorse.components.PositionComponent;
import com.xmorse.components.RenderableComponent;
import com.xmorse.components.SpriteComponent;

public class RenderSystem extends EntitySystem
{
	private ImmutableArray<Entity> entities;
	private SpriteBatch batch;

	private ComponentMapper<PositionComponent> _positions =
		ComponentMapper.getFor(PositionComponent.class);

	public RenderSystem(SpriteBatch batch)
	{
		this.batch = batch;
	}

	public void addedToEngine(Engine engine)
	{
		Family.Builder builder = Family.all(
			RenderableComponent.class,
			SpriteComponent.class,
			PositionComponent.class);
		Family family = builder.get();
		entities = engine.getEntitiesFor(family);
	}

	public void update(float deltaTime)
	{
		for (int i = 0; i < entities.size(); ++i) {
			Entity entity = entities.get(i);

			SpriteComponent scom = entity.getComponent(SpriteComponent.class);
			PositionComponent pcom = entity.getComponent(PositionComponent.class);

			batch.draw(scom.sprite.getTexture(), pcom.x, pcom.y);
		}
	}
}
