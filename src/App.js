import React, {
  Component
} from "react";
import "./App.css";
import * as firebase from "firebase";
import PropTypes from "prop-types";
import {
  withStyles
} from "@material-ui/core/styles";
import AppRepos from "./Components/AppInfos/AppRepos";
import AppStats from "./Components/Stats/AppStats";

const {
  version: appVersion
} = require("../package.json");

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
      id: 0,
      currentPage: {
        id: 1,
        component: AppRepos
      },
      pages: [{
          id: 0,
          component: AppRepos
        },
        {
          id: 1,
          component: AppStats
        }
        // {id: 2, component: AppRepos},
      ]
    };
  }

  componentDidMount() {
    // this.intervalID = setInterval(() => this.tick(), 10000);
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

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    const {
      id,
      pages
    } = this.state;
    const newId = id + 1 >= pages.length ? 0 : id + 1;
    this.setState({
      ...this.state,
      id: newId,
      currentPage: pages[newId]
    });
    console.log(this.state);
  }

  render() {
    return React.createElement(this.state.currentPage.component, {});
    // return <p className="App-clock">The time is {this.state.time}.</p>;

    // return <AppStats />;

    // if (repos && repos.length > 0) {
    //   return (
    //     <div className="App">
    //       <AppBar position="static" color="primary">
    //         <Toolbar>
    //           <h1 className={classes.grow}>Dashboard Devs Pumpkin</h1>
    //           <IconButton color="inherit">
    //             <Badge
    //               className="badge"
    //               badgeContent={`${temperature}°`}
    //               color="secondary"
    //             >
    //               {temperature > 19 ? <Whatshot /> : <AcUnit />}
    //             </Badge>
    //           </IconButton>
    //           <IconButton color="inherit">
    //             <Badge
    //               className="badge"
    //               badgeContent={`${humidity}%`}
    //               color="secondary"
    //             >
    //               <LocalDrink />
    //             </Badge>
    //           </IconButton>
    //         </Toolbar>
    //       </AppBar>
    //       <div className="App-body">
    //         {repos && repos.length
    //           ? repos
    //               .sort((a, b) => b.pullRequests.length - a.pullRequests.length)
    //               .map(repo =>
    //                 repo ? <AppInfos key={repo.name} app={repo} /> : null
    //               )
    //           : null}
    //       </div>
    //     </div>
    //   );
    // }
    // return (
    //   <div className="App">
    //     <header className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //     </header>
    //   </div>
    // );
  }
}

App.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(styles)(App);