package com.xmorse.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.xmorse.XMorse;
import com.xmorse.util.Static;

public class GameOverScreen extends ScreenAdapter
{
	private final XMorse _game;
	private final Stage _stage;
	private final Skin _skin;

	public GameOverScreen(final XMorse game)
	{
		_game = game;
		_stage = new Stage();
		_skin = Static.commonSkin();
	}

	@Override
	public void show()
	{
		super.show();
		Gdx.input.setInputProcessor(_stage);

		TextButton playButton = new TextButton("Play Again", _skin);
		float left = Gdx.graphics.getWidth() / 2 - Gdx.graphics.getWidth() / 8;
		float top = Gdx.graphics.getHeight() / 2;
		playButton.addListener(new ClickListener()
		{
			@Override
			public void clicked(InputEvent event, float x, float y)
			{
				_game.setScreen(new PlayScreen(_game));
			}
		});
		playButton.setPosition(left, top);
		_stage.addActor(playButton);

		TextButton menuButton = new TextButton("Menu", _skin);
		left = Gdx.graphics.getWidth() / 2 - Gdx.graphics.getWidth() / 8;
		top = Gdx.graphics.getHeight() / 2 - menuButton.getHeight() * 2;
		menuButton.addListener(new ClickListener()
		{
			@Override
			public void clicked(InputEvent event, float x, float y)
			{
				_game.setScreen(new MenuScreen(_game));
			}
		});
		menuButton.setPosition(left, top);
		_stage.addActor(menuButton);

		Label titleLabel = new Label("X Morse", _skin);
		float titleLeft = Gdx.graphics.getWidth() / 2 - titleLabel.getWidth() / 2;
		float titleTop = Gdx.graphics.getHeight() - titleLabel.getHeight() - 20;
		titleLabel.setPosition(titleLeft, titleTop);
		_stage.addActor(titleLabel);

		Label msgLabel = new Label("Game Over", _skin);
		float msgLeft = Gdx.graphics.getWidth() / 2 - msgLabel.getWidth() / 2;
		float msgTop = Gdx.graphics.getHeight() - msgLabel.getHeight() - 40;
		msgLabel.setPosition(msgLeft, msgTop);
		_stage.addActor(msgLabel);
	}

	@Override
	public void render(float delta)
	{
		super.render(delta);
		Gdx.gl.glClearColor(0, 0, 0, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		_stage.act();
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
		_stage.dispose();
		_skin.dispose();
		super.dispose();
	}
}
