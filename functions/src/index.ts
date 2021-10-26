import functions = require("firebase-functions");
import express = require("express");
import admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const app = express();

app.get("/deployments", (request: any, response: any) => {
  const deploymentsRef = admin.database().ref("deployments");
  deploymentsRef.on("value", (snapshot: any) => {
    response.send(snapshot.val());
  });
});

app.post("/deployments", async (request: any, response: any) => {
  const {body} = request;
  const envRef = admin
      .database()
      .ref(`repositories/${body.app}/environments/${body.env}`);
  const version = body.version;

  if (body.buildNumber) {
    const key = body.version.replace(/\./g, "_");
    const envSnapshot = await envRef.once("value");
    const value = Object.assign({}, envSnapshot.val());
    if (value && !value.name) {
      await envRef.set({name: body.env});
    }
    await admin
        .database()
        .ref(`repositories/${body.app}/environments/${body.env}/versions/${key}`)
        .set({
          build_number: body.buildNumber,
          version: body.version,
          timestamp: admin.database.ServerValue.TIMESTAMP,
        });
    return response
        .status(200)
        .send(`OK ${body.app} ${body.version} ${body.env}`);
  } else {
    const snapshot = await admin
        .database()
        .ref(`repositories/${body.app}/environments/${body.env}`)
        .once("value");
    const value = Object.assign({}, snapshot.val());
    await admin
        .database()
        .ref(`repositories/${body.app}/environments/${body.env}`)
        .set({
          ...value,
          name: body.env,
          version: version,
          timestamp: admin.database.ServerValue.TIMESTAMP,
        });
    return response
        .status(200)
        .send(`OK ${body.app} ${body.version} ${body.env}`);
  }
});

app.post("/version", (request: any, response: any) => {
  const {body} = request;

  return admin
      .database()
      .ref("version")
      .set(body.version)
      .then(() => {
        response.status(200).send(`OK ${body.version}`);
      });
});

exports.app = functions.https.onRequest(app);
