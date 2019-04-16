import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  lastRow: {
    borderBottom: "none"
  },
  envCell: {
    paddingRight: "0 !important"
  }
});

function AppVersionTable(props) {
  const { classes, data } = props;

  return data ? (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Application</TableCell>
            <TableCell align="right">Environnement</TableCell>
            <TableCell align="right">Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(value => (
            <TableRow key={value.appName} rowSpan={value.environements.length}>
              <TableCell scope="row">{value.appName}</TableCell>
              <TableCell colSpan="2" scope="row" className={classes.envCell}>
                <Table>
                  <TableBody>
                    {value.environements.map((env, index) =>
                      env ? (
                        <TableRow key={env.name}>
                          <TableCell
                            align="right"
                            className={
                              index === value.environements.length - 1
                                ? classes.lastRow
                                : ""
                            }
                          >
                            {env.name}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={
                              index === value.environements.length - 1
                                ? classes.lastRow
                                : ""
                            }
                          >
                            {env.version}
                          </TableCell>
                        </TableRow>
                      ) : null
                    )}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  ) : null;
}

AppVersionTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppVersionTable);
