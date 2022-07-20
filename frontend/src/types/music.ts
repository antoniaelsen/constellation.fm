import { Service } from "lib/constants";

export interface Image {
  url: string;
  height?: number;
  width?: number;
}

export interface User {
  id: string;
  service: Service;
  serviceId: string;
  displayName: string;
  image?: Image;
  url: string;
}

export interface Album {
  service: Service;
  serviceId: string;
  id: string;
  image: Image;
  name: string;
  url: string;
}

export interface Artist {
  service: Service;
  serviceId: string;
  id: string;
  name: string;
  url: string;
}

export interface Track {
  service: Service;
  serviceId: string;
  id: string;
  album: Album;
  artists: Artist[];
  name: string;
  trackNumber: number;
  url: string;
}

export interface PlaylistTrack {
  addedAt: string;
  addedBy: User;
  order: number;
  track: Track;
}

export interface Playlist {
  id: string;
  service: Service;
  serviceId: string;
  collaborative: boolean;
  description?: string;
  duration: number;
  editable?: boolean;
  image: Image;
  isPublic: boolean;
  name: string;
  order?: number;
  owner: User;
  tracks: PlaylistTrack[];
  url: string;
}

export interface MusicState {
  currentUser: User | null,
  entities: any,
  loadingPlaylists: boolean,
  playlists: Playlist[],
  users: User[],
}