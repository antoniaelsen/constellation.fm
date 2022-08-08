import { cloneDeep, merge, union } from 'lodash';
import { normalize } from 'normalizr';
import {
  CREATE_PLAYLIST_SUCCESS,
  GET_PLAYLIST_SUCCESS,
  GET_USER_SUCCESS,
  GET_USER_PLAYLISTS_SUCCESS,
  GET_USER_PLAYLISTS_LIMIT_SUCCESS,
  GET_USER_PLAYLISTS_LIMIT_REQUEST,
  GET_USER_PLAYLISTS_LIMIT_FAILURE,
  GET_USER_PLAYLISTS_REQUEST,
  GET_USER_PLAYLISTS_FAILURE,
  PLAY_TRACK_SUCCESS,
  PLAY_TRACK_FAILURE,
} from 'actions/rest/spotify';
import schemas from 'store/entities';
import { MusicState } from 'types/music';
import { transformPlaylistFull, transformPlaylistSimplified, transformUser } from 'lib/spotify';


type MusicReducer = (state: MusicState, data: any) => MusicState;

export const reducers: {[key: string]: MusicReducer} = {
  [GET_USER_SUCCESS]: (prevState, action) => {
    const user = action.payload;
    const transformed = transformUser(user);
    const { entities, result } = normalize(transformed, schemas.user);
    return {
      ...prevState,
      currentUser: result,
      entities: merge(cloneDeep(prevState.entities), entities)
    };
  },
  [CREATE_PLAYLIST_SUCCESS]: (prevState, action) => {
    // const playlist = action.payload;
    return prevState;
  },
  [CREATE_PLAYLIST_SUCCESS]: (prevState, action) => {
    // const playlist = action.payload;
    return prevState;
  },
  [GET_PLAYLIST_SUCCESS]: (prevState, action) => {
    const playlist = action.payload;
    const transformed = transformPlaylistFull(playlist);
    const normalized = normalize(transformed, schemas.playlist);
    const { entities, result } = normalized;
    return {
      ...prevState,
      entities: merge(cloneDeep(prevState.entities), entities),
      playlists: union(prevState.playlists, [result])
    };
  },
  [GET_USER_PLAYLISTS_REQUEST]: (prevState, action) => {
    return {
      ...prevState,
      loadingPlaylists: true
    };
  },
  [GET_USER_PLAYLISTS_FAILURE]: (prevState, action) => {
    return {
      ...prevState,
      loadingPlaylists: false
    };
  },
  [GET_USER_PLAYLISTS_SUCCESS]: (prevState, action) => {
    const { items } = action.payload;
    const transformed = items.map(transformPlaylistSimplified);
    const normalized = normalize(transformed, [schemas.playlist]);
    const { entities, result } = normalized;
    return {
      ...prevState,
      loadingPlaylists: false,
      entities: merge(cloneDeep(prevState.entities), entities),
      playlists: union(prevState.playlists, result)
    };
  },
  [GET_USER_PLAYLISTS_LIMIT_REQUEST]: (prevState, action) => {
    return {
      ...prevState,
      loadingPlaylists: true
    };
  },
  [GET_USER_PLAYLISTS_LIMIT_FAILURE]: (prevState, action) => {
    return {
      ...prevState,
      loadingPlaylists: false
    };
  },
  [GET_USER_PLAYLISTS_LIMIT_SUCCESS]: (prevState, action) => {
    const { items, offset, total } = action.payload;
    const transformed = items.map(transformPlaylistSimplified);
    const normalized = normalize(transformed, [schemas.playlist]);
    const { entities, result } = normalized;
    return {
      ...prevState,
      entities: merge(cloneDeep(prevState.entities), entities),
      playlists: union(prevState.playlists, result),
      loadingPlaylists: offset > total
    };
  },

  [PLAY_TRACK_SUCCESS]: (prevState, action) => {
    return prevState;
  },

  [PLAY_TRACK_FAILURE]: (prevState, action) => {
    return prevState;
  }
}
