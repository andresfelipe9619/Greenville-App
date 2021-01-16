import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  paper: {
    padding: theme.spacing(6, 4),
    opacity: 0.96,
  },
  select: {
    flex: '0 0 auto',
  },
  button: {
    margin: '30px 40px',
  },
}));
export default useStyles;
