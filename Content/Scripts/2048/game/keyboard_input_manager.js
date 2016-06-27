module.exports = function (widget, vbox) {
  "use strict";

  var instantiate = require('instantiator')
  var UMG = require('UMG')

  function test() {
    var design =
      // {
      //     type : HorizontalBox,
      //     children : [
      //       {
      //         slot : {
      //           Padding : {Left:8, Right:8, Top:8, Bottom:8}
      //         },
      //         type : TextBlock,
      //         attrs : {
      //           Text : '2048',
      //           Font : {
      //             FontObject : GEngine.SmallFont,
      //             Size : 90
      //           }
      //         }
      //       },
      //       {
      //           type: Button,
      //           slot: { Size: { SizeRule: 'Fill' } },
      //           children:[

      //           ]
      //       }
      //     ]
      // }

//how to show those buttons?
      UMG(CanvasPanel, {},
        UMG(HorizontalBox,{},
            UMG(Button, { id: 'button' },
              UMG.text({}, 'Reset')
            ),
            UMG(Button, { id: 'button1' },
              UMG.text({}, 'Reset1')
            ),
            UMG(Button, { id: 'button2' },
              UMG.text({}, 'Reset2')
            ),
            UMG(Button, { id: 'button3' },
              UMG.text({}, 'Reset3')
            ),
            UMG(Button, { id: 'button4' },
              UMG.text({}, 'Reset4')
            )
        )

      )


    var widget = instantiate(design)
    vbox.AddChild(widget)
    return widget
  }

  var layout = test()
  var reset_button = Button(layout.find('button'))

  function KeyboardInputManager() {
    this.events = {};

    this.listen();
  }

  KeyboardInputManager.prototype.destroy = function () {
    reset_button.RemoveFromParent()
  }

  KeyboardInputManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  };

  KeyboardInputManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(function (callback) {
        callback(data);
      });
    }
  };

  KeyboardInputManager.prototype.listen = function () {
    var map = {
      'W': () => this.emit("move", 2),
      'A': () => this.emit("move", 1),
      'S': () => this.emit("move", 0),
      'D': () => this.emit("move", 3),
      'Up': () => this.emit("move", 2),
      'Left': () => this.emit("move", 1),
      'Down': () => this.emit("move", 0),
      'Right': () => this.emit("move", 3)
    }
    console.log('what wrong?')
    widget.proxy.OnKeyDown = (geom, keyevent) => {

      console.log('OnKeyDown', geom, keyevent)

      var key = KismetInputLibrary.prototype.GetKey(keyevent).KeyName
      console.log(key);
      var op = map[key]
      if (op != undefined) {
        op()
        return EventReply.Handled()
      }
      else {
        return EventReply.Unhandled()
      }
    }

    reset_button.OnClicked = () => this.restart();
  };

  KeyboardInputManager.prototype.restart = function (event) {
    // event.preventDefault();
    this.emit("restart");
  };

  KeyboardInputManager.prototype.keepPlaying = function (event) {
    // event.preventDefault();
    this.emit("keepPlaying");
  };

  KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
    // var button = document.querySelector(selector);
    // button.addEventListener("click", fn.bind(this));
    // button.addEventListener(this.eventTouchend, fn.bind(this));
  };

  return KeyboardInputManager
}
