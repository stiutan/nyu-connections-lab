const sendChatLog = (message) => {
  if (socket && socket.connected) {
    socket.emit("user-log", {
      message,
      name: myUser.name,
      color: myUser.color,
    });
  }
};

const displayChatLog = () => {
  socket.on("user-log", addToChatLog);
};

const addToChatLog = (entry) => {
  let log = document.querySelector(".chat-log");

  let message = document.createElement("p");
  message.textContent = entry.message;

  let { r, g, b } = entry.color;
  message.style.color = `rgb(${r}, ${g}, ${b})`;

  log.appendChild(message);

};

const logMyArrival = () => {
  sendChatLog(`👋🏼 ${myUser.name} entered the floor!`);
};

const logPoke = () => {
  sendChatLog(`🫵🏼 ${myUser.name} just poked your face.`);
};

const logUserDeparture = (user) => {
  // Each remaining client displays this once; don't relay it again.
  addToChatLog({
    message: `👎🏼 ${user.name} went home.`,
    color: user.color,
  });
};
