/**
 * helpers to calculate proximity to users/objects +
 * mapping needed values based on proximity
 */

// update these to set proximity distances
const nearDist = 24;
const farDist = 80; // for icon color, size, audio
const farDist_identity = 60; // for name

function getProximity(other, _farDist = farDist) {
  if (!other.position || !myUser.position) {
    return _farDist;
  }

  let { x: x1, y: y1 } = other.position;
  let { x: x2, y: y2 } = myUser.position;

  // calculate distance for prox
  let distance = dist(x1, y1, x2, y2);

  // cap off distances to range
  return constrain(distance, nearDist, _farDist);
}

// maps distance values to
const getMappedProximity = (otherUser, nearVal, farVal, _farDist = farDist) => {
  let proximity = getProximity(otherUser, _farDist);
  return map(proximity, nearDist, _farDist, nearVal, farVal);
};

const getColor = (user) => {
  let { r, g, b } = user.color;
  return {
    r: getMappedProximity(user, r, defaultColor.r),
    g: getMappedProximity(user, g, defaultColor.g),
    b: getMappedProximity(user, b, defaultColor.b),
  };
};

const getSize = (user) => {
  return getMappedProximity(user, maxSize, minSize);
};

const getOpacity = (user) => {
  return getMappedProximity(user, maxOpacity, minOpacity, farDist_identity);
};

const getAudioVolume = (user) => {
  let proximity = getMappedProximity(user, maxVolume, minVolume);
  return proximity ** 2; // square to put volume on a curve
};

const getUserDrawData = (user) => {
  return {
    ...user,
    size: getSize(user),
    color: getColor(user),
    opacity: getOpacity(user),
  };
};
