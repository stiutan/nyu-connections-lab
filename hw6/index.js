let express = require("express");
let app = express();
let poisonousBooks = require("./public/data/poisonous_books.json");

// 1. Serve a static html page
app.use("/", express.static("public"));

// 2. Serve json data to a different route
app.get("/books", (req, res) => {
  // BONUS: Filter by query parameters
  let filteredBooks = filterByQuery(poisonousBooks, req.query);
  returnBooksJsonOrError(filteredBooks, res);
});

// 3. Serve dynamic json data via a route with a path parameter
app.get("/books/:title", (req, res) => {
  let filteredBooks = filterByQuery(poisonousBooks, req.query);
  let matchedBooks = matchBooks(filteredBooks, "title", req.params.title);
  returnBooksJsonOrError(matchedBooks, res);
});

app.listen(3000, () => {
  console.log("app is listening at localhost:3000");
});

const returnBooksJsonOrError = (books, res) => {
  if (books.length == 0) {
    res.json({ error: "no books found" });
  } else {
    res.json(books);
  }
};

/**
 * helper for applying query parameter filters
 */
const filterByQuery = (books, query) => {
  let matchedBooks = books;
  matchedBooks = matchBooks(matchedBooks, "title", query.title ?? "");
  matchedBooks = matchBooks(matchedBooks, "author", query.author ?? "");
  matchedBooks = matchBooks(matchedBooks, "toxicMaterial", query.material ?? "");
  matchedBooks = matchBooks(matchedBooks, "year", query.year ?? "");

  return matchedBooks;
};

/**
 * helper for matching books
 *
 * given a book's key (in json) and a search string,
 * check for a match
 */
const matchBooks = (books, key, search) => {
  if (search === "") {
    return books;
  }

  return books.filter((book) => {
    return normalize(String(book[key])).startsWith(normalize(search));
  });
};

/**
 * helper for matching book strings
 *
 * this simplifies searching (which can reduce accuracy)
 * some trade-offs we're making are that we're ignoring
 * letter accents, whitespaces, and punctuation marks.
 */
const normalize = (title) =>
  title
    .toLowerCase()
    .normalize("NFD") // split off letter accents (ö → o + accent mark)
    .replace(/[^\p{L}\p{N}]/gu, ""); // keep only alphanumeric characters
