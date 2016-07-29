package com.xmorse.systems;

import com.badlogic.ashley.core.ComponentMapper;
import com.badlogic.ashley.core.Engine;
import com.badlogic.ashley.core.Entity;
import com.badlogic.ashley.core.EntitySystem;
import com.badlogic.ashley.core.Family;
import com.badlogic.ashley.utils.ImmutableArray;
import com.xmorse.components.PositionComponent;
import com.xmorse.components.VelocityComponent;

public class MovementSystem extends EntitySystem
{
	private ImmutableArray<Entity> entities;
	private ComponentMapper<PositionComponent> pm =
		ComponentMapper.getFor(PositionComponent.class);
	private ComponentMapper<VelocityComponent> vm =
		ComponentMapper.getFor(VelocityComponent.class);

	public MovementSystem()
	{
	}

	@Override
	public void addedToEngine(Engine engine)
	{
		Family.Builder builder = Family.all(
			PositionComponent.class,
			VelocityComponent.class);
		Family family = builder.get();
		entities = engine.getEntitiesFor(family);
	}

	@Override
	public void update(float deltaTime)
	{
		for (int i = 0; i < entities.size(); ++i) {
			Entity entity = entities.get(i);
			PositionComponent position = pm.get(entity);
			VelocityComponent velocity = vm.get(entity);

			position.x += velocity.x * deltaTime;
			position.y += velocity.y * deltaTime;
		}
	}
}
