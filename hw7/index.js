import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import express from "express";

const defaultSecrets = { secrets: [] };

let app = express();

/**
 * #HW7 Route 1
 * Serve a static html page to the “/” route
 */
app.use(express.static("public"));

// read json from client
app.use(express.json());

const adapter = new JSONFile("db.json");
const db = new Low(adapter, defaultSecrets);

// read from db on start up - set up db.data to avoid null case
// for class7 example, we only read within /message making it possible to break
await db.read();

/**
 * #HW7 Route 2
 * Store new data via the “/new-data” route
 */
app.post("/new-secret", (req, res) => {
  let newSecret = req.body;
  console.log("new secret: ", newSecret);

  // add to lowdb json database
  db.data.secrets.push(newSecret);

  // write new msg to database
  db.write().then(() => {
    // send success back to client
    res.json({ state: "success!" });
  });
});

/**
 * #HW7 - Route 3
 * Serve stored data via the “/data” route
 */
app.get("/secrets", (req, res) => {
  db.read().then(() => {
    let secretsJson = { secrets: db.data.secrets };
    res.json(secretsJson);
  });
});

app.listen(3000, () => {
  console.log("app is listening at localhost:3000");
});
