/**
 * helpers to scale all drawn items to map size
 * (adjusted to browser size)
 */

const mapWidth = 1000; // setting 1000 map units
const mapSpawnArea = {
  // elevators in % of map image
  left: 0.28,
  right: 0.29,
  top: 0.51,
  bottom: 0.67,
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

const getSpawnPosition = () => {
  return {
    x: random(mapSpawnArea.left, mapSpawnArea.right) * getMapWidth(),
    y: random(mapSpawnArea.top, mapSpawnArea.bottom) * getMapHeight(),
  };
};
