import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import express from "express";

//Data array
// let defaultData = [
//   {
//     name: "Me",
//     message: "This is my first message",
//   },
//   {
//     name: "You",
//     message: "Hello hello!",
//   },
// ];
const defaultData = { messages: [] };

//Set up the server
let app = express();

//Serve static files from a public folder
app.use(express.static("public"));

// parse json as they come in
app.use(express.json());

/*ROUTES */
app.get("/messages", (request, response) => {
  //Send data as an object
  // response.json(defaultData);

  // read messages from database
  db.read().then(() => {
    //save the messages to an object
    let theData = { messages: db.data.messages };
    //send the messages to the client
    response.json(theData);
  });
});

const adapter = new JSONFile("db.json");
const db = new Low(adapter, defaultData);

app.post("/newMessage", (request, response) => {
  console.log(request.body);

  let newMessage = request.body;
  newMessage.time = Date();
  console.log(newMessage);

  // defaultData.push(newMessage);
  // response.json({ msg: "Success" });

  // initialize lowdb json database
  db.data.messages.push(newMessage);

  // write new message to database
  db.write().then(() => {
    //send message back to the client
    response.json({ msg: "Success" });
  });
});

//Set port variable to listen for requests
let port = 3000;
app.listen(port, () => {
  console.log("Server listening on localhost:", port);
});
