import { AnyAction } from 'redux';
import { merge, transform } from 'lodash';
import { normalize } from 'normalizr';
import { Connection } from 'rest/constants';
import {
  CREATE_PLAYLIST_SUCCESS,
  GET_USER_SUCCESS,
  GET_USER_PLAYLISTS_SUCCESS
} from 'actions/rest/spotify';
import { MusicState, Playlist, User } from 'store/music/types';
import schemas from 'store/entities';


type MusicReducer = (state: MusicState, data: any) => MusicState;

const transformUser = (input: any): User => {
  const { display_name: displayName, external_urls, id } = input;
  const url = external_urls.spotify;
  return {
    connection: Connection.SPOTIFY,
    connectionId: id,
    id: `${Connection.SPOTIFY}-${id}`,
    displayName,
    url
  };
}

const transformPlaylistSimplified = (input: any, i: number): Playlist => {
  const { collaborative, description, external_urls, id, images, name, owner, public: isPublic } = input;
  const image = images[0];
  const url = external_urls.spotify;

  return {
    connection: Connection.SPOTIFY,
    connectionId: id,
    id: `${Connection.SPOTIFY}-${id}`,
    order: i,
    owner: transformUser(owner),
    tracks: [],
    collaborative,
    description,
    name,
    image,
    isPublic,
    url
  };
}

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
  [GET_USER_PLAYLISTS_SUCCESS]: (prevState, action) => {
    const { items } = action.payload;
    const transformed = items.map(transformPlaylistSimplified);
    const normalized = normalize(transformed, [schemas.playlist]);
    const { entities, result } = normalized;
    console.log("Normalized:", normalized, prevState)
    return {
      ...prevState,
      entities: merge(prevState.entities, entities),
      playlists: merge(prevState.playlists, result)
    };
  },
}
