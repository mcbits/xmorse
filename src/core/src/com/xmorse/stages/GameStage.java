package com.xmorse.stages;

import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.physics.box2d.Body;
import com.badlogic.gdx.physics.box2d.Box2DDebugRenderer;
import com.badlogic.gdx.physics.box2d.World;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.xmorse.util.Static;

public class GameStage extends Stage
{

	// This will be our viewport measurements while working with the debug renderer
	private static final int VIEWPORT_WIDTH = 20;
	private static final int VIEWPORT_HEIGHT = 13;
	private final float TIME_STEP = 1 / 300f;
	private World _world;
	private Body _ground;
	private Body _player;
	private float accumulator = 0f;

	private OrthographicCamera camera;
	private Box2DDebugRenderer renderer;

	public GameStage()
	{
		_world = Static.createWorld();
		_ground = Static.createGround(_world);
		_player = Static.createPlayer(_world);
		renderer = new Box2DDebugRenderer();
		setupCamera();
	}

	private void setupCamera()
	{
		camera = new OrthographicCamera(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
		camera.position.set(camera.viewportWidth / 2, camera.viewportHeight / 2, 0f);
		camera.update();
	}

	@Override
	public void act(float delta)
	{
		super.act(delta);

		// Fixed timestep
		accumulator += delta;

		while (accumulator >= delta) {
			_world.step(TIME_STEP, 6, 2);
			accumulator -= TIME_STEP;
		}

		//TODO: Implement interpolation

	}

	@Override
	public void draw()
	{
		super.draw();
		renderer.render(_world, camera.combined);
	}
}