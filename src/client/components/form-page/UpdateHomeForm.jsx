import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik } from 'formik';
import Dropzone from '../dropzone/Dropzone';
import server from '../../utils/server';
import { validationSchema, testValues as initialValues } from './form-settings';
import { CustomSelect, CustomTextField } from './inputs';
import { getFile } from '../utils';

const { serverFunctions } = server;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function UpdateHomeForm(props) {
  const classes = useStyles();
  const { openAlert } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { createHouse } = serverFunctions;
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChangeCheck = event => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter(v => v).length !== 2;

  const onSuccess = useCallback(resetForm => {
    setIsSuccess(true);
    openAlert({
      variant: 'success',
      message: 'Formulario Enviado Satisfactoriamente',
    });
    setTimeout(() => {
      setIsSuccess(false);
      resetForm(initialValues);
    }, 5000);
  }, []);

  const onError = useCallback(e => {
    openAlert({
      variant: 'error',
      message: 'Algo Salio Mal Enviando El Formulario',
    });
    console.error('Error trying to sumbit form:', e);
  }, []);

  const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
    const { houseFile, ...formData } = values;
    try {
      setSubmitting(true);
      setIsLoading(true);
      console.log('houseFile', houseFile);
      // const fileString = await getFile(houseFile);
      // const fileFromDrive = await createHouseFile(houseId, fileString);
      const house = JSON.stringify({
        ...formData,
        // houseFile: fileFromDrive.url,
      });
      console.log('HOUSE', house);
      //   await createHouse(house);
      onSuccess(resetForm);
    } catch (e) {
      onError(e);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  }, []);

  return (
    <div>
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {formikProps => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          } = formikProps;
          const inputProps = {
            classes,
            errors,
            touched,
            values,
            handleChange,
            handleBlur,
            isLoading,
          };
          return (
            <Paper className={classes.paper}>
              <Typography variant="h3" gutterBottom>
                Create New House
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={8}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      name="lastName"
                      label="Last Name"
                      {...inputProps}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomSelect name="model" label="Model" {...inputProps} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomSelect
                      name="builder"
                      label="Builder"
                      {...inputProps}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomSelect name="zone" label="Zone" {...inputProps} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      type="number"
                      name="drywallFootage"
                      label="Drywall Footage"
                      {...inputProps}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      type="number"
                      name="footHouse"
                      label="Foot House"
                      {...inputProps}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      type="number"
                      name="footGarage"
                      label="Foot Garage"
                      {...inputProps}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      type="number"
                      name="footExterior"
                      label="Foot Exterior"
                      {...inputProps}
                    />
                  </Grid>

                  <Divider variant="middle" />
                  <Grid
                    container
                    item
                    spacing={8}
                    xs={12}
                    alignItems="center"
                    justify="center"
                  >
                    <Grid item xs={12}>
                      <Typography variant="h4">HOUSE STATUS </Typography>
                      <FormControl
                        required
                        error={error}
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel component="legend">Pick two</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={gilad}
                                onChange={handleChangeCheck}
                                name="gilad"
                              />
                            }
                            label="Gilad Gray"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={jason}
                                onChange={handleChangeCheck}
                                name="jason"
                              />
                            }
                            label="Jason Killian"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={antoine}
                                onChange={handleChangeCheck}
                                name="antoine"
                              />
                            }
                            label="Antoine Llorca"
                          />
                        </FormGroup>
                        <FormHelperText>
                          You can display an error
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Divider variant="middle" />

                    <Grid item xs={12}>
                      <Typography>Update Process...</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        disabled={isLoading}
                        className={classes.button}
                        variant="contained"
                        type="submit"
                        color="primary"
                      >
                        Enviar
                      </Button>
                      {isSuccess && (
                        <Typography variant="h4">
                          The house was created!
                        </Typography>
                      )}
                      {isLoading && <LinearProgress />}
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          );
        }}
      </Formik>
    </div>
  );
}
