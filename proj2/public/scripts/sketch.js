function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Inter");

  setupMyUser();
  setupAudio();
  setupSocket();
}

function setupMyUser() {
  // avoid ugly colors lol (too vivid, too light)
  colorMode(HSL, 360, 100, 100);
  let randomColor = color(random(360), random(35, 65), random(30, 50));

  myUser.name = prompt("Please enter your name:", "Anonymous") || "Anonymous";
  myUser.color = {
    r: red(randomColor),
    g: green(randomColor),
    b: blue(randomColor),
  };

  // reset back to rgb for drawing
  colorMode(RGB, 255);
}

const setupAudio = () => {
  // handle audio set up button
  let button = document.querySelector("button.audio-instruction");
  button.addEventListener("click", async () => {
    // disable audio while connecting
    button.disabled = true;

    let enabled = await enableAudio();
    if (enabled) {
      // replace audio enablement button with instruction text
      let ptext = document.createElement("p");
      ptext.className = "audio-instruction";
      ptext.textContent = "hold down space to speak";

      button.replaceWith(ptext);
    } else {
      // if connection failed, re-enable button
      button.disabled = false;
    }
  });

  // mute whenever user leaves window
  window.addEventListener("blur", mute);
};

function setupSocket() {
  socket = io();
  displayChatLog();

  socket.on("connect", () => {
    console.log("Connected to Socket");
    logMyArrival();

    // uncomment if you want an initial loading location for users / using WASD
    // socket.emit("user-update", { ...myUser, x: mouseX, y: mouseY });
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
  background(255);

  let nextPosition = calcNextPosition(myUser.position);
  if (nextPosition) moveUser(nextPosition);

  for (let user of Object.values(users)) {
    drawUser(getUserDrawData(user));
  }
}

function mouseMoved() {
  // mainly used for first initial position, draw handles other movement
  if (myUser.position === null) {
    moveUser({ x: mouseX, y: mouseY });
  }
}

function mousePressed(event) {
  if (event?.target.closest("button")) return;
  logPoke();
}

function keyPressed() {
  if (key === " ") {
    unmute();
    return false; // cancel keyboard behavior
  }
}

function keyReleased() {
  if (key === " ") {
    mute();
    return false; // cancel keyboard behavior
  }
}

function drawUser(user) {
  let { r, g, b } = user.color;
  let { x, y } = user.position;
  let { size, name, nameOpacity } = user;

  push();

  // color
  noStroke();
  fill(r, g, b);

  // icon
  ellipse(x, y, size, size);

  // name
  fill(r, g, b, nameOpacity);
  textAlign(CENTER, BOTTOM);
  text(name, x, y - size);

  pop();
}
