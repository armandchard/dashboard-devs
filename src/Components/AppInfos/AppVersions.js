import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@material-ui/core";

class AppVersions extends React.Component {
  render() {
    const { envs } = this.props;

    return (
      <ListItem>
        {!!envs
          ? envs.map(env => (
              <ListItemText
                key={env.name}
                primary={env.name}
                secondary={env.version}
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

export default AppVersions;
