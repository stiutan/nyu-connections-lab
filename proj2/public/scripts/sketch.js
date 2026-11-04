let customFont;

function preload() {
  // Path is relative to index.html
  customFont = loadFont("assets/VCR_OSD_MONO_1.001.ttf");
}

function setup() {
  textFont(customFont);

  setupCanvas();
  setupMyUser();
  setupAudio();
  setupSocket();
  setupInteractiveObjects();
}

function setupCanvas() {
  const { width, height } = getMapBounds();
  const canvas = createCanvas(width, height);

  canvas.parent(document.querySelector(".map-container"));
}

function setupMyUser() {
  myUser.name = prompt("Please enter your name:", "").trim() || "anonymous";
  myUser.color = getRandomColor();
  myUser.position = getSpawnPosition();
}

function setupAudio() {
  // mute whenever user leaves window
  window.addEventListener("blur", releaseAudioButton);
}

function setupSocket() {
  socket = io();
  displayChatLog();

  socket.on("connect", () => {
    console.log("Connected to Socket");
    socket.emit("user-update", myUser);
    logMyArrival();
  });

  socket.on("users", (allUsers) => {
    users = allUsers;
  });

  socket.on("user-data", (user) => {
    users[user.id] = user;
  });

  socket.on("user-disconnected", ({ id, user }) => {
    if (user) logUserDeparture(user);
    delete users[id];
  });
}

function draw() {
  clear();

  updatePosition();
  updateAudioVolumes();
  updateUserIcons();
  updateInteractiveObjects();
}

function keyPressed(event) {
  if (event.code === "Space") {
    // holding the setup press must never unmute
    if (event.repeat) return false;

    pressAudioButton();
    return false; // cancel keyboard behavior
  }
}

function keyReleased(event) {
  if (event.code === "Space") {
    releaseAudioButton();
    return false; // cancel keyboard behavior
  }
}

function windowResized() {
  const { width, height } = getMapBounds();
  resizeCanvas(width, height);
}
