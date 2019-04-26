import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import { AssignmentTurnedIn } from "@material-ui/icons";

const styles = theme => ({
  root: {
    display: "inline-block",
    position: "relative",
    height: "28px",
    width: "28px"
  },
  avatar: {
    height: "28px",
    width: "28px"
  },
  approved: {
    position: "absolute",
    height: "12px",
    width: "12px",
    right: "0px",
    top: "0px"
  },
  approvedIconOuter: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(255, 255, 255)",
    boxSizing: "border-box",
    display: "flex",
    height: "100%",
    width: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    padding: "2px"
  },
  approvedIconInner: {
    backgroundColor: "green",
    alignItems: "center",
    display: "flex",
    height: "100%",
    width: "100%",
    borderRadius: "50%",
    overflow: "hidden"
  }
});

class Reviewer extends React.Component {
  render() {
    const { classes, reviewer } = this.props;

    return (
      <div className={classes.root}>
        <Badge badgeContent={reviewer}>
          <AssignmentTurnedIn />
        </Badge>
        {/* <Avatar
          key={reviewer.user.account_id}
          alt={reviewer.user.display_name}
          src={reviewer.user.links.avatar.href}
          className={classes.avatar}
        />
        {reviewer.approved ? (
          <span className={classes.approved}>
            <span className={classes.approvedIconOuter}>
              <span className={classes.approvedIconInner} />
            </span>
          </span>
        ) : null} */}
      </div>
    );
  }
}

Reviewer.propTypes = {
  classes: PropTypes.object.isRequired,
  reviewer: PropTypes.object.isRequired
};

export default withStyles(styles)(Reviewer);
