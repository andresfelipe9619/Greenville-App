import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import {withStyles} from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = (theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.35rem',
  },
});

function AlertContent(props) {
  const {classes, className, message, onClose, variant, ...other} = props;
  const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      className={[classes[variant], className].join(' ')}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          {Icon && (
            <Icon className={[classes.icon, classes.iconVariant].join(' ')} />
          )}
          {message}
        </span>
      }
      action={
        onClose && [
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]
      }
      {...other}
    />
  );
}

const SnackbarContentWrapper = withStyles(styles1)(AlertContent);

export default function Alert({
  open,
  variant,
  message,
  duration,
  position,
  handleClose,
}) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: position || 'right',
      }}
      open={open}
      autoHideDuration={duration || 6000}
      ClickAwayListenerProps={{
        mouseEvent: false,
        touchEvent: false,
        onClickAway: () => {},
      }}
      onClose={handleClose}
      style={{
        top: '85px',
      }}
    >
      <SnackbarContentWrapper
        onClose={handleClose}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
}
