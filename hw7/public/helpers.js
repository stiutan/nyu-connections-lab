const addToWall = (wall, secret, isTemporary) => {
  let secretElement = document.createElement("p");

  // add secret to wall
  secretElement.classList.add("secret");
  secretElement.textContent = secret;
  wall.appendChild(secretElement);

  // set secret styling
  let { x, y, rotation } = getRandomWallSpot(wall, secretElement);
  secretElement.style.left = `${x}px`;
  secretElement.style.top = `${y}px`;
  secretElement.style.transform = `rotate(${rotation}deg)`;

  // after 5s, remove element (should have faded out)
  if (isTemporary) {
    setTimeout(() => {
      secretElement.remove();
    }, 5000);
  }
};

const getRandomWallSpot = (wall, secret) => {
  let availableWidth = Math.max(0, wall.clientWidth - secret.offsetWidth);
  let availableHeight = Math.max(0, wall.clientHeight - secret.offsetHeight);

  let x = Math.random() * availableWidth;
  let y = Math.random() * availableHeight;
  let rotation = Math.random() * 30 - 15; // -15 to +15

  return { x, y, rotation };
};
