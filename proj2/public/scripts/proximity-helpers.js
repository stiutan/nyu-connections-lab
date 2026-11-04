/**
 * helpers to calculate proximity to users/objects +
 * mapping needed values based on proximity
 */

// update these to set proximity distances
const NEAR = 0;
const FAR = 1;
const distanceRange_icon = { near: 24, far: 80 }; // for icon color, size, audio
const distanceRange_name = { near: 24, far: 60 }; // for name opacity
const distanceRange_interactiveObject = { near: 40, far: 60 }; // for interactive map objects

function getProximity(other, distance) {
  if (!other.position || !myUser.position) {
    return FAR;
  }

  let { x: x1, y: y1 } = other.position;
  let { x: x2, y: y2 } = myUser.position;

  // calculate distance for prox
  let separation = dist(x1, y1, x2, y2);

  // cap off distances to range
  let cappedDistances = constrain(separation, distance.near, distance.far);

  // map to normalize values
  let mappedDistances = map(
    cappedDistances,
    distance.near,
    distance.far,
    NEAR,
    FAR,
  );

  return mappedDistances;
}

// map normalized proximity (0–1) to corresponding values for near/far
const mapToValues = (proximity, values) => {
  return map(proximity, NEAR, FAR, values.near, values.far);
};

const getColor = (user) => {
  let proximity = getProximity(user, distanceRange_icon);
  return {
    r: mapToValues(proximity, {
      near: user.color.r,
      far: defaultColor.r,
    }),
    g: mapToValues(proximity, {
      near: user.color.g,
      far: defaultColor.g,
    }),
    b: mapToValues(proximity, {
      near: user.color.b,
      far: defaultColor.b,
    }),
  };
};

const getSize = (user) => {
  let proximity = getProximity(user, distanceRange_icon);
  return mapToValues(proximity, {
    near: maxSize,
    far: minSize,
  });
};

const getOpacity = (user) => {
  let proximity = getProximity(user, distanceRange_name);
  return mapToValues(proximity, {
    near: maxOpacity,
    far: minOpacity,
  });
};

const getAudioVolume = (user) => {
  let proximity = getProximity(user, distanceRange_icon);
  return (
    mapToValues(proximity, {
      near: maxVolume,
      far: minVolume,
    }) ** 2 // put volume on a curve
  );
};

const getUserDrawData = (user) => {
  return {
    ...user,
    size: getSize(user),
    color: getColor(user),
    opacity: getOpacity(user),
  };
};
