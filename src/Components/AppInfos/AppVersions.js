import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemText, ListSubheader, List } from "@material-ui/core";
import { CheckCircle, NewReleases } from "@material-ui/icons";
import moment from "moment";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    paddingBottom: "0"
  },
  item: {
    paddingTop: "5px",
    paddingBottom: "0"
  },
  header: {
    textAlign: "left",
    height: "28px"
  },
  version: {
    color: "rgba(0, 0, 0, 0.54)"
  },
  ko: {
    color: "#ff5353"
  },
  ok: {
    color: "#00875a"
  }
});

class AppVersions extends React.Component {
  render() {
    const { envs, classes } = this.props;
    return !!envs
      ? envs.map(
          ({
            name,
            version,
            versions,
            timestamp,
            statusValue,
            statusTimestamp
          }) => (
            <List
              dense
              subheader={
                <ListSubheader className={classes.header}>
                  {statusValue ? (
                    <React.Fragment>
                      {/* {statusValue === 200 || statusValue === "200" ? (
                        <CheckCircle className={classes.ok} />
                      ) : (
                        <NewReleases className={classes.ko} />
                      )} */}
                      {name}{" "}
                      {statusTimestamp ? (
                        <span>
                          {statusValue === 200 || statusValue === "200"
                            ? "up"
                            : "down"}{" "}
                          from {moment(statusTimestamp).fromNow(true)}
                        </span>
                      ) : null}
                    </React.Fragment>
                  ) : (
                    name
                  )}
                </ListSubheader>
              }
              className={classes.root}
              key={name}
            >
              {versions ? (
                versions.map(env => (
                  <ListItem className={classes.item} key={env.timestamp}>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          {env.version} ({env.build_number}){" "}
                          {env.timestamp ? (
                            <span className={classes.version}>
                              deployed {moment(env.timestamp).fromNow()}
                            </span>
                          ) : null}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem className={classes.item}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        {version}{" "}
                        {timestamp ? (
                          <span className={classes.version}>
                            deployed {moment(timestamp).fromNow()}
                          </span>
                        ) : null}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              )}
            </List>
          )
        )
      : null;
    // return (
    //   <ListItem className={classes.root}>
    //     {!!envs
    //       ? envs.map(
    //           ({
    //             name,
    //             version,
    //             versions,
    //             timestamp,
    //             statusValue,
    //             statusTimestamp
    //           }) => (
    //             <ListItemText
    //               key={name}
    //               primary={
    //                 statusValue ? (
    //                   <span
    //                     className={
    //                       statusValue === 200 || statusValue === "200"
    //                         ? classes.ok
    //                         : classes.ko
    //                     }
    //                   >
    //                     {name}
    //                   </span>
    //                 ) : (
    //                   name
    //                 )
    //               }
    //               secondary={
    //                 versions ? (
    //                   versions.map(env => (
    //                     <span key={env.version}>
    //                       {env.version} ({env.build_number})
    //                       {env.timestamp ? (
    //                         <span className={classes.flex}>
    //                           {moment(env.timestamp).fromNow(true)}
    //                         </span>
    //                       ) : null}
    //                     </span>
    //                   ))
    //                 ) : (
    //                   <span>
    //                     {version}
    //                     {/* {statusValue}{" "}
    //                     {moment(statusTimestamp).fromNow(true)} */}
    //                     {timestamp ? (
    //                       <span className={classes.flex}>
    //                         {moment(timestamp).fromNow(true)}
    //                       </span>
    //                     ) : null}
    //                   </span>
    //                 )
    //               }
    //             />
    //           )
    //         )
    //       : null}
    //   </ListItem>
    // );
  }
}

AppVersions.propTypes = {
  envs: PropTypes.array.isRequired
};

export default withStyles(styles)(AppVersions);
