import {
    Notify, Listen,
    VIEW_HOME, VIEW_OPTIONS, VIEW_PLAYING, VIEW_STORIES, VIEW_TEXT
} from "./events";
import { Query, QueryAll } from "./query";

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

Listen(VIEW_OPTIONS,
    () => view(".options", Query(".btn-options")));

Listen(VIEW_PLAYING,
    () => view(".playing", Query(".btn-playing")));

Listen(VIEW_STORIES,
    () => view(".stories", Query(".btn-stories")));

Listen(VIEW_TEXT,
    () => view(".paste", Query(".btn-paste")));


