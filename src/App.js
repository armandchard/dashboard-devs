import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";
import AppInfos from "./Components/AppInfos/AppInfos";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const { version: appVersion } = require("../package.json");

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

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
          envs,
          logo: values[key].logo
        };
      });
      this.setState({
        repos: map
      });
    });

    versionRef.on("value", snap => {
      const version = snap.val();
      console.log(version, appVersion);
      if (version !== appVersion) {
        // eslint-disable-next-line no-restricted-globals
        location.reload(true);
      }
    });
  }

  render() {
    const { repos } = this.state;
    const { classes } = this.props;

    if (repos && repos.length > 0) {
      return (
        <div className="App">
          <AppBar position="static" color="primary">
            <Toolbar>
              {/* <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton> */}
              <h1 className={classes.grow}>Dashboard Devs Pumpkin</h1>
            </Toolbar>
          </AppBar>
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

export default withStyles(styles)(App);
