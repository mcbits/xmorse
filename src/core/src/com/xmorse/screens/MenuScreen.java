package com.xmorse.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.xmorse.game.XMorse;

public class MenuScreen extends ScreenAdapter
{
	private XMorse _game;
	private Skin _skin;
	private Stage _stage;

	public MenuScreen(XMorse game)
	{
		_game = game;
		_stage = new Stage();
		createSkin();
	}

	private void createSkin()
	{
		_skin = new Skin();

		//Create a font
		BitmapFont font = new BitmapFont();
		_skin.add("default", font);

		//Create a texture
		int w = Gdx.graphics.getWidth() / 4;
		int h = Gdx.graphics.getHeight() / 10;
		Pixmap pixmap = new Pixmap(w, h, Pixmap.Format.RGB888);
		pixmap.setColor(Color.WHITE);
		pixmap.fill();
		_skin.add("background", new Texture(pixmap));

		//Create a button style
		TextButton.TextButtonStyle textButtonStyle = new TextButton.TextButtonStyle();
		textButtonStyle.up = _skin.newDrawable("background", Color.GRAY);
		textButtonStyle.down = _skin.newDrawable("background", Color.DARK_GRAY);
		textButtonStyle.checked = _skin.newDrawable("background", Color.DARK_GRAY);
		textButtonStyle.over = _skin.newDrawable("background", Color.LIGHT_GRAY);
		textButtonStyle.font = _skin.getFont("default");
		_skin.add("default", textButtonStyle);

		Label.LabelStyle labelStyle = new Label.LabelStyle(font, Color.RED);
		_skin.add("default", labelStyle);
	}

	@Override
	public void show()
	{
		super.show();
		Gdx.input.setInputProcessor(_stage);

		TextButton playButton = new TextButton("Play", _skin);
		int left = Gdx.graphics.getWidth() / 2 - Gdx.graphics.getWidth() / 8;
		int top = Gdx.graphics.getHeight() / 2;
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

		Label titleLabel = new Label("X Morse", _skin);
		float titleLeft = Gdx.graphics.getWidth() / 2 - titleLabel.getWidth() / 2;
		float titleTop = Gdx.graphics.getHeight() - titleLabel.getHeight() - 20;
		titleLabel.setPosition(titleLeft, titleTop);
		_stage.addActor(titleLabel);
	}

	@Override
	public void render(float delta)
	{
		Gdx.gl.glClearColor(0, 0, 0, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		_game.batch.begin();
		_game.batch.end();
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
		_skin.dispose();
		_stage.dispose();
		super.dispose();
	}
}
