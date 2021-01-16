import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withRouter } from 'react-router-dom';
import useStyles from './styles';

function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.toolBar}>
            <img
              src="http://www.guisason.com/desercion/DESERSION_cabecera.png"
              alt="header"
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(React.memo(Navbar));
