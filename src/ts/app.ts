declare let require;
require("file-loader?name=index.html!../index.html");
require("file-loader?name=favicon.ico!../favicon.ico");
require("file-loader?name=robots.txt!../robots.txt");
require("../less/site.less");

import * as Morse from "./morsetable";
import { MorseParams } from "./morseparams";
import { Player } from "./player";
import * as UI from "./ui";

const morseTable = new Morse.Table();
const morseParams = new MorseParams();
const player = new Player(morseTable, morseParams);

UI.init();
