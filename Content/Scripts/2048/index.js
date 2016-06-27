(function () {
    "use strict";

    /// <reference path="../typings/ue.d.ts" />
    module.exports = function () {


        function getPlayerController() {
            return GWorld.GetAllActorsOfClass(PlayerController).OutActors[0]
        }

        let playerController = getPlayerController()

        // Widget을 만들자
        var widget = WidgetBlueprintLibrary.CreateWidget(GWorld, JavascriptWidget, playerController)
        widget.proxy = {}
        widget.JavascriptContext = Context
        widget.bSupportsKeyboardFocus = true

        // Setup location / rotation
        playerController.GetControlledPawn().SetActorLocation({X:854,Z:300})
        playerController.SetInitialLocationAndRotation({},{Yaw:170,Pitch:0,Roll:0})

        var data = {
            Block : StaticMesh.Load('/Engine/BasicShapes/Cube.Cube'),
            Spacing : 120,
            Size: 4
        }

        var update = null

        var page = new VerticalBox();
        page.Visibility = 'Visible'

        widget.SetRootWidget(page)
        widget.AddToViewport()

        // UIOnly mode로 설정
        playerController.bShowMouseCursor = true
        WidgetBlueprintLibrary.SetInputMode_UIOnly(playerController,page)

        // Game 설정
        var game = null

        function start_game() {
            if (game != null) {
                game()
            }
            try {
                game = require('./game/application')(widget, page, data)
            }
            catch (e) {
                console.error("EXCEPTION",String(e),e.stack)
            }
        }

        start_game()

        update = start_game

        return function () {
            // for live reload
            game()
            widget.RemoveFromViewport()
            // live_jade()
        }
    }
})()
