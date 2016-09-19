var XMorse;
(function (XMorse) {
    var Game = (function () {
        function Game() {
            var conf = {
                width: 800,
                height: 400,
                antialias: true,
                enableDebug: true,
                forceSetTimeOut: false,
                parent: "game",
                physicsConfig: Phaser.Physics.ARCADE,
                preserveDrawingBuffer: true,
                renderer: Phaser.CANVAS,
                resolution: 1,
                state: { create: this.create, preload: this.preload },
                transparent: false
            };
            this.game = new Phaser.Game(conf);
        }
        Game.prototype.preload = function () {
            var load = this.game.load;
            load.image("xmorse", "assets/images/xmorse.png");
            load.image("swamp", "assets/images/swamp.png");
            load.image("desert", "assets/images/desert.png");
            load.spritesheet("idle", "assets/images/player-idle.png", 499, 750);
            load.spritesheet("run", "assets/images/player-run.png", 500, 800);
            load.spritesheet("jump", "assets/images/player-jump.png", 490, 845);
            load.spritesheet("land", "assets/images/player-land.png", 559, 764);
            load.audio("IntroMusic", ["assets/music/intro.mp3"]);
        };
        Game.prototype.create = function () {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.state.add("PlayState", new XMorse.PlayState(this.game), false);
            this.game.state.add("MainMenuState", new XMorse.MainMenuState(this.game), true);
        };
        return Game;
    }());
    XMorse.Game = Game;
})(XMorse || (XMorse = {}));
document.addEventListener("DOMContentLoaded", function () {
    var game = new XMorse.Game();
});
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XMorse;
(function (XMorse) {
    var MainMenuState = (function (_super) {
        __extends(MainMenuState, _super);
        function MainMenuState(game) {
            _super.call(this);
            this.game = game;
        }
        MainMenuState.prototype.create = function () {
            var _this = this;
            this.backgroundImage = this.add.sprite(0, 0, "xmorse");
            var widthScale = this.game.width / this.backgroundImage.width;
            var heightScale = this.game.height / this.backgroundImage.height;
            this.backgroundImage.scale.setTo(widthScale, heightScale);
            this.music = this.game.add.audio("IntroMusic", 1, true);
            this.music.play();
            var optionStyle = { font: "30pt Helvetica", fill: "#ffffff", align: "left" };
            var txt = this.game.add.text(450, 248, "Start", optionStyle);
            txt.inputEnabled = true;
            txt.events.onInputUp.add(function () {
                _this.music.stop();
                _this.game.state.start("PlayState");
            });
            txt.events.onInputOver.add(function (target) { return target.fill = "#ffff99"; });
            txt.events.onInputOut.add(function (target) { return target.fill = "#ffffff"; });
        };
        return MainMenuState;
    }(Phaser.State));
    XMorse.MainMenuState = MainMenuState;
})(XMorse || (XMorse = {}));
var XMorse;
(function (XMorse) {
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState(game) {
            _super.call(this);
            this.game = game;
        }
        PlayState.prototype.preload = function () {
        };
        PlayState.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.background = this.game.add.tileSprite(0, 0, 800, 400, "swamp");
            this.player = this.game.add.sprite(this.game.world.centerX / 2, this.game.world.centerY, "run");
            this.player.anchor.setTo(0.5, 0.5);
            this.player.scale.setTo(0.125);
            this.player.animations.add("jump", [0], 1, true);
            this.player.animations.add("idle", [0, 1], 2, true);
            this.player.animations.add("run", [0, 1, 2, 3, 4, 5], 12, true);
            this.player.animations.play("run");
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.collideWorldBounds = true;
        };
        PlayState.prototype.update = function () {
            this.background.tilePosition.x -= 10;
            if (this.game.input.activePointer.isDown) {
                this.player.animations.play("jump");
                this.player.body.velocity.y = -550;
            }
            else {
                this.player.animations.play("run");
                var body = this.player.body;
                body.velocity.y = 2000;
            }
        };
        return PlayState;
    }(Phaser.State));
    XMorse.PlayState = PlayState;
})(XMorse || (XMorse = {}));
