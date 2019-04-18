import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import CallSplit from "@material-ui/icons/CallSplit";

class AppVersions extends React.Component {
  render() {
    const { branches } = this.props;

    return !!branches && branches.length > 0 ? (
      <ListItem>
        <ListItemIcon>
          <CallSplit />
        </ListItemIcon>
        <ListItemText>{branches.length} Active branches</ListItemText>
      </ListItem>
    ) : null;
  }
}

AppVersions.propTypes = {
  branches: PropTypes.array
};

export default AppVersions;
