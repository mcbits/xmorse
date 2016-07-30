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
	private ImmutableArray<Entity> _entities;
	private ComponentMapper<PositionComponent> _positions =
		ComponentMapper.getFor(PositionComponent.class);
	private ComponentMapper<VelocityComponent> _velocities =
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
		_entities = engine.getEntitiesFor(family);
	}

	@Override
	public void update(float deltaTime)
	{
		for (int i = 0; i < _entities.size(); ++i) {
			Entity entity = _entities.get(i);
			PositionComponent position = _positions.get(entity);
			VelocityComponent velocity = _velocities.get(entity);

			position.x += velocity.dx * deltaTime;
			position.y += velocity.dy * deltaTime;
		}
	}
}
