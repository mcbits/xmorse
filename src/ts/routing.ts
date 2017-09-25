/// <reference path="events.ts"/>

namespace Routing
{
	const routes = {
		"": VIEW_HOME,
		"#playing": VIEW_PLAYING,
		"#settings": VIEW_SETTINGS,
		"#stories": VIEW_STORIES,
		"#text": VIEW_TEXT
	};

	function processHash()
	{
		const hash = location.hash;
		if (routes[hash])
			Notify(routes[hash], null);

		if (hash === "" && location.href.indexOf("#") > -1)
			history.replaceState("", document.title, window.location.pathname);
	}

	window.addEventListener("hashchange", processHash);
	document.addEventListener("DOMContentLoaded", processHash);
}
