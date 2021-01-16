import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    marginBottom: 40,
  },
  toolBar: {
    'display': 'flex',
    'justifyContent': 'start',
    '& img': {
      'flexBasis': '100px',
      'maxWidth': '100%',
      'height': '170px',
    },
  },
}));
export default useStyles;
