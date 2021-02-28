import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Dropzone from '../dropzone/Dropzone';

export default function FilesFields({
  values,
  isLoading,
  filesGroups,
  setFieldValue,
}) {
  if (!filesGroups || !filesGroups.length) return null;
  return (
    <Grid
      item
      xs={12}
      container
      spacing={8}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <Typography variant="h5">Files to Upload</Typography>
      </Grid>
      <Divider variant="middle" />
      {filesGroups.map(f => (
        <Grid item xs={4} key={f.name}>
          <Typography variant="h6">{f.name}</Typography>
          <Dropzone
            field={f.name}
            values={values}
            disabled={isLoading}
            setFieldValue={setFieldValue}
            // accept={SUPPORTED_FORMATS}
          />
        </Grid>
      ))}
    </Grid>
  );
}
