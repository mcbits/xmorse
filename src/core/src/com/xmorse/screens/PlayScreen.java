package com.xmorse.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.xmorse.XMorse;

public class PlayScreen extends ScreenAdapter
{
	private final XMorse _game;
	private boolean _alive = true;

	public PlayScreen(XMorse game)
	{
		_game = game;
	}

	@Override
	public void show()
	{
	}

	@Override
	public void render(float delta)
	{
		if (!_alive) {
			_game.setScreen(new GameOverScreen(_game));
		}

		_game.batch.begin();

		_game.batch.end();

		//_alive = false;
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
		super.dispose();
	}
}
