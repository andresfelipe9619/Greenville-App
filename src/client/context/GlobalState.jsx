import React from 'react';
import { AlertContext } from './Alert';
import { HouseContext } from './House';

function GlobalState({ children }) {
  return (
    <>
      <AlertContext>
        <HouseContext>{children}</HouseContext>
      </AlertContext>
    </>
  );
}
export default React.memo(GlobalState);
