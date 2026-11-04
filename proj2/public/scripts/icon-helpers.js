/**
 * helpers to draw user dots/icons
 */

const getRandomColor = () => {
  // avoid ugly colors lol (too vivid, too light)
  colorMode(HSL, 360, 100, 100);
  let randomColor = color(random(360), random(35, 65), random(30, 50));

  // reset back to rgb for drawing
  colorMode(RGB, 255);

  return {
    r: red(randomColor),
    g: green(randomColor),
    b: blue(randomColor),
  };
};

function updateUserIcons() {
  push();
  scale(getMapScale());

  Object.values(users).forEach((user) => {
    drawUser(getUserDrawData(user));
  });

  pop();
}

function drawUser(user) {
  let { r, g, b } = user.color;
  let { x, y } = user.position;
  let { size, name, opacity } = user;

  push();

  // color
  noStroke();
  fill(r, g, b);

  // icon
  ellipse(x, y, size, size);

  // name
  fill(r, g, b, opacity);
  textAlign(CENTER, BOTTOM);
  textSize(10);
  text(name, x, y - 8);

  pop();

  if (isSpeaking(user.id)) {
    drawSpeakingRing(user);
  }
}

function drawSpeakingRing(user) {
  let progress = (millis() % 800) / 800; // restart cycle every 800ms
  let ringSize = user.size + progress * 12;
  let opacity = user.opacity * (1 - progress);

  let { r, g, b } = user.color;
  let { x, y } = user.position;

  push();
  noFill();
  stroke(r, g, b, opacity);
  ellipse(x, y, ringSize, ringSize);
  pop();
}
