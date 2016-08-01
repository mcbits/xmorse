package com.xmorse.screens;

import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.xmorse.game.XMorse;
import com.xmorse.util.Static;

public class CreditsScreen extends ScreenAdapter
{
	private final XMorse _game;
	private final Stage _stage;
	private final Skin _skin;

	public CreditsScreen(final XMorse game)
	{
		_game = game;
		_stage = new Stage();
		_skin = Static.commonSkin();
	}

	@Override
	public void show()
	{
		super.show();
	}

	@Override
	public void render(float delta)
	{
		super.render(delta);
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
