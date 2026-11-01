// update these to set proximity distances
const min = 100;
const maxForColor = 400;
const maxForOpacity = 200;

function getProximity(x, y, max) {
  // calculate distance for prox
  let distance = dist(x, y, mouseX, mouseY);

  // cap off distances to range
  return constrain(distance, min, max);
}

const getColor = (user) => {
  let proximity = getProximity(user.x, user.y, maxForColor);
  let { r, g, b } = user.color;
  return {
    r: map(proximity, min, maxForColor, r, 0),
    g: map(proximity, min, maxForColor, g, 0),
    b: map(proximity, min, maxForColor, b, 0),
  };
};

const getOpacity = (user) => {
  let proximity = getProximity(user.x, user.y, maxForOpacity);
  return map(proximity, min, maxForOpacity, 255, 0);
};

const getUserDrawData = (user) => {
  return {
    ...user,
    color: getColor(user),
    opacity: getOpacity(user),
  };
};
