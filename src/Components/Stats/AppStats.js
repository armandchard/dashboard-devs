import React, { Component } from "react";
import logo from "../../transparent.gif";
import "../../App.css";
import * as firebase from "firebase";
import PropTypes from "prop-types";
import AppStatCard from "./AppStatCard";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

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

class AppRepos extends Component {
  constructor() {
    super();
    this.state = {
      repos: []
    };
  }

  componentDidMount() {
    const reposRef = firebase.database().ref("repositories");

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
  }

  render() {
    const { repos } = this.state;
    const { classes } = this.props;
    const data = {
      okr: [
        { name: "Users flippés", count: 3796 },
        { name: "NAC issus des listes d'attente", count: 87 }
      ],
      pumpkinCb: [
        { name: "CB Pumpkin", count: 390 },
        { name: "NAC", count: 158 },
        { name: "MAC en février", count: 149 },
        {
          name: "cashback pour",
          data: { transactionsCount: 1, transactionsAmount: 178 }
        }
      ],
      p2p: [
        { name: "MAU en février", count: 189130 },
        { name: "Prévision MAU au 25 février", count: 209287 },
        { name: "Activations", count: 779 },
        { name: "Organiques", count: 441 },
        { name: "Payantes", count: 338 }
      ],
      legalEntity: [
        { name: "Paye ta blague", count: 49, region: "Paris IDF" },
        { name: "UDDA", count: 30, region: "Paris IDF" },
        { name: "ADISP Paris 1", count: 17, region: "Paris IDF" }
      ]
    };

    if (repos && repos.length > 0) {
      return (
        <div className="App">
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" className={classes.grow}>
                Pumpkin Daily Report
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="App-body">
            <AppStatCard name="Suivi OKR 2020" data={data.okr}></AppStatCard>
            <AppStatCard name="CB Pumpkin" data={data.pumpkinCb}></AppStatCard>
            <AppStatCard name="Pumpkin P2P" data={data.p2p}></AppStatCard>
            <AppStatCard
              name="Les meilleures Legal Entity"
              data={data.legalEntity}
            ></AppStatCard>
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

AppRepos.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(styles)(AppRepos);
