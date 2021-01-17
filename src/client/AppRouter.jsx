import React, { useContext } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Alert from './components/alert/Alert';
import CreateHomeForm from './components/form-page/CreateHomeForm';
import UpdateHomeForm from './components/form-page/UpdateHomeForm';
import AlertContext from './context/alert-context';
import Dashboard from './components/dashboard/Dashboard';

export default function AppRouter() {
  const { open, message, variant, closeAlert, openAlert } = useContext(
    AlertContext
  );
  return (
    <HashRouter>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Alert
          open={open}
          message={message}
          variant={variant}
          handleClose={closeAlert}
        />
        <Switch>
          <Route
            exact
            strict
            path="/"
            render={props => <Dashboard {...props} />}
          />
          <Route
            exact
            strict
            path="/create"
            render={props => (
              <CreateHomeForm openAlert={openAlert} {...props} />
            )}
          />
          <Route
            exact
            strict
            path="/update"
            render={props => (
              <UpdateHomeForm openAlert={openAlert} {...props} />
            )}
          />
        </Switch>
      </Container>
    </HashRouter>
  );
}
