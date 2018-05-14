(function() {
	let dateObj = new Date();

	let chatMessageCounter = $('.chat-message-counter');
	let chatFeedback = $('.chat-feedback');
	let intent = '';
	let target = '';
	let chatContainer = $('.chat-history');
	let userMessageField = $('#message');
	let userMessage;
	let botReply = '';

	let messageTime = '';
	let replyTime = ''; 

	// Set first message time to when website was loaded
	$('.chat-time').text(dateObj.toLocaleTimeString());

	$('#live-chat header').on('click', function() {

		$('.chat').slideToggle(300, 'swing');
		$('.chat-message-counter').fadeToggle(300, 'swing');

	});

	// $('.chat-close').on('click', function(e) {

	// 	e.preventDefault();
	// 	$('#live-chat').fadeOut(300);

	// });

	$('#new-message-form').submit(function(e) {
		e.preventDefault();

		clearFeedback();
		let userMessage = $('#message').val();

		showUserMessage(userMessage);

		$.ajax({
			type: "GET",
			url: 'https://api.wit.ai/message',
			data: {
				'q': userMessage,
				'access_token': '4DPNGUZY3IRSHFRNDRDKHUAIYT2YYTCC' 
			},
			dataType: 'jsonp',
			success: function(data) {
				if (!$.isEmptyObject(data.entities)) {
					intent = data.entities.intent[0].value;
					target = data.entities.target[0].value;
				}

				if (intent) {
					$.ajax({
						type: "GET",
						url: "http://localhost/chat-box/script.php",
						data: {
							'intent': intent,
							'target': target
						},
						success: function(data) {
							if (data != '') {
								botReply = data;
								showBotReply(botReply);
							} else {
								let message = `I'm sorry, i don't understand the question`;
								showBotReply(message);
							}
						},
						error: function() {
							console.log('error');
							chatFeedback.css('color', 'red');
							chatFeedback.text('an error occured, message could not be sent');
						}					
					});
				} else {
					let message = `I'm sorry, i don't understand the question`;
					showBotReply(message);
				}
			},
			error: function() {
				console.log('error');
				chatFeedback.css('color', 'red');
				chatFeedback.text('an error occured, message could not be sent');
			}
		});
	});

	function clearFeedback() {
		// chatFeedback.css('color', 'red');		
		chatFeedback.text('');
	}

	function showBotReply(message) {
		replyTime = dateObj.toLocaleTimeString();							

		let chatMessageTemplateBot = `
			<div class="chat-message clearfix">

				<img src="images/avatar.png" alt="" width="32" height="32">

				<div class="chat-message-content clearfix">

					<span class="chat-time">${replyTime}</span>

						<h5>Bot</h5> 

					<p>${message}</p>

				</div>
			</div>
			<hr>
		`;	

		chatContainer.append(chatMessageTemplateBot);
		// Scroll chat to end
		scrollChatContainerBottom();
		// Increase chat message counter
		chatMessageCounter.text(parseInt(chatMessageCounter.text()) + 1);
	}

	function showUserMessage(message) {
		messageTime = dateObj.toLocaleTimeString();

		let chatMessageTemplateUser = `
			<div class="chat-message clearfix">

				<img src="images/avatar.png" alt="" width="32" height="32">

				<div class="chat-message-content clearfix">

					<span class="chat-time">${messageTime}</span>

						<h5>You</h5> 

					<p>${message}</p>

				</div>
			</div>
			<hr>
		`;
		
		chatContainer.append(chatMessageTemplateUser);
		// Scroll chat to end
		scrollChatContainerBottom();
		// Clear chat input field
		userMessageField.val('');
		// Increase chat message counter
		chatMessageCounter.text(parseInt(chatMessageCounter.text()) + 1);
	}

	function scrollChatContainerTop() {
		chatContainer.scrollTop(0);
	}

	function scrollChatContainerBottom() {
		chatContainer.scrollTop(parseInt(chatContainer.prop('scrollHeight')));		
	}

}) ();