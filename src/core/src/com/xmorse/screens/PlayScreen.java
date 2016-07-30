package com.xmorse.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.xmorse.game.XMorse;

public class PlayScreen extends ScreenAdapter
{
	private XMorse _game;
	private Stage _stage;

	public PlayScreen(XMorse game)
	{
		_game = game;
	}

	@Override
	public void show()
	{
		_stage = new Stage();
	}

	@Override
	public void render(float delta)
	{
		_stage.act(delta);

		Gdx.gl.glClearColor(1, 1, 0, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);

		_stage.draw();
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
