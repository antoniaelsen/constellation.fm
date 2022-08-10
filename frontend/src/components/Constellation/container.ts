import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

import { playTrack } from 'actions/rest/spotify';
import { RootState } from 'store';
import { ConstellationHoC as Component } from './HoC';
import { PlayContext } from 'types/music';


interface ContainerProps {
};

const mapStateToProps = (state: RootState, props: ContainerProps) =>  {
  const context = state.music.context;
  return {
    context,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    // getConstellation,
    // updateConstellation,
  
    // addItemToPlaylist,
    // removePlaylistItems,
    // updatePlaylistItems,
    // updatePlaylist,

    playTrack: (trackCtx: PlayContext) => {
      dispatch((playTrack as any)(trackCtx));
    }
  }
};

export const Constellation = connect(mapStateToProps, mapDispatchToProps)(Component);
