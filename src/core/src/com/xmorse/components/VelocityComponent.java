package com.xmorse.components;

import com.badlogic.ashley.core.Component;
import com.badlogic.gdx.math.Vector3;

public class VelocityComponent implements Component
{
	public float x = 0.0f;
	public float y = 0.0f;

	public VelocityComponent(float x, float y)
	{
		this.x = x;
		this.y = y;
	}
}
