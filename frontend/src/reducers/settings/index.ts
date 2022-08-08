import { AnyAction } from 'redux';
import {
  TOGGLE_TOOLTIPS
} from 'actions/settings';
import { SettingsState } from 'types/settings';

export const initialState: SettingsState = {
  space: {
    hideTooltips: false
  }
};

type SettingsReducer = {[key: string]: (state: SettingsState, action: any) => SettingsState};

const reducers: SettingsReducer = {
  [TOGGLE_TOOLTIPS]: (state, action) => ({
    ...state,
    space: {
      ...state.space,
      hideTooltops: action.payload
    }
  }),
};

export default (state = initialState, action: AnyAction) => {
  const reducer = reducers[action.type];
  return reducer ? reducer(state, action) : state;
};
