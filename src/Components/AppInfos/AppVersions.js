import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@material-ui/core";

class AppVersions extends React.Component {
  render() {
    const { app } = this.props;

    return (
      <ListItem>
        {!!app
          ? app.environements.map(env => (
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
  app: PropTypes.object.isRequired
};

export default AppVersions;
