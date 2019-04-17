import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Reviewer from "./Reviewer";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  reviewer: {
    display: "inline-block",
    position: "relative",
    height: "28px",
    width: "28px"
  },
  avatar: {
    height: "28px",
    width: "28px"
  }
});

class NestedList extends React.Component {
  render() {
    const { classes, values } = this.props;

    return (
      <Paper className={classes.root}>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div">{values.name}</ListSubheader>
          }
        >
          <ListItem>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText inset primary="Pull Requests" />
          </ListItem>
          <Collapse in={!!values.pullRequests} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {values.pullRequests.map(pr => (
                <ListItem key={pr.id} className={classes.nested}>
                  <Avatar
                    alt={pr.author.display_name}
                    src={pr.author.links.avatar.href}
                    className={classes.avatar}
                  />
                  <ListItemText
                    inset
                    primary={pr.title}
                    secondary={
                      <span>
                        {pr.source.branch.name} -> {pr.destination.branch.name}
                      </span>
                    }
                  />
                  {pr.participants
                    .sort(r => r.approved)
                    .slice(0, 2)
                    .map(reviewer => (
                      <Reviewer
                        key={reviewer.user.account_id}
                        reviewer={reviewer}
                      />
                    ))}
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Paper>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired
};

export default withStyles(styles)(NestedList);
