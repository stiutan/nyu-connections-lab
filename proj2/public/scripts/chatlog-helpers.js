/**
 * helpers to handle logs in chatlog
 */

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
  message.addEventListener("animationend", () => message.remove());
};

const logMyArrival = () => {
  sendChatLog(`👋🏼 ${myUser.name} just got off the elevator!`);
};

const logPoke = () => {
 // 10% chance (0.1) for the rare message
  if (Math.random() < 0.20) {
    sendChatLog(`💥 ${myUser.name} pooped myself :(`);
  } else {
    // 90% chance for the standard message
    sendChatLog(`🫵🏼 ${myUser.name} just poked your face.`);
  }
};

const logUserDeparture = (user) => {
  // Each remaining client displays this once; don't relay it again.
  addToChatLog({
    message: `👎🏼 ${user.name} went home.`,
    color: user.color,
  });
};
