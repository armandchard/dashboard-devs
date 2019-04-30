import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardHeader, List, Avatar } from "@material-ui/core";
import PullRequests from "./PullRequests";
import AppVersions from "./AppVersions";
import AppBranches from "./AppBranches";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    margin: "5px",
    overflowX: "auto"
  },
  title: {
    color: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  }
});

export const colorsDefinition = {
  "#20d0b0": "#EE38AA", // tealish
  "#ff80a1": "#11C0D8", // carnation-pink
  "#ee38aa": "#11C0D8", // medium-pink
  "#f5557a": "#11C0D8", // warm-pink
  "#11c0d8": "#EE38AA", // turquoise-blue
  "#8ca0b3": "#EE38AA", // bluey-gray
  "#adbac5": "#EE38AA", // bluey-gray-two
  "#bbcad2": "#EE38AA", // cloudy-blue
  "#11C0D8": "#EE38AA", // light-blue-gray
  "#EE38AA": "#11C0D8" // gray 300
};

class AppInfos extends React.Component {
  transform(value) {
    const { getHashCode } = this;
    if (value) {
      const colors = Object.keys(colorsDefinition);
      const hash = getHashCode(value);
      const halfLength = value.length / 2;
      const charAt = halfLength < hash.length ? halfLength : 0;
      const index = parseInt(hash.charAt(charAt), 10);
      let color = colors[index - 1 || 0];
      if (!color) {
        color = "#bbcad2";
      }
      return color;
    } else {
      return "#bbcad2";
    }
  }

  getHashCode(str) {
    let hash = 1;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash.toString();
  }

  render() {
    const {
      classes,
      app: { name, envs, branches, logo, pullRequests }
    } = this.props;

    const prs = pullRequests
      ? pullRequests.filter(pr => !pr.title.startsWith("[WIP]"))
      : [];

    return (
      <Card className={classes.root}>
        <CardHeader
          title={name}
          className={classes.title}
          avatar={
            <Avatar
              aria-label={name}
              src={
                logo
                  ? logo.href
                  : prs.length > 0
                  ? prs[0].source.repository.links.avatar.href
                  : ""
              }
            />
          }
        />
        <List>
          <AppVersions envs={envs} />
          <AppBranches branches={branches} />
          {!!prs && prs.length > 0 ? <PullRequests pullRequests={prs} /> : null}
        </List>
      </Card>
    );
  }
}

AppInfos.propTypes = {
  classes: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

export default withStyles(styles)(AppInfos);
