let socket;
let users = {};
let myData = {
  name: "",
  color: {},
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  myData.name = prompt("Please enter your name:", "Anonymous") || "Anonymous";
  myData.color = {
    r: random(255),
    g: random(255),
    b: random(255),
  };

  socket = io();

  socket.on("connect", () => {
    console.log("Connected to Socket");

    // uncomment if you want an initial loading location for users
    // socket.emit("user-update", { ...myData, x: mouseX, y: mouseY });
  });

  socket.on("users", (allUsers) => {
    users = allUsers;
  });

  socket.on("user-data", (data) => {
    users[data.id] = data;
  });

  socket.on("user-disconnected", (id) => {
    delete users[id];
  });
}

function draw() {
  background(255);
  for (let user of Object.values(users)) {
    drawUser(user);
  }
}

function mouseMoved() {
  if (socket && socket.connected) {
    socket.emit("user-update", { ...myData, x: mouseX, y: mouseY });
  }
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
  textAlign(CENTER, BOTTOM);
  text(user.name, user.x, user.y - 10);

  pop();
}
