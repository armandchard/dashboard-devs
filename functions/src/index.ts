const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const app = express();

app.get("/deployments", (request: any, response: any) => {
  const deploymentsRef = admin.database().ref("deployments");
  deploymentsRef.on("value", (snapshot: any) => {
    response.send(snapshot.val());
  });
});

app.post("/deployments", (request: any, response: any) => {
  const body = request.body;
  console.log(body);
  return admin
    .database()
    .ref(`deployments/${body.app}/${body.env}`)
    .set({
      version: body.version
    })
    .then(() => {
      response.status(200).send(`OK ${body.app} ${body.version} ${body.env}`);
    });
});

exports.app = functions.https.onRequest(app);
