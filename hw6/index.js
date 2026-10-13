let express = require("express");
let app = express();
let poisonousBooks = require("./public/data/poisonous_books.json");

// 1. Serve a static html page
app.use("/", express.static("public"));

// 2. Serve json data to a different route
app.get("/books", (req, res) => {
  res.json(poisonousBooks);
});

// 3. Serve dynamic json data via a route with a path parameter
app.get("/books/:title", (req, res) => {
  let reqTitle = req.params.title;
  let matchingBooks = poisonousBooks.filter((book) => {
    // the book titles can be quite long so rather than complete matches
    // we just treat it like a search bar -- match if it starts with 'xyz'
    return normalizeTitle(book.title).startsWith(normalizeTitle(reqTitle));
  });

  if (matchingBooks.length == 0) {
    res.json({ error: "book not found" });
  } else {
    res.json(matchingBooks);
  }
});

app.listen(3000, () => {
  console.log("app is listening at localhost:3000");
});

/**
 * helper for matching book titles
 *
 * this simplifies searching (which can reduce accuracy)
 * some trade-offs we're making are that we're ignoring
 * letter accents, whitespaces, and punctuation marks.
 */
const normalizeTitle = (title) =>
  title
    .toLowerCase()
    // split off letter accents (ö → o + accent mark)
    .normalize("NFD")
    // keep only alphanumeric characters
    .replace(/[^\p{L}\p{N}]/gu, "");
