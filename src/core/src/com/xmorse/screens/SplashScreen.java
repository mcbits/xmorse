package com.xmorse.screens;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Sprite;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.utils.TimeUtils;
import com.xmorse.Time;
import com.xmorse.game.XMorse;

public class SplashScreen extends ScreenAdapter
{
	private XMorse _game;
	private SpriteBatch _batch;
	private Sprite _splash;
	private Texture _texture;
	private long _startTime;

	/**
	 * Creates a new instance of the splash screen.
	 * @param game     The Game instance.
	 * @param batch    The game's SpriteBatch instance.
	 */
	public SplashScreen(XMorse game, SpriteBatch batch)
	{
		_game = game;
		_batch = batch;
	}

	@Override
	public void show()
	{
		_texture = new Texture("PNG/splash_800x480.png");
		_splash = new Sprite(_texture);
		_splash.setSize(Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
		_startTime = TimeUtils.millis();
	}

	@Override
	public void render(float delta)
	{
		Gdx.gl.glClearColor(0, 0, 0, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		_batch.begin();
		_splash.draw(_batch);
		_batch.end();

		if (TimeUtils.timeSinceMillis(_startTime) > 250)
			_game.setScreen(new MenuScreen(_game));
	}

	@Override
	public void resize(int width, int height)
	{
		super.resize(width, height);
	}

	@Override
	public void pause()
	{
		super.pause();
	}

	@Override
	public void resume()
	{
		super.resume();
	}

	@Override
	public void hide()
	{
		super.hide();
	}

	@Override
	public void dispose()
	{
		_texture.dispose();
		super.dispose();
	}
}
