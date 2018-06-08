import * as FullScreen from "fullscreen";
import * as Routing from "routing";
import * as Settings from "settings";
import * as Controls from "controls";

export function main()
{
	FullScreen.Initialize();
	Controls.Initialize();
	Settings.Initialize();
	Routing.Initialize();
}
