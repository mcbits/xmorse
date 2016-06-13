var GameOverState = (function () {
    function GameOverState(game) {
    }
    GameOverState.prototype.preload = function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    GameOverState.prototype.create = function () {
        var titleText = game.add.text(game.world.centerX, 50, "Game Over", Menu.titleStyle);
        titleText.anchor.setTo(0.5);
        var menuGroup = game.add.group();
        menuGroup.position.setTo(game.world.centerX, game.world.centerY);
        var restartText = game.add.text(0, -Menu.spacing, "Play again", Menu.textStyle);
        restartText.anchor.set(0.5);
        restartText.inputEnabled = true;
        restartText.events.onInputUp.add(Menu.playClicked);
        menuGroup.add(restartText);
        var mainMenuText = game.add.text(0, Menu.spacing, "Main menu", Menu.textStyle);
        mainMenuText.anchor.set(0.5);
        mainMenuText.inputEnabled = true;
        mainMenuText.events.onInputUp.add(Menu.mainMenuClicked);
        menuGroup.add(mainMenuText);
    };
    GameOverState.prototype.update = function () {
    };
    GameOverState.prototype.render = function () {
    };
    GameOverState.prototype.shutdown = function () {
    };
    return GameOverState;
}());
