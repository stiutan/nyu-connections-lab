// update these to set proximity distances
const min = 100;
const max = 400;
const maxForName = 200;

function getProximity(pos1, pos2, _max = max) {
  // calculate distance for prox
  let distance = dist(pos1.x, pos1.y, pos2.x, pos2.y);

  // cap off distances to range
  return constrain(distance, min, _max);
}

const getColor = (user) => {
  let proximity = getProximity(user.position, myUser.position);
  let { r, g, b } = user.color;
  return {
    r: map(proximity, min, max, r, 0),
    g: map(proximity, min, max, g, 0),
    b: map(proximity, min, max, b, 0),
  };
};

const getNameOpacity = (user) => {
  let proximity = getProximity(user.position, myUser.position, maxForName);
  return map(proximity, min, maxForName, 255, 0);
};

const getSize = (user) => {
  let proximity = getProximity(user.position, myUser.position);
  return map(proximity, min, max, 12, 4);
};

const getUserDrawData = (user) => {
  return {
    ...user,
    size: getSize(user),
    color: getColor(user),
    nameOpacity: getNameOpacity(user),
  };
};
