package com.xmorse.game;

import com.badlogic.ashley.core.Engine;
import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.xmorse.managers.EntityManager;
import com.xmorse.screens.SplashScreen;

public class XMorse extends Game
{
	private Engine engine;
	private EntityManager entityManager;
	private SpriteBatch batch;
	private OrthographicCamera camera;
	private SplashScreen _splash;

	public static long currentTimeMillis;

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
		Gdx.gl.glClearColor(1, 0, 0, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		batch.begin();
		screen.render(1);
		batch.end();
	}

	@Override
	public void dispose()
	{
		batch.dispose();
	}
}
