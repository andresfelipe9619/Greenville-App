import React, { useReducer, useContext, useCallback } from 'react';

const initialState = {
  houses: [],
  house: null,
  houseSelected: null,
};

const HouseStateContext = React.createContext();
const HouseDispatchContext = React.createContext();

function HouseReducer(state, { type, houses, houseSelected, house }) {
  switch (type) {
    case 'houses': {
      return { ...state, houses };
    }
    case 'select': {
      return { ...state, houseSelected };
    }
    case 'add': {
      return {
        ...state,
        houses: [...state.houses, house],
      };
    }
    case 'remove': {
      return {
        ...state,
        houses: state.houses.filter(i => i !== house),
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

function HouseContext({ children }) {
  const [state, dispatch] = useReducer(HouseReducer, initialState);

  const setHouses = useCallback(
    houses => dispatch({ type: 'houses', houses }),
    []
  );
  const setHouseSelected = useCallback(
    house => dispatch({ type: 'select', house }),
    []
  );
  const addHouse = useCallback(house => dispatch({ type: 'add', house }), []);

  const removeHouse = useCallback(
    house => dispatch({ type: 'remove', house }),
    []
  );
  //   async function updateUser(dispatch, user, updates) {
  //     dispatch({type: 'start update', updates})
  //     try {
  //       const updatedUser = await userClient.updateUser(user, updates)
  //       dispatch({type: 'finish update', updatedUser})
  //     } catch (error) {
  //       dispatch({type: 'fail update', error})
  //     }
  //   }

  return (
    <HouseStateContext.Provider value={state}>
      <HouseDispatchContext.Provider
        value={{
          setHouses,
          addHouse,
          removeHouse,
          setHouseSelected,
        }}
      >
        {children}
      </HouseDispatchContext.Provider>
    </HouseStateContext.Provider>
  );
}

function withBreadcrumbDispatch(Component) {
  return function WrapperComponent(props) {
    return (
      <HouseDispatchContext.Consumer>
        {dispatchProps => <Component {...{ ...props, ...dispatchProps }} />}
      </HouseDispatchContext.Consumer>
    );
  };
}

function useHouseState() {
  const context = useContext(HouseStateContext);
  if (context === undefined) {
    throw new Error(
      'House state Context must be used within an House Provider'
    );
  }
  return context;
}

function useHouseDispatch() {
  const context = React.useContext(HouseDispatchContext);
  if (context === undefined) {
    throw new Error(
      'House dispatch Context must be used within a House Provider'
    );
  }
  return context;
}

function useHouse() {
  return [useHouseState(), useHouseDispatch()];
}

export {
  HouseContext,
  useHouse,
  withBreadcrumbDispatch,
  useHouseState,
  useHouseDispatch,
  HouseDispatchContext,
};
