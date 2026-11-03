/**
 * helpers to scale all drawn items to map size
 * (adjusted to browser size)
 */

const mapWidth = 1000; // setting 1000 map units
const mapSpawnArea = {
  // elevators in % of map image
  left: 0.27,
  right: 0.3,
  top: 0.5,
  bottom: 0.68,
};

const getMapBounds = () => {
  const map = document.querySelector(".floor-map");
  return map.getBoundingClientRect();
};

const getMapScale = () => {
  return getMapBounds().width / mapWidth;
};

const getMapWidth = () => {
  return mapWidth;
};

const getMapHeight = () => {
  return getMapBounds().height / getMapScale();
};
