package com.xmorse.components;

import com.badlogic.ashley.core.ComponentMapper;

public class Mappers
{
	public static final ComponentMapper<PositionComponent> position = ComponentMapper.getFor(PositionComponent.class);
	public static final ComponentMapper<VelocityComponent> velocity = ComponentMapper.getFor(VelocityComponent.class);
}
