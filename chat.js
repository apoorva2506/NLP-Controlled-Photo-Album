
(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.images').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage, load;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        getImageFile = function () {
            var $upload_input;
            $upload_input = $('.upload_input');
            return $upload_input.val();
        };
        encodeImageFileAsURL = function (element) {
          var file = element.files[0];
          var reader = new FileReader();
          reader.onloadend = function() {
            // console.log('RESULT', reader.result);
            return reader.result;
          }
          reader.readAsDataURL(file);
        }
         sendMessage = function (text) {
            var $messages, message;
            // if (text.trim() === '') {
            //     return;
            // }
            $('.message_input').val('');
            $messages = $('.images');
            message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 700);
        };

        speechRecog = function () {
            window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
          const synth = window.speechSynthesis;
          const recognition = new SpeechRecognition();
          const icon = document.querySelector('i.fa.fa-microphone')
          // let paragraph = document.createElement('search');
          icon.addEventListener('click', () => {
          // sound.play();
          dictate();
          });
          const dictate = () => {
          recognition.start();
          recognition.onresult = (event) => {
          const speechToText = event.results[0][0].transcript;
      }

        loadImage = function (text) {
            sendMessage(text);

            var apigClient = apigClientFactory.newClient({
                invokeUrl: config.invokeUrl, // REQUIRED
                apiKey: config.apiKey,// REQUIRED
                  accessKey: config.accessKey,
                  secretKey: config.secretKey,
                region: config.region // REQUIRED
              });

              var params = {
                "q" : text
              };
              console.log(params);

            var additionalParams={};
            var body={};

            console.log(body);

            apigClient.searchGet(params, body, additionalParams)
                .then(function(result){

                  console.log(result.data)
                  var2 = result.data;
                  sendMessage(var2);

                }).catch( function(result){
                  // Add error callback code here.
                  console.log("error");
                });

        };

        uploadImage = function (text) {
            sendMessage(text);
            var file = document.getElementById('file').files[0];
            var filename = file.name;
            var type = file.type
            var params = {
              'filename' : filename,
              'Content-Type' :type
            }
            var additionalParams = {
                headers: {
                "Content-Type": "text/plain",
               }
            }
            console.log(type);
           
            console.log(filename)

            var apigClient = apigClientFactory.newClient();
            console.log(file);
            // var body = file.replace(/^data:image\/[a-z]+;base64,/, "");


            // var reader = new FileReader();
            // reader.onloadend = function() {
            //     body = reader.result;
            //   }
            // reader.readAsDataURL(file);
            var body = encodeImageFileAsURL(document.getElementById('file'));
            console.log(body);

            apigClient.uploadPut(params, body, additionalParams)
                .then(function(result){

                  console.log("Success!")
                

                }).catch( function(result){
                  // Add error callback code here.
                  console.log("error");
                });
        };

        $('.search_image').click(function (e) {
            return loadImage(getMessageText());
        });
        $('.microphone').click(function (e) {
            return speechRecog();
        });
        $('.upload_image').click(function (e) {
            return uploadImage(getImageFile());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return loadImage(getMessageText());
            }
        });
        // sendMessage('Hi there! How can I help you today? :)');
    });
}.call(this));
