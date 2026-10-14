// import express
let express = require("express");

// create an app instance - calling express() returns an object
let app = express();

// Serve HTML file
// middleware to server static files
app.use(express.static("public")); /* SENDING AN HTML FILE */

// GET route for main page
app.get("/", (request, response) => {
  response.send("This is the main page"); /* SENDING A STRING */
});

// GET route for about page
app.get("/about", (request, response) => {
  response.send("This is the about page");
});

// GET route to serve json data
app.get("/data", (request, response) => {
  response.json(foodData); /* SENDING A JSON */
});

// specify a listening port - keep at bottom
app.listen(3000, () => {
  console.log("app is listening at localhost:3000");
});

let foodData = {
  foods: [
    {
      name: "pizza",
      cost: "$4",
      tastiness: 9,
    },
    {
      name: "taco",
      cost: "$3",
      tastiness: 8,
    },
  ],
};
