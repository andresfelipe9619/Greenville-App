import React, { useCallback, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik } from 'formik';
import { updateValidationSchema, initialValues } from './form-settings';
import { CustomSelect, CustomTextField } from './inputs';
import useStyles from './styles';
import { useAlertDispatch } from '../../context/Alert';
import { updateHouse } from '../../api';
import { useHouse } from '../../context/House';

const statuses = [
  { label: 'DRYWALL', value: 'drywall' },
  { label: 'PRIMEWALLS', value: 'primewalls' },
  { label: 'FINISH PAINTING', value: 'finish-painting' },
  { label: 'PAINT TOUCH UP', value: 'paint-touch-up' },
  { label: 'EXTERIOR PAINT', value: 'exterior-paint' },
];
export default function UpdateHomeForm(props) {
  const classes = useStyles();
  const { openAlert } = useAlertDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({});
  const [{ houseSelected }] = useHouse();
  console.log('houseSelected', houseSelected);

  console.log('props', props);

  useEffect(() => {
    const checkState = statuses.reduce((acc, status) => {
      if (!houseSelected) {
        acc[status.value] = false;
        return acc;
      }
      const found = (houseSelected.statuses || []).find(
        s => s.value === status.value
      );
      if (found) {
        acc[status.value] = true;
      } else {
        acc[status.value] = false;
      }
      return acc;
    }, {});
    setState(checkState);
  }, []);

  const handleChangeCheck = useCallback(event => {
    setState(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked,
    }));
  }, []);

  const onSuccess = useCallback(resetForm => {
    openAlert({
      variant: 'success',
      message: 'House Created Successfully!',
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
        initialValues={houseSelected}
        validationSchema={updateValidationSchema}
      >
        {formikProps => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
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
                Update House
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
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h2">
                      Files
                    </Typography>
                    <Link href="#">Link to Documents!</Link>
                    <Button
                      disabled={isLoading}
                      className={classes.button}
                      variant="outlined"
                      color="primary"
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h2">
                      House Status
                    </Typography>
                    <FormControl
                      required
                      component="fieldset"
                      className={classes.formControl}
                    >
                      <FormGroup row>
                        {statuses.map(status => (
                          <FormControlLabel
                            key={status.value}
                            control={
                              <Checkbox
                                checked={state[status.value] || false}
                                onChange={handleChangeCheck}
                                name={status.value}
                              />
                            }
                            label={status.label}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Divider variant="middle" />

                  <Grid item xs={12}>
                    <Typography variant="h5" component="h2" paragraph>
                      Update Process...
                    </Typography>
                    <CustomTextField
                      type="text"
                      name="newUpdate"
                      label="New Update"
                      multiline
                      rows={3}
                      rowsMax={6}
                      variant="outlined"
                      {...inputProps}
                    />
                    <Button
                      disabled={isLoading}
                      className={classes.button}
                      variant="outlined"
                      color="primary"
                    >
                      Attachments
                    </Button>
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
                      SAVE CHANGES
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
