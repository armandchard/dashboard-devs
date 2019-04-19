import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";
import AppInfos from "./Components/AppInfos/AppInfos";
import PropTypes from "prop-types";
const { version: appVersion } = require("../package.json");

class App extends Component {
  constructor() {
    super();
    this.state = {
      repos: []
    };
  }

  componentDidMount() {
    const reposRef = firebase.database().ref("repositories");
    const versionRef = firebase.database().ref("version");

    reposRef.on("value", snap => {
      const values = snap.val();
      const map = Object.keys(values).map(key => {
        let prs = [];
        let branches = [];
        let envs = [];
        if (values[key].pull_requests) {
          const val = Object.values(values[key].pull_requests);
          prs.push(...val);
        }
        if (values[key].branches) {
          const branch = Object.values(values[key].branches);
          branches.push(...branch);
        }
        if (values[key].environments) {
          const environements = Object.keys(values[key].environments).map(
            environment => ({
              name: environment,
              version: values[key].environments[environment].version
            })
          );
          envs.push(...environements);
        }
        return {
          name: key,
          pullRequests: prs,
          branches,
          envs
        };
      });
      this.setState({
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
    const { repos } = this.state;

    if (repos && repos.length > 0) {
      return (
        <div className="App">
          <header className="App-header">
            <h1>Dashboard Devs Pumpkin</h1>
          </header>
          <div className="App-body">
            {repos && repos.length
              ? repos
                  .sort((a, b) => b.pullRequests.length - a.pullRequests.length)
                  .map(repo =>
                    repo ? <AppInfos key={repo.name} app={repo} /> : null
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

App.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object)
};

export default App;
