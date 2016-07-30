package com.xmorse.components;

import com.badlogic.ashley.core.Component;

public class VelocityComponent implements Component
{
	public float dx = 0.0f;
	public float dy = 0.0f;

	public VelocityComponent(float dx, float dy)
	{
		this.dx = dx;
		this.dy = dy;
	}
}
