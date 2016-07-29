package com.xmorse.components;

import com.badlogic.ashley.core.Component;
import com.badlogic.gdx.utils.Pool;

public class PlayerComponent implements Component, Pool.Poolable
{
	public int score;
	public int health = 100;

	@Override
	public void reset()
	{
		score = 0;
		health = 100;
	}
}
