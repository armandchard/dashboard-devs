import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const speedRef = firebase.database().ref("deployments");
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
  }

  render() {
    const table = this.state.data;
    if (table && table.length > 0) {
      return (
        <div className="App">
          <header className="App-header">
            <table>
              <tr>
                <th>App</th>
                <th>Env</th>
                <th>Version</th>
              </tr>
              {table.map(app => (
                <tr key={app.appName}>
                  <td>{app.appName}</td>
                  <td colSpan="2">
                    {app.environements.map(env => (
                      <tr>
                        <td>{env.name}</td>
                        <td>{env.version}</td>
                      </tr>
                    ))}
                  </td>
                </tr>
              ))}
            </table>
            {/* <h1>{this.state.data["api-b2c"].preprod.version}</h1> */}
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
