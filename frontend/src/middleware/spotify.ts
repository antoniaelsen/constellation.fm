import { getUserPlaylistsLimited, GET_USER_PLAYLISTS_LIMIT_SUCCESS } from "actions/rest/spotify";
import type { AnyAction, Dispatch } from "redux"


const middleware = {
  [GET_USER_PLAYLISTS_LIMIT_SUCCESS]: (store, next, action, result) => {
    const { payload } = result;
    const { limit, offset, total } = payload;
    if (offset > total) return;
    store.dispatch(getUserPlaylistsLimited(offset + limit));
  },
}

const spotifyMiddlware = (store: any) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const result = next(action);
 

  const fn = middleware[action.type];
  if (fn) fn(store, next, action, result);

  return result;
};

export default spotifyMiddlware;
