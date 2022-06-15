import { merge, union } from 'lodash';
import { normalize } from 'normalizr';
import {
  CREATE_PLAYLIST_SUCCESS,
  GET_USER_SUCCESS,
  GET_USER_PLAYLISTS_SUCCESS,
  GET_PLAYLIST_SUCCESS
} from 'actions/rest/spotify';
import { MusicState } from 'store/types/music';
import schemas from 'store/entities';
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
      entities: merge(prevState.entities, entities)
    };
  },
  [CREATE_PLAYLIST_SUCCESS]: (prevState, action) => {
    const playlist = action.payload;
    return prevState;
  },
  [CREATE_PLAYLIST_SUCCESS]: (prevState, action) => {
    const playlist = action.payload;
    return prevState;
  },
  [GET_PLAYLIST_SUCCESS]: (prevState, action) => {
    console.log("Get Playlist Success:")
    const playlist = action.payload;
    console.log("Raw:", playlist)
    const transformed = transformPlaylistFull(playlist);
    console.log("Transformed:", transformed)
    const normalized = normalize(transformed, schemas.playlist);
    const { entities, result } = normalized;
    console.log("Normalized:", normalized, prevState)
    return {
      ...prevState,
      entities: merge(prevState.entities, entities),
      playlists: union(prevState.playlists, [result])
    };
  },
  [GET_USER_PLAYLISTS_SUCCESS]: (prevState, action) => {
    const { items } = action.payload;
    const transformed = items.map(transformPlaylistSimplified);
    const normalized = normalize(transformed, [schemas.playlist]);
    const { entities, result } = normalized;
    console.log("Normalized:", normalized, prevState)
    return {
      ...prevState,
      entities: merge(prevState.entities, entities),
      playlists: union(prevState.playlists, result)
    };
  },
}
