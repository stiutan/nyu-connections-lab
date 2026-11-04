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
  // avoid ugly colors lol (too vivid, too light)
  colorMode(HSL, 360, 100, 100);
  let randomColor = color(random(360), random(35, 65), random(30, 50));

  myUser.name = prompt("Please enter your name:", "anonymous") || "anonymous";
  myUser.color = {
    r: red(randomColor),
    g: green(randomColor),
    b: blue(randomColor),
  };
  myUser.position = {
    x: random(mapSpawnArea.left, mapSpawnArea.right) * getMapWidth(),
    y: random(mapSpawnArea.top, mapSpawnArea.bottom) * getMapHeight(),
  };

  // reset back to rgb for drawing
  colorMode(RGB, 255);
}

function setupAudio() {
  // Mute whenever the user leaves the window.
  window.addEventListener("blur", mute);
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
  if (key === " ") {
    // holding the setup press must never unmute
    if (event?.repeat) return false;

    if (!audioEnabling) {
      if (isAudioEnabled) {
        unmute();
      } else {
        enableAudio();
      }
    }
    return false; // cancel keyboard behavior
  }
}

function keyReleased() {
  if (key === " ") {
    mute();
    return false; // cancel keyboard behavior
  }
}

function windowResized() {
  const { width, height } = getMapBounds();
  resizeCanvas(width, height);
}
