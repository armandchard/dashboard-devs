import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardHeader, List, Avatar } from "@material-ui/core";
import AppVersions from "./AppVersions";

const styles = (theme) => ({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    margin: "5px",
    minWidth: 300,
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    overflowX: "auto",
  },
  link: {
    textDecoration: "none",
  },
  avatarLink: {
    cursor: "pointer",
  },
  title: {
    padding: "8px 16px 0",
    color: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
  list: {
    paddingTop: 0,
  },
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
  "#EE38AA": "#11C0D8", // gray 300
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

  onAvatarClick(url) {
    if (url) {
      window.open(url, "_blank");
    }
  }

  render() {
    const {
      classes,
      app: { name, envs, logo, pullRequests, url, appCenterUrl },
    } = this.props;

    const prs = pullRequests
      ? pullRequests.filter((pr) => !pr.title.startsWith("[WIP]"))
      : [];

    return (
      <Card className={classes.root}>
        <CardHeader
          title={
            url ? (
              // eslint-disable-next-line react/jsx-no-target-blank
              <a href={url.href} target="_blank" className={classes.link}>
                {name}
              </a>
            ) : (
              name
            )
          }
          className={classes.title}
          avatar={
            <Avatar
              className={appCenterUrl ? classes.avatarLink : ""}
              onClick={() => this.onAvatarClick(appCenterUrl)}
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
        <List className={classes.list}>
          <AppVersions envs={envs} />
        </List>
      </Card>
    );
  }
}

AppInfos.propTypes = {
  classes: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppInfos);
