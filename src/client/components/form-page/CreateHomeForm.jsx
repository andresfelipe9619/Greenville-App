import React, { useCallback, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik } from 'formik';
import useStyles from './styles';
import { createValidationSchema, initialValues } from './form-settings';
import API from '../../api';
import { useAlertDispatch } from '../../context/Alert';
import { useHouseDispatch } from '../../context/House';
import HomeFields from './HomeFields';
import useHouseForm from '../../hooks/useHouseForm';
import FilesFields from './FilesFields';

export default function CreateHomeForm() {
  const classes = useStyles();
  const HouseContext = useHouseDispatch();
  const { openAlert } = useAlertDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const dependencies = useHouseForm();

  const onSuccess = useCallback(({ data, resetForm }) => {
    openAlert({
      variant: 'success',
      message: `House #${data.idHouse} created successfully!`,
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

      const house = JSON.stringify(formData);
      console.log('HOUSE', house);
      const { data } = await API.createHouse(house);
      console.log('data', data);
      HouseContext.addHouse(data);
      if (houseFile) {
        const fileFromDrive = await API.uploadHouseFiles(data.idHouse, [
          {
            name: 'Custom FILE :D',
            base64: houseFile,
          },
        ]);
        console.log('fileFromDrive', fileFromDrive);
        if (!fileFromDrive.folder) {
          throw new Error(
            'Somenthing went wrong creating files. It is not returning any folder.'
          );
        }
        API.updateHouse(
          JSON.stringify({ files: fileFromDrive.folder, idHouse: data.idHouse })
        );
      }
      onSuccess({ resetForm, data });
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
                <Grid container spacing={4}>
                  <HomeFields
                    inputProps={inputProps}
                    dependencies={dependencies}
                  />
                  <Divider variant="middle" />
                  <FilesFields
                    {...{ values, isLoading, setFieldValue }}
                    filesGroups={dependencies.filesGroups}
                  />
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
