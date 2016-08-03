package com.xmorse.scenes;

import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Table;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;
import com.xmorse.util.Static;

public class Hud
{
	public Stage stage;
	public Viewport viewport;

	private float _timeCount;
	private int _score = 0;
	private Label _scoreTextLabel;
	private Label _scoreLabel;

	public Hud(SpriteBatch batch)
	{
		_timeCount = 0;
		_score = 0;
		Camera camera = new OrthographicCamera();
		viewport = new FitViewport(Static.BaseWidth, Static.BaseHeight, camera);
		stage = new Stage(viewport, batch);

		Table table = new Table();
		table.top();
		table.setFillParent(true);

		Label.LabelStyle labelStyle = new Label.LabelStyle(new BitmapFont(), Color.WHITE);
		_scoreTextLabel = new Label("SCORE", labelStyle);
		_scoreLabel = new Label(String.format("%06d", _score), labelStyle);

		table.add(_scoreTextLabel).expandX().padTop(10);
		table.row();
		table.add(_scoreLabel).expandX();

		stage.addActor(table);
	}
}
