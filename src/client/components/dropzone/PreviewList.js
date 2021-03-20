import React from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Thumb, { FileGroupThumb } from './Thumb';

const useStyles = makeStyles(theme => ({
  root: {
    height: 120,
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: fade('#555', 0.2),
  },
  gridList: {
    flexWrap: 'nowrap',
    width: '100%',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
}));

export default function PreviewList({ files, loading }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {files.map((file, i) => (
          <GridListTile key={i}>
            <Thumb {...{ file, loading }} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export function PreviewFileGruop({ files, loading }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {files.map((file, i) => (
          <GridListTile key={i}>
            <FileGroupThumb {...{ file, loading }} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
