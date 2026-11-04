/**
 * helpers to draw user dots/icons
 */

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
