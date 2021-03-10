import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getFileSize } from '../utils';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  content: {
    flex: '1 0 auto',
  },
  text: {
    fontSize: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export default function Thumb({ file, loading }) {
  if (!file) return null;
  if (loading) return <p>Cargando Archivo...</p>;
  const { size, name } = file;
  const exactSize = getFileSize(size);
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography component="h5" variant="subtitle1" className={classes.text}>
          {name}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.text}
        >
          {exactSize}
        </Typography>
      </CardContent>
    </Card>
  );
}
