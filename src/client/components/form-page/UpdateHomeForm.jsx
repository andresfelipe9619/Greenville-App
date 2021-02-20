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
import { getFile } from '../utils';
import API from '../../api';
import { useHouse, useHouseDispatch } from '../../context/House';

const statuses = [
  { label: 'DRYWALL', value: 'drywall' },
  { label: 'PRIMEWALLS', value: 'primewalls' },
  { label: 'FINISH PAINTING', value: 'finishPainting' },
  { label: 'PAINT TOUCH UP', value: 'paintTouchUp' },
  { label: 'EXTERIOR PAINT', value: 'exteriorPaint' },
];
export default function UpdateHomeForm({ history }) {
  const classes = useStyles();
  const HouseContext = useHouseDispatch();
  const { openAlert } = useAlertDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({});
  const [{ houseSelected }] = useHouse();
  console.log('houseSelected', houseSelected);
  useEffect(() => {
    const checkState = statuses.reduce((acc, status) => {
      acc[status.value] = false;
      if (!houseSelected) return acc;

      const found = (houseSelected.statuses || []).find(
        s => s.value === status.value
      );
      if (found) acc[status.value] = true;

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
      message: 'House Updated Successfully!',
    });
    resetForm(initialValues);
    history.push('/');
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
    const { comment: description, commentFiles, ...formData } = values;
    try {
      setSubmitting(true);
      setIsLoading(true);
      const house = JSON.stringify(formData);
      const idSelected = houseSelected.idHouse;
      console.log('HOUSE', house);
      let comment = null;

      if (description) {
        comment = await API.createComment(
          JSON.stringify({ idHouse: idSelected, description })
        );
      }

      if (comment && commentFiles) {
        const fileString = await getFile(commentFiles);
        const fileFromDrive = await API.uploadHouseCommentsFiles(
          comment.idComment,
          [
            {
              name: 'Custom FILE :D',
              base64: fileString,
            },
          ]
        );
        console.log('fileFromDrive', fileFromDrive);
        if (!fileFromDrive.folder) {
          throw new Error(
            'Somenthing went wrong creating files. It is not returning any folder.'
          );
        }
      }

      HouseContext.updateHouse(formData);
      API.updateHouse(JSON.stringify({ idHouse: idSelected, ...formData }));

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
                      classes={{ root: classes.formControl }}
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
                    {(houseSelected.comments || []).map((c, i) => (
                      <p key={i}>{JSON.stringify(c)}</p>
                    ))}
                    <CustomTextField
                      type="text"
                      name="comment"
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
