const axios = require("axios");
const { version: appVersion } = require("./package.json");

axios
  .post("https://dashboard-devs.firebaseapp.com/version", {
    version: appVersion
  })
  .then(response => console.log(response));
