import { AnyAction } from 'redux';
import {
  CLEAR_TOKENS,
  SET_AUTHENTICATION,
  UPDATE_CONNECTIONS,
  UPDATE_TOKENS,
} from 'actions/auth';
import { AuthState } from 'store/types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  connections: [],
  tokens: {},
};

type AuthReducer = {[key: string]: (state: AuthState, action: any) => AuthState};

const reducers: AuthReducer = {
  [SET_AUTHENTICATION]: (state, action) => ({...state, isAuthenticated: action.payload}),
  [CLEAR_TOKENS]: (prevState, action) => {
    return {
      ...prevState,
      tokens: {}
    };
  },
  [UPDATE_CONNECTIONS]: (prevState, action) => {
    const connections = action.payload;
  
    return {
      ...prevState,
      connections,
    };
  },
  [UPDATE_TOKENS]: (prevState, action) => {
    const tokens = action.payload;
  
    return {
      ...prevState,
      tokens: {
        ...prevState.tokens,
        ...tokens
      }
    };
  },
};

export default (state = initialState, action: AnyAction) => {
  const reducer = reducers[action.type];
  return reducer ? reducer(state, action) : state;
};
