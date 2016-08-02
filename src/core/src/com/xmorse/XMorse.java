package com.xmorse;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.xmorse.screens.SplashScreen;

public class XMorse extends Game
{
	public static long currentTimeMillis;
	public SpriteBatch batch;

	private OrthographicCamera _camera;
	private SplashScreen _splash;

	@Override
	public void create()
	{
		batch = new SpriteBatch();
		_camera = new OrthographicCamera();
		_camera.setToOrtho(false);
		_splash = new SplashScreen(this);
		setScreen(_splash);
	}

	@Override
	public void render()
	{
		super.render();
	}

	@Override
	public void dispose()
	{
		batch.dispose();
	}
}
