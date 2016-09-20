var XMorse;
(function (XMorse) {
    var Game = (function () {
        function Game() {
            var conf = {
                width: 800,
                height: 480,
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
            load.spritesheet("sign", "assets/images/sign.png", 100, 100);
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
            this.createBackground();
            this.createMusic();
            this.createStartButton();
        };
        MainMenuState.prototype.createBackground = function () {
            this.backgroundImage = this.add.sprite(0, 0, "xmorse");
            var widthScale = this.game.width / this.backgroundImage.width;
            var heightScale = this.game.height / this.backgroundImage.height;
            this.backgroundImage.scale.setTo(widthScale, heightScale);
        };
        MainMenuState.prototype.createMusic = function () {
            this.music = this.game.add.audio("IntroMusic", 1, true);
            this.music.play();
        };
        MainMenuState.prototype.createStartButton = function () {
            var _this = this;
            var startText = this.game.add.text(450, 300, "Start", {
                font: "30pt Helvetica",
                fill: "#ffffff",
                align: "left"
            });
            startText.inputEnabled = true;
            startText.events.onInputOver.add(function (target) { return target.fill = "#ffff99"; });
            startText.events.onInputOut.add(function (target) { return target.fill = "#ffffff"; });
            startText.events.onInputUp.add(function () {
                _this.music.stop();
                _this.game.state.start("PlayState");
            });
        };
        return MainMenuState;
    }(Phaser.State));
    XMorse.MainMenuState = MainMenuState;
})(XMorse || (XMorse = {}));
var XMorse;
(function (XMorse) {
    var Obstacle = (function () {
        function Obstacle(game) {
            this.game = game;
            this.sprite = this.game.add.sprite(this.game.world.centerX / .75, this.game.world.centerY / .65, "sign");
            this.sprite.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.collideWorldBounds = true;
            this.sprite.animations.add("spin", [0, 1, 2, 3], 12, true);
            this.sprite.animations.play("spin");
        }
        Obstacle.prototype.update = function () {
            this.sprite.body.velocity.x = -150;
            this.sprite.body.velocity.y = 2000;
        };
        return Obstacle;
    }());
    XMorse.Obstacle = Obstacle;
})(XMorse || (XMorse = {}));
var XMorse;
(function (XMorse) {
    var Player = (function () {
        function Player(game) {
            this.game = game;
        }
        Player.prototype.preload = function () {
        };
        Player.prototype.create = function () {
            this.sprite = this.game.add.sprite(this.game.world.centerX / 2, this.game.world.centerY, "run");
            this.sprite.anchor.setTo(0.5, 0.5);
            this.sprite.scale.setTo(0.125);
            this.sprite.animations.add("jump", [0], 1, true);
            this.sprite.animations.add("idle", [0, 1], 2, true);
            this.sprite.animations.add("run", [0, 1, 2, 3, 4, 5], 12, true);
            this.sprite.animations.play("run");
            this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.collideWorldBounds = true;
        };
        Player.prototype.update = function () {
            if (this.game.input.activePointer.isDown) {
                this.sprite.animations.play("jump");
                this.sprite.body.velocity.y = -550;
            }
            else {
                this.sprite.animations.play("run");
                var body = this.sprite.body;
                body.velocity.y = 2000;
            }
        };
        return Player;
    }());
    XMorse.Player = Player;
})(XMorse || (XMorse = {}));
var XMorse;
(function (XMorse) {
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState(game) {
            _super.call(this);
            this.game = game;
            this.obstacles = [];
        }
        PlayState.prototype.preload = function () {
        };
        PlayState.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.background = this.game.add.tileSprite(0, 0, 800, 480, "swamp");
            var scale = this.game.height / 400;
            this.background.tileScale.set(scale, scale);
            this.player = new XMorse.Player(this.game);
            this.player.create();
        };
        PlayState.prototype.update = function () {
            if (this.obstacles.length < 1) {
                this.obstacles.push(new XMorse.Obstacle(this.game));
            }
            this.background.tilePosition.x -= 3;
            for (var o = 0; o < this.obstacles.length; ++o) {
                this.obstacles[o].update();
            }
            this.player.update();
        };
        return PlayState;
    }(Phaser.State));
    XMorse.PlayState = PlayState;
})(XMorse || (XMorse = {}));
