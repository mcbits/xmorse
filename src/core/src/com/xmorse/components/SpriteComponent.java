package com.xmorse.components;

import com.badlogic.ashley.core.Component;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Sprite;

public class SpriteComponent implements Component
{
	public Sprite sprite;

	public SpriteComponent(Texture texture)
	{
		sprite = new Sprite(texture);
	}
}
