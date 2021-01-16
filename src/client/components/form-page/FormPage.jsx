import React, {useEffect, useCallback, useState} from 'react';
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
import Dropzone from '../dropzone/Dropzone';
import FormHelperText from '@material-ui/core/FormHelperText';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Formik} from 'formik';
import server from '../../server';
import useStyles from './styles';
import {
  SUPPORTED_FORMATS,
  validationSchema,
  initialValues,
} from './form-settings';
import {getFile} from '../utils';

export default function FormPage(props) {
  const classes = useStyles();
  const {openAlert} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const {searchPerson, registerPerson, createPonenciaFile} = server;

  const onSubmit = useCallback(async (values, {setSubmitting, resetForm}) => {
    const {archivo_ponencia, numero_documento, ...formData} = values;
    setSubmitting(true);
    try {
      setIsLoading(true);
      const fileString = await getFile(archivo_ponencia);
      const fileFromDrive = await createPonenciaFile(
        numero_documento,
        fileString
      );
      const person = JSON.stringify({
        ...formData,
        numero_documento,
        archivo_ponencia: fileFromDrive.url,
      });
      await registerPerson(person);
      onSuccess(resetForm);
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  }, []);

  const onSuccess = (resetForm) => {
    setIsSuccess(true);
    openAlert({
      variant: 'success',
      message: 'Formulario Enviado Satisfactoriamente',
    });
    setTimeout(() => {
      setIsSuccess(false);
      resetForm(initialValues);
    }, 5000);
  };

  const onError = (error) => {
    setError(error);
    openAlert({
      variant: 'error',
      message: 'Algo Fue Mal Enviando El Formulario',
    });
    console.error('Error trying to sumbit form:', error);
  };

  useEffect(() => {
    searchPerson('123').then((data) => console.log('data', data));
  }, []);

  return (
    <div>
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          } = formikProps;
          return (
            <Paper className={classes.paper}>
              <Typography variant="h3" gutterBottom>
                Formulario de inscripción de ponentes
              </Typography>
              <Typography variant="h6" gutterBottom>
                Los campos marcados con asteriscos (*) son obligatorios.{' '}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={8}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      error={
                        !!(touched.tipo_documento && errors.tipo_documento)
                      }
                    >
                      <InputLabel htmlFor="tipo_documento">
                        Tipo de documento
                      </InputLabel>
                      <Select
                        value={values.tipo_documento}
                        required
                        fullWidth
                        className={{
                          root: classes.root,
                          select: classes.select,
                        }}
                        onChange={handleChange}
                        disabled={isLoading || error}
                        inputProps={{
                          name: 'tipo_documento',
                          id: 'tipo_documento',
                        }}
                      >
                        <MenuItem fullWidth value={'cc'}>
                          C.C
                        </MenuItem>
                        <MenuItem fullWidth value={'ti'}>
                          T.I
                        </MenuItem>
                        <MenuItem fullWidth value={'ext'}>
                          Extranjero
                        </MenuItem>
                      </Select>
                      <FormHelperText>
                        {touched.tipo_documento && errors.tipo_documento}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.numero_documento}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={
                        touched.numero_documento && errors.numero_documento
                      }
                      error={
                        !!(touched.numero_documento && errors.numero_documento)
                      }
                      required
                      type="number"
                      id="numero_documento"
                      name="numero_documento"
                      label="Número de Identificación"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="nombre"
                      label="Nombre"
                      name="nombre"
                      value={values.nombre}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={touched.nombre && errors.nombre}
                      error={!!(touched.nombre && errors.nombre)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.apellidos}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={touched.apellidos && errors.apellidos}
                      error={!!(touched.apellidos && errors.apellidos)}
                      required
                      id="apellidos"
                      name="apellidos"
                      label="Apellidos"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.universidad}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={touched.universidad && errors.universidad}
                      error={!!(touched.universidad && errors.universidad)}
                      required
                      id="universidad"
                      name="universidad"
                      label="Universidad"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.email}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={touched.email && errors.email}
                      error={!!(touched.email && errors.email)}
                      id="email"
                      type="email"
                      name="email"
                      label="Email"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.direccion}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={touched.direccion && errors.direccion}
                      error={!!(touched.direccion && errors.direccion)}
                      required
                      id="direccion"
                      name="direccion"
                      label="Dirección"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.telefono}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={touched.telefono && errors.telefono}
                      error={!!(touched.telefono && errors.telefono)}
                      required
                      type="number"
                      id="telefono"
                      name="telefono"
                      label="Teléfono"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.ciudad}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={touched.ciudad && errors.ciudad}
                      error={!!(touched.ciudad && errors.ciudad)}
                      required
                      id="ciudad"
                      name="ciudad"
                      label="Ciudad"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.celular}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={touched.celular && errors.celular}
                      error={!!(touched.celular && errors.celular)}
                      id="celular"
                      name="celular"
                      label="Celular"
                      type="number"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      error={
                        !!(
                          touched.tematica_ponencia && errors.tematica_ponencia
                        )
                      }
                    >
                      <InputLabel htmlFor="tematica_ponencia">
                        Línea temática de ponencia
                      </InputLabel>
                      <Select
                        required
                        fullWidth
                        className={{
                          root: classes.root,
                          select: classes.select,
                        }}
                        value={values.tematica_ponencia}
                        onChange={handleChange}
                        disabled={isLoading || error}
                        inputProps={{
                          name: 'tematica_ponencia',
                          id: 'tematica_ponencia',
                        }}
                      >
                        <MenuItem value={'Gestión Cultural'}>
                          Gestión Cultural
                        </MenuItem>
                        <MenuItem value={'Ingeniería'}>Ingeniería</MenuItem>
                        <MenuItem value={'Otros'}>Otros</MenuItem>
                      </Select>
                      <FormHelperText>
                        {touched.tematica_ponencia && errors.tematica_ponencia}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.descripcion_ponencia}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={
                        (touched.descripcion_ponencia &&
                          errors.descripcion_ponencia) ||
                        'Redactar en máximo 300 caracteres'
                      }
                      error={
                        !!(
                          touched.descripcion_ponencia &&
                          errors.descripcion_ponencia
                        )
                      }
                      multiline
                      rows="4"
                      required
                      id="descripcion_ponencia"
                      name="descripcion_ponencia"
                      label="Descripción general de la ponencia"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.importancia_tema}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={
                        (touched.importancia_tema && errors.importancia_tema) ||
                        'Redactar en máximo 500 caracteres'
                      }
                      error={
                        !!(touched.importancia_tema && errors.importancia_tema)
                      }
                      multiline
                      required
                      rows="4"
                      id="importancia_tema"
                      name="importancia_tema"
                      label="Importancia del tema para la institución"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={values.motivos_interes}
                      onChange={handleChange}
                      disabled={isLoading || error}
                      onBlur={handleBlur}
                      helperText={
                        (touched.motivos_interes && errors.motivos_interes) ||
                        'Redactar en máximo 300 caracteres'
                      }
                      error={
                        !!(touched.motivos_interes && errors.motivos_interes)
                      }
                      required
                      multiline
                      rows="4"
                      id="motivos_interes"
                      name="motivos_interes"
                      label="Motivos de interés para otras instituciones de educación superior"
                      fullWidth
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
                      <InputLabel htmlFor="archivo_ponencia">
                        Archivo Word a subir debe cargarse como Documentos WORD
                        2007 y seguir las especificaciones técnicas que se
                        indican en la pestaña de descargas
                      </InputLabel>
                    </Grid>
                    <Divider variant="middle" />
                    <Grid item xs={8}>
                      <Dropzone
                        disabled={isLoading || error}
                        setFieldValue={setFieldValue}
                        values={values}
                        accept={SUPPORTED_FORMATS}
                        error={
                          !!(
                            touched.archivo_ponencia && errors.archivo_ponencia
                          )
                        }
                        helperText={
                          touched.archivo_ponencia && errors.archivo_ponencia
                        }
                      />
                    </Grid>
                  </Grid>
                  <Divider variant="middle" />
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      El Comité organizador seleccionará las ponencias que se
                      presentarán en el IV Encuentro Colombiano de Gestíon
                      Universitaria. Dentri de los criterios de la aprobación
                      están: La pertinencia del tema, la relación con las líneas
                      temáticas, la importancia e interés para las Instituciones
                      de Educación Superior; también se valorarán las buenas
                      prácticas y casos de éxito para el mejoramiento de la
                      gestión universitaria.
                    </Typography>
                    <Button
                      disabled={error || isLoading}
                      className={classes.button}
                      variant="contained"
                      type="submit"
                      color="primary"
                    >
                      Enviar
                    </Button>
                    {isSuccess && (
                      <Typography variant="h4">
                        Muchas gracias por su inscripción. Estaremos en contacto
                        con usted.
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
