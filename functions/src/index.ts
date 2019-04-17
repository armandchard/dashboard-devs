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
  const { body } = request;

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

app.post("/version", (request: any, response: any) => {
  const { body } = request;

  return admin
    .database()
    .ref("version")
    .set(body.version)
    .then(() => {
      response.status(200).send(`OK ${body.version}`);
    });
});

app.post("/webhooks", async (request: any, response: any) => {
  const { body } = request;
  const repoRef = admin
    .database()
    .ref("repositories")
    .child(`${body.repository.name}/pull_requests/${body.pullrequest.id}`);

  if (
    body.pullrequest.state === "DECLINED" ||
    body.pullrequest.state === "MERGED"
  ) {
    const dbRemove = await repoRef.remove();
    response.status(200).send(`OK ${dbRemove}`);
  } else {
    const dbUpdate = await repoRef.set({
      repository: { ...body.repository },
      actor: { ...body.actor },
      ...body.pullrequest
    });
    response.status(200).send(`OK ${dbUpdate}`);
  }
});

exports.app = functions.https.onRequest(app);
