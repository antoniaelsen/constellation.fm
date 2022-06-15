import { Connection } from "rest/constants";

export interface Image {
  url: string;
  height?: number;
  width?: number;
}

export interface User {
  id: string;
  connection: Connection;
  connectionId: string;
  displayName: string;
  image?: Image;
  url: string;
}

export interface Album {
  connection: Connection;
  connectionId: string;
  id: string;
  image: Image;
  name: string;
  url: string;
}

export interface Artist {
  connection: Connection;
  connectionId: string;
  id: string;
  name: string;
  url: string;
}

export interface Track {
  connection: Connection;
  connectionId: string;
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
  track: Track;
}

export interface Playlist {
  id: string;
  connection: Connection;
  connectionId: string;
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
  playlists: Playlist[],
  users: User[],
}