const sendChatLog = (message) => {
  if (socket && socket.connected) {
    socket.emit("user-log", {
      message,
      name: myData.name,
      color: myData.color,
    });
  }
};

const displayChatLog = () => {
  socket.on("user-log", addToChatLog);
};

const addToChatLog = (entry) => {
  let log = document.getElementById("chat-log");

  let message = document.createElement("p");
  message.textContent = entry.message;

  let { r, g, b } = entry.color;
  message.style.color = `rgb(${r}, ${g}, ${b})`;

  log.appendChild(message);

  // if (log.children.length > 100) log.firstElementChild.remove();
  log.scrollTop = log.scrollHeight;
};

const logMyArrival = () => {
  sendChatLog(`👋🏼 ${myData.name} entered the floor!`);
};

const logPoke = () => {
  sendChatLog(`🫵🏼 ${myData.name} just poked your face.`);
};

const logUserDeparture = (user) => {
  // Each remaining client displays this once; don't relay it again.
  addToChatLog({
    message: `👎🏼 ${user.name} went home.`,
    color: user.color,
  });
};
