package com.xmorse.desktop;

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;
import com.xmorse.XMorse;
import com.xmorse.util.Static;

public class DesktopLauncher {
	public static void main (String[] arg) {
		LwjglApplicationConfiguration config = new LwjglApplicationConfiguration();
		config.width = Static.BaseWidth;
		config.height = Static.BaseHeight;
		new LwjglApplication(new XMorse(), config);
	}
}
