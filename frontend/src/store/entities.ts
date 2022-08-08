
import { schema } from 'normalizr';

const user = new schema.Entity('user');
const album = new schema.Entity('album');
const artist = new schema.Entity('artist');
const track = new schema.Entity('track', {
  album: album,
  artists: [artist]
});
const playlistTrack = new schema.Entity('playlistTrack', {
  track: track,
}, { idAttribute: (value) => value.track.id });
const playlist = new schema.Entity('playlist', {
  owner: user,
  tracks: [playlistTrack]
});

const schemas = {
  album,
  artist,
  playlist,
  playlistTrack,
  track,
  user
};

export default schemas;
