$(function attachevents() {
    $('#refresh').click(refreshChat);
    $('#submit').click(sendMessage);
    $('#messages').scrollTop($('#messages')[0].scrollHeight); //scroll to bottom of chat at the start

    //send message when enter is pressed
    $(document).on("keypress", function (e) {
        console.log('enter');
        if(e.which == 13){
            sendMessage();
        }
    });

    let userScrolling = false; //auto-scrolling to bottom of chat depends on this variable
    let url = 'https://messenger-a7c78.firebaseio.com/Messenger.json'; //database link
    setInterval(refreshChat, 500);

    function refreshChat(){

        $.ajax({url,
            method: 'GET',
            success: refresh
        });

        function refresh(messages) {
            $('#messages').text('');
            let keys = Object.keys(messages);
            for(let key of keys){
                let currentMessage = messages[key];
                let author = currentMessage.author;
                let content = currentMessage.content;

                //let text = $('#messages').text() + `${author}: ${content}\n`;
                let div = $('<div>');
                $(div).attr('class', 'message');
                $(div).append(`<span class="author">${author}:</span>`);
                $(div).append(`<div class="content"><span>${content}</span></div>`);
                $('#messages').append(div);

            }
        }

        //if user is scrolling stop auto-scroll to bottom of chat
        if($('#messages').scrollTop() + $('#messages').height() * 2 < $('#messages')[0].scrollHeight){
            userScrolling = true;
        }
        //else auto-scroll to bottom of chat
        if(!userScrolling) {
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        }
        //if user scrolls to bottom of chat enable auto-scroll again
        if($('#messages').scrollTop() + $('#messages').height() * 2 > $('#messages')[0].scrollHeight){
            userScrolling = false;


        }
    }

    function sendMessage() {
        //TODO: Add html escaping

        if($('#author').val() == '' || $('#content').val() == ''){
            return;
        }
        let author = $('#author').val();
        let content = $('#content').val();
        let timestamp = Date.now();

        let newMessage = JSON.stringify({ author: author,
            content: content,
            timestamp: timestamp
        });

        $.post({url,
            data: newMessage,
            success: clear,
            error: displayError});

        function clear(){
            $('#content').val('');
        }
        function displayError(){
            console.log('Error');
        }
        refreshChat();
    }
});