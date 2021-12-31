import { Connection } from "rest/constants";

export interface User {
  id: string;
  connection: Connection;
  connectionId: string;
  displayName: string;
  url: string;
}

export interface Image {
  url: string;
  height?: number;
  width?: number;
}

export interface Track {
  connectionId: string;
  connection: Connection;
}

export interface PlaylistTrack {

}

export interface Playlist {
  id: string;
  connection: Connection;
  connectionId: string;
  collaborative: boolean;
  description?: string;
  editable?: boolean;
  image: ImageBitmap;
  isPublic: boolean;
  name: string;
  order: number;
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