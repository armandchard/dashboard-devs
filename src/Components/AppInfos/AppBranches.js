import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import { ExpandLess, ExpandMore, CallSplit } from "@material-ui/icons";

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  avatar: {
    height: "28px",
    width: "28px"
  },
  margin: {
    margin: theme.spacing.unit * 2,
    color: "rgba(0, 0, 0, 0.54)"
  },
  textColor: {
    color: "rgba(0, 0, 0, 0.54)"
  }
});
class AppVersions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { branches, classes } = this.props;

    return !!branches && branches.length > 0 ? (
      <div>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <CallSplit />
          </ListItemIcon>
          <ListItemText inset>{branches.length} Active branches</ListItemText>
          {this.state.open ? (
            <ExpandLess className={classes.textColor} />
          ) : (
            <ExpandMore className={classes.textColor} />
          )}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {branches.map((branch, index) => (
              <ListItem
                key={`${branch.name}-${index}`}
                className={classes.nested}
              >
                <ListItemText inset primary={branch.name} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </div>
    ) : null;
  }
}

AppVersions.propTypes = {
  branches: PropTypes.array
};

export default withStyles(styles)(AppVersions);
