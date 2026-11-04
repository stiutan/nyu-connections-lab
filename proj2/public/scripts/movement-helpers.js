/**
 * helpers to handle key-controlled movement through map +
 * sending socket messages to update all users
 */

const getMovementPerFrame = (dx, dy) => {
  // a^2 + b^2 = c^2 yuhhh
  let distance = Math.sqrt(dx * dx + dy * dy);

  // no change, don't update
  if (distance <= 0) {
    return null;
  }

  let speed = 100; // map units per second
  let time = Math.min(deltaTime, 100) / 1000; // seconds passed since prev frame, capped
  let step = speed * time;

  return {
    x: dx * (step / distance),
    y: dy * (step / distance),
  };
};

const calcNextPosition = (position) => {
  if (position === null) {
    return { x: 10, y: 10 };
  }

  let dx = 0;
  let dy = 0;
  let W = 87;
  let A = 65;
  let S = 83;
  let D = 68;

  if (keyIsDown(W) || keyIsDown(UP_ARROW)) dy -= 1;
  if (keyIsDown(A) || keyIsDown(LEFT_ARROW)) dx -= 1;
  if (keyIsDown(S) || keyIsDown(DOWN_ARROW)) dy += 1;
  if (keyIsDown(D) || keyIsDown(RIGHT_ARROW)) dx += 1;

  let movement = getMovementPerFrame(dx, dy);
  if (!movement) return null;

  return {
    x: position.x + movement.x,
    y: position.y + movement.y,
  };
};

const moveWithinBounds = (position) => {
  let radius = maxSize / 2;
  return {
    x: constrain(position.x, maxSize, getMapWidth() - maxSize),
    y: constrain(position.y, maxSize, getMapHeight() - maxSize),
  };
};

const moveUser = (position) => {
  // set new position & send update to everyone
  if (socket && socket.connected) {
    myUser.position = moveWithinBounds(position);
    socket.emit("user-update", myUser);
  }
};

const updatePosition = () => {
  let nextPosition = calcNextPosition(myUser.position);
  if (nextPosition) moveUser(nextPosition);
};
