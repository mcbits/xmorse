declare let require;
require("file-loader?name=index.html!../index.html");
require("file-loader?name=privacy.html!../privacy.html");
require("file-loader?name=favicon.ico!../favicon.ico");
require("file-loader?name=robots.txt!../robots.txt");
require("file-loader?name=CNAME!../CNAME");
require("file-loader?name=google90d264b1a2a461c8.html!../google90d264b1a2a461c8.html");
require("../less/site.less");

import * as Audio from "./audiocontext"; Audio;
import * as VoicePlayer from "./voiceplayer"; VoicePlayer;
import * as TonePlayer from "./toneplayer"; TonePlayer;
import * as Player from "./player"; Player;
import * as FullScreen from "./fullscreen"; FullScreen;
import * as Storage from "./storage"; Storage;
import * as UI from "./ui"; UI;
