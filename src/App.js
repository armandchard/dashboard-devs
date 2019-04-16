import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";
import AppVersionTable from "./Components/AppVersionTable/AppVersionTable";
import AppInfos from "./Components/AppInfos/AppInfos";
const { version: appVersion } = require("../package.json");

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
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
        data: map
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
      console.log({ map });
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
    const { data: table, repos } = this.state;
    if (table && table.length > 0) {
      return (
        <div className="App">
          <header className="App-header">
            <AppVersionTable data={table} />
          </header>
          <div className="App-body">
            {repos.map(repo =>
              repo ? <AppInfos key={repo.name} values={repo} /> : null
            )}
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
