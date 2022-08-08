import { SET_PLAYING_CONTEXT } from 'actions';
import { AnyAction } from 'redux';

import { MusicState } from 'types/music';
import { reducers as musicReducers } from "./spotify"

export const initialState: MusicState = {
  currentUser: null,
  entities: {},
  loadingPlaylists: false,
  playlists: [],
  users: [],
  context: null,
};

type MusicReducer = (state: MusicState, data: any) => MusicState;


const generalReducers: {[key: string]: MusicReducer} = {
  [SET_PLAYING_CONTEXT]: (prevState, action) => {
    const context = action.payload;
    return {
      ...prevState,
      context
    };
  },
}




const reducers: {[key: string]: MusicReducer} = {
  ...musicReducers,
  ...generalReducers,
}

export default (state = initialState, action: AnyAction) => {
  const reducer = reducers[action.type];
  return reducer ? reducer(state, action) : state;
};
