package com.xmorse.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;
import com.xmorse.XMorse;
import com.xmorse.scenes.Hud;
import com.xmorse.util.Static;

public class PlayScreen extends ScreenAdapter
{
	private final XMorse _game;
	private boolean _alive = true;
	private Camera _camera;
	private Viewport _viewport;
	private Hud _hud;

	public PlayScreen(XMorse game)
	{
		_game = game;
		_camera = new OrthographicCamera();
		_viewport = new FitViewport(Static.BaseWidth, Static.BaseHeight, _camera);
		_hud = new Hud(game.batch);
		_camera.position.set(_viewport.getWorldWidth() / 2, _viewport.getWorldHeight() / 2, 0);
	}

	@Override
	public void show()
	{
	}

	public void handleInput(float dt)
	{
		if (Gdx.input.isTouched())
			_camera.position.x += 10 * dt;
	}

	public void update(float dt)
	{
		handleInput(dt);
		_camera.update();
	}

	@Override
	public void render(float dt)
	{
		if (!_alive) {
			_game.setScreen(new GameOverScreen(_game));
		}

		update(dt);

		Gdx.gl.glClearColor(0, 0, 0, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);

		_game.batch.setProjectionMatrix(_hud.stage.getCamera().combined);
		_hud.stage.draw();

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
