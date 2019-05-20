const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const app = express();

app.post("/sensors", (request: any, response: any) => {
  const sensorRef = admin.database().ref("sensors");
  const { body } = request;

  return sensorRef
    .set({
      temperature: body.temperature,
      humidity: body.humidity
    })
    .then(() => {
      response.status(200).send(`OK ${body.temperature} ${body.humidity}`);
    });
});

app.post("/sensors", (request: any, response: any) => {
  const sensorRef = admin.database().ref("sensors");
  const { body } = request;

  return sensorRef
    .set({
      temperature: body.temperature,
      humidity: body.humidity
    })
    .then(() => {
      response.status(200).send(`OK ${body.temperature} ${body.humidity}`);
    });
});

app.get("/deployments", (request: any, response: any) => {
  const deploymentsRef = admin.database().ref("deployments");
  deploymentsRef.on("value", (snapshot: any) => {
    response.send(snapshot.val());
  });
});

app.get("/status_url", async (request: any, response: any) => {
  const repoRef = admin.database().ref("repositories");
  const repoSnap = await repoRef.once("value");
  const values = Object.assign({}, repoSnap.val());

  const map = values
    ? Object.keys(values)
        .map(key => {
          let envs = [];
          if (values[key].environments) {
            const environements = Object.keys(values[key].environments).map(
              environment => ({
                environment,
                repository: key,
                status_url: values[key].environments[environment].status_url,
                status: values[key].environments[environment].status_value
              })
            );
            envs.push(...environements);
          }
          return envs.filter(env => env.status_url);
        })
        .filter(env => env && env.length > 0)
    : [];

  let mergedTab: any = [];
  map.forEach(t => {
    t.forEach(e => {
      mergedTab.push(e);
    });
  });
  response.status(200).send(mergedTab);
});

app.post("/status_url", async (request: any, response: any) => {
  const { body } = request;
  const statusRef = admin
    .database()
    .ref(`repositories/${body.repository}/environments/${body.environment}`);
  const envSnapshot = await statusRef.once("value");
  const value = Object.assign({}, envSnapshot.val());
  await statusRef.set({
    ...value,
    status_value: body.status,
    status_timestamp: admin.database.ServerValue.TIMESTAMP
  });
  response.status(200).send(body.status);
});

app.post("/deployments", async (request: any, response: any) => {
  const { body } = request;
  const envRef = admin
    .database()
    .ref(`repositories/${body.app}/environments/${body.env}`);
  let version = body.version;

  if (body.buildNumber) {
    const key = body.version.replace(/\./g, "_");
    const envSnapshot = await envRef.once("value");
    const value = Object.assign({}, envSnapshot.val());
    if (value && !value.name) {
      await envRef.set({ name: body.env });
    }
    await admin
      .database()
      .ref(`repositories/${body.app}/environments/${body.env}/versions/${key}`)
      .set({
        build_number: body.buildNumber,
        version: body.version,
        timestamp: admin.database.ServerValue.TIMESTAMP
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
        timestamp: admin.database.ServerValue.TIMESTAMP
      });
    return response
      .status(200)
      .send(`OK ${body.app} ${body.version} ${body.env}`);
  }
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
  const branchName = branch.name
    .split("/")
    .pop()
    .replace(/\./g, "_");
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
  const logoRef = ref.child("logo");
  const urlRef = ref.child("url");
  logoRef.set({
    href: body.pullrequest.source.repository.links.avatar.href
  });
  urlRef.set({
    href: body.pullrequest.source.repository.links.html.href
  });
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
