import React from 'react';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { CustomTextField } from './inputs';
import useStyles from './styles';

function Comment({ comment }) {
  return (
    <Grid container item md={12}>
      <Grid item md={6}>
        <Typography align="left">{comment.user}</Typography>
      </Grid>
      <Grid item md={6}>
        <Typography align="right">{comment.date}</Typography>
      </Grid>
      <Grid item md={12}>
        {comment.description}
      </Grid>
      <Divider />
    </Grid>
  );
}

export default function CommentsSection({
  isLoading,
  inputProps,
  houseSelected,
}) {
  const classes = useStyles();

  return (
    <Box width="100%" mt={8}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="files-content"
          id="files-header"
        >
          <Typography variant="h5" component="h2" paragraph>
            Update Process...
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container item xs={12}>
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
            {(houseSelected.comments || []).reverse().map((c, i) => (
              <Comment key={i} comment={c} />
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
