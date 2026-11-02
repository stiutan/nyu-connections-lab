const getMovementPerFrame = (dx, dy, mode) => {
  // a^2 + b^2 = c^2 yuhhh
  let distance = Math.sqrt(dx * dx + dy * dy);

  // no change, don't update
  if (distance <= 0) {
    return null;
  }

  let speed = 150; // px per second
  let time = deltaTime / 1000; // seconds passed since prev frame
  let step =
    mode === movementOptions.mouse
      ? Math.min(speed * time, distance)
      : speed * time;

  return {
    x: dx * (step / distance),
    y: dy * (step / distance),
  };
};

const getMouseNextPosition = (position) => {
  // no change, rely on mouseMoved to initialize
  if (position === null) {
    return null;
  }

  let dx = mouseX - position.x;
  let dy = mouseY - position.y;

  let movement = getMovementPerFrame(dx, dy, movementOptions.mouse);
  if (!movement) return null;

  return {
    x: position.x + movement.x,
    y: position.y + movement.y,
  };
};

const getKeysNextPosition = (position) => {
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

  let movement = getMovementPerFrame(dx, dy, movementOptions.mouse);
  if (!movement) return null;

  return {
    x: position.x + movement.x,
    y: position.y + movement.y,
  };
};

const calcNextPosition = (position) => {
  switch (movementMode) {
    case movementOptions.mouse:
      return getMouseNextPosition(position);
    case movementOptions.keys:
      return getKeysNextPosition(position);
    default:
      return position;
  }
};

const moveUser = (position) => {
  // set new position & send update to everyone
  if (socket && socket.connected) {
    myUser.position = position;
    socket.emit("user-update", myUser);
  }
};

const updatePosition = () => {
  let nextPosition = calcNextPosition(myUser.position);
  if (nextPosition) moveUser(nextPosition);
};
