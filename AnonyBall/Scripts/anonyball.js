$(function () {
    var Mode = {
        WAITING: 0, //Waiting for a reply
        SEND: 1, //User to send message
        REPLY: 2, //User to type reply
        CONFIRM: 3, //User to continue or not continue
        INIT: 4
    };
    var Events = {
        NOW_INITIALIZING: "NOW_INITIALIZING",
        NOW_WAITING: "NOW_WAITING",
        NOW_SENDING: "NOW_SENDING",
        NOW_REPLYING: "NOW_REPLYING",
        NOW_CONFIRMING: "NOW_CONFIRMING"
    };
    var TIMEOUT = 22000;
    var currentMode = Mode.SEND;
    var $listeners = $(".listener");
    var setMode = function (mode, data) {
        currentMode = mode;
        switch (mode) {
            case Mode.SEND:
                $listeners.trigger(Events.NOW_SENDING);
                break;
            case Mode.WAITING:
                $listeners.trigger(Events.NOW_WAITING);
                break;
            case Mode.REPLY:
                $listeners.trigger(Events.NOW_REPLYING, [data]);
                break;
            case Mode.CONFIRM:
                $listeners.trigger(Events.NOW_CONFIRMING, [data]);
                break;
            case Mode.INIT:
                $listeners.trigger(Events.NOW_INITIALIZING);
                break;
        }
    };
    var anonyBall = $.connection.anonyBall;
    var $anonyBall = $("#anonyBall") //input and output
    var $numUsers = $("#numUsers");
    $.extend($anonyBall, {
        addInput: function (message) {
            var $this = this;
            var $myForm = $("<form id=\"myMessage\"><input id=\"myMessageInput\" type=\"text\"></input></form>")
                .css("opacity", 0);
            $myForm.appendTo($this).fadeTo(1500, 1);
            var $myInput = $this.find("#myMessageInput");
            var instructions = "";
            if(currentMode === Mode.SEND){
                instructions = "Type anything";
            }
            else if(currentMode === Mode.REPLY){
                instructions = "Type your reply"
            }
            $myInput
                .blur(function () {
                    $(this)
                        .val(instructions)
                        .removeClass("focused")
                        .addClass("blurred");
                })
                .focus(function () {
                    $(this)
                        .val("")
                        .removeClass("blurred")
                        .addClass("focused");
                })
                .blur();
            $myForm.submit(function (e) {
                e.preventDefault();
                var text = $myInput.val();
                if (currentMode === Mode.SEND) {
                    anonyBall.server.addMessage(text);
                    setMode(Mode.WAITING);
                }
                else if (currentMode === Mode.REPLY) {
                    anonyBall.server.reply(message, text);
                    setMode(Mode.SEND);
                }
            });
            return $this;
        },
        addReply: function (text, messageId) {
            if (currentMode === Mode.WAITING) {
                this.find("#reply")
                    .css("opacity", 0)
                    .fadeTo(1500, 1)
                    .text(text);
                setMode(Mode.CONFIRM, true);
            }
        }

    });
    $anonyBall
        .bind(Events.NOW_REPLYING, function (e, message) {
            $anonyBall
                .fadeTo(1500, 0, function () {
                    $anonyBall
                        .empty()
                        .css("opacity", 1)
                        .addInput(message);
                })
        })
        .bind(Events.NOW_SENDING, function () {
            console.log(this);
            $anonyBall
                .fadeTo(1500, 0, function () {
                    $anonyBall
                        .empty()
                        .css("opacity", 1)
                        .addInput();
                })
        })
        .bind(Events.NOW_WAITING, function () {
            $anonyBall
                .append("<div id=\"reply\">Waiting...</div>")
                    .find("#myMessageInput")
                    .off("blur")
                    .off("focus")
                    .prop("disabled", true);
            setTimeout(function () {
                setMode(Mode.CONFIRM, false);
            }, TIMEOUT);
        })
        .bind(Events.NOW_CONFIRMING, function (e, success) {
            if (!success) {
                $(this).find("#reply").text("No response!");
            }
        });
    var $info = $("#info") //information
        .bind(Events.NOW_REPLYING, function (e, message) {
            $(this)
                .css("opacity", 0)
                .html("Reply to the following message: <br />")
                .append($("<div class=\"message\"></div>").text(message.Text))
                .fadeTo(1500, 1);
        })
        .bind(Events.NOW_SENDING, function () {
            $(this).fadeTo(1500, 0);
        })
        .bind(Events.NOW_WAITING, function () {
            $(this).fadeTo(1500, 0);
        })
        .bind(Events.NOW_CONFIRMING, function(){
            $(this)
                .css("opacity", 0)
                .html("Try again?<br/>" +
                    "<a href class=\"try message\">Yes</a>")
                .fadeTo(1500, 1);
            $(".try").click(function (e) {
                e.preventDefault();
                setMode(Mode.INIT);
            });
        })
         .bind(Events.NOW_INITIALIZING, function () {
             anonyBall.server.getMessage()
                     .done(function (result) {
                         if (result) {
                             setMode(Mode.REPLY, result);
                         }
                         else {
                             setMode(Mode.SEND);
                         }
                     });
         });
    var $busyAnim = $("#busyAnim")
        .bind(Events.NOW_WAITING, function () {
            $(this).css("visibility", "visible");
        })
        .bind(Events.NOW_CONFIRMING, function () {
            $(this).css("visibility", "hidden");
        })
        .bind(Events.NOW_INITIALIZING, function () {
            $(this).css("visibility", "hidden");
        })
        .bind(Events.NOW_SENDING, function () {
            $(this).css("visibility", "hidden");
        })
        .bind(Events.NOW_REPLYING, function () {
            $(this).css("visibility", "hidden");
        });
    anonyBall.client.addReply = function (text, messageId) {
        $anonyBall.addReply(text, messageId);
    };
    anonyBall.client.populateNumUsers = function (numUsers) {
        $numUsers.text("Online Users: " + numUsers);
    }
    $.connection.hub.start()
        .done(function(){
            setMode(Mode.INIT);
        });
});