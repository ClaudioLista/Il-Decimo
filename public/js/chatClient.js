window.addEventListener("load", () => {
    scratchPad.scrollTop = scratchPad.scrollHeight;

    isAuth = document.getElementById("isAuth").innerText;
    if (isAuth === "true") {
        socket = io();
        room = document.getElementById("roomId").innerText;
        user = document.getElementById("userChat").innerText;
        socket.emit('create or join', room);
    }

    window.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    const sendButton = document.getElementById("sendM")
    sendButton.addEventListener("click", () => {
        sendMessage();
    })

    function sendMessage() {
        let textarea = document.getElementById('chatMessage');
        let chatMessage = textarea.value; 
        if (chatMessage != "") {
            var currentdate = new Date();
            var getMinutes= currentdate.getMinutes();
            var getMonth = currentdate.getMonth();
            var getDay = currentdate.getDate();
            if(currentdate.getMinutes() < 10) {
                var getMinutes = '0' + currentdate.getMinutes()
            }
            if(currentdate.getMonth() + 1 < 10) {
                var getMonth = '0' + (currentdate.getMonth() + 1)
            }
            if(currentdate.getDate() < 10) {
                var getDay = '0' + currentdate.getDate()
            }
            var datetime = getDay+"/"+getMonth+ "/" + currentdate.getFullYear() + " - "+currentdate.getHours()+":"+getMinutes;
    
            let divMessageChat = document.createElement('div')
            divMessageChat.className = "messages-chat"
    
            let divMessage = document.createElement('div')
            divMessage.className = "message"
    
            let pText = document.createElement('p')
            let pElementText = document.createTextNode(chatMessage)
            pText.appendChild(pElementText)
            pText.className = "text"
    
            let pTime = document.createElement('p')
            let pElementTime = document.createTextNode(datetime)
            pTime.appendChild(pElementTime)
            pTime.className = "time"
    
            divMessage.appendChild(pText)
            divMessageChat.appendChild(divMessage)
            divMessageChat.appendChild(pTime)
    
            let parent = document.querySelector('#scratchPad')
            parent.appendChild(divMessageChat)
    
            scratchPad.scrollTop = scratchPad.scrollHeight;
            
            socket.emit('message', {
                room: room,
                message: chatMessage,
                name: user,
                date: datetime
            });
            textarea.value = ''
        }
    }
    
    //Handle 'message' message
    socket.on('message', (message) => {
        let divMessageChat = document.createElement('div')
        divMessageChat.className = "messages-chat"
    
        let divMessage = document.createElement('div')
        divMessage.className = "receive-message"
    
        let pText = document.createElement('p')
        let pElementText = document.createTextNode(message.message)
        pText.appendChild(pElementText)
        pText.className = "receive-text"
    
        let pTime = document.createElement('p')
        let pElementTime = document.createTextNode(message.date + " ")
        let sName = document.createElement('strong')
        let pElementName = document.createTextNode(message.name)
        sName.appendChild(pElementName)
        pTime.appendChild(pElementTime)
        pTime.appendChild(sName)
        pTime.className = "receive-time"
    
        divMessage.appendChild(pText)
        divMessageChat.appendChild(divMessage)
        divMessageChat.appendChild(pTime)
    
        let parent = document.querySelector('#scratchPad')
        parent.appendChild(divMessageChat)
    
        scratchPad.scrollTop = scratchPad.scrollHeight;
    });    

});