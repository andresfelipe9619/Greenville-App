import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { formatDate } from '../utils';

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const findStatus = (status, prop = 'name') => s => s[prop] === status;

function HouseStatuses({ statuses, house, width }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(null);
  const { status, comments = [] } = house;
  const orientation = isWidthUp('md', width) ? 'horizontal' : 'vertical';

  useEffect(() => {
    console.log(`Statuses: `, statuses);
    console.log(`House Status: `, status);
    if (!status) {
      setActiveStep(0);
    } else {
      const index = statuses.findIndex(findStatus(status));
      console.log(`Status Index: `, index);
      setActiveStep(index);
    }
  }, [house]);

  if (Number.isNaN(activeStep) || !statuses.length) return null;

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        orientation={orientation}
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {statuses.map(s => {
          const labelProps = {};
          const comment = comments.find(findStatus(s.name, 'status'));
          if (comment && comment.statusDate) {
            labelProps.optional = (
              <Typography variant="caption">
                {formatDate(comment.statusDate, false)}
              </Typography>
            );
          }
          return (
            <Step key={s.name}>
              <StepLabel StepIconComponent={QontoStepIcon} {...labelProps}>
                {s.name}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
}
export default withWidth()(HouseStatuses);
