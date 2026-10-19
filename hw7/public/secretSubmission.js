// listen for new secrets
let secretInput = document.querySelector(".secret-input-textbox");
secretInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let secret = secretInput.value.trim();
    if (secret === "") {
      return;
    }
    console.log("secret: ", secret);

    let secretObj = { secret };
    console.log("secret object: ", secretObj);

    let secretJSON = JSON.stringify(secretObj);
    console.log("secret json: ", secretJSON);

    /**
     * #HW7 Route 2
     * Use fetch() on the client to make a POST request to your server
     */
    fetch("/new-secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: secretJSON,
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log("[new secret] response: ", resJson); // state: "success!"

        let secretWall = document.querySelector(".secrets-wall");
        addToWall(secretWall, secret, /* isTemporary = */ true);

        // reset input
        secretInput.value = "";
      })
      .catch((e) => console.error(e));
  }
});
