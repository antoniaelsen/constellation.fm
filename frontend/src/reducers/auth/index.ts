import { AnyAction } from 'redux';
import {
  CLEAR_TOKENS,
  SET_AUTHENTICATION,
  UPDATE_TOKENS,
} from 'actions/auth';
import { AuthState } from 'store/auth/types';

const initialState: AuthState = {
  isAuthenticated: false,
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
