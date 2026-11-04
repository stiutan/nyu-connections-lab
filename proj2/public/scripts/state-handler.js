let socket;

let users = {}; // includes me
let myUser = {
  name: null,
  color: null,
  position: null,
};

let audioRoom;
let audios = {}; // does not include me (based on subscriptions)
let myAudio;
let isAudioEnabled = false;
let isAudioEnabling = false;
let isAudioButtonPressed = false;

let defaultColor = { r: 26, g: 47, b: 96 }; // default navy blue

// proximity values
let maxSize = 10; // larger icon
let minSize = 4; // smaller icon
let maxOpacity = 255; // 0% opaque
let minOpacity = 0; // 100% opaque
let maxVolume = 1; // full volume
let minVolume = 0; // no volume
