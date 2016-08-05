package com.xmorse.util;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.physics.box2d.Body;
import com.badlogic.gdx.physics.box2d.BodyDef;
import com.badlogic.gdx.physics.box2d.PolygonShape;
import com.badlogic.gdx.physics.box2d.World;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;

public class Static
{
	public static final int BaseWidth = 800;
	public static final int BaseHeight = 480;
	public static final Vector2 Gravity = new Vector2(0, 0);

	// Pixels per meter
	public static final float PPM = 100;

	public static Skin commonSkin()
	{
		Skin skin = new Skin();

		//Create a font
		BitmapFont font = new BitmapFont();
		skin.add("default", font);

		//Create a texture
		int w = Gdx.graphics.getWidth() / 4;
		int h = Gdx.graphics.getHeight() / 10;
		Pixmap pixmap = new Pixmap(w, h, Pixmap.Format.RGB888);
		pixmap.setColor(Color.WHITE);
		pixmap.fill();
		skin.add("background", new Texture(pixmap));

		//Create a button style
		TextButton.TextButtonStyle textButtonStyle = new TextButton.TextButtonStyle();
		textButtonStyle.up = skin.newDrawable("background", Color.GRAY);
		textButtonStyle.down = skin.newDrawable("background", Color.DARK_GRAY);
		textButtonStyle.checked = skin.newDrawable("background", Color.DARK_GRAY);
		textButtonStyle.over = skin.newDrawable("background", Color.LIGHT_GRAY);
		textButtonStyle.font = skin.getFont("default");
		skin.add("default", textButtonStyle);

		Label.LabelStyle labelStyle = new Label.LabelStyle(font, Color.WHITE);
		skin.add("default", labelStyle);

		return skin;
	}

	public static World createWorld()
	{
		return new World(Static.Gravity, true);
	}

	public static Body createGround(World world)
	{
		BodyDef bodyDef = new BodyDef();
		bodyDef.position.set(new Vector2(0f, 0f));
		Body body = world.createBody(bodyDef);
		PolygonShape shape = new PolygonShape();
		shape.setAsBox(25f, 1f);
		body.createFixture(shape, 0f);
		shape.dispose();
		return body;
	}

	public static Body createPlayer(World world) {
		BodyDef bodyDef = new BodyDef();
		bodyDef.type = BodyDef.BodyType.DynamicBody;
		bodyDef.position.set(new Vector2(2f, 2f));
		PolygonShape shape = new PolygonShape();
		shape.setAsBox(0.5f, 1f);
		Body body = world.createBody(bodyDef);
		body.createFixture(shape, 0.5f);
		body.resetMassData();
		shape.dispose();
		return body;
	}
}
