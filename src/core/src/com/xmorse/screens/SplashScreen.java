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

public class SplashScreen extends ScreenAdapter
{
	private Game _game;
	private SpriteBatch _batch;
	private Sprite _splash;
	private Texture _texture;
	private long _startTime;

	/**
	 * Creates a new instance of the splash screen.
	 * @param game     The Game instance.
	 * @param batch    The game's SpriteBatch instance.
	 */
	public SplashScreen(Game game, SpriteBatch batch)
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

		if (TimeUtils.millis() - 2000 > _startTime)
			_game.setScreen(new MenuScreen(_game, _batch));
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
