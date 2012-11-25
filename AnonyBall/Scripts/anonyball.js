$(function () {
    var Mode = {
        WAITING: 0,
        SEND: 1,
        REPLY: 2
    };
    var anonyBall = $.connection.anonyBall;
    anonyBall.client.addReply = function (text, messageId) {
        if ($anonyBall.mode === Mode.WAITING) {
            $anonyBall.find("#reply").text(text);
        }
    };
    var $anonyBall = $("#anonyBall");
    $.extend($anonyBall, {
        mode: Mode.SEND,
        addInput: function (message) {
            var $this = this;
            var html = "<form id=\"myMessage\"><input id=\"myMessageInput\" type=\"text\"></input></form>";
            $this.append($(html));
            var $myMessage = $this.find("#myMessage");
            var $myInput = $this.find("#myMessageInput");
            $myMessage.submit(function (e) {
                e.preventDefault();
                var text = $myInput.val();
                if ($this.mode === Mode.SEND) {
                    anonyBall.server.addMessage(text);
                    $this.setMode(Mode.WAITING);
                }
                else if ($this.mode === Mode.REPLY) {
                    anonyBall.server.reply(message, text);
                    $this.setMode(Mode.REPLY);
                }
            });
            return $this;
        },
        setMode: function (code, message) {
            this.mode = code;
            switch (code) {
                case Mode.SEND:
                    this.empty()
                        .addInput();
                    break;
                case Mode.WAITING:
                    this.append($("<div id=\"reply\">waiting...</div>"));
                    break;
                case Mode.REPLY:
                    this.append($("<div></div>").text(message.Text))
                        .addInput(message);
                    break;
            }
        }
    });
    $.connection.hub.start()
        .done(function(){
            anonyBall.server.getMessage()
                .done(function (result) {
                    if (result) {
                        $anonyBall.setMode(Mode.REPLY, result);
                    }
                    else {
                        $anonyBall.setMode(Mode.SEND);
                    }
                });
        });
});