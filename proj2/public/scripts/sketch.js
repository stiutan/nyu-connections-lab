function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Inter");

  setupMyData();
  setupSocket();
}

function setupMyData() {
  // avoid ugly colors lol (too vivid, too light)
  colorMode(HSL, 360, 100, 100);
  let randomColor = color(random(360), random(35, 65), random(30, 50));

  myData.name = prompt("Please enter your name:", "Anonymous") || "Anonymous";
  myData.color = {
    r: red(randomColor),
    g: green(randomColor),
    b: blue(randomColor),
  };

  // reset back to rgb for drawing
  colorMode(RGB, 255);
}

function setupSocket() {
  socket = io();
  displayChatLog();

  socket.on("connect", () => {
    console.log("Connected to Socket");
    logMyArrival();

    // uncomment if you want an initial loading location for users / using WASD
    // socket.emit("user-update", { ...myData, x: mouseX, y: mouseY });
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
  for (let user of Object.values(users)) {
    drawUser(getUserDrawData(user));
  }
}

function mouseMoved() {
  if (socket && socket.connected) {
    socket.emit("user-update", { ...myData, x: mouseX, y: mouseY });
  }
}

function mousePressed() {
  logPoke();
}

function drawUser(user) {
  let { r, g, b } = user.color;

  push();

  // color
  noStroke();
  fill(r, g, b);

  // icon
  ellipse(user.x, user.y, 10, 10);

  // name
  fill(r, g, b, user.opacity);
  textAlign(CENTER, BOTTOM);
  text(user.name, user.x, user.y - 10);

  pop();
}
