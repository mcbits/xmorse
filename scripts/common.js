var game;
var Menu;
(function (Menu) {
    Menu.textStyle = {
        font: "65px Arial",
        fill: "#ffffff",
        align: "center"
    };
    Menu.titleStyle = {
        font: "80px Arial",
        fill: "#444477",
        align: "center"
    };
    Menu.spacing = 45;
    function playClicked() {
        game.state.start("Play");
    }
    Menu.playClicked = playClicked;
    function optionsClicked() {
        game.state.start("Options");
    }
    Menu.optionsClicked = optionsClicked;
    function mainMenuClicked() {
        game.state.start("MainMenu");
    }
    Menu.mainMenuClicked = mainMenuClicked;
})(Menu || (Menu = {}));
var Speed = (function () {
    function SpeedObject() {
        var base = 50;
        Object.defineProperty(this, "dit", {
            get: function () { return base * 1; },
            set: function (value) { return base = value; }
        });
        Object.defineProperty(this, "dah", {
            get: function () { return base * 4; },
            set: function (value) { return base = value / 4; }
        });
    }
    return new SpeedObject();
})();
