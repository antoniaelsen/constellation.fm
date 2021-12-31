
import { schema } from 'normalizr';

const user = new schema.Entity('user');
const track = new schema.Entity('track');
const playlist = new schema.Entity('playlist', {
  owner: user,
  tracks: [track]
});

const schemas = {
  playlist,
  track,
  user
};

export default schemas;
