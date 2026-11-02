const joinAudioRoom = async () => {
  // skip if already connected to room
  if (isAudioRoomConnected()) return;

  // check socket connection before proceeding
  if (!socket?.connected) {
    throw new Error("Socket is not connected yet.");
  }

  // wait for token from server before joining
  let res = await socket.timeout(10000).emitWithAck("audio-token");
  if (res.error) {
    throw new Error(res.error);
  }

  audioRoom = new LivekitClient.Room();

  // listen for subscriptions to other users' audios
  audioRoom.on(
    LivekitClient.RoomEvent.TrackSubscribed,
    (track, publication, participant) => {
      if (track.kind !== LivekitClient.Track.Kind.Audio) {
        return;
      }

      // play audio received from others
      let audioElement = track.attach();
      document.body.appendChild(audioElement);

      console.log("Receiving audio from: ", participant.identity);
    },
  );

  // listen for unsubscriptions to other users' audios
  audioRoom.on(LivekitClient.RoomEvent.TrackUnsubscribed, (track) => {
    track.detach().forEach((element) => element.remove());
  });

  // connect yourself to audio room
  await audioRoom.connect(res.url, res.token);
  console.log("Connected to audio room: ", audioRoom.name);
};

const publishMyAudio = async () => {
  if (myAudio) return;

  if (!isAudioRoomConnected()) {
    throw new Error("Connect to the audio room first.");
  }

  // LiveKit creates a tack and captures the mic
  let track = await LivekitClient.createLocalAudioTrack();
  try {
    // mute before publishing and sending to the room
    await track.mute();
    myAudio = await audioRoom.localParticipant.publishTrack(track, {
      source: LivekitClient.Track.Source.Microphone,
    });
  } catch (e) {
    track.stop();
    throw e;
  }

  console.log("Microphone published.");
};

const enableAudio = async () => {
  try {
    await joinAudioRoom();
    await audioRoom.startAudio();
    await publishMyAudio();
    return true;
  } catch (e) {
    console.error("Could not enable audio: ", e);
    return false;
  }
};

const isAudioRoomConnected = () => audioRoom?.state === "connected";

const unmute = async () => {
  if (myAudio) {
    await myAudio.unmute();
    console.log("Speaking: true");
  }
};

const mute = async () => {
  if (myAudio) {
    await myAudio.mute();
    console.log("Speaking: false");
  }
};
