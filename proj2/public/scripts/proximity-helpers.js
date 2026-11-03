// update these to set proximity distances
const nearDist = 24;
const farDist = 80; // for icon color, size
const farDist_identity = 60; // for identification (name, audio)

function getProximity(otherUser, _farDist = farDist) {
  if (!otherUser.position || !myUser.position) {
    return _farDist;
  }

  let { x: x1, y: y1 } = otherUser.position;
  let { x: x2, y: y2 } = myUser.position;

  // calculate distance for prox
  let distance = dist(x1, y1, x2, y2);

  // cap off distances to range
  return constrain(distance, nearDist, _farDist);
}

const getMappedProximity = (otherUser, nearVal, farVal, _farDist = farDist) => {
  let proximity = getProximity(otherUser, _farDist);
  return map(proximity, nearDist, _farDist, nearVal, farVal);
};

const getColor = (user) => {
  let { r, g, b } = user.color;
  let farColor = { r: 26, g: 47, b: 96 }; // default navy blue
  return {
    r: getMappedProximity(user, r, farColor.r),
    g: getMappedProximity(user, g, farColor.g),
    b: getMappedProximity(user, b, farColor.b),
  };
};

const getSize = (user) => {
  let nearSize = 12; // larger icon
  let farSize = 4; // smaller icon
  return getMappedProximity(user, nearSize, farSize);
};

const getOpacity = (user) => {
  let nearOpacity = 255; // 0% opaque
  let farOpacity = 0; // 100% opaque
  return getMappedProximity(user, nearOpacity, farOpacity, farDist_identity);
};

const getAudioVolume = (user) => {
  let nearVolume = 1; // 0% opaque
  let farVolume = 0; // 100% opaque
  return getMappedProximity(user, nearVolume, farVolume) ** 2; // square to put volume on a curve
};

const getUserDrawData = (user) => {
  return {
    ...user,
    size: getSize(user),
    color: getColor(user),
    opacity: getOpacity(user),
  };
};
