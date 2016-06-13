var OptionsState = (function () {
    function OptionsState(game) {
    }
    OptionsState.prototype.preload = function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    OptionsState.prototype.create = function () {
        var titleText = game.add.text(game.world.centerX, 50, "Options", Menu.titleStyle);
        titleText.anchor.setTo(0.5);
        var menuGroup = game.add.group();
        menuGroup.position.setTo(game.world.centerX, game.world.centerY);
        var mainMenuText = game.add.text(0, Menu.spacing, "Main menu", Menu.textStyle);
        mainMenuText.anchor.set(0.5);
        mainMenuText.inputEnabled = true;
        mainMenuText.events.onInputUp.add(Menu.mainMenuClicked);
        menuGroup.add(mainMenuText);
    };
    OptionsState.prototype.update = function () {
    };
    OptionsState.prototype.render = function () {
    };
    OptionsState.prototype.shutdown = function () {
    };
    return OptionsState;
}());
