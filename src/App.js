import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";
import AppVersionTable from "./Components/AppVersionTable/AppVersionTable";
const { version: appVersion } = require("../package.json");

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const speedRef = firebase.database().ref("deployments");
    const versionRef = firebase.database().ref("version");

    speedRef.on("value", snap => {
      const values = snap.val();
      const map = Object.keys(values).map(key => {
        const environements = Object.keys(values[key]).map(environement => ({
          name: environement,
          version: values[key][environement].version
        }));
        return { appName: key, environements };
      });
      this.setState({
        data: map
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
    const table = this.state.data;
    if (table && table.length > 0) {
      return (
        <div className="App">
          <header className="App-header">
            <AppVersionTable data={table} />
          </header>
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
