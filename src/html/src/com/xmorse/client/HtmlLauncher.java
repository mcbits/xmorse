package com.xmorse.client;

import com.badlogic.gdx.ApplicationListener;
import com.badlogic.gdx.backends.gwt.GwtApplication;
import com.badlogic.gdx.backends.gwt.GwtApplicationConfiguration;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.dom.client.Style;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.xmorse.XMorse;
import com.xmorse.util.Static;

public class HtmlLauncher extends GwtApplication
{
	@Override
	public GwtApplicationConfiguration getConfig()
	{
		GwtApplicationConfiguration config = new GwtApplicationConfiguration(Static.BaseWidth, Static.BaseHeight);
		return config;
	}

	@Override
	public ApplicationListener createApplicationListener()
	{
		return new XMorse();
	}
}
