import React, { Component } from "react";
import logo from "./transparent.gif";
import "./App.css";
import * as firebase from "firebase";
import AppInfos from "./Components/AppInfos/AppInfos";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import AcUnit from "@material-ui/icons/AcUnit";
import Whatshot from "@material-ui/icons/Whatshot";
import LocalDrink from "@material-ui/icons/LocalDrink";

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

  async componentWillMount() {
    const versionRef = firebase.database().ref("version");

    await versionRef.on("value", async snap => {
      const version = snap.val();
      if (version !== appVersion) {
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      }
    });
  }

  componentDidMount() {
    const reposRef = firebase.database().ref("repositories");
    const sensorsRef = firebase.database().ref("sensors");

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
              name: values[key].environments[environment].name || environment,
              version: values[key].environments[environment].version,
              statusValue: values[key].environments[environment].status_value,
              statusTimestamp:
                values[key].environments[environment].status_timestamp,
              versions: values[key].environments[environment].versions
                ? Object.values(values[key].environments[environment].versions)
                : null,
              timestamp: values[key].environments[environment].timestamp
            })
          );
          envs.push(...environements);
        }
        return {
          name: key,
          pullRequests: prs,
          branches,
          envs,
          logo: values[key].logo,
          url: values[key].url,
          appCenterUrl: values[key].app_center_url
        };
      });
      this.setState({
        repos: map
      });
    });

    sensorsRef.on("value", snap => {
      const sensors = snap.val();
      this.setState({ ...this.state, ...sensors });
    });
  }

  render() {
    const { repos, humidity, temperature } = this.state;
    const { classes } = this.props;

    if (repos && repos.length > 0) {
      return (
        <div className="App">
          <AppBar position="static" color="primary">
            <Toolbar>
              <h1 className={classes.grow}>Dashboard Devs Pumpkin</h1>
              <IconButton color="inherit">
                <Badge
                  className="badge"
                  badgeContent={`${temperature}°`}
                  color="secondary"
                >
                  {temperature > 19 ? <Whatshot /> : <AcUnit />}
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge
                  className="badge"
                  badgeContent={`${humidity}%`}
                  color="secondary"
                >
                  <LocalDrink />
                </Badge>
              </IconButton>
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
