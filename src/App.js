import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";
import AppInfos from "./Components/AppInfos/AppInfos";
const { version: appVersion } = require("../package.json");

class App extends Component {
  constructor() {
    super();
    this.state = {
      apps: [],
      repos: []
    };
  }

  componentDidMount() {
    const reposRef = firebase.database().ref("repositories");
    const deploymentsRef = firebase.database().ref("deployments");
    const versionRef = firebase.database().ref("version");

    deploymentsRef.on("value", snap => {
      const values = snap.val();
      const map = Object.keys(values).map(key => {
        const environements = Object.keys(values[key]).map(environement => ({
          name: environement,
          version: values[key][environement].version
        }));
        return { appName: key, environements };
      });
      this.setState({
        ...this.state,
        apps: map
      });
    });

    reposRef.on("value", snap => {
      const values = snap.val();
      const map = Object.keys(values).map(key => {
        let prs = [];
        const val = Object.values(values[key].pull_requests);
        prs.push(...val);
        return {
          name: key,
          pullRequests: prs
        };
      });
      this.setState({
        ...this.state,
        repos: map
      });
    });

    versionRef.on("value", snap => {
      const version = snap.val();
      if (version !== appVersion) {
        // eslint-disable-next-line no-restricted-globals
        location.reload(true);
      }
    });
  }

  render() {
    const { apps: data, repos } = this.state;
    const apps = data.map(app => {
      const repo = repos.find(repo => repo.name === app.appName);
      return { ...app, ...repo };
    });

    if (apps && apps.length > 0) {
      return (
        <div className="App">
          <header className="App-header">
            <h1>Dashboard Devs Pumpkin</h1>
          </header>
          <div className="App-body">
            {apps && apps.length
              ? apps
                  .sort((a, b) =>
                    a.pullRequests
                      ? a.pullRequests.length
                      : 0 - b.pullRequests
                      ? b.pullRequests.length
                      : 0
                  )
                  .map(app =>
                    app ? <AppInfos key={app.appName} app={app} /> : null
                  )
              : null}
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}

export default App;
