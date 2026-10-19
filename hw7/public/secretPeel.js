let peelContainer = document.querySelector(".secret-peel");
let peelFlap = document.querySelector(".secret-peel-flap-region");

let width = peelContainer.clientWidth;
let height = peelContainer.clientHeight;

// default location of flap
let restX = width - 10;
let restY = height - 20;

let pathX = -width - restX;
let pathY = -height - restY;

let peel = new Peel(peelContainer, { corner: Peel.Corners.BOTTOM_RIGHT });
peel.setPeelPath(restX, restY, -width, -height);
peel.setTimeAlongPath(0);

let state = {
  currProgress: 0,
  isDragging: false,
  isAnimating: false,
  isPeeled: false,
};

const startPeel = () => {
  // only drag when it's not in the midst of animation or hasn't been peeled yet
  if (state.isAnimating || state.isPeeled) return;

  state.isDragging = true;

  // reset secret inner wall
  fetch("/secrets")
    .then((res) => res.json())
    .then((resJson) => {
      let wall = document.querySelector(".secret-secrets-wall");
      wall.replaceChildren();

      resJson.secrets.forEach((secretEntry) => {
        addToWall(wall, secretEntry.secret, false);
      });
    })
    .catch((e) => console.error(e));
};

const settlePeel = (target) => {
  state.isDragging = false;
  state.isAnimating = true;

  let startProgress = state.currProgress;
  let startTime = performance.now();

  const animate = (currTime) => {
    let animationDuration = 450; // 0.45s
    let time = Math.min(1, (currTime - startTime) / animationDuration);
    let easing = 1 - Math.pow(1 - time, 3);

    setPeelProgress(startProgress + (target - startProgress) * easing);

    if (time < 1) {
      // ##RequestAnimationFrame
      // ask the browser to run animate before the next screen repaint -> keeps animation smooth
      requestAnimationFrame(animate);
    } else {
      state.isAnimating = false;
      state.isPeeled = target === 1; // check if target has reached 100%
      peelFlap.style.pointerEvents = state.isPeeled ? "none" : "";
    }
  };

  requestAnimationFrame(animate); // #RequestAnimationFrame
};

const releasePeel = () => {
  // releasing is only needed if we're still dragging
  if (!state.isDragging) return;

  // if reached 25% peel, finish it off
  settlePeel(state.currProgress >= 0.25 ? 1 : 0);
};

const updatePeel = (event, x, y) => {
  // progress changes only when dragging
  if (!state.isDragging || state.isAnimating || state.isPeeled) return;

  // project the pointer's position onto diagonal peel path
  let movedX = x - restX;
  let movedY = y - restY;
  let distanceAlongPath =
    (movedX * pathX + movedY * pathY) / (pathX * pathX + pathY * pathY);

  setPeelProgress(Math.max(0, Math.min(1, distanceAlongPath)));

  // if reached 25% peel, finish it off
  if (state.currProgress >= 0.25) settlePeel(1);
};

const resizePeel = () => {
  // when window is resized, update vars
  width = peelContainer.clientWidth;
  height = peelContainer.clientHeight;
  restX = width - 10;
  restY = height - 20;
  pathX = -width - restX;
  pathY = -height - restY;

  // refresh peel.js cached dimensions then rebuild corner and path
  peel.setupDimensions();
  peel.setCorner(Peel.Corners.BOTTOM_RIGHT);
  peel.setPeelPath(restX, restY, -width, -height);
  peel.setTimeAlongPath(state.currProgress);
};

const setPeelProgress = (progress) => {
  state.currProgress = progress;
  peel.setTimeAlongPath(state.currProgress);
};

/**
 * event listeners
 */

// starting peeling
peelFlap.addEventListener("pointerdown", startPeel);

// during peeling
peel.handleDrag(updatePeel, peelFlap);

// after peeling
window.addEventListener("mouseup", releasePeel);
window.addEventListener("touchend", releasePeel);
window.addEventListener("touchcancel", () => {
  if (state.isDragging) settlePeel(0);
});

// handle window resizes -- update flap
window.addEventListener("resize", resizePeel);
