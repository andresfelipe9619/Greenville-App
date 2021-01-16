import React, {useState} from 'react';
import AlertContext, {initialState as initialAlert} from './alert-context';

export default function GlobalState(props) {
  const [alertState, setAlert] = useState(initialAlert);

  const openAlert = ({message, variant}) => {
    setAlert({...alertState, open: true, message, variant});
  };

  const closeAlert = () => {
    setAlert({...alertState, open: false, message: ''});
  };

  return (
    <AlertContext.Provider
      value={{
        open: alertState.open,
        message: alertState.message,
        variant: alertState.variant,
        closeAlert,
        openAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
}
