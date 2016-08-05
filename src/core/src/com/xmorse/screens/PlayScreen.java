package com.xmorse.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.physics.box2d.Body;
import com.badlogic.gdx.physics.box2d.BodyDef;
import com.badlogic.gdx.physics.box2d.Box2DDebugRenderer;
import com.badlogic.gdx.physics.box2d.FixtureDef;
import com.badlogic.gdx.physics.box2d.PolygonShape;
import com.badlogic.gdx.physics.box2d.World;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;
import com.xmorse.XMorse;
import com.xmorse.scenes.Hud;
import com.xmorse.sprites.PlayerSprite;
import com.xmorse.stages.GameStage;
import com.xmorse.util.Static;

public class PlayScreen extends ScreenAdapter
{
	private final XMorse _game;
	private boolean _alive = true;
	private Camera _camera;
	private Viewport _viewport;
	private Hud _hud;
	private World _world;
	private Box2DDebugRenderer _renderer;
	private PlayerSprite _player;
	private GameStage _stage;

	public PlayScreen(XMorse game)
	{
		_game = game;
		_camera = new OrthographicCamera();
		{
			float scaledWidth = Static.BaseWidth / Static.PPM;
			float scaledHeight = Static.BaseHeight / Static.PPM;
			_viewport = new FitViewport(scaledWidth, scaledHeight, _camera);
		}
		_hud = new Hud(game.batch);
		_camera.position.set(_viewport.getWorldWidth() / 2, _viewport.getWorldHeight() / 2, 0);
		_world = new World(new Vector2(0, -10), true);
		_renderer = new Box2DDebugRenderer();
		_player = new PlayerSprite(_world);
		_stage = new GameStage();
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

		_world.step(1 / 60f, 6, 2);

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

		_renderer.render(_world, _camera.combined);

		_stage.draw();
		_stage.act(dt);

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
		_renderer.dispose();
		_world.dispose();
		super.dispose();
	}
}
