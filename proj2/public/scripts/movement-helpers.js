const calcNextPosition = (position) => {
  // no change, rely on mouseMoved to initialize
  if (position === null) {
    return null;
  }

  // a^2 + b^2 = c^2 yuhhh
  let dx = mouseX - position.x;
  let dy = mouseY - position.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  // no change, don't update
  if (distance <= 0) {
    return null;
  }

  let speed = 150; // px per second
  let time = deltaTime / 1000; // seconds passed since prev frame
  let step = Math.min(speed * time, distance);

  return {
    x: position.x + dx * (step / distance),
    y: position.y + dy * (step / distance),
  };
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
