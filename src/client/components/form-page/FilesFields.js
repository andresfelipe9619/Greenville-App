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
import { PreviewFileGruop } from '../dropzone/PreviewList';

export default function FilesFields({
  isLoading,
  filesGroups,
  houseSelected,
  setFieldValue,
}) {
  if (!filesGroups || !filesGroups.length) return null;
  const { files: houseFiles, filesGroups: houseFilesGroups } = houseSelected;
  const haveFilesGroups = !!Object.keys(houseFilesGroups || {}).length;
  console.log(`filesGroups`, filesGroups);
  console.log(`houseFilesGroups`, houseFilesGroups);
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
                {haveFilesGroups && (houseFilesGroups[f.name] || []).length && (
                  <PreviewFileGruop files={houseFilesGroups[f.name]} />
                )}
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
