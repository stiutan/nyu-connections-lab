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
