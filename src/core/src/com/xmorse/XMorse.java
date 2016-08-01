package com.xmorse;

import com.badlogic.ashley.core.Engine;
import com.badlogic.gdx.Game;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.xmorse.managers.EntityManager;
import com.xmorse.screens.SplashScreen;

public class XMorse extends Game
{
	public static long currentTimeMillis;
	public SpriteBatch batch;

	private Engine _engine;
	private EntityManager _entityManager;
	private OrthographicCamera _camera;
	private SplashScreen _splash;

	@Override
	public void create()
	{
		batch = new SpriteBatch();
		_engine = new Engine();
		_camera = new OrthographicCamera();
		_camera.setToOrtho(false);
		_entityManager = new EntityManager(_engine, batch, _camera);
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
