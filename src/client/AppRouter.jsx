import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Alert from './components/alert/Alert';
import CreateHomeForm from './components/form-page/CreateHomeForm';
import UpdateHomeForm from './components/form-page/UpdateHomeForm';
import Dashboard from './components/dashboard/Dashboard';

export default function AppRouter() {
  return (
    <HashRouter>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Alert />
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
            render={props => <CreateHomeForm {...props} />}
          />
          <Route
            exact
            strict
            path="/update/:houseId"
            render={props => <UpdateHomeForm {...props} />}
          />
        </Switch>
      </Container>
    </HashRouter>
  );
}
