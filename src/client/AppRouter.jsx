import React, { useContext } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Alert from './components/alert/Alert';
import FormPage from './components/form-page/FormPage';
import AlertContext from './context/alert-context';

export default function AppRouter() {
  const { open, message, variant, closeAlert, openAlert } = useContext(
    AlertContext
  );
  return (
    <BrowserRouter>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Alert
          open={open}
          message={message}
          variant={variant}
          handleClose={closeAlert}
        />
        <FormPage openAlert={openAlert} />
      </Container>
    </BrowserRouter>
  );
}
