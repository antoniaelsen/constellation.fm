import { AnyAction } from 'redux';

import { MusicState } from 'store/types/music';
import { reducers as musicReducers } from "./spotify"

export const initialState: MusicState = {
  currentUser: null,
  entities: {},
  loadingPlaylists: false,
  playlists: [],
  users: [],
};

type MusicReducer = (state: MusicState, data: any) => MusicState;

const reducers: {[key: string]: MusicReducer} = {
  ...musicReducers,
  
}

export default (state = initialState, action: AnyAction) => {
  const reducer = reducers[action.type];
  return reducer ? reducer(state, action) : state;
};
