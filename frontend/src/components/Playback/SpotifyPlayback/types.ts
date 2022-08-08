
export interface SpotifyWebApiItem {
  name: string;
  uri: string;
  url: string;
}

export interface SpotifyWebApiContextTrack extends SpotifyWebApiItem {
  artists: SpotifyWebApiItem[];
  content_type: string;
  estimated_duration: number;
  group: SpotifyWebApiItem,
  images: {
    height: number;
    width: number;
    size: string;
    url: string;
  }[],
  uid: string;

};

export interface SpotifyWebApiContextMetadata extends SpotifyWebApiItem {
  current_item: SpotifyWebApiContextTrack;
  next_items: SpotifyWebApiContextTrack[];
  previous_items: SpotifyWebApiContextTrack[];
  restrictions: Spotify.PlaybackRestrictions;
  options: {
    repeat_mode: string;
    shuffled: boolean;
  }
}

export interface SpotifyPlaybackState extends Omit<Spotify.PlaybackState, "metadata"> {
  metadata: SpotifyWebApiContextMetadata;
}
