import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(0, 1),
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
  commentBox: {
    padding: theme.spacing(1),
    backgroundColor: fade('#555', 0.2),
  },
  commentContainer: {
    marginTop: theme.spacing(0.5),
  },
  userBox: {
    fontWeight: 'bold',
  },
}));

export const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

export default useStyles;
