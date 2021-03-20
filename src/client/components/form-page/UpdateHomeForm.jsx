import React, { useCallback, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik } from 'formik';
import { updateValidationSchema, getInitialValues } from './form-settings';
import useStyles from './styles';
import { useAlertDispatch } from '../../context/Alert';
import API from '../../api';
import { useHouse, useHouseDispatch } from '../../context/House';
import HomeFields from './HomeFields';
import FilesFields from './FilesFields';
import useHouseForm, { getFormData } from '../../hooks/useHouseForm';
import CommentsSection from './CommentsSection';

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
  const dependencies = useHouseForm();
  const initialValues = getInitialValues();

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
    const { houseFiles, formData } = getFormData(values);
    const { idHouse, zone, address } = houseSelected;
    try {
      setSubmitting(true);
      setIsLoading(true);
      let houseFolder = '';
      if (houseFiles.length) {
        const fileFromDrive = await API.uplaodFilesGroups({
          zone,
          idHouse: `${idHouse} / ${address}`,
          houseFiles,
        });
        houseFolder = fileFromDrive.folder;
      }
      HouseContext.updateHouse(formData);
      API.updateHouse(
        JSON.stringify({ idHouse, ...formData, files: houseFolder })
      );
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
        enableReinitialize
        onSubmit={onSubmit}
        initialValues={houseSelected}
        validationSchema={updateValidationSchema}
      >
        {formikProps => {
          const {
            values,
            touched,
            errors,
            setFieldValue,
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
              <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  <HomeFields
                    showId
                    inputProps={inputProps}
                    dependencies={dependencies}
                  />
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
                    <FilesFields
                      houseSelected={houseSelected}
                      {...{ values, isLoading, setFieldValue }}
                      filesGroups={dependencies.filesGroups}
                    />
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
      <CommentsSection {...{ isLoading, houseSelected }} />
    </div>
  );
}
