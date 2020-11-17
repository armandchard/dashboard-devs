import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    margin: "5px",
    overflowX: "auto"
  },
  link: {
    textDecoration: "none"
  },
  avatarLink: {
    cursor: "pointer"
  },
  title: {
    padding: "8px 16px 0",
    color: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  },
  list: {
    paddingTop: 0
  }
});

export const colorsDefinition = {
  "#20d0b0": "#EE38AA", // tealish
  "#ff80a1": "#11C0D8", // carnation-pink
  "#ee38aa": "#11C0D8", // medium-pink
  "#f5557a": "#11C0D8", // warm-pink
  "#11c0d8": "#EE38AA", // turquoise-blue
  "#8ca0b3": "#EE38AA", // bluey-gray
  "#adbac5": "#EE38AA", // bluey-gray-two
  "#bbcad2": "#EE38AA", // cloudy-blue
  "#11C0D8": "#EE38AA", // light-blue-gray
  "#EE38AA": "#11C0D8" // gray 300
};

class AppStatCard extends React.Component {
  render() {
    const { classes, name, data } = this.props;

    return (
      <Card className={classes.root}>
        <CardHeader title={name} className={classes.title} />
        <List className={classes.list}>
          {data
            ? data.map(item => {
                return (
                  <ListItem className={classes.item} key={item.name}>
                    <ListItemText
                      primary={
                        item.data ? (
                          <React.Fragment>
                            {item.data.transactionsCount}&nbsp;{item.name}&nbsp;
                            {item.data.transactionsAmount / 100} €
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            {item.count ? (
                              <span className={classes.version}>
                                {item.count}
                              </span>
                            ) : null}
                            &nbsp;
                            {item.name}
                          </React.Fragment>
                        )
                      }
                    />
                  </ListItem>
                );
              })
            : null}
        </List>
      </Card>
    );
  }
}

AppStatCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppStatCard);
