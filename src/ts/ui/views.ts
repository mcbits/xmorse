/// <reference path="../events.ts"/>
/// <reference path="../query.ts"/>

namespace Views {
	function view(selector: string, menuItem: Element) {
		const views = QueryAll(".view");

		for (let i = 0; i < views.length; ++i) {
			const view = views[i];
			if (!view.classList.contains("disabled"))
				view.classList.add("disabled");
		}

		const viewToShow = Query(selector);
		viewToShow.classList.remove("disabled");

		// Highlight the menu item
		const controls = QueryAll(".menu .btn");
		for (let i = 0; i < controls.length; ++i) {
			const control = controls[i];
			control.classList.remove("active");
		}
		menuItem.classList.add("active");
	}

	Listen(VIEW_HOME,
		() => view(".home", Query(".btn-home")));

	Listen(VIEW_SETTINGS,
		() => view(".settings", Query(".btn-settings")));

	Listen(VIEW_PLAYING,
		() => view(".playing", Query(".btn-playing")));

	Listen(VIEW_STORIES,
		() => view(".stories", Query(".btn-stories")));

	Listen(VIEW_TEXT,
		() => view(".paste", Query(".btn-paste")));
}
