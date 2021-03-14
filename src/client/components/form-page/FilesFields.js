import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from '@material-ui/core/Link';
import Dropzone from '../dropzone/Dropzone';
import { AccordionSummary } from './styles';

export default function FilesFields({
  isLoading,
  houseFiles,
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
          {houseFiles ? (
            <Link href={houseFiles} target="_blank">
              Link to Documents!
            </Link>
          ) : null}
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
              <Grid item xs={6} key={f.name}>
                <Typography variant="h6">{f.name}</Typography>
                <Dropzone
                  multiple
                  field={f.name}
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
