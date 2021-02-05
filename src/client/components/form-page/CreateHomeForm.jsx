import React, { useCallback, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik } from 'formik';
import Dropzone from '../dropzone/Dropzone';
import useStyles from './styles';
import {
  createValidationSchema,
  testValues as initialValues,
} from './form-settings';
import { CustomSelect, CustomTextField } from './inputs';
import { getFile } from '../utils';
import API from '../../api';
import { useAlertDispatch } from '../../context/Alert';
import { useHouseDispatch } from '../../context/House';

export default function CreateHomeForm() {
  const classes = useStyles();
  const HouseContext = useHouseDispatch();
  const { openAlert } = useAlertDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSuccess = useCallback(({ result, resetForm }) => {
    openAlert({
      variant: 'success',
      message: `House #${result.idHouse} created successfully!`,
    });
    resetForm(initialValues);
  }, []);

  const onError = useCallback(e => {
    const message = 'Something went wrong creating the house';
    openAlert({
      message,
      variant: 'error',
    });
    console.error(`${message}: `, e);
  }, []);

  const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
    const { houseFile, ...formData } = values;
    try {
      setSubmitting(true);
      setIsLoading(true);
      console.log('houseFile', houseFile);
      const fileString = await getFile(houseFile);
      const house = JSON.stringify(formData);
      console.log('HOUSE', house);
      HouseContext.addHouse(formData);
      const result = await API.createHouse(house);
      console.log('result', result);
      const fileFromDrive = await API.uploadHouseFiles(result.idHouse, [
        {
          name: 'Custom FILE :D',
          base64: fileString,
        },
      ]);
      console.log('fileFromDrive', fileFromDrive);
      API.updateHouse(
        JSON.stringify({ files: fileFromDrive, idHouse: result.idHouse })
      );
      onSuccess({ resetForm, result });
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
        validationSchema={createValidationSchema}
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
              <Typography component="h1" variant="h4" gutterBottom>
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
