const socket = io();

async function loadMsgs(){
    const allMsgs = await axios.get('/allmessages');
    console.log(allMsgs);

    for(let message of allMsgs.data){

        const timeStamp = timeDifference(new Date(), new Date(message.createdAt));

		if(currentUser !== message.user){
			$("#all-msg-container").prepend(
				`<div class="othermessage">
					<div>
						<span>${message.user}</span>
						<span>${timeStamp}</span>
					</div>
					<p>${message.content}</p>
				</div>`
			);
		}
		else{
			$("#all-msg-container").prepend(
				`<div class="mymessage">
					<div>
						<span>${message.user}</span>
						<span>${timeStamp}</span>
					</div>
					<p>${message.content}</p>
				</div>`
			);
		}
    }
}

loadMsgs();

$("#send-msg-btn").click(() => {
	const textMsg = $("#msg-text").val();

	socket.emit("send-msg", {
		user: currentUser,
		msg: textMsg,
	});

	$("#msg-text").val("");
});

socket.on("received-msg", (data) => {

    const timeStamp = timeDifference(new Date(), new Date(data.createdAt));

	$("#all-msg-container").prepend(
        `<div class="mymessage">
            <div>
				<span>${data.user}</span>
				<span>${timeStamp}</span>
            </div>
            <p>${data.msg}</p>
        </div>`
    );
});

function timeDifference(current, previous) {
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;

	var elapsed = current - previous;

	if (elapsed < msPerMinute) {
		if (elapsed / 1000 < 30) {
			return "Just now";
		}

		return Math.round(elapsed / 1000) + " seconds ago";
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + " minutes ago";
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + " hours ago";
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed / msPerDay) + " days ago";
	} else if (elapsed < msPerYear) {
		return Math.round(elapsed / msPerMonth) + " months ago";
	} else {
		return Math.round(elapsed / msPerYear) + " years ago";
	}
}
