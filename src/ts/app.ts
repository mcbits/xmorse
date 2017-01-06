declare let require;
require("file-loader?name=index.html!../index.html");
require("file-loader?name=favicon.ico!../favicon.ico");
require("file-loader?name=robots.txt!../robots.txt");
require("../less/site.less");

import * as Audio from "./audiocontext"; Audio;
import * as VoicePlayer from "./voiceplayer"; VoicePlayer;
import * as TonePlayer from "./toneplayer"; TonePlayer;
import * as Player from "./player"; Player;
import * as FullScreen from "./fullscreen"; FullScreen;
import * as UI from "./ui"; UI;
