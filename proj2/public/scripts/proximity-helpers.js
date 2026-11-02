// update these to set proximity distances
const nearDist = 80;
const farDist_icon = 240; // for icon color, size
const farDist_identity = 120; // for identification (name, audio)

function getProximity(otherUser, farDist) {
  if (!otherUser.position || !myUser.position) {
    return farDist;
  }

  let { x: x1, y: y1 } = otherUser.position;
  let { x: x2, y: y2 } = myUser.position;

  // calculate distance for prox
  let distance = dist(x1, y1, x2, y2);

  // cap off distances to range
  return constrain(distance, nearDist, farDist);
}

const getMappedProximity = (otherUser, farDist, nearVal, farVal) => {
  let proximity = getProximity(otherUser, farDist);
  return map(proximity, nearDist, farDist, nearVal, farVal);
};

const getColor = (user) => {
  let { r, g, b } = user.color;
  return {
    r: getMappedProximity(user, farDist_icon, r, 0),
    g: getMappedProximity(user, farDist_icon, g, 0),
    b: getMappedProximity(user, farDist_icon, b, 0),
  };
};

const getSize = (user) => {
  let nearSize = 12; // larger icon
  let farSize = 4; // smaller icon
  return getMappedProximity(user, farDist_icon, nearSize, farSize);
};

const getNameOpacity = (user) => {
  let nearOpacity = 255; // 0% opaque
  let farOpacity = 0; // 100% opaque
  return getMappedProximity(user, farDist_identity, nearOpacity, farOpacity);
};

const getAudioVolume = (user) => {
  let nearVolume = 1; // 0% opaque
  let farVolume = 0; // 100% opaque
  return getMappedProximity(user, farDist_identity, nearVolume, farVolume);
};

const getUserDrawData = (user) => {
  return {
    ...user,
    size: getSize(user),
    color: getColor(user),
    nameOpacity: getNameOpacity(user),
  };
};
