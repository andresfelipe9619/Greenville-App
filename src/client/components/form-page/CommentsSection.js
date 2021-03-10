import React, { useState } from 'react';
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
import Dropzone from '../dropzone/Dropzone';
import API from '../../api';
import useStyles from './styles';
import { useHouseDispatch } from '../../context/House';

const formatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

function Comment({ comment }) {
  if (!comment) return null;
  const date = new Date(comment.date).toLocaleString('en-US', formatOptions);
  const classes = useStyles();
  return (
    <Grid
      item
      md={12}
      container
      spacing={2}
      className={classes.commentContainer}
    >
      <Grid item md={6}>
        <Typography align="left" className={classes.userBox}>
          {comment.user}
        </Typography>
      </Grid>
      <Grid item md={6}>
        <Typography align="right">{date}</Typography>
      </Grid>
      <Grid item md={12}>
        <Box width="100%" className={classes.commentBox}>
          <Typography align="left">{comment.description}</Typography>
        </Box>
      </Grid>
      <Divider variant="middle" flexItem />
    </Grid>
  );
}

export default function CommentsSection({ isLoading, houseSelected }) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [reset, setReset] = useState(false);
  const HouseContext = useHouseDispatch();

  const setFieldValue = (_, value) => {
    if (!value || !value.length) return;
    setFiles(value);
  };

  const handleChange = e => {
    const { value } = e.target;
    setReset(false);
    setDescription(value);
  };

  const handleSaveComment = async () => {
    try {
      setUploading(true);
      const { idHouse, zone, comments } = houseSelected;
      const { data: comment } = await API.createComment(
        JSON.stringify({ idHouse, description })
      );
      console.log('Created Comment: ', comment);
      HouseContext.updateHouse({ idHouse, comments: [...comments, comment] });
      if (comment && files) {
        const { idComment } = comment;
        const fileFromDrive = await API.uploadHouseCommentsFiles({
          idComment,
          idHouse,
          files,
          zone,
        });
        console.log('fileFromDrive', fileFromDrive);
        if (!fileFromDrive.folder) {
          throw new Error(
            'Somenthing went wrong creating files. It is not returning any folder.'
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      setFiles([]);
      setDescription('');
    }
  };

  const loading = uploading || isLoading;
  const disabled = loading || !description;
  const inputProps = {
    handleChange,
    touched: {
      comment: true,
    },
    errors: {
      comment: false,
    },
    values: {
      comment: description,
    },
  };

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
          <Grid container item xs={12} spacing={3}>
            <CustomTextField
              type="text"
              name="comment"
              label="New Update"
              multiline
              rows={3}
              rowsMax={6}
              disabled={loading}
              variant="outlined"
              {...inputProps}
            />
            <Grid item md={9}>
              <Dropzone
                multiple
                reset={reset}
                field={'commentFiles'}
                setFieldValue={setFieldValue}
              />
            </Grid>
            <Grid item md={3} container justify="flex-end">
              <Button
                color="primary"
                variant="outlined"
                disabled={disabled}
                className={classes.button}
                onClick={handleSaveComment}
              >
                {uploading ? 'Saving Comment...' : 'Save Comment'}
              </Button>
            </Grid>
            <Divider variant="middle" flexItem />
            {(houseSelected.comments || []).map((c, i) => (
              <Comment key={i} comment={c} />
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
