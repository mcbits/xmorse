package com.xmorse.game;

import com.badlogic.ashley.core.Engine;
import com.badlogic.gdx.Game;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.xmorse.managers.EntityManager;
import com.xmorse.screens.SplashScreen;

public class XMorse extends Game
{
	public static long currentTimeMillis;
	private Engine engine;
	private EntityManager entityManager;
	private SpriteBatch batch;
	private OrthographicCamera camera;
	private SplashScreen _splash;

	@Override
	public void create()
	{
		engine = new Engine();
		batch = new SpriteBatch();
		camera = new OrthographicCamera();
		camera.setToOrtho(false);
		entityManager = new EntityManager(engine, batch, camera);
		_splash = new SplashScreen(this, batch);
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
