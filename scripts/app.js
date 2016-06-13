var app = (function () {
    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;
    var gameRatio = innerWidth / innerHeight;
    function checkLanding(player, ground) {
    }
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    document.addEventListener("DOMContentLoaded", function (event) {
        game = new Phaser.Game(1280, 720, Phaser.CANVAS, { preload: preload });
        game.state.add("MainMenu", MainMenuState);
        game.state.add("Options", OptionsState);
        game.state.add("Play", Play.State);
        game.state.add("GameOver", GameOverState);
        game.state.start("MainMenu");
    });
})();
