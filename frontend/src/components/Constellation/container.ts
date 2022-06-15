import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect'

import { getPlaylist } from 'actions/rest/spotify';
import { RootState } from 'store';
import { ConstellationHoC as Component } from './HoC';
import schemas from 'store/entities';
import { denormalize } from 'normalizr';
import { isEqual } from 'lodash';


interface ContainerProps {
  id: string;
};

const createSelectPlaylistById = () => createSelector(
  [
    (state) => state.music.entities,
    (state) => state.music.entities?.playlist || [],
    (_, props) => props.id,
  ],
  (entities, playlists, id) => {
    const normalized = playlists[id]
    if (!playlists || playlists.length === 0) return null;
    console.time("Denormalizing playlists");
    const de = denormalize(normalized, schemas.playlist, entities);
    console.timeEnd("Denormalizing playlists");
    return de;
  }, 
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => {
        console.log("Comparing", isEqual(a, b), a, b)
        return isEqual(a, b)
      }
    }
  }
);

const makeMapStateToProps = () => {
  const selectPlaylistById = createSelectPlaylistById();
  const empty = {};
  let temp = null;

  return (state: RootState, props: ContainerProps) =>  {
    const playlist = selectPlaylistById(state, props);
    console.log("Constellation Container | Map state to props - plist", temp === playlist, playlist);
    temp = playlist;
    return {
      constellation: empty,
      playlist
    };
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    // getConstellation,
    // updateConstellation,
  
    // addItemToPlaylist,
    // removePlaylistItems,
    // updatePlaylistItems,
    getPlaylist: (id: string) => dispatch((getPlaylist as any)(id)),
    // updatePlaylist,

    selectTrack: (id: string) => {
      console.log("Mock selectTrack", id);
    }
  }
};

type StateProps = ReturnType<typeof makeMapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const Constellation = connect(makeMapStateToProps, mapDispatchToProps)(Component);
