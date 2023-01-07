//Variable div associated with placeholder element scrachtPad in HTML5 page
const scratchPad = document.getElementById('scratchPad');

// Connect to server

function sendMessage() {
    let textarea = document.getElementById('chatMessage');
	let chatMessage = textarea.value;
	console.log(`You sent a message: ${chatMessage}`);
	
	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
	scratchPad.insertAdjacentHTML( 'beforeEnd', `<p>Time: ${(performance.now() / 1000).toFixed(3)} --> You sent a message: </p>`);
	scratchPad.insertAdjacentHTML( 'beforeEnd', `<p style="color:green"> ${chatMessage} </p>`);	 

	if(chatMessage == "Bye"){
		scratchPad.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' + (performance.now() / 1000).toFixed(3) + ' --> Sending "Bye" to server...</p>');
		console.log('Sending "Bye" to server');

		socket.emit('Bye', room);

		// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
		scratchPad.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' + (performance.now() / 1000).toFixed(3) + ' --> Going to disconnect...</p>');
		console.log('Going to disconnect...');

		// Disconnect from server
		// not necessary, the server will disconnect the client
		// socket.disconnect();
	} else {
		socket.emit('message', {
			room: room,
			message: chatMessage
		});
	}
    textarea.value = ''
}

//Handle 'created' message
socket.on('created', (room) => {	 
	console.log(`room ${room} has been created!`);
	console.log('This peer is the initiator...');

	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
	scratchPad.insertAdjacentHTML( 'beforeEnd', `<p>Time: ${(performance.now() / 1000).toFixed(3)} --> room ${room} has been created! </p>`);
    scratchPad.insertAdjacentHTML( 'beforeEnd', `<p>Time: ${(performance.now() / 1000).toFixed(3)} --> This peer is the initiator... </p>`);
});

//Handle 'full' message
socket.on('full', (room) => {
	console.log(`room ${room} is too crowded!`);

	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
    scratchPad.insertAdjacentHTML( 'beforeEnd', `<p>Time: ${(performance.now() / 1000).toFixed(3)} --> room ${room} is too crowded! </p>`);
});

//Handle 'remotePeerJoining' message
socket.on('remotePeerJoining', (room) => {
	console.log(`Request to join ${room}`);
	console.log('You are the initiator!');

	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
    scratchPad.insertAdjacentHTML( 'beforeEnd', `<p style="color:red">Time: ${(performance.now() / 1000).toFixed(3)} --> Message from server: request to join room ${room}</p>`);
});

//Handle 'broadcast: joined' message
socket.on('broadcast: joined', (msg) => {

	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
    scratchPad.insertAdjacentHTML( 'beforeEnd', `<p style="color:red">Time: ${(performance.now() / 1000).toFixed(3)} --> Broadcast message from server: ${msg}</p>`);

	console.log(`Broadcast message from server: ${msg}`);	  
});

//Handle 'joined' message
socket.on('joined', (msg) => {
	console.log(`You joined ${room}`);
	console.log('You are the joiner!');

	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
    scratchPad.insertAdjacentHTML( 'beforeEnd', `<p style="color:red">Time: ${(performance.now() / 1000).toFixed(3)} --> Message from server: you joined the room ${room}</p>`); 
});

//Handle 'message' message
socket.on('message', (message) => {
	console.log(`Got message from other peer: ${message}`);
	
	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
	scratchPad.insertAdjacentHTML( 'beforeEnd', `<p>Time: ${(performance.now() / 1000).toFixed(3)} --> Got message from other peer: </p>`);
    scratchPad.insertAdjacentHTML( 'beforeEnd', `<p style="color:blue"> ${message} </p>`);	  
});

//Handle 'Bye' message
socket.on('Bye', () => {
	console.log(`Got message from other peer: Bye`);
	
	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
	scratchPad.insertAdjacentHTML( 'beforeEnd', `<p>Time: ${(performance.now() / 1000).toFixed(3)} --> Got message from other peer: </p>`);
    scratchPad.insertAdjacentHTML( 'beforeEnd', `<p style="color:blue"> Bye </p>`);	 

	console.log('Got "Bye" from other peer! Going to disconnect...');

	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
	scratchPad.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' + (performance.now() / 1000).toFixed(3) + ' --> Got "Bye" from other peer!</p>');
	scratchPad.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' + (performance.now() / 1000).toFixed(3) + ' --> Sending "Ack" to server</p>');

	// Send 'Ack' back to remote party through server
	console.log('Sending "Ack" to server');

	socket.emit('Ack');

	console.log('Going to disconnect...');

	// Info, concerned messages exchange, are dynamically inserted in the HTML5 page
	scratchPad.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' + (performance.now() / 1000).toFixed(3) + ' --> Going to disconnect...</p>');
	
	// Disconnect from server
	// not necessary, the server will disconnect the client
	// socket.disconnect();
});