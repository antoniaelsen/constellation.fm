import { merge, union } from 'lodash';
import { normalize } from 'normalizr';
import { Connection } from 'rest/constants';
import {
  CREATE_PLAYLIST_SUCCESS,
  GET_USER_SUCCESS,
  GET_USER_PLAYLISTS_SUCCESS,
  GET_PLAYLIST_SUCCESS
} from 'actions/rest/spotify';
import {
  Album,
  Artist,
  MusicState,
  Playlist,
  PlaylistTrack,
  Track,
  User
} from 'store/music/types';
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
};

const transformArtist = (input: any): Artist => {
  const { external_urls, id, images, name } = input;
  const url = external_urls.spotify;
  return {
    connection: Connection.SPOTIFY,
    connectionId: id,
    id: `${Connection.SPOTIFY}-${id}`,
    name,
    url
  };
};

const transformAlbum = (input: any): Album => {
  const { external_urls, id, images, name } = input;
  const image = images?.[0];
  const url = external_urls.spotify;
  return {
    connection: Connection.SPOTIFY,
    connectionId: id,
    id: `${Connection.SPOTIFY}-${id}`,
    image,
    name, 
    url
  };
};

const transformTrack = (input: any): Track => {
  const { artists, album, external_urls, id, images, name, track_number: trackNumber } = input;
  const url = external_urls.spotify;

  return {
    album: transformAlbum(album),
    artists: artists.map(transformArtist),
    connection: Connection.SPOTIFY,
    connectionId: id,
    id: `${Connection.SPOTIFY}-${id}`,
    name,
    trackNumber,
    url
  };
};

const transformPlaylistSimplified = (input: any, i: number): Playlist => {
  const { collaborative, description, external_urls, id, images, name, owner, public: isPublic } = input;
  const image = { url: images[0] };
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
};

const transformPlaylistFull = (input: any): Playlist => {
  const { collaborative, description, external_urls, id, images, name, owner, public: isPublic, tracks } = input;
  const image = images[0];
  const url = external_urls.spotify;

  return {
    connection: Connection.SPOTIFY,
    connectionId: id,
    id: `${Connection.SPOTIFY}-${id}`,
    owner: transformUser(owner),
    tracks: tracks.items.map(transformPlaylistTrack),
    collaborative,
    description,
    name,
    image,
    isPublic,
    url
  };
};

const transformPlaylistTrack = (input: any): PlaylistTrack => {
  const { added_at, added_by, track } = input;

  return {
    addedAt: added_at,
    addedBy: transformUser(added_by),
    track: transformTrack(track),
  };
};



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
