import React, { useCallback, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik } from 'formik';
import Dropzone from '../dropzone/Dropzone';
import server from '../../utils/server';
import useStyles from './styles';
import { validationSchema, initialValues } from './form-settings';
import { getFile } from '../utils';

export default function FormPage(props) {
  const classes = useStyles();
  const { openAlert } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { createHouseFile } = server;

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
                  <Grid item xs={12} sm={12}>
                    <CustomTextField
                      name="address"
                      label="Address"
                      {...inputProps}
                    />
                  </Grid>
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
                      <InputLabel htmlFor="houseFile">
                        Files to Upload
                      </InputLabel>
                    </Grid>
                    <Divider variant="middle" />
                    <Grid item xs={8}>
                      <Dropzone
                        field={'houseFile'}
                        disabled={isLoading}
                        setFieldValue={setFieldValue}
                        values={values}
                        // accept={SUPPORTED_FORMATS}
                        error={!!(touched.houseFile && errors.houseFile)}
                        helperText={touched.houseFile && errors.houseFile}
                      />
                    </Grid>
                  </Grid>
                  <Divider variant="middle" />
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
              </form>
            </Paper>
          );
        }}
      </Formik>
    </div>
  );
}

const CustomTextField = ({
  values,
  name,
  label,
  type,
  touched,
  errors,
  isLoading,
  handleChange,
  handleBlur,
}) => (
  <TextField
    value={values[name]}
    onChange={handleChange}
    disabled={isLoading}
    onBlur={handleBlur}
    helperText={touched[name] && errors[name]}
    error={!!(touched[name] && errors[name])}
    required
    type={type}
    id={name}
    name={name}
    label={label}
    fullWidth
  />
);

const CustomSelect = ({
  name,
  label,
  classes,
  errors,
  touched,
  values,
  handleChange,
  isLoading,
}) => (
  <FormControl
    className={classes.formControl}
    fullWidth
    error={!!(touched[name] && errors[name])}
  >
    <InputLabel htmlFor={name}>{label}</InputLabel>
    <Select
      required
      fullWidth
      classes={{
        root: classes.root,
        select: classes.select,
      }}
      value={values[name]}
      onChange={handleChange}
      disabled={isLoading}
      inputProps={{
        name,
        id: name,
      }}
    >
      <MenuItem value={'A'}>A</MenuItem>
      <MenuItem value={'B'}>B</MenuItem>
      <MenuItem value={'C'}>C</MenuItem>
    </Select>
    <FormHelperText>
      {touched.tematica_ponencia && errors.tematica_ponencia}
    </FormHelperText>
  </FormControl>
);
