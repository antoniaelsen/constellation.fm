import { Dispatch, AnyAction } from 'redux';
import { connect} from 'react-redux';

import { setPlayingTrack } from 'actions';
import { RootState } from 'store';
import { TrackContext } from 'types/music';
import { Playback as Component } from './component';


const connectionTokensSelector = (state: RootState) => {
  const { connections, tokens } = state.auth;
  const playbackConnectionTokens = connections.reduce((acc, service) => {
    const tokenKeys = Object.keys(tokens);
    const playbackKey = `${service}playback`;
    if (!tokenKeys.includes(playbackKey)) return acc;
    return {
      ...acc,
      [service]: tokens[playbackKey]
    };
  }, {});
  return playbackConnectionTokens;
};

interface ContainerProps {};

const mapStateToProps = (state: RootState) =>  {
  const connectionTokens = connectionTokensSelector(state);

  return {
    connectionTokens
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    setPlayingTrack: (trackContext: TrackContext | null) => dispatch(setPlayingTrack(trackContext))
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const Playback = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  RootState
>(mapStateToProps, mapDispatchToProps)(Component);
