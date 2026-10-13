console.log("JS on the client");

// fetch json data
fetch("/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
