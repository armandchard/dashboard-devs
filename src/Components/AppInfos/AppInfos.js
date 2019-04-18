import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardHeader, List } from "@material-ui/core";
import PullRequests from "./PullRequests";
import AppVersions from "./AppVersions";
import AppBranches from "./AppBranches";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  }
});

class NestedList extends React.Component {
  render() {
    const { classes, app } = this.props;

    return (
      <Card className={classes.root}>
        <CardHeader title={app.appName} />
        <List>
          <AppVersions app={app} />
          <AppBranches branches={app.branches} />
          {!!app.pullRequests && app.pullRequests.length > 0 ? (
            <PullRequests pullRequests={app.pullRequests} />
          ) : null}
        </List>
      </Card>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

export default withStyles(styles)(NestedList);
