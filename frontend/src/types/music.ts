import { Service } from "lib/constants";

export enum RepeatState {
  OFF = 0,
  CONTEXT = 1,
  TRACK = 2,
};


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
  uri: string;
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

export type Item = {
  name: string;
  uri?: string;
  url?: string;
}

export interface TrackSimple extends Item {
  album: Item & {
    image: {
      url: string;
    }
  };
  artists: Item[];
}

export interface PlaylistTrack {
  addedAt: string;
  addedBy: User;
  order: number;
  track: Track | null;
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
  uri: string;
  url: string;
}
export interface ContextTrack extends TrackSimple {
  id: string;  // Service Id
  position: number | null;
  uri: string; 
}

export interface Context { // A playlist, album, queue
  service: Service;
  serviceId: string | null;
  id: string | null;
  
  name: string | null;
  uri: string | null;
  url: string | null;
  type: string;

  length: number;

  current: ContextTrack;
  next: ContextTrack[];
  prev: ContextTrack[];
}

export interface PlayContext {
  uri?: string | null;
  position?: number;
  offset?: {
    position: number | null;
    uri?: string; 
  };
}

export interface MusicState {
  currentUser: User | null,
  entities: any,
  loadingPlaylists: boolean,
  playlists: Playlist[],
  users: User[],
  context: Context | null,
}
