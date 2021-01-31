import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import InputAdornment from '@material-ui/core/InputAdornment';
import useStyles from './styles';
import server from '../../utils/server';
import { useHouse } from '../../context/House';

const { serverFunctions } = server;
const { getHouses } = serverFunctions;

export default function Navbar() {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = !!anchorEl;

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            className={classes.title}
            onClick={() => history.push('/')}
            variant="h6"
            noWrap
          >
            HR Drywall
          </Typography>
          <SearchBox classes={classes} />
          <div className={classes.grow} />
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<HomeIcon />}
            onClick={() => history.push('/create')}
          >
            New House
          </Button>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}

export function SearchBox({ classes }) {
  const history = useHistory();
  const [{ houses }, { setHouses, setHouseSelected }] = useHouse();
  const fetchHouses = async () => {
    const response = await getHouses();
    setHouses(response);
  };

  const handleChange = (_, value, reason) => {
    console.log('{e,reason}', { value, reason });
    if (reason === 'select-option') {
      const id = value.idhouse;
      setHouseSelected(value);
      history.push(`/update/${id}`);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  return (
    <Autocomplete
      id="combo-box-demo"
      className={classes.search}
      options={houses}
      getOptionLabel={option => option.address}
      onChange={handleChange}
      style={{ width: 300 }}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
