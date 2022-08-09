import { Service } from 'lib/constants';

import {
  Album,
  Artist,
  ContextTrack,
  Playlist,
  PlaylistTrack,
  Track,
  User
} from 'types/music';


const transformContextTrack = (payload: Spotify.Track | SpotifyApi.TrackObjectFull): ContextTrack => {
  const { id, name, uri, artists, album } = payload;
  return {
    id: `${Service.SPOTIFY}-track-${id}`,
    name,
    uri,
    artists,
    position: null,
    album: {
      name: album.name,
      image: {
        url: album.images[0]?.url
      }
    }
  };
}

const transformUser = (input: SpotifyApi.UserObjectPublic): User => {
  const { display_name: displayName, external_urls, id } = input;
  const url = external_urls.spotify;
  return {
    service: Service.SPOTIFY,
    serviceId: id,
    id: `${Service.SPOTIFY}-user-${id}`,
    displayName: displayName || "",
    url
  };
};

const transformArtist = (input: SpotifyApi.ArtistObjectSimplified): Artist => {
  const { external_urls, id, name } = input;
  const url = external_urls?.spotify;
  return {
    service: Service.SPOTIFY,
    serviceId: id,
    id: `${Service.SPOTIFY}-artist-${id}`,
    name,
    url
  };
};

const transformAlbum = (input: SpotifyApi.AlbumObjectSimplified): Album => {
  const { external_urls, id, images, name, uri } = input;
  const image = images?.[0];
  const url = external_urls?.spotify;
  return {
    service: Service.SPOTIFY,
    serviceId: id,
    id: `${Service.SPOTIFY}-album-${id}`,
    image,
    name, 
    uri,
    url,
  };
};

const transformTrack = (input: SpotifyApi.TrackObjectFull): Track => {
  const { artists, album, external_urls, id, name, track_number: trackNumber } = input;
  const url = external_urls?.spotify;

  return {
    album: transformAlbum(album),
    artists: artists.map(transformArtist),
    service: Service.SPOTIFY,
    serviceId: id,
    id: `${Service.SPOTIFY}-track-${id}`,
    name,
    trackNumber,
    url
  };
};

const transformPlaylistSimplified = (input: SpotifyApi.PlaylistObjectSimplified, i: number): Playlist => {
  const { collaborative, description, external_urls, id, images, name, owner, public: isPublic, uri } = input;
  const image = { url: images[0]?.url };  // TODO(aelsen)
  const url = external_urls.spotify;

  return {
    service: Service.SPOTIFY,
    serviceId: id,
    duration: 0,
    id: `${Service.SPOTIFY}-playlist-${id}`,
    order: i,
    owner: transformUser(owner),
    tracks: [],
    collaborative,
    description: description || "",
    name,
    image,
    isPublic: !!isPublic,
    uri,
    url
  };
};

const transformPlaylistFull = (input: SpotifyApi.PlaylistObjectFull): Playlist => {
  const { collaborative, description, external_urls, id, images, name, owner, public: isPublic, tracks, uri } = input;
  const image = images[0];
  const url = external_urls.spotify;

  return {
    service: Service.SPOTIFY,
    serviceId: id,
    duration: 0,
    id: `${Service.SPOTIFY}-playlist-${id}`,
    owner: transformUser(owner),
    tracks: tracks.items.map(transformPlaylistTrack),
    collaborative,
    description: description || "",
    name,
    image,
    isPublic: !!isPublic,
    uri,
    url
  };
};

const transformPlaylistTrack = (input: SpotifyApi.PlaylistTrackObject, i: number): PlaylistTrack => {
  const { added_at, added_by, track } = input;

  return {
    addedAt: added_at,
    addedBy: transformUser(added_by),
    order: i,
    track: track ? transformTrack(track) : null,
  };
};


export {
  transformAlbum,
  transformArtist,
  transformContextTrack,
  transformTrack,
  transformPlaylistFull,
  transformPlaylistSimplified,
  transformPlaylistTrack,
  transformUser,
};