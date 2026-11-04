/**
 * helpers to handle interactive objects
 */

const getObjectPosition = (object) => {
  let centerX = object.offsetLeft + object.offsetWidth / 2;
  let centerY = object.offsetTop + object.offsetHeight / 2;
  let scale = getMapScale();

  return {
    x: centerX / scale,
    y: centerY / scale,
  };
};

const isInteractive = (item) => {
  const object = {
    position: getObjectPosition(item),
  };

  const proximity = getProximity(object, distanceRange_interactiveObject);
  return proximity === NEAR;
};

const createInteractionMessage = (emoji, messages) => {
  return `${emoji} ${myUser.name} ${chooseInteractionMessage(messages)}`;
};

const chooseInteractionMessage = (messages) => {
  let { base, rare, special = {}, rareOdds = 0.2 } = messages;
  let userName = myUser.name.trim().toLowerCase();

  // grab all special logs where name matches
  const specials = Object.entries(special)
    .filter(([name]) => {
      let specialName = name.trim().toLowerCase();
      return specialName.length > 0 && userName.includes(specialName);
    })
    .map(([, log]) => log);

  // if name matches, return a special log (randomize if multiple)
  if (specials.length > 0) {
    let i = Math.floor(Math.random() * specials.length);
    return specials[i];
  }

  // by default: 80% - base log; 20% - rare log
  return Math.random() < rareOdds ? rare : base;
};

const setupLaser = () => {
  handleInteraction("laser", () =>
    createInteractionMessage("🔥", {
      base: "is using the laser cutter.",
      rare: "started a fire at the laser cutter!!!",
      special: {
        Rylee: "is laser cutting a sexy lady.",
      },
    }),
  );
};

const setupEquipment = () => {
  handleInteraction("equipment", () =>
    createInteractionMessage("🖥️", {
      base: "rented some gear from the ER.",
      rare: "got banned from the ER!",
      special: {
        TiffQ: "is looking for a yogurt cup in the ER.",
        Sehmon: "is daydreaming about C-foods by the ER.",
      },
    }),
  );
};

const setupBandsaw = () => {
  handleInteraction("bandsaw", () =>
    createInteractionMessage("🪚", {
      base: "is cutting wood on the band saw",
      rare: "got sawdust in their eye!",
      special: {
        TiffS: "almost cut her hand on the band saw!",
      },
    }),
  );
};

const setupPrinter = () => {
  handleInteraction("printer", () =>
    createInteractionMessage("🖨️", {
      base: "is printing some stickers.",
      rare: "is desperately trying to contact the Design Lab.",
      special: {
        Craig: "is hiding from students in the Design Lab.",
      },
    }),
  );
};

const setupSolder = () => {
  handleInteraction("solder", () =>
    createInteractionMessage("💥", {
      base: "is soldering a PCB.",
      rare: "is crashing out soldering a PCB.",
      special: {
        Miles: "is soldering some speakers.",
        Daniel: "is soldering a glove.",
        Iris: "is soldering a musical cube.",
      },
    }),
  );
};

const setupFoosball = () => {
  handleInteraction("foosball", () =>
    createInteractionMessage("⚽️", {
      base: "watched James beat Ramzy in foosball",
      rare: "watched Ramzy beat James in foosball",
      special: {
        James: "beat Ramzy in foosball",
        Ramzy: "beat James in foosball",
      },
      rareOdds: 0.5,
    }),
  );
};

const setupVending = () => {
  handleInteraction("vending", () =>
    createInteractionMessage("🍪", {
      base: "got a snack from the vending machine.",
      rare: "spilled some hot gos by the vending machine.",
      special: {
        Ramzy: "got a snickers bar from the vending machine.",
        Sehmon: "found seafood in the vending machine?!",
      },
    }),
  );
};

const setupCoffee = () => {
  handleInteraction("coffee", () =>
    createInteractionMessage("☕️", {
      base: "made a fresh batch of coffee.",
      rare: "drank their 10th cup of coffee... someone stop them.",
      special: {
        Camila: "found her rainstick by the coffee machine!",
        Sehmon: "wishes there was seafood in the kitchen.",
      },
    }),
  );
};

const handleInteraction = (id, getMessage) => {
  const item = document.getElementById(id);
  if (!item) return;

  item.addEventListener("click", () => {
    if (isInteractive(item)) {
      logInteraction(getMessage());
    }
  });
};

const setupInteractiveObjects = () => {
  setupLaser();
  setupEquipment();
  setupBandsaw();
  setupPrinter();
  setupSolder();
  setupFoosball();
  setupVending();
  setupCoffee();
};

const updateInteractiveObjects = () => {
  document.querySelectorAll(".interactive-item").forEach((item) => {
    item.classList.toggle("is-interactive", isInteractive(item));
  });
};
