import { Service } from 'lib/constants';

import {
  Album,
  Artist,
  Playlist,
  PlaylistTrack,
  Track,
  User
} from 'types/music';

const transformUser = (input: any): User => {
  const { display_name: displayName, external_urls, id } = input;
  const url = external_urls.spotify;
  return {
    service: Service.SPOTIFY,
    serviceId: id,
    id: `${Service.SPOTIFY}-user-${id}`,
    displayName,
    url
  };
};

const transformArtist = (input: any): Artist => {
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

const transformAlbum = (input: any): Album => {
  const { external_urls, id, images, name } = input;
  const image = images?.[0];
  const url = external_urls?.spotify;
  return {
    service: Service.SPOTIFY,
    serviceId: id,
    id: `${Service.SPOTIFY}-album-${id}`,
    image,
    name, 
    url
  };
};

const transformTrack = (input: any): Track => {
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

const transformPlaylistSimplified = (input: any, i: number): Playlist => {
  const { collaborative, description, external_urls, id, images, name, owner, public: isPublic } = input;
  const image = { url: images[0] };
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
    service: Service.SPOTIFY,
    serviceId: id,
    duration: 0,
    id: `${Service.SPOTIFY}-playlist-${id}`,
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

const transformPlaylistTrack = (input: any, i: number): PlaylistTrack => {
  const { added_at, added_by, track } = input;

  return {
    addedAt: added_at,
    addedBy: transformUser(added_by),
    order: i,
    track: transformTrack(track),
  };
};


export {
  transformAlbum,
  transformArtist,
  transformTrack,
  transformPlaylistFull,
  transformPlaylistSimplified,
  transformPlaylistTrack,
  transformUser,
};