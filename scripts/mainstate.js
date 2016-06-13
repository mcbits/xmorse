var MainMenuState = (function () {
    function MainMenuState(game) {
    }
    MainMenuState.prototype.preload = function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    MainMenuState.prototype.create = function () {
        var titleText = game.add.text(game.world.centerX, 50, "X Morse", Menu.titleStyle);
        titleText.anchor.setTo(0.5);
        var menuGroup = game.add.group();
        menuGroup.position.setTo(game.world.centerX, game.world.centerY);
        var playText = game.add.text(0, -Menu.spacing, "Play", Menu.textStyle);
        playText.anchor.set(0.5);
        playText.inputEnabled = true;
        playText.events.onInputUp.add(Menu.playClicked);
        menuGroup.add(playText);
        var optionsText = game.add.text(0, Menu.spacing, "Options", Menu.textStyle);
        optionsText.anchor.set(0.5);
        optionsText.inputEnabled = true;
        optionsText.events.onInputUp.add(Menu.optionsClicked);
        menuGroup.add(optionsText);
    };
    MainMenuState.prototype.update = function () {
    };
    MainMenuState.prototype.render = function () {
    };
    MainMenuState.prototype.shutdown = function () {
    };
    return MainMenuState;
}());
