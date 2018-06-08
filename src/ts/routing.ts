import { Query, QueryAll } from "query";

const routes = {
	"": { viewSelector: ".home", menuItemSelector: ".btn-home" },
	"#playing": { viewSelector: ".playing", menuItemSelector: ".btn-playing" },
	"#settings": { viewSelector: ".settings", menuItemSelector: ".btn-settings" },
	"#stories": { viewSelector: ".stories", menuItemSelector: ".btn-stories" },
	"#text": { viewSelector: ".paste", menuItemSelector: ".btn-paste" },
};

function setView(viewSelector: string, menuItemSelector: string)
{
	// Disable all views
	QueryAll(".view")
		.filter(view => !view.classList.contains("disabled"))
		.forEach(view => view.classList.add("disabled"));

	// Enable selected view
	Query(viewSelector).classList.remove("disabled");

	// Unhighlight previous menu item(s)
	QueryAll(".menu .btn.active")
		.forEach(button => button.classList.remove("active"));

	// Highlight new menu item
	Query(menuItemSelector).classList.add("active");
}

function processHash()
{
	const route = routes[location.hash];

	if (route)
		setView(route.viewSelector, route.menuItemSelector);

	if (location.hash === "" && location.href.indexOf("#") > -1)
		history.replaceState("", document.title, window.location.pathname);
}

export function Initialize()
{
	document.addEventListener("DOMContentLoaded", processHash);
	window.addEventListener("hashchange", processHash);
}
