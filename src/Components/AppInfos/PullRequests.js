import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import AssignmentTurnedInOutlined from "@material-ui/icons/AssignmentTurnedInOutlined";
import {
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

const styles = theme => ({
  nested: {
    paddingTop: 0,
    paddingLeft: theme.spacing.unit * 3
  },
  avatar: {
    height: "28px",
    width: "28px"
  },
  margin: {
    marginRight: theme.spacing.unit,
    color: "rgba(0, 0, 0, 0.54)"
  },
  textColor: {
    color: "rgba(0, 0, 0, 0.54)"
  }
});

class PullRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
    this.onPrClick = this.onPrClick.bind(this);
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  onPrClick = pr => {
    window.open(pr.links.html.href, "_blank");
  };

  render() {
    const { classes, pullRequests } = this.props;

    return (
      <div>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText
            inset
            primary={<span>{pullRequests.length} Pull Requests</span>}
          />
          {this.state.open ? (
            <ExpandLess className={classes.textColor} />
          ) : (
            <ExpandMore className={classes.textColor} />
          )}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {pullRequests.map(pr => {
              const approveCount = pr.participants
                ? pr.participants.filter(p => p.approved).length
                : 0;
              return (
                <ListItem
                  key={pr.id}
                  className={classes.nested}
                  button
                  onClick={() => this.onPrClick(pr)}
                >
                  <Tooltip title={pr.author.display_name}>
                    <Avatar
                      alt={pr.author.display_name}
                      src={pr.author.links.avatar.href}
                      className={classes.avatar}
                    />
                  </Tooltip>
                  <ListItemText
                    inset
                    primary={pr.title}
                    secondary={
                      <span>
                        {pr.source.branch.name} -> {pr.destination.branch.name}
                      </span>
                    }
                  />
                  {approveCount > 0 ? (
                    <Tooltip
                      title={
                        <span>
                          {`${approveCount}
                          ${approveCount > 1 ? "approves" : "approve"}`}
                        </span>
                      }
                    >
                      <Badge
                        className={classes.margin}
                        badgeContent={
                          pr.participants
                            ? pr.participants.filter(p => p.approved).length
                            : 0
                        }
                        color="secondary"
                      >
                        <AssignmentTurnedInOutlined />
                      </Badge>
                    </Tooltip>
                  ) : null}
                </ListItem>
              );
            })}
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
