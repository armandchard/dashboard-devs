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
    .ref(`repositories/${body.app}/environments/${body.env}`)
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
  const repoRef = admin.database().ref(`repositories/${body.repository.name}`);

  if (body.pullrequest) {
    const updatePR = await updatePullRequest(body, repoRef);
    response.status(200).send(`OK ${updatePR}`);
  }
  if (body.push) {
    const updateBr = await updateBranch(body, repoRef);
    response.status(200).send(`OK ${updateBr}`);
  }
});

async function updateBranch(body: any, ref: any) {
  const update = body.push.changes[0];
  const branch = update.new || update.old;
  const branchName = branch.name.split("/").pop();
  const branchRef = ref.child(`branches/${branchName}`);

  if (branch.type !== "branch") {
    return new Promise(resolve => resolve(branch));
  }

  if (update.closed || update.new === null) {
    return branchRef.remove();
  } else {
    return branchRef.set({
      name: branch.name
    });
  }
}

async function updatePullRequest(body: any, ref: any) {
  const prRef = ref.child(`pull_requests/${body.pullrequest.id}`);

  if (
    body.pullrequest.state === "DECLINED" ||
    body.pullrequest.state === "MERGED"
  ) {
    return prRef.remove();
  } else {
    return prRef.set({
      repository: { ...body.repository },
      actor: { ...body.actor },
      ...body.pullrequest
    });
  }
}

exports.app = functions.https.onRequest(app);
