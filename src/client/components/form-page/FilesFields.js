import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dropzone from '../dropzone/Dropzone';

export default function FilesFields({
  values,
  isLoading,
  filesGroups,
  setFieldValue,
}) {
  if (!filesGroups || !filesGroups.length) return null;
  return (
    <Box width="100%" mt={8}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="files-content"
          id="files-header"
        >
          <Typography variant="h5">Files to Upload</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            item
            xs={12}
            container
            spacing={2}
            justify="center"
            alignItems="center"
          >
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
