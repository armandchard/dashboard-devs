import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import Reviewer from "./Reviewer";
import {
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  avatar: {
    height: "28px",
    width: "28px"
  }
});

class PullRequests extends React.Component {
  render() {
    const { classes, pullRequests } = this.props;

    return (
      <div>
        <ListItem>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText
            primary={<span>{pullRequests.length} Pull Requests</span>}
          />
        </ListItem>
        <Collapse in={!!pullRequests} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {pullRequests.map(pr => (
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
      </div>
    );
  }
}

PullRequests.propTypes = {
  classes: PropTypes.object.isRequired,
  pullRequests: PropTypes.array.isRequired
};

export default withStyles(styles)(PullRequests);
