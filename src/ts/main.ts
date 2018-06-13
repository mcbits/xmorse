import * as FullScreen from "fullscreen";
import * as Routing from "routing";
import * as Settings from "settings";
import { ui } from "controls";

export function main()
{
	FullScreen.Initialize();
	ui.Initialize();
	Settings.Initialize();
	Routing.Initialize();
}
