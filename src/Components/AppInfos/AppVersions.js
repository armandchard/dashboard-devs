import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemText } from "@material-ui/core";
import moment from "moment";

const styles = theme => ({
  root: { paddingTop: 0, paddingBottom: 0 },
  flex: {
    display: "flex"
  }
});

// Can customize display from now
// moment.updateLocale("en", {
//   relativeTime: {
//     future: "in %s",
//     past: "%s ago",
//     s: "a few seconds",
//     ss: "%d seconds",
//     m: "a minute",
//     mm: "%d minutes",
//     h: "an hour",
//     hh: "%d hours",
//     d: "a day",
//     dd: "%d days",
//     M: "a month",
//     MM: "%d months",
//     y: "a year",
//     yy: "%d years"
//   }
// });

class AppVersions extends React.Component {
  render() {
    const { envs, classes } = this.props;
    console.log(envs);
    return (
      <ListItem className={classes.root}>
        {!!envs
          ? envs.map(({ name, version, versions, timestamp }) => (
              <ListItemText
                key={name}
                primary={name}
                secondary={
                  versions ? (
                    versions.map(env => (
                      <span key={env.version}>
                        {env.version}({env.build_number})
                        {env.timestamp ? (
                          <span className={classes.flex}>
                            {moment(env.timestamp).fromNow(true)}
                          </span>
                        ) : null}
                      </span>
                    ))
                  ) : (
                    <span>
                      {version}
                      {timestamp ? (
                        <span className={classes.flex}>
                          {moment(timestamp).fromNow(true)}
                        </span>
                      ) : null}
                    </span>
                  )
                }
              />
            ))
          : null}
      </ListItem>
    );
  }
}

AppVersions.propTypes = {
  envs: PropTypes.array.isRequired
};

export default withStyles(styles)(AppVersions);
