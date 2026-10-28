console.log("Hello!");

//Initialize and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on("connect", () => {
  console.log("Connected");
});

//Listen for an event named 'message-share' from the server
socket.on("message-share", (data) => {
  console.log(data);
  drawEllipse(data);
});

//In global scope
let myRed, myGreen, myBlue;
let myDiameter;

/* P5 LOGIC */
function setup() {
  createCanvas(windowWidth, windowHeight);

  //Generate random fill values (will happen once per connection)
  myRed = random(0, 255);
  myGreen = random(0, 255);
  myBlue = random(0, 255);

  //Generate random ellipse size
  myDiameter = random(5, 50);
}

// alt: when pressing, make big diameter circle
function mousePressed() {
  let mouseData = {
    x: mouseX,
    y: mouseY,
    r: myRed,
    g: myGreen,
    b: myBlue,
    d: 100,
  };

  console.log(mouseData);
  socket.emit("message", mouseData);
}

function mouseMoved() {
  //Grab mouse position & other data
  // let mouseData = { x: mouseX, y: mouseY };
  let mouseData = {
    x: mouseX,
    y: mouseY,
    r: myRed,
    g: myGreen,
    b: myBlue,
    d: myDiameter,
  };

  //Draw yourself? Wait for server?
  // fill(0);
  // ellipse(mouseX, mouseY, 10, 10);

  //Send mouse data object to the server
  console.log(mouseData);
  socket.emit("message", mouseData);
}

//Expects an object with x and y properties
function drawEllipse(obj) {
  // fill(0);
  // ellipse(obj.x, obj.y, 10, 10);
  fill(obj.r, obj.g, obj.b);
  noStroke();
  ellipse(obj.x, obj.y, obj.d, obj.d);
}
